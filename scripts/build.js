import { htmlPlugin } from '@craftamap/esbuild-plugin-html';
import esbuild from 'esbuild';

const ctx = await esbuild.context({
    entryPoints: ['src/main.ts', 'src/app.css'],
    bundle: true,
    metafile: true,
    charset: 'utf8',
    format: 'iife',
    outdir: 'app',
    loader: { '.png': 'dataurl' },
    assetNames: '[name]',
    plugins: [
        htmlPlugin({
            files: [{
                filename: 'index.html',
                entryPoints: ['src/main.ts', 'src/app.css'],
                title: 'ENGINE',
                inline: {
                    js: true,
                    css: true,
                },
                htmlTemplate: 'src/index.html',
            }],
        }),
    ],
    minify: true,
    mangleProps: /_$/,
});

try {
    await ctx.rebuild();
} catch (e) {
    console.error('Error: ', e);
    process.exit(1);
}
process.exit(0);
