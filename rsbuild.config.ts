import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { version, repository } from './package.json'

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    define: {
      PACKAGE_VERSION: JSON.stringify(version),
      PACKAGE_REPOSITORY: JSON.stringify(repository),
    },
  },
})
