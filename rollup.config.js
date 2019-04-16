/* eslint import/no-extraneous-dependencies: ['error', {'devDependencies': true}] */
// import autoExternal from 'rollup-plugin-auto-external';
// import typescript from 'rollup-plugin-typescript2';
// import external from 'rollup-plugin-peer-deps-external';
// // import postcss from 'rollup-plugin-postcss-modules'
// import postcss from 'rollup-plugin-postcss';
// import url from 'rollup-plugin-url';
// import svgr from '@svgr/rollup';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

import pkg from './package.json';

// export default {
//   input: 'src/rollupindex.js',
//   plugins: [autoExternal()],
//   output: [{
//       file: 'lib/index.cjs.js',
//       format: 'cjs',
//       sourcemap: true
//     },
//     {
//       file: 'lib/index.es.js',
//       format: 'es',
//       sourcemap: true
//     }
//   ]
// };

// const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// export default {
//   input: 'src/rollupindex.tsx',
//   output: [
//     {
//       file: pkg.main,
//       format: 'cjs',
//       exports: 'named',
//       sourcemap: true
//     },
//     {
//       file: pkg.module,
//       format: 'es',
//       exports: 'named',
//       sourcemap: true
//     }
//   ],
//   plugins: [
//     // autoExternal(),
//     external(),
//     postcss({
//       modules: true
//     }),
//     url(),
//     svgr(),
//     resolve(),
//     babel({
//       extensions,
//       include: ['src/**/*'],
//       exclude: 'node_modules/**'
//     }),
//     typescript({
//       rollupCommonJSResolveHack: true,
//       clean: true
//     }),
//     commonjs()
//   ]
// };

// import babel from 'rollup-plugin-babel';
// import resolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';

// const isProd = process.env.NODE_ENV === 'production';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM'
};

export default {
  input: 'src/rollupindex.tsx',

  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'workingConfig',
      globals,
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      globals,
      sourcemap: true
    }
  ],
  plugins: [
    resolve({extensions}),
    commonjs({
      include: '**/node_modules/**',
      namedExports: {}
    }),
    babel({
      extensions,
      include: ['src/**/*'],
      exclude: 'node_modules/**'
    })
  ],
  external: Object.keys(globals)
};
