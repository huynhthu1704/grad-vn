import {CommonActions} from '@react-navigation/native';
import React, {memo, useEffect, useState} from 'react';
import {DeviceEventEmitter, Image, ScrollView, StyleSheet, TextInput, ToastAndroid, TouchableOpacity, View} from 'react-native';
import {ICONS, IMAGES} from '../assets/image-paths';
import CustomButton from '../components/custom-button';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import Spinner from '../components/spinner';
import {EMIT_EVENT, FONT_FAMILY, TABLE, TYPE_USER} from '../constants/enum';
import {UserProps} from '../constants/types';
import {ROUTE_KEY} from '../navigator/routers';
import {RootStackScreenProps} from '../navigator/stacks';
import API from '../services/api';
import {cacheUserInfo} from '../stores/reducers/userReducer';
import {useAppDispatch} from '../stores/store/storeHooks';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';
import messaging from '@react-native-firebase/messaging';
import {showMessage} from '../utils';

const LogIn = (props: RootStackScreenProps<'LogIn'>) => {
	const {navigation} = props;
	const dispatch = useAppDispatch();

	const [phone, setPhone] = useState(__DEV__ ? '' : '');
	const [password, setPassword] = useState(__DEV__ ? '' : '');
	const [errorPhone, setErrorPhone] = useState('');
	const [errorPass, setErrorPass] = useState('');
	const phoneRegex = /(0)+([0-9]{9})\b/;
	const [passwordVisible, setPasswordVisible] = useState(false);

	useEffect(() => {
		DeviceEventEmitter.addListener(EMIT_EVENT.DATA_LOGIN, ({phone: newPhone, password: newPassword}) => {
			setPhone(newPhone);
			setPassword(newPassword);
		});
	}, []);

	const onPressForgotPass = () => navigation.navigate(ROUTE_KEY.ForgotPass);

	const onPressSignUp = () => navigation.navigate(ROUTE_KEY.SignUp);

	const onPressLogin = async () => {
		if (!phone.trim()) {
			return setErrorPhone('Thiếu số điện thoại!');
		} else if (phoneRegex.test(phone) == false) {
			return setErrorPhone('Số điện thoại không hợp lệ!');
		} else {
			setErrorPhone('');
		}

		if (!password.trim()) {
			return setErrorPass('Thiếu mật khẩu!');
		} else {
			setErrorPass('');
		}
		if (!phone || !password) {
			return;
		}
		Spinner.show();
		const users = (await API.get(TABLE.USERS, true)) as UserProps[];
		console.log('user list: ' + JSON.stringify(users));

		for (let i = 0; i < users.length; i++) {
			if (users[i].phone === phone && users[i].password === password) {
				// update token user:
				const tokenDevice = await messaging().getToken();
				const newUser = await API.put(`${TABLE.USERS}/${users[i]?.id}`, {...users[i], tokenDevice: tokenDevice});
				Spinner.hide();
				//// Test
				// navigation.dispatch(CommonActions.reset({index: 0, routes: [{name: ROUTE_KEY.BottomTab}]}));
				// ToastAndroid.show('Đăng nhập thành công!', ToastAndroid.SHORT);

				//// Main when have home screen
				if (users[i].type === TYPE_USER.SERVICER && !users[i]?.isAccept) {
					//ToastAndroid.show('Tài khoản của bạn đang chờ admin xét duyệt', ToastAndroid.SHORT);
					return showMessage('Tài khoản của bạn đang chờ admin xét duyệt');
				} else {
					dispatch(cacheUserInfo(newUser));
					navigation.dispatch(CommonActions.reset({index: 0, routes: [{name: ROUTE_KEY.BottomTab}]}));
					return ToastAndroid.show('Đăng nhập thành công!', ToastAndroid.SHORT);
				}
			}
		}
		Spinner.hide();
		ToastAndroid.show('Sai thông tin đăng nhập!', ToastAndroid.SHORT);
		showMessage('Sai thông tin đăng nhập!');
	};

	return (
		<FixedContainer>
			<ScrollView>
				<Image source={IMAGES.LOGO} style={styles.logo} />
				<CustomText font={FONT_FAMILY.BOLD} text={'ĐĂNG NHẬP'} style={styles.title} />

				<View style={styles.input}>
					<TextInput
						value={phone}
						onChangeText={setPhone}
						keyboardType="numeric"
						placeholder="Số điện thoại"
						maxLength={10}
						placeholderTextColor={colors.grayText}
						style={styles.inputText}
					/>
				</View>
				<CustomText text={errorPhone} style={{color: colors.red, marginLeft: 25}} size={10} />

				<View style={styles.input}>
					<TextInput
						secureTextEntry={!passwordVisible}
						value={password}
						onChangeText={setPassword}
						placeholder="Mật khẩu"
						placeholderTextColor={colors.grayText}
						style={styles.inputText}
					/>
					<TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
						<Image source={ICONS.eye} style={styles.eyeIcon} />
					</TouchableOpacity>
				</View>
				<CustomText text={errorPass} style={{color: colors.red, marginLeft: 25}} size={10} />

				<TouchableOpacity style={styles.forgotPass} onPress={onPressForgotPass}>
					<CustomText text={'Quên mật khẩu?'} size={13} font={FONT_FAMILY.BOLD} style={{textAlign: 'center'}} />
				</TouchableOpacity>

				<TouchableOpacity style={styles.signUp} onPress={onPressSignUp}>
					<CustomText text={'Đăng ký tài khoản ngay?'} size={13} font={FONT_FAMILY.BOLD} style={{textAlign: 'center'}} />
				</TouchableOpacity>

				<View style={{alignSelf: 'center'}}>
					<CustomButton onPress={onPressLogin} text="ĐĂNG NHẬP" style={styles.button} />
				</View>
			</ScrollView>
		</FixedContainer>
	);
};

export default memo(LogIn);
const styles = StyleSheet.create({
	logo: {
		width: widthScale(100),
		height: widthScale(100),
		marginTop: heightScale(50),
		alignSelf: 'center',
	},
	title: {
		alignSelf: 'center',
	},
	input: {
		marginHorizontal: widthScale(20),
		borderRadius: 10,
		borderWidth: 1,
		borderColor: colors.blackGray,
		marginTop: heightScale(40),
	},
	inputText: {
		color: colors.black,
		paddingLeft: widthScale(5),
	},
	button: {
		width: widthScale(150),
		marginTop: heightScale(100),
	},
	forgotPass: {
		alignSelf: 'flex-end',
		margin: widthScale(20),
	},
	signUp: {
		margin: widthScale(20),
	},
	eyeIcon: {
		position: 'absolute',
		top: heightScale(5),
		right: widthScale(10),
		width: 20,
		height: 30,
	},
});
