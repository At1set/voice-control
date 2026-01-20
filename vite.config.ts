import path from 'node:path';

import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import manifest from './manifest.config.ts';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), crx({ manifest })],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@images': path.resolve(__dirname, './src/lib/shared/assets/images/index.ts'),
			'@icons': path.resolve(__dirname, './src/lib/shared/assets/icons/index.ts'),
		},
	},
	server: {
		cors: {
			origin: [/chrome-extension:\/\//],
		},
	},
});
