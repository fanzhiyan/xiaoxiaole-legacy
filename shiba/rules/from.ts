// 校验手机号
export function validatePhoneNumber(phone : string) : boolean {
	const reg : RegExp = /^1[3-9]\d{9}$/;
	return phone !== undefined && phone.trim() !== "" && reg.test(phone);
}

// 校验密码
export function validatePassword(password : string) : boolean {
	const reg : RegExp = /^(?=.*[a-zA-Z!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
	return password !== undefined && password.trim() !== "" && reg.test(password);
}

// 校验验证码
export function validateVerificationCode(code : string) : boolean {
	return code !== undefined && code.trim() !== "";
}

// 校验两个值是否一致
export function validateMatch(value1 : string, value2 : string) : boolean {
	return value1 !== undefined && value1.trim() !== "" && value2 !== undefined && value2.trim() !== "" && value1 === value2;
}

// 校验值是否空值
export function isEmpty<T>(value: T | null | undefined): value is T {
  if (typeof value === 'string') {
    return value.trim() == '';
  }
  return value == null && value == undefined;
}
