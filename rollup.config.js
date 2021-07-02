import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript2 from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import path from 'path';

const extensions = ['.js', '.ts', '.tsx'];

export default function () {
  const config = {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.mjs',
        format: 'esm',
      },
      {
        file: 'dist/index.js',
        format: 'umd',
        exports: 'auto',
        name: 'PainterWeb'
      },
    ],
    plugins: [
      commonjs({
        include: 'node_modules/**',
        extensions,
        ignore: ['conditional-runtime-dependency'],
      }),
      resolve(),
      typescript2({
        tsconfig: path.resolve(__dirname, './tsconfig.json'),
        extensions,
      }),
    ],
    // external: ['painter-kernel'],
  };
  if (process.env['BUILD_ENV'] === 'PRD') {
    config.plugins.push(terser());
  }
  return config;
}
