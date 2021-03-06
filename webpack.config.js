const webpack = require('webpack');

module.exports = {
	entry: ['babel-polyfill', './src/index.js'],
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{ 
				type: "javascript/auto",
				test: /\.json$/, 
				exclude: /(node_modules|bower_components)/,
				use: ['json-loader']
			}
		]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx', '.css'], 
	},
	output: {
		path: __dirname + '/public',
		publicPath: '/',
		filename: 'bundle.js'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	devServer: {
		contentBase: './public',
		hot: true
	}
};