// 以前的使用方法
// const routesModules = import.meta.globEager('../views/**/router/*.js');
// 现在的使用方法
// const routesModules = import.meta.glob('../views/**/router/*.js',);

// const files = import.meta.glob('./module/*.{js,ts}', { eager: true });
// let api = {};


// export default api;


// mainModule.ts
import type * as Modules from './module/index.d';

// const files = import.meta.glob<Modules>('./module//*.{js,ts}', { eager: true });
const files = Object.fromEntries(
  Object.entries(import.meta.glob<Modules>('./module/**/*.{js,ts}', { eager: true }))
    .filter(([key]) => !key.endsWith('.d.ts'))
);
let api: Modules.Modules = {};

Object.keys(files).forEach((key) => {
  api = {
    ...api,
    [key.replace(/(.*\/)*([^.]+).*/gi, '$2')]: files[key],
  };
});

export default api 