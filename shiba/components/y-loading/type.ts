// 配置项
export type LoadingOptions = {
	icon : string,
	show : boolean,
	loadingText : string
}

// 方法
export type LoadingFunction = {
	loading : (opction : LoadingOptions) => void;
	close : () => void;
};


export interface Props {
	// mode ?: 'lp' | 'fk' | 'loader';
	selector ?: string
}

export type mode = 'loader' | 'fk' | 'lp'

// 方法Type
export type messageType = 'loading' | 'close'