import TypedCSSModulesPlugin from "@nice-labs/typed-css-modules/dist/extensions/webpack-plugin";
import * as HTMLPlugin from "html-webpack-plugin";
import * as CSSPlugin from "mini-css-extract-plugin";
import * as path from "path";
import PathsPlugin from "tsconfig-paths-webpack-plugin";
import * as webpack from "webpack";
import * as loaders from "./loaders";

const config: webpack.Configuration = {
    entry: "./src/index.tsx",
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "bundle.min.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        plugins: [new PathsPlugin()],
    },
    module: {
        rules: [
            { test: /\.scss$/, use: loaders.TypedCSSLoaders },
            { test: /\.css$/, use: loaders.CSSLoaders },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
            },
            { test: /\.svg$/, use: require.resolve("svg-url-loader") },
        ],
    },
    plugins: [
        new CSSPlugin(),
        new HTMLPlugin({
            favicon: "./public/favicon.ico",
            manifest: "./public/manifest.json",
            template: "./public/index.html",
        }),
        new webpack.WatchIgnorePlugin([
            /css\.d\.ts$/,
        ]),
        new TypedCSSModulesPlugin({
            mode: "local", // "local" | "global" (default is "local")
            camelCase: false, // boolean (default is false)
            filesPattern: "./src/**/*.scss", // string | string[] (default is "./src/**/*.css")
        }),
    ],
};

export default config;
