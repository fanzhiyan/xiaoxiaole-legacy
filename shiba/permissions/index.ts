
/*
 * @User: 十八
 * @Date: 2023-10-18 15:11:22
 */


// 定义系统信息类型
interface SystemInfo {
	platform: string; // 平台类型，例如 "android" 或 "iOS"
	system: string; // 系统版本信息
	statusBarHeight: number; // 状态栏高度
	screenWidth: number; // 屏幕宽度
	screenHeight: number; // 屏幕高度
}

// 定义权限映射类型
interface PermissionMap {
	[key: string]: string; // 权限名称映射，例如 "WRITE_EXTERNAL_STORAGE" 对应的描述
}

// 插件安装函数
const install = (Vue: any) => {
	// 获取系统信息
	const systemInfo: SystemInfo = uni.getSystemInfoSync() as SystemInfo;
	const platform: string = systemInfo.platform;

	// 初始化变量
	let permissionTitle: string = ''; // 权限说明标题
	let isPermissionViewVisible: boolean = false; // 权限说明视图是否可见
	let permissionExplanationView: plus.nativeObj.View | null = null; // 权限说明视图对象
	let permissionName: string = ''; // 权限名称

	// 权限名称映射
	const permissionMap: PermissionMap = {
		'WRITE_EXTERNAL_STORAGE': '存储权限，主要用于保存文件、图片等数据到设备存储，实现文件下载和缓存功能。',
		'READ_MEDIA_IMAGES': '相册权限，主要用于读取设备上的图片和媒体文件，实现上传头像等功能。',
		'READ_EXTERNAL_STORAGE': '相册权限，主要用于读取设备上的文件和媒体内容，实现文件浏览和读取功能。',
		'ACCESS_FINE_LOCATION': '位置权限，主要用于获取设备的精确位置信息，实现导航和定位服务。',
		'ACCESS_COARSE_LOCATION': '粗略位置权限，主要用于获取设备的大致位置信息，实现基于位置的广告推送。',
		'RECORD_AUDIO': '麦克风权限，主要用于录音功能，实现语音留言和音频记录。',
		'CAMERA': '相机权限，主要用于拍摄照片和视频，实现拍照和视频通话功能。',
		'CALL_PHONE': '电话权限，主要用于直接拨打电话，实现一键拨号功能。',
		'READ_CONTACTS': '联系人权限，主要用于读取联系人信息，实现联系人同步。',
		'WRITE_CONTACTS': '写入联系人权限，主要用于添加或修改联系人信息，实现保存新的联系人功能。',
		'READ_SMS': '读取短信权限，主要用于读取短信内容，实现短信验证和信息同步。',
		'SEND_SMS': '发送短信权限，主要用于发送短信，实现短信通知和验证码发送。',
		'RECEIVE_SMS': '接收短信权限，主要用于接收短信内容，实现自动读取验证码功能。',
		'READ_CALENDAR': '读取日历权限，主要用于读取日历事件，实现日程管理和提醒功能。',
		'WRITE_CALENDAR': '写入日历权限，主要用于添加或修改日历事件，实现创建新的日程功能。',
		'BLUETOOTH': '蓝牙权限，主要用于连接和通信，实现蓝牙耳机和蓝牙设备配对。',
		'BLUETOOTH_ADMIN': '蓝牙管理权限，主要用于管理蓝牙设置，实现扫描和配对蓝牙设备。',
		'ACCESS_WIFI_STATE': 'WiFi状态权限，主要用于获取WiFi连接状态，实现网络连接检测。',
		'CHANGE_WIFI_STATE': '修改WiFi状态权限，主要用于更改WiFi设置，实现连接和断开WiFi网络。',
		'RECEIVE_BOOT_COMPLETED': '开机启动权限，主要用于应用在设备启动后自动运行，实现后台服务启动。',
		'RECEIVE_PUSH_NOTIFICATION': '推送通知权限，主要用于接收推送通知，实现消息提醒和更新通知。'
	};

	// 关闭权限说明视图
	const closePermissionExplanationView = (): void => {
		if (permissionExplanationView !== null) {
			permissionExplanationView.hide();
		}
	};

	// 显示权限说明视图
	const showPermissionExplanation = (permission: string): void => {
		let permissionID: string = permission.replace('android.permission.', '');
		const sdkVersion: number = parseInt(systemInfo.system.split(' ')[1].split('.')[0]);
		permissionName = permissionMap[permissionID] || '其他权限';
		permissionTitle = `APP需要访问${permissionName}`;

		// 延迟后显示权限说明视图
		setTimeout(() => {
			if (!isPermissionViewVisible) {
				const top: string = `${systemInfo.statusBarHeight + 54}px`;
				const width: string = `${systemInfo.screenWidth - 40}px`;
				permissionExplanationView = new plus.nativeObj.View('permissionExplanationView', {
					top: '0px',
					left: '0px',
					height: `${systemInfo.screenHeight}px`,
					width: `${systemInfo.screenWidth}px`,
					borderRadius: '500px',
					backgroundColor: 'rgba(0,0,0,.7)'
				});
				permissionExplanationView.drawRect({
					color: '#ffffff',
					radius: '12px'
				}, {
					top,
					left: '20px',
					width: `${systemInfo.screenWidth - 40}px`,
					height: '130px'
				});
				permissionExplanationView.drawText('权限使用说明', {
					top,
					left: '35px',
					width: `${systemInfo.screenWidth - 70}px`,
					height: '46px'
				}, {
					size: '17px',
					color: '#000000',
					align: 'left',
					whiteSpace: 'normal',
					weight: 'bold'
				});
				permissionExplanationView.drawText(permissionTitle, {
					top: `${systemInfo.statusBarHeight + 87}px`,
					left: '35px',
					width: `${systemInfo.screenWidth - 70}px`,
					height: '70px'
				}, {
					size: '15px',
					color: '#666666',
					align: 'left',
					whiteSpace: 'normal'
				});
				permissionExplanationView.show();
			}
		}, 300);
	};

	// 请求权限函数
	function requestPermission(permissionID: string): Promise<Boolean> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (plus.os.name === 'Android') {
					try {
						const main = plus.android.runtimeMainActivity();
						const context = main.getContext();
						const PackageManager = plus.android.importClass('android.content.pm.PackageManager');
						const permissionStatus = plus.android.invoke(context, 'checkSelfPermission', permissionID);
						if (permissionStatus === PackageManager.PERMISSION_GRANTED) {
							console.log(`权限 ${permissionID} 已经被授予`);
							resolve(true);
						} else {
							console.log(`权限 ${permissionID} 没有被授予`);
							resolve(false);
						}
					} catch (error) {
						console.error(`检查权限 ${permissionID} 时出错`, error);
						reject(error);
					}
				} else {
					console.log('当前平台不是 Android');
					resolve(false);
				}
			}, 1200);
		});
	}

	// 仅在 Android 平台上创建权限请求监听器
	if (platform === 'android') {
		// 创建权限请求监听器
		const requestPermissionListener = uni.createRequestPermissionListener();

		// 权限确认事件处理
		requestPermissionListener.onConfirm((event: string[]) => {
			showPermissionExplanation(event[0]);
		});

		// 权限请求事件处理
		requestPermissionListener.onRequest(async (event) => {
			// 关闭之前弹窗
			closePermissionExplanationView()
			// const hasPermission = await requestPermission(event[0]);
			// if (!hasPermission) {
			// 	const permissionID = event[0].replace('android.permission.', '');
			// 	const permissionName = permissionMap[permissionID] || '未知权限';
			// 	uni.showModal({
			// 		title: '权限提示',
			// 		content: `未获取${permissionName}，请在设置中开启权限`,
			// 		confirmText: "前往开启",
			// 		cancelText: "暂不开启",
			// 		success: (res) => {
			// 			if (res.confirm) {
			// 				if (plus.os.name === 'iOS') {
			// 					plus.runtime.openURL('app-settings:');
			// 				} else {
			// 					const Intent = plus.android.importClass('android.content.Intent');
			// 					const Settings = plus.android.importClass('android.provider.Settings');
			// 					const Uri = plus.android.importClass('android.net.Uri');
			// 					const mainActivity = plus.android.runtimeMainActivity();
			// 					const intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
			// 					const uri = Uri.fromParts('package', mainActivity.getPackageName(), null);
			// 					intent.setData(uri);
			// 					mainActivity.startActivity(intent);
			// 				}
			// 			}
			// 		}
			// 	});
			// }
		});

		// 权限请求完成事件处理
		requestPermissionListener.onComplete(async (event: string[]) => {
			closePermissionExplanationView();
		});
	}
};

export default {
	install
};
