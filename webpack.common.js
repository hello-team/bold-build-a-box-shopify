const path = require("path")

module.exports = {
  entry: {
    'bold-box': "./scripts/bold-box.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.scss$/,
        use:  [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    modules: true,
                    sourceMap: true,
                    importLoaders: 3,
                }
            },
            'sass-loader'
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
    
  },
  resolve : {
    extensions: ['.*', '.js', '.jsx', '.scss', '.css']
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "assets")
  }
}