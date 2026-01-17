import { defineManifest } from '@crxjs/vite-plugin';
import pkg from './package.json';

export default defineManifest({
	manifest_version: 3,
	name: pkg.name,
	version: pkg.version,
	action: {
		default_popup: 'src/popup/index.html',
		default_title: 'Описание расширения...',
	},
	background: {
		service_worker: 'src/background/index.ts',
		type: 'module',
	},
});
