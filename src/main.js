import { createHelia } from "helia";
import { createLibp2p } from "libp2p";
import { identify } from "@libp2p/identify";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { webSockets } from "@libp2p/websockets";
import { webRTC } from "@libp2p/webrtc";
import { all } from "@libp2p/websockets/filters";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { createOrbitDB } from "@orbitdb/core";
import { Lander } from "@orbitdb/voyager";
import { multiaddr } from "@multiformats/multiaddr";
import "./style.css";

const options = {
  addresses: {
    listen: ["/webrtc", "/p2p-circuit"],
  },
  transports: [
    webSockets({
      filter: all, // connect to insecure sockets also (E.g. /ws/)
    }),
    webRTC(),
    circuitRelayTransport(),
  ],
  connectionEncrypters: [noise()],
  streamMuxers: [yamux()],
  connectionGater: {
    denyDialMultiaddr: () => false, // allow dialling of private addresses.
  },
  services: {
    identify: identify(),
    pubsub: gossipsub({
      emitSelf: true,
    }),
  },
};

let orbitdb, lander;
let pinningDB;

const init = async () => {
  const id = "lander";
  const libp2p = await createLibp2p({ ...options });
  const ipfs = await createHelia({ libp2p });
  orbitdb = await createOrbitDB({ ipfs, id });
  console.log(await orbitdb.identity.id);
};

window.addEventListener("load", async (event) => {
  await init();
  document.getElementById("peerId").innerText =
    orbitdb.ipfs.libp2p.peerId.toString();
});

document.getElementById("create").addEventListener("click", async () => {
  pinningDB = await orbitdb.open("my-db");
  document.getElementById("created").innerText = pinningDB.address;

  pinningDB.events.on("join", (peerId, heads) =>
    console.log("join", peerId, heads),
  );
  pinningDB.events.on("leave", (peerId) => console.log("leave", peerId));
});

document.getElementById("pin").addEventListener("click", async () => {
  if (pinningDB) {
    const orbiterAddressOrId = multiaddr(
      document.getElementById("orbiterAddressOrId").value,
    );

    lander = await Lander({ orbitdb, orbiterAddressOrId });

    // Helper function for tests
    /*
      lander.shutdown = async () => {
          await orbitdb.stop()
          await orbitdb.ipfs.stop()
      }
      */

    let msg = "DB successfully pinned";

    if (!(await lander.pin([pinningDB.address]))) {
      msg = "DB pin failed";
    }

    document.getElementById("pinned").innerText = msg;

    // await lander.shutdown()
  }
});

document.getElementById("fetch").addEventListener("click", async () => {
  const orbiterAddressOrId = multiaddr(
    document.getElementById("orbiterAddressOrId").value,
  );

  orbitdb.ipfs.libp2p.dial(multiaddr(orbiterAddressOrId));

  const address = document.getElementById("address").value;

  const db = await orbitdb.open(address);
  console.log(db.name);

  document.getElementById("fetched").innerText = db.address;
});
