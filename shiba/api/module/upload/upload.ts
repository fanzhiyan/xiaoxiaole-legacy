import config from "@/shiba/config/config"
import shiba from "@/shiba";
const {
	Token_Name,
	VUE_BASE_UPLOAD
} = config

//上传图片
export const uploadFile = (params) => {
	uni.showLoading({
		title: '上传中...',
		mask: true
	})
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: VUE_BASE_UPLOAD,
			filePath: params,
			name: 'file',
			header: {
				// #ifdef MP
				"Content-Type": "multipart/form-data",
				// #endif
				'token': shiba.$store('user')[Token_Name] || uni.getStorageSync(Token_Name),
			},
		}).then(response => {
			uni.hideLoading()
			uni.showToast({
				title: "上传成功"
			})
			resolve(JSON.parse(response.data))
		}).catch(error => {
			uni.showToast({
				title: "上传失败"
			})
			uni.hideLoading()
			reject(error)
		})
	})
}