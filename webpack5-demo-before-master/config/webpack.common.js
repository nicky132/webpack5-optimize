const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');

module.exports = {
    // 入口
    entry: {
        index: './src/index.tsx'
    },
    // 输出
    output: {
        filename: '[name].bundle.js',
        path: paths.appDist,
        // 编译前清除目录
        clean: true
    },
    resolve: {
        alias: {
            '@': paths.appSrc
        }
    },
    plugins: [
        // 生成html，自动引入所有bundle
        new HtmlWebpackPlugin(
            {title: '优化前-nicky', template: paths.appHtml}
        ),
    ],
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                include: paths.appSrc,
                loader: require.resolve('url-loader')
            }, {
                test: /.(woff|woff2|eot|ttf|otf)$/i,
                include: paths.appSrc,
                loader: require.resolve('url-loader')
            }, {
                test: /\.module\.(scss|sass)$/,
                include: paths.appSrc,
                use: [
                    // 将 JS 字符串生成为 style 节点
                    'style-loader',
                    // 将 CSS 转化成 CommonJS 模块
                    {
                        loader: 'css-loader',
                        options: { // Enable CSS Modules features
                            modules: true,
                            importLoaders: 2,
                            // 0 => no loaders (default);
                            // 1 => postcss-loader;
                            // 2 => postcss-loader, sass-loader
                        }
                    },
                    // 将 PostCSS 编译成 CSS
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        // postcss-preset-env 包含 autoprefixer
                                        'postcss-preset-env',
                                    ],
                                ]
                            }
                        }
                    },
                    // 将 Sass 编译成 CSS
                    'sass-loader',
                ].filter(Boolean)
            }, {
                test: /\.(js|ts|jsx|tsx)$/,
                include: paths.appSrc,
                use: [
                    {
                        loader: 'esbuild-loader',
                        options: {
                            loader: 'tsx',
                            target: 'es2015'
                        }
                    }
                ]
            }
        ]
    }
}
