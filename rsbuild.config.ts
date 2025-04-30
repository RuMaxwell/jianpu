import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { version } from './package.json'

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    define: {
      PACKAGE_VERSION: JSON.stringify(version),
    },
  },
})
