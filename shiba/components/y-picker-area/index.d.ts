// props值
export type Props = {
	modelValue : boolean,
	cancelColor : string,
	confirmColor : string,
	cancelText : string,
	confirmText : string,
	title : string
}

// 抛出的值

export type AreaCheck = {
	province_name : string,
	province_id : string | number,
	city_name : string,
	city_id : string | number,
	district_name : string,
	district_id : string | number
}