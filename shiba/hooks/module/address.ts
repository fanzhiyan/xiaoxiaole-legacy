import { isEmpty, validatePhoneNumber } from "@/shiba/rules/from";
import shiba from "@/shiba";
import { useMessageBox } from "@/shiba/components/y-message-box/index";
import { reactive, ref } from "vue";

const TOAST_MESSAGES = {
	consignee: '请输入收货人姓名',
	mobile: '请输入手机号',
	validMobile: '请输入合法手机号',
	region: '请选择省市区信息',
	address: '请输入详细地址'
};

type AddressModel = {
	consignee : string;
	mobile : string;
	address : string;
	is_default : boolean;
	region : string;
	label : string;
	province_name : string;
	province_id : string;
	city_name : string;
	city_id : string;
	district_name : string;
	district_id : string;
	label_id : string;
};

type Tag = {
	id : string;
	label : id;
};

const validateModel = (model : AddressModel) : boolean | void => {
	if (isEmpty(model.consignee)) return uni.$y.toast(TOAST_MESSAGES.consignee);
	if (isEmpty(model.mobile)) return uni.$y.toast(TOAST_MESSAGES.mobile);
	if (!validatePhoneNumber(model.mobile)) return uni.$y.toast(TOAST_MESSAGES.validMobile);
	if (isEmpty(model.region)) return uni.$y.toast(TOAST_MESSAGES.region);
	if (isEmpty(model.address)) return uni.$y.toast(TOAST_MESSAGES.address);
	return true;
};

export const useAddress = () => {
	const message = useMessageBox();
	const state = reactive({
		showRegion: false,
		model: {
			consignee: "",
			mobile: "",
			address: "",
			is_default: false,
			region: "",
			label: "",
			province_name: "",
			province_id: "",
			city_name: "",
			city_id: "",
			district_name: "",
			district_id: "",
			label_id:''
		} as AddressModel
	});
	let tagList = ref<Tag[]>([]);

	// 回显地址
	const GetInfo = async (id : string) => {
		const res = await shiba.$api.api.GetAddressDetail({ id });
		state.model = { ...res.data, region: `${res.data.province_name}-${res.data.city_name}-${res.data.district_name}` };
	};

	// 保存编辑
	const UpdateEdit = async (id : string) => {
		if (!validateModel(state.model)) return;
		const res = await shiba.$api.api.UpdateAddress({ ...state.model, id });
		uni.navigateBack();
	};

	// 删除
	const DeleteAddress = async (id : string, back : boolean = true, callback ?: () => void) => {
		await message.confirm({ title: '提示', content: "删除后不可恢复" });
		const res = await shiba.$api.api.DeleteAddress({ id });
		if (callback) callback();
		if (back) uni.navigateBack();
	};

	// 创建
	const CreateAddress = async () => {
		if (!validateModel(state.model)) return;
		const res = await shiba.$api.api.createAddress(state.model);
		uni.navigateBack();
	};

	// 获取地址标签
	const GetTagList = async () => {
		const res = await shiba.$api.api.GetAddressTag();
		tagList.value = res.data;
	};

	// 添加标签
	const AddTag = async () => {
		const res = await message.prompt({ title: "添加标签" });
		await shiba.$api.api.AddAddressTag({ label: res.value });
		GetTagList();
	};
	// 删除
	const DeleteTag = async (item) => {
		const res = await message.confirm({ title: "提示",content:"确认删除吗？" });
		await shiba.$api.api.DeleteAddressTag({ label_id:item.id });
		GetTagList();
		state.model.label_id=''
		state.model.label=''
	};
	

	// 设置默认地址
	const SetDefault = async (item, callback) => {
		const res = await shiba.$api.api.UpdateAddress({ ...item, is_default: true });
		if (callback) callback();
	};


	return {
		DeleteTag,
		SetDefault,
		AddTag,
		tagList,
		GetTagList,
		CreateAddress,
		DeleteAddress,
		UpdateEdit,
		GetInfo,
		state
	};
};