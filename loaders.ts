import * as TypedCSSModules from "@nice-labs/typed-css-modules";
import * as MiniCSSExtractPlugin from "mini-css-extract-plugin";

export const CSSLoader = {
    loader: require.resolve("css-loader"),
    options: {
        modules: true,
        localIdentName: "[local]",
    },
};

export const TypedCSSLoaders = [
    MiniCSSExtractPlugin.loader,
    CSSLoader,
    TypedCSSModules.loader,
    require.resolve("postcss-loader"),
    require.resolve("sassjs-loader"),
];

export const CSSLoaders = [
    MiniCSSExtractPlugin.loader,
    CSSLoader,
    require.resolve("postcss-loader"),
];
