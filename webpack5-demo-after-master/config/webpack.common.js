const chalk = require('chalk')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const paths = require('./paths');
const isEnvProduction = process.env.NODE_ENV === 'production';

module.exports = {
    // 入口
    entry: {
        index: './src/index.tsx'
    },
    // 输出
    output: { // 仅在生产环境添加 hash
        filename: isEnvProduction ? '[name].[contenthash].bundle.js' : '[name].bundle.js',
        path: paths.appDist,
        // 编译前清除目录
        clean: true,
        // publicPath: isEnvProduction ? 'https://xxx.com' : '', 关闭该 CDN 配置，因为示例项目，无 CDN 服务。
    },
    resolve: {
        alias: {
            '@': paths.appSrc
        },
        extensions: [
            '.tsx', '.js'
        ],
        modules: [
            'node_modules', paths.appSrc,
        ],
        symlinks: false
    },
    plugins: [
        // 生成html，自动引入所有bundle
        new HtmlWebpackPlugin(
            {title: '优化后--nicky', template: paths.appHtml}
        ),
        // 进度条
        new ProgressBarPlugin(
            {
                    format: `  :msg [:bar] ${
                    chalk.green.bold(':percent')
                } (:elapsed s)`
            }
        ),
        // dll plugins
        // new webpack.DllReferencePlugin({
        // // 注意: DllReferencePlugin 的 context 必须和 package.json 的同级目录，要不然会链接失败
        // context: path.resolve(__dirname, '../'),
        // manifest: path.resolve(__dirname, '../dll/react.manifest.json'),
        // }),
    ],
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                include: paths.appSrc,
                type: 'asset/resource'
            }, {
                test: /.(woff|woff2|eot|ttf|otf)$/i,
                include: paths.appSrc,
                type: 'asset/resource'
            }, {
                test: /\.module\.(scss|sass)$/,
                include: paths.appSrc,
                use: [
                    // 将 JS 字符串生成为 style 节点
                    'style-loader',
                    isEnvProduction && MiniCssExtractPlugin.loader,
                    // 仅生产环境
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
                    // happypack
                    // {
                    // loader: 'thread-loader',
                    // options: {
                    //     workerParallelJobs: 2
                    // }
                    // },
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
    },
    cache: {
        type: 'filesystem', // 使用文件缓存
    }
}
