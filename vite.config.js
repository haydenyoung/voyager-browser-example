import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { visualizer } from "rollup-plugin-visualizer"

export default {
  root: 'src',
  build: {
    outDir: '../dist'
  },
  plugins: [
    nodePolyfills(),
    visualizer()
  ]
}
