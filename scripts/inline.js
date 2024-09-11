import { htmlPlugin } from "@craftamap/esbuild-plugin-html"
import esbuild from "esbuild"

const ctx = await esbuild.context({
    entryPoints: ["app/main.js", "app/app.css"],
    bundle: false,
    metafile: true,
    charset: "utf8",
    format: "iife",
    outdir: "inline",
    loader: { ".png": "dataurl" },
    assetNames: "[name]",
    plugins: [
        htmlPlugin({
            files: [
                {
                    filename: "index.html",
                    entryPoints: ["app/main.js", "app/app.css"],
                    title: "XIICUR SURVIIVORS",
                    inline: {
                        js: true,
                        css: true,
                    },
                    htmlTemplate: "src/index.html",
                },
            ],
        }),
    ],
    minify: true,
    mangleProps: /_$/,
})

try {
    await ctx.rebuild()
} catch (e) {
    console.error("Error: ", e)
    process.exit(1)
}
process.exit(0)
