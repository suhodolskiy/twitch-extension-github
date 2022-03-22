const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const bundlePath = path.resolve(__dirname, 'dist')

module.exports = (env, argv) => {
  const plugins = [
    new webpack.DefinePlugin({
      'process.env.GITHUB_TOKEN': JSON.stringify(process.env.GITHUB_TOKEN),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].style.css',
    }),
  ]

  const entries = {}

  for (const entry of ['panel', 'config']) {
    entries[entry] = `./src/components/${entry}/index.ts`

    plugins.push(
      new HtmlWebpackPlugin({
        filename: `${entry}.html`,
        template: `./src/components/${entry}/index.html`,
        chunks: [entry],
        title: 'Twitch Extension Github',
      })
    )
  }

  let devServer
  if (argv.mode === 'development') {
    devServer = {
      contentBase: path.join(__dirname, 'public'),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      port: 8080,
    }

    plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  return {
    entry: entries,
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
        { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  autoprefixer({
                    browsers: ['ie >= 8', 'last 4 version'],
                  }),
                ],
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins,
  }
}
