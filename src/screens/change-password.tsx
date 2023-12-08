import React, {useState} from 'react';
import {Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {ICONS} from '../assets/image-paths';
import CustomButton from '../components/custom-button';
import CustomHeader from '../components/custom-header';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import Spinner from '../components/spinner';
import {FONT_FAMILY, TABLE} from '../constants/enum';
import {useLanguage} from '../hooks/useLanguage';
import {RootStackScreenProps} from '../navigator/stacks';
import API from '../services/api';
import {cacheUserInfo} from '../stores/reducers/userReducer';
import {useAppDispatch, useAppSelector} from '../stores/store/storeHooks';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';
import {AlertYesNo, showMessage} from '../utils';

const ChangePassword = (props: RootStackScreenProps<'ChangePassword'>) => {
	const text = useLanguage().ChangePassword;
	const dispatch = useAppDispatch();
	const userInfo = useAppSelector(state => state.userInfoReducer.userInfo);

	const [currentPass, setCurrentPass] = useState('');
	const [newPass, setNewPass] = useState('');
	const [renewPass, setRenewPass] = useState('');
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [newPasswordVisible, setNewPasswordVisible] = useState(false);
	const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] = useState(false);

	const handleChangePass = () => {
		if (userInfo?.password !== currentPass) {
			showMessage(text.currentPasswordIncorrect);
		} else {
			if (newPass !== renewPass) {
				showMessage(text.passwordMismatch);
			} else {
				AlertYesNo(undefined, text.confirmChangePassword, changePass);
			}
		}
	};

	const changePass = () => {
		Spinner.show();
		const newData = {...userInfo, password: newPass};
		API.put(`${TABLE.USERS}/${userInfo?.id}`, newData)
			.then(() => {
				dispatch(cacheUserInfo(newData));
				setCurrentPass('');
				setNewPass('');
				setRenewPass('');
				showMessage(text.changePasswordSuccess);
			})
			.catch(() => showMessage(text.changePasswordFailure))
			.finally(() => Spinner.hide());
	};

	return (
		<FixedContainer>
			<CustomHeader title={text.title} />
			<ScrollView style={styles.view}>
				<CustomText text={text.enterpass} font={FONT_FAMILY.BOLD} size={14} />
				<View>
					<TextInput secureTextEntry={!passwordVisible} value={currentPass} onChangeText={setCurrentPass} style={styles.input} />
					<TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
						<Image source={ICONS.eye} style={styles.eyeIcon} />
					</TouchableOpacity>
				</View>
				<CustomText text={text.enterpassnew} font={FONT_FAMILY.BOLD} size={14} />
				<View>
					<TextInput secureTextEntry={!newPasswordVisible} value={newPass} onChangeText={setNewPass} style={styles.input} />
					<TouchableOpacity style={styles.eyeIcon} onPress={() => setNewPasswordVisible(!newPasswordVisible)}>
						<Image source={ICONS.eye} style={styles.eyeIcon} />
					</TouchableOpacity>
				</View>
				<CustomText text={text.enterpassnew1} font={FONT_FAMILY.BOLD} size={14} />
				<View>
					<TextInput secureTextEntry={!confirmNewPasswordVisible} value={renewPass} onChangeText={setRenewPass} style={styles.input} />
					<TouchableOpacity style={styles.eyeIcon} onPress={() => setConfirmNewPasswordVisible(!confirmNewPasswordVisible)}>
						<Image source={ICONS.eye} style={styles.eyeIcon} />
					</TouchableOpacity>
				</View>
			</ScrollView>
			<View style={{margin: widthScale(20)}}>
				<CustomButton disabled={!currentPass.trim() || !newPass.trim() || !renewPass.trim()} onPress={handleChangePass} text="THAY ĐỔI" />
			</View>
		</FixedContainer>
	);
};

export default ChangePassword;
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
