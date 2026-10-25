import {
	loadEnv,
	defineConfig
} from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import path from 'path';

// https://vitejs.dev/config/
// export default (command, mode) => {
// 	const env = loadEnv(mode, __dirname, 'VUE_APP_');
// 	const UnoCss = await import('unocss/vite').then(i => i.default)
// 	return {
// 		envPrefix: "VUE_APP_",
// 		plugins: [
// 			uni(),
// 			UnoCss()
// 			// mpliveMainfestPlugin(env.SHOPRO_MPLIVE_ON)
// 		],
// 		server: {
// 			host: true,
// 			// open: true,
// 			port: 7020,
// 			hmr: {
// 				overlay: true,
// 			},
// 		},
// 	};
// };


// https://vitejs.dev/config/
export default defineConfig(async (command, mode) => {
	const env = loadEnv(mode, __dirname, 'VUE_APP_');
	// const UnoCss = await import('unocss/vite').then(i => i.default)
	return {
		envPrefix: "VUE_APP_",
		plugins: [
			uni(),
			// UnoCss()
		],
		server: {
			host: true,
			// open: true,
			port: 7020,
			hmr: {
				overlay: true,
			},
		},
	}
})