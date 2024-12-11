import * as esbuild from 'esbuild';

for (const isProd of [false, true]) {
  await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: isProd,
    sourcemap: !isProd ? 'inline' : undefined,
    format: 'iife',
    target: 'es2017',
    globalName: 'SlidingPuzzles',
    outfile: 'dist/iife/sliding-puzzles' + (isProd ? '.min.js' : '.js'),
    footer: {
      js: 'SlidingPuzzles = SlidingPuzzles.default;',
    },
  });
}
