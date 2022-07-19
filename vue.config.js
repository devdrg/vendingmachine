module.exports = {
    // outputDir: "~@/../server/public",
    // outputDir: "~@/../dist/app",
    outputDir: "~@/../server/dist",

    devServer: {
        headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": "true" },
        host: "0.0.0.0",
        // port: 8080,
        host: process.env.VUE_APP_HOST,
        port: process.env.VUE_APP_PORT || 8080,
        hotOnly: false,
        // publicPath: process.env.BASE_URL || "/app"
    },
    css: {
        loaderOptions: {
            sass: {
                additionalData: `
        @import "~@/scss/_common.scss";
        `
            }
        }
    },
    chainWebpack: config => {
        config.module.rules.delete('eslint');
        config.performance
          .maxEntrypointSize(1500000)
          .maxAssetSize(1500000)
        // config.module
        //   .rule('raw')
        //   .test(/\.txt$/)
        //   .use('raw-loader')
        //   .loader('raw-loader')
        //   .end()
    },
    
    // publicPath: process.env.NODE_ENV === 'production' ? '/my-app/' : '/'
    publicPath: process.env.BASE_URL
};