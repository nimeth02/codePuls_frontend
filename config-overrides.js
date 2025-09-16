const { override } = require("customize-cra");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
  webpack: override((config) => {
    config.plugins.push(
      new ModuleFederationPlugin({
        name: "codepulss",
        filename: "remoteEntry.js",
        exposes: {
          "./App": "./src/App.tsx",
        },
        shared: {
          react: { singleton: true, eager: true, requiredVersion: "^18.0.0" },
          "react-dom": { singleton: true, eager: true, requiredVersion: "^18.0.0" },
        },
      })
    );


    // Add TS path alias support
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      context: path.resolve(__dirname, "src/context/"),
    };

    return config;
  }),

  // 👇 Add this to fix "overrides.devServer is not a function"
  devServer: (configFunction) => {
    return (proxy, allowedHost) => {
      const config = configFunction(proxy, allowedHost);
      // tweak devServer if needed
      config.headers = {
        "Access-Control-Allow-Origin": "*",
      };
      return config;
    };
  },
};

