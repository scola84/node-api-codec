import buble from 'rollup-plugin-buble';

export default {
  dest: './dist/api-codec.js',
  entry: 'index.js',
  format: 'cjs',
  external: [
    '@scola/error',
    'negotiator',
    'stream',
    'wildcard'
  ],
  plugins: [
    buble()
  ]
};
