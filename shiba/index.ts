// 导出
import api from '@/shiba/api';
import config from '@/shiba/config/config';
import store from '@/shiba/store';
import utils from '@/shiba/utils';
import locale from '@/shiba/locale';
// 组件hook
import * as hook from '@/shiba/components';
// 业务hook
import * as hooks from '@/shiba/hooks';

const shiba = {
  $api:api,
  $config: config,
  $store: store,
  $utils: utils,
  $hook: {
	  ...hook,
	  ...hooks
  },
  $locale: locale,
};
uni.$shiba=shiba
export default shiba;
