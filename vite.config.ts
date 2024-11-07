import { sveltekit } from '@sveltejs/kit/vite';
import { vite as vidstack } from 'vidstack/plugins';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [vidstack(), sveltekit()],
	server: {
		watch: {
		  usePolling: true,
		},
		host: true,
		strictPort: true,
		port: 5173,
	}
});
