# Voyager Browser Example

This client provides an example of pinning a database to the Voyager pinning service.

## Getting Started

Make sure you have a copy of the Voyager daemon running or that you have access to one. You will need its address.

Refer to the Voyager document on how to run the pinning service and how to add access control for remote users.

Clone this repository and run:

```
npm run dev
```

Once running, browse to the URL printed to the screen.

## Pinning a DB

Type or paste the address of the Voyager service you wish to connect to into the text box provided.

To pin a database to Voyager, follow the "Create a db and pin..." prompts. This will create a database and pin it to the Voyager pinning service. If successful, the pinning successful message will be displayed.

## Fetching a DB

To fetch a pinned database, floow the "Fetch a pinned db..." prompts.

If successful, you will have a replica of the database requested synchronized to your browser peer.