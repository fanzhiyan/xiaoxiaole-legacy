
import wechatApi from  "@/shiba/api/module/platform/wechat"

// #ifdef MP-MP-WEIXIN

// #endif
// #ifdef APP-PLUS
const login = () => {
	return new Promise(async (resolve, reject) => {
		const loginRes = await uni.login({
			provider: 'weixin',
			onlyAuthorize: true
		});
		if (loginRes.errMsg == 'login:ok') {
			try{
				const res = await wechatApi.Login({
					code:loginRes.code
				});
				resolve(true);
			}catch(e){
				reject(false)
			}
		} else {
			uni.showToast({
				icon: 'none',
				title: loginRes.errMsg,
			});
		}
		reject(false)
	});
};
// #endif