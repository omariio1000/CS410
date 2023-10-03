const path = require("path");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: path.resolve(__dirname, "src", "Main.ts"),
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "compiled.js",
    library: {
      type: "var",
      name: "intro",
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader", sideEffects: true },
    ],
  },
  optimization: {
    minimize: false,
    minimizer: [
      new TerserWebpackPlugin({
        extractComments: false,
        terserOptions: {
          mangle: false,
          compress: {
            booleans: false,
            collapse_vars: false,
            conditionals: false,
            dead_code: false,
            evaluate: false,
            hoist_props: false,
            if_return: false,
            inline: false,
            join_vars: false,
            loops: false,
            reduce_funcs: false,
            reduce_vars: false,
            side_effects: false,
            switches: false,
            unused: false,
          },
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
};
