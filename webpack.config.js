const path = require("path");
const outputPath = path.join(__dirname, "dist");

module.exports = {
  mode: "production",
  entry: {
    static: "./src/code/static.js",
    init: "./src/code/init.js",
  },
  output: {
    path: outputPath,
    filename: "[name]-bundle.js",
  },
  devtool: "source-map",
  resolve: {
    modules: ["node_modules"],
    extensions: ["ts"],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.(png|gif|svg)$/,
        use: "url-loader",
      },
      {
        test: /\.css$/,
        use: [
          "to-string-loader",
          {
            loader: "css-loader",
            options: { esModule: false },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ["to-string-loader", "html-loader"],
      },
    ],
  },
};
