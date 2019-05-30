import TypedCSSModulesPlugin from "@nice-labs/typed-css-modules/dist/extensions/webpack-plugin";
import * as CopyPlugin from "copy-webpack-plugin";
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
            { test: /\.png$/, use: require.resolve("file-loader") },
        ],
    },
    plugins: [
        new CSSPlugin(),
        new HTMLPlugin({
            favicon: "./public/favicon.ico",
            manifest: "./public/manifest.json",
            template: "./public/index.html",
            meta: {
                "theme-color": "#000000",
                "viewport": "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
                "apple-mobile-web-app-capable": "yes",
                "apple-mobile-web-app-status-bar-style": "black",
            },
        }),
        new CopyPlugin([
            "public/radar-128.png",
            "public/radar-256.png",
            "public/radar-512.png",
            "public/manifest.json",
            {from: "src/serviceWorker.js", to: "service-worker.js"},
          ]),
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
