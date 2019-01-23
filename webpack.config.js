const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const bundlePath = path.resolve(__dirname, 'dist/')

module.exports = (env, argv) => {
  const entryPoints = {
    Panel: {
      path: './src/components/Panel/Panel.js',
      outputHtml: 'panel.html',
      build: true,
    },
    Config: {
      path: './src/components/Config/Config.js',
      outputHtml: 'config.html',
      build: true,
    },
  }

  let entry = {}
  let plugins = [
    new webpack.DefinePlugin({
      'process.env.GITHUB_TOKEN': JSON.stringify(process.env.GITHUB_TOKEN),
    }),
  ]

  if (argv.mode === 'development') {
    plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  for (let name in entryPoints) {
    if (entryPoints[name].build) {
      entry[name] = entryPoints[name].path

      if (argv.mode === 'production') {
        plugins.push(
          new HtmlWebpackPlugin({
            inject: true,
            chunks: [name],
            template: './src/template.html',
            filename: entryPoints[name].outputHtml,
          })
        )
      }
    }
  }

  let devServer
  if (argv.mode === 'development') {
    devServer = {
      contentBase: path.join(__dirname, 'public'),
      host: argv.devrig ? 'localhost.rig.twitch.tv' : 'localhost',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      port: 8080,
    }

    if (fs.existsSync(path.resolve(__dirname, 'conf/server.key'))) {
      devServer.https = {
        key: fs.readFileSync(path.resolve(__dirname, 'conf/server.key')),
        cert: fs.readFileSync(path.resolve(__dirname, 'conf/server.crt')),
      }
    }
  }

  return {
    entry,
    devServer,
    optimization: {
      minimize: true,
    },
    output: {
      filename: '[name].bundle.js',
      path: bundlePath,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images',
          },
        },
      ],
    },
    plugins,
  }
}
