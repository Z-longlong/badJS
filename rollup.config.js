import commonjs from 'rollup-plugin-commonjs';
import {
    terser
} from 'rollup-plugin-terser';

export default {
    input: './bad.js',
    output: {
        file: './bad.min.js',
        format: 'es'
    },
    plugins: [
        commonjs(),
        terser()
    ]
};