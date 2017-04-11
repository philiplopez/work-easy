const {FuseBox} = require('fuse-box')

const fuse = FuseBox.init({
    homeDir: "src/",
    outFile: "build/bundle.js",
    sourceMaps: true,
    plugins: [
    ]
});

fuse.devServer("> main.ts");
