const webpack = require("webpack");

var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js",
  output: {
    // path: __dirname + '/dist',
    // publicPath: '/',
    filename: "./bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: false,
      filename: "./index.html" //relative to root of the application
    }),
    new webpack.DefinePlugin({
      "process.env.API_KEY": JSON.stringify(
        "AIzaSyBjtW6LTs6UmvJ-FYRSqVAljQNDobbYQno"
      ),
      "process.env.AUTH_DOMAIN": JSON.stringify("curate-3a4b8.firebaseapp.com"),
      "process.env.DB_URL": JSON.stringify(
        "https://curate-3a4b8.firebaseio.com"
      ),
      "process.env.PROJECT_ID": JSON.stringify("curate-3a4b8"),
      "process.env.STORAGE_BUCKET": JSON.stringify("curate-3a4b8.appspot.com"),
      "process.env.MESSAGING_SENDER_ID": JSON.stringify("931076853892"),
      "process.env.APP_ID": JSON.stringify(
        "1:931076853892:web:94ee05d0b0bb3742bcf2d1"
      )
    })
  ],
  devServer: {
    contentBase: "./",
    publicPath: "/dist/",
    historyApiFallback: true
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: ["file-loader"]
      }
    ]
  }
};
