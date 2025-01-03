import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

const config = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			// these are the aliases and paths to them
			$functions: path.resolve('src', 'lib', 'functions'),
			$: path.resolve('src', 'store'),
			$icons: path.resolve('src', 'lib', 'icons'),
			$routes: path.resolve('src', 'routes'),
			$lib: path.resolve('src', 'lib')
		}
	}
};

export default config;
