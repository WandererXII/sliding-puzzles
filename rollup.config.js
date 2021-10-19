import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/sliding-puzzles.js',
      format: 'iife',
      name: 'SlidingPuzzles',
      plugins: [
        getBabelOutputPlugin({
          allowAllFormats: true,
          presets: [
            [
              '@babel/preset-env',
              {
                targets: '> 0.25%, last 2 versions, Firefox ESR, not dead',
              },
            ],
          ],
        }),
      ],
    },
    {
      file: 'dist/sliding-puzzles.min.js',
      format: 'iife',
      name: 'SlidingPuzzles',
      plugins: [
        terser(),
        getBabelOutputPlugin({
          allowAllFormats: true,
          presets: [
            [
              '@babel/preset-env',
              {
                targets: '> 0.25%, last 2 versions, Firefox ESR, not dead',
              },
            ],
          ],
        }),
      ],
    },
  ],
  plugins: [typescript()],
};
