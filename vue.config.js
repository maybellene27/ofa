const webpack = require('webpack')

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    port: process.env.VUE_APP_PORT || 3000
  },
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill'
      })
    ]
  }
}
