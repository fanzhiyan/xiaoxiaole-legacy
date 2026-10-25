// props值
export type Props = {
	modelValue: boolean,
	days?: number
}

// 抛出的值
export type DateTimeItem = {
	label: string,
	value: string
}

export type PickupTimeResult = {
	date: DateTimeItem,
	time: DateTimeItem,
	formattedValue: string
} 