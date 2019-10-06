var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/js/index.js',
    output: {
      // path: __dirname + '/dist',
      // publicPath: '/',
      filename: './bundle.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
          hash: false,
          filename: './index.html' //relative to root of the application
      })
    ],
    devServer: {
      contentBase: './',
      publicPath: '/dist/',
      historyApiFallback: true
    },
    resolve: {
      extensions: ['*', '.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
            test: /\.css$/,
            exclude: /node_modules/,
            use: ['style-loader', 'css-loader'],
        },
        {
            test: /\.(png|jpe?g|gif|svg)$/i,
            use: ['file-loader'],
          },
      ]
    },
  };