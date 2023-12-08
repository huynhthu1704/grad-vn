import auth from '@react-native-firebase/auth';
import React, {memo, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import CustomButton from '../components/custom-button';
import CustomHeader from '../components/custom-header';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import Spinner from '../components/spinner';
import {FONT_FAMILY, TABLE} from '../constants/enum';
import {UserProps} from '../constants/types';
import {ROUTE_KEY} from '../navigator/routers';
import {RootStackScreenProps} from '../navigator/stacks';
import API from '../services/api';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';
import {showMessage} from '../utils';

const ForgotPass = (props: RootStackScreenProps<'ForgotPass'>) => {
	const {navigation} = props;

	const [phone, setPhone] = useState('');

	const onPressSendOtp = async () => {
		const phoneCheck = `+84${phone}`;
		Spinner.show();
		let userPhone: UserProps;

		const userList = (await API.get(`${TABLE.USERS}`, true)) as UserProps[];
		for (let i = 0; i < userList.length; i++) {
			if (phoneCheck.includes(userList[i].phone)) {
				userPhone = userList[i];
			}
		}

		if (!userPhone!) {
			Spinner.hide();
			return showMessage('Không có thông tin số điện thoại!');
		}

		auth()
			.signInWithPhoneNumber(phoneCheck)
			.then(confirm => {
				navigation.replace(ROUTE_KEY.Otp, {confirm, userPhone});
			})
			.catch(error => {
				if (error?.code == 'auth/invalid-phone-number') {
					showMessage('Số điện thoại không tồn tại!');
				} else if (error?.code == 'auth/too-many-requests') {
					showMessage('Bạn đã yêu cầu quá số lần quy định, vui lòng thử lại vào ngày mai!');
				} else {
					console.error(error);
					showMessage('Đã có lỗi!');
				}
			})
			.finally(() => Spinner.hide());
	};

	return (
		<FixedContainer>
			<CustomHeader title="Quên mật khẩu" />
			<View style={styles.view}>
				<CustomText font={FONT_FAMILY.BOLD} text={'SỐ ĐIỆN THOẠI:'} />
				<View style={styles.viewInput}>
					<TextInput
						maxLength={10}
						onChangeText={setPhone}
						value={phone}
						keyboardType="numeric"
						style={styles.input}
						placeholder="Hãy nhập số điện thoại của bạn"
						placeholderTextColor={colors.grayText}
					/>
				</View>
				<CustomButton disabled={!phone || phone.length < 10} text="Nhận mã OTP" style={{marginTop: heightScale(20)}} onPress={onPressSendOtp} />
			</View>
		</FixedContainer>
	);
};

export default memo(ForgotPass);
const styles = StyleSheet.create({
	view: {
		paddingTop: heightScale(20),
		paddingHorizontal: widthScale(20),
	},
	viewInput: {
		borderWidth: 1,
		borderRadius: 8,
		marginTop: heightScale(5),
	},
	input: {
		color: colors.black,
	},
});
