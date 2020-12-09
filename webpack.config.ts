import webpack from "webpack"

// requirements

import path from "path"
import tsconfig from "tsconfig-paths-webpack-plugin"

// utils functions

const assetPath = (suite:string = "") => path.resolve(path.join(__dirname, 'resources/assets'), suite);

const outputPath = (suite:string = "") => path.join("js", suite).replace(/^\//, '');

// get current Node Env
const nodeEnv = process.env.NODE_ENV as string;



// webpack plugins

const pluginDefs = {

	// global storage
	nt: [assetPath("ts/lib/glob.ts"), 'default'],

	// utilitaire functions
	fn:  [assetPath('ts/lib/fn/index.ts'), 'default'],

	// constances
	vr:  [assetPath('ts/lib/vr/index.ts'), 'default'],

	// environnement variables based on build-mode [prod | dev]
	env: [assetPath('ts/lib/env/prod'), 'default']
}


// webpack configuration for prod

const config:webpack.Configuration =
{

	output: {

		chunkFilename: 'js/lib/[chunkhash].js',
		publicPath: '/static/',
		path: path.resolve(__dirname, 'public/static')
	},

	mode: 'production',

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: ['babel-loader']
			},
			{
				test: /\.(svg|png|webp|jpe?g)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							publicPath: nodeEnv == 'prod' ? '/static/images/' : '//w-server.tb:8081/static/images/',

							output: './images',
							name: '[contenthash].[ext]'
						}
					}
				]
			}
		]
	},

	resolve: {
		extensions: ['.ts', '.js', '.txt', ".jsx"],

		alias: {
			iamges: assetPath('images')
		},

		plugins: [
			new tsconfig()
		]
	},

	plugins: [

		new webpack.ProvidePlugin(pluginDefs),
	]
};

if(nodeEnv === 'dev')
{


	Object.assign(pluginDefs, { env: [ assetPath('ts/lib/env/dev.ts'), 'default' ]});


	// Add new settings for webpack-server on dev env

	Object.assign(config, {

		output: Object.assign(config.output, { publicPath: 'http://w-server.tb:8081/static/' }),
		mode: 'development',
		devtool: 'source-map',

		devServer: {

			host: 'w-server.tb',
			port: 8081,
			allowedHosts: [
				"test.tb"
			],

			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
				"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
			},

			compress: true,
			publicPath: 'w-server.tb:8081/static/',

			watchContentBase: true,
			contentBase: [assetPath('../views')],

			hot: true,
			watchOptions: {
				poll: true
			}
		},
	});

	// new plugins

	config.plugins?.push(new webpack.HotModuleReplacementPlugin({}));
}


Object.assign(config, {

	entry: {

		main: {
			import: assetPath('ts/main.ts'),
			filename: outputPath('main.js')
		}
	}
});


module.exports = [config];
