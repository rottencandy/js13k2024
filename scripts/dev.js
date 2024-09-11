import { htmlPlugin } from "@craftamap/esbuild-plugin-html"
import esbuild from "esbuild"

const ctx = await esbuild.context({
    entryPoints: ["src/main.ts", "src/app.css"],
    bundle: true,
    metafile: true,
    charset: "utf8",
    format: "iife",
    outdir: "app",
    loader: { ".png": "dataurl" },
    assetNames: "[name]",
    plugins: [
        htmlPlugin({
            files: [
                {
                    filename: "index.html",
                    entryPoints: ["src/main.ts", "src/app.css"],
                    title: "XIICUR SURVIIVORS",
                    htmlTemplate: "src/index.html",
                },
            ],
        }),
    ],
    sourcemap: "inline",
})

await ctx.watch()
const { host, port } = await ctx.serve({ servedir: "app" })
console.log(`Serving: http://${host}:${port}`)

process.on("SIGINT", async () => {
    await ctx.dispose()
    process.exit()
})
