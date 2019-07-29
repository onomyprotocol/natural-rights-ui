const recryptApiToNaturalRights = require('natural-rights-recrypt')
const {
  HttpServer,
  LmdbDatabaseAdapter,
  LocalService,
  initSEA
} = require('natural-rights/es/natural-rights-server')
const Gun = require('gun')
const SEA = initSEA(Gun)
const Recrypt = require('@ironcorelabs/recrypt-node-binding')
const { urlencoded, json } = require('body-parser')

const path = require('path')

const htmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const optimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const terserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

const { NODE_ENV } = process.env

const isDevelopment = NODE_ENV === 'development'
const srcPath = path.join(__dirname, 'src')

const base = {
  mode: NODE_ENV,
  context: srcPath,
  entry: './index.js',
  output: { filename: 'bundle.[hash].js' },
  resolve: {
    alias: { src: path.resolve(__dirname, 'src') },
    extensions: ['*', '.js', '.jsx', '.json', '.sass', '.wasm']
  },
  externals: ['fs', 'mkdirp', 'node-webcrypto-ossl'],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          isDevelopment ? 'style-loader' : miniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  browsers: ['> 1%', 'last 2 versions']
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|ttf|eot|svg|otf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      title: 'Natural Rights',
      meta: {
        viewport: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0'
      },
      inject: 'body'
    }),
    new miniCssExtractPlugin({
      filename: 'bundle.[contenthash].css',
      chunkFilename: '[id].css'
    })
  ]
}

if (NODE_ENV === 'development') {
  module.exports = merge(base, {
    watchOptions: {
      ignored: /node_modules\/gun/
    },
    devServer: {
      contentBase: srcPath,
      historyApiFallback: true,
      proxy: {
        '/gun': {
          target: 'http://localhost:4000/',
          ws: true
        }
      },
      before: function(app, server) {
        const adapter = new LmdbDatabaseAdapter({
          path: './',
          mapSize: parseInt(process.env.LMDB_MAP_SIZE) || 2 * 1024 ** 3
        })

        const RecryptApi = new Recrypt.Api256()
        const primitives = recryptApiToNaturalRights(RecryptApi)
        const service = new LocalService(primitives, SEA, adapter)
        primitives.signKeyGen().then(pair => (service.signKeyPair = pair))
        const srv = new HttpServer(service)

        app.use(urlencoded({ extended: true }))
        app.use(json())
        app.get('/gun', (req, res) => res.end())

        app.post('/api/v1', srv.handleRequest.bind(srv))

        const web = require('http')
          .createServer()
          .listen(4000)

        new Gun({ web, radisk: true })
      }
    },
    output: { path: srcPath },
    watch: true,
    devtool: 'inline-source-map',
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ]
  })
}

if (NODE_ENV === 'production') {
  module.exports = merge(base, {
    optimization: {
      minimizer: [new terserPlugin({ parallel: true })]
    },
    output: { path: path.join(__dirname, 'build') },
    plugins: [
      new optimizeCssAssetsPlugin({}),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ]
  })
}
