module.exports = {
    'core': {
        builder: 'webpack5'
    },
    "stories": [
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    "addons": [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/preset-create-react-app",
        "@storybook/addon-queryparams",
    ],
    "features": {
        "emotionAlias": false,
    },
}
