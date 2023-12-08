import React, {memo, useState} from 'react';
import {DeviceEventEmitter, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {ICONS} from '../assets/image-paths';
import CustomButton from '../components/custom-button';
import CustomHeader from '../components/custom-header';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import Spinner from '../components/spinner';
import {EMIT_EVENT, FONT_FAMILY, TABLE} from '../constants/enum';
import {RootStackScreenProps} from '../navigator/stacks';
import API from '../services/api';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';
import {showMessage} from '../utils';

const text = {
	title: 'ĐỔI MẬT KHẨU',
	enterpass: 'NHẬP MẬT KHẨU HIỆN TẠI',
	enterpassnew: 'NHẬP MẬT KHẨU MỚI',
	resetpassword: 'ĐẶT LẠI MẬT KHẨU MỚI',
	passwordMismatch: 'Xác nhận mật khẩu sai!',
	changePasswordSuccess: 'Đổi mật khẩu thành công!',
	changePasswordFailure: 'Đổi mật khẩu thất bại',
};

const ChangePasswordForgot = (props: RootStackScreenProps<'ChangePasswordForgot'>) => {
	const {navigation, route} = props;
	const userPhone = route.params.userPhone;

	const [newPass, setNewPass] = useState('');
	const [renewPass, setRenewPass] = useState('');
	const [newPasswordVisible, setNewPasswordVisible] = useState(false);
	const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] = useState(false);

	const handleChangePass = async () => {
		if (newPass !== renewPass) {
			return showMessage(text.passwordMismatch);
		}

		Spinner.show();
		try {
			const res = await API.put(`${TABLE.USERS}/${userPhone.id}`, {...userPhone, password: newPass});
			if (res) {
				showMessage(text.changePasswordSuccess);
				DeviceEventEmitter.emit(EMIT_EVENT.DATA_LOGIN, {phone: userPhone.phone, password: newPass});
				navigation.goBack();
			} else {
				showMessage(text.changePasswordFailure);
			}
		} catch (error) {
			showMessage(text.changePasswordFailure);
		} finally {
			Spinner.hide();
		}
	};

	return (
		<FixedContainer>
			<CustomHeader title={text.title} />
			<ScrollView style={styles.view}>
				<CustomText text={text.enterpass} font={FONT_FAMILY.BOLD} size={14} />
				<View>
					<TextInput secureTextEntry={!newPasswordVisible} value={newPass} onChangeText={setNewPass} style={styles.input} />
					<TouchableOpacity style={styles.eyeIcon} onPress={() => setNewPasswordVisible(!newPasswordVisible)}>
						<Image source={ICONS.eye} style={styles.eyeIcon} />
					</TouchableOpacity>
				</View>
				<CustomText text={text.enterpassnew} font={FONT_FAMILY.BOLD} size={14} />
				<View>
					<TextInput secureTextEntry={!confirmNewPasswordVisible} value={renewPass} onChangeText={setRenewPass} style={styles.input} />
					<TouchableOpacity style={styles.eyeIcon} onPress={() => setConfirmNewPasswordVisible(!confirmNewPasswordVisible)}>
						<Image source={ICONS.eye} style={styles.eyeIcon} />
					</TouchableOpacity>
				</View>
			</ScrollView>
			<View style={{margin: widthScale(20)}}>
				<CustomButton disabled={!newPass.trim() || !renewPass.trim()} onPress={handleChangePass} text={text.resetpassword} />
			</View>
		</FixedContainer>
	);
};

export default memo(ChangePasswordForgot);
const styles = StyleSheet.create({
	view: {
		paddingHorizontal: widthScale(20),
		marginTop: heightScale(20),
	},
	input: {
		color: colors.black,
		borderRadius: 8,
		borderWidth: 1,
		paddingLeft: widthScale(10),
		marginTop: heightScale(5),
		marginBottom: heightScale(20),
	},
	eyeIcon: {
		position: 'absolute',
		top: heightScale(7),
		right: widthScale(10),
		width: 20,
		height: 30,
	},
});
