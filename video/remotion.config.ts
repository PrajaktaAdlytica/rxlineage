import { Config } from "@remotion/cli/config";
import path from "node:path";
Config.setPublicDir("../public");
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...config.resolve?.alias,
      "react-dom/client": path.resolve("../node_modules/react-dom/client.js"),
      react: path.resolve("../node_modules/react"),
      "react-dom": path.resolve("../node_modules/react-dom"),
      remotion: path.resolve("../node_modules/remotion"),
      "@remotion/fonts": path.resolve("../node_modules/@remotion/fonts"),
    },
  },
}));
