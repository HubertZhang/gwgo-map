const plugins = [
    require("autoprefixer")(),
    require("postcss-font-family-system-ui")(),
    require("postcss-pxtorem")({
        rootValue: 16,
        unitPrecision: 5,
        propList: ["*"],
    }),
];

module.exports = { plugins };
