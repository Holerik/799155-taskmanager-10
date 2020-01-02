const path = require('path');
const MomentLocalesPlugin = require(`moment-locales-webpack-plugin`);

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public')
  },
  devtool: 'source-map',

  devServer: {
    contentBase: path.join(__dirname, 'public'), // где искать сборку
    publicPath: 'http://localhost:8080/', // адрес сборки
    compress: true,
    // автоматическая перезагрузка страницы
    // если не работает по стандартному URLу в браузере 'http://localhost:8080',
    // то добавьте к нему '/webpack-dev-server/': 'http://localhost:8080/webpack-dev-server/'
    watchContentBase: true
  },
  module: {
    rules: [
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
        },
    ],
  },
  plugins: [
  // Оставляем только одну локаль.
    new MomentLocalesPlugin({
      localesToKeep: [`es-us`],
    }),
  ], 
};