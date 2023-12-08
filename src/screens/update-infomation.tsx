import { FormikProps } from 'formik';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ICONS } from '../assets/image-paths';
import CustomButton from '../components/custom-button';
import CustomHeader from '../components/custom-header';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import ModalChooseProvince, { ModalObject } from '../components/sign-up/modal-choose-province';
import Spinner from '../components/spinner';
import { FONT_FAMILY, TABLE, TYPE_USER } from '../constants/enum';
import { useLanguage } from '../hooks/useLanguage';
import { RootStackScreenProps } from '../navigator/stacks';
import API from '../services/api';
import { cacheUserInfo } from '../stores/reducers/userReducer';
import { useAppDispatch, useAppSelector } from '../stores/store/storeHooks';
import { colors } from '../styles/colors';
import { heightScale, widthScale } from '../styles/scaling-utils';
import { showMessage } from '../utils';
import { getImageFromDevice, uploadImage } from '../utils/image';

const UpdateInformation = (props: RootStackScreenProps<'UpdateInformation'>) => {
	const text = useLanguage().UpdateInformation;
	const { navigation } = props;
	const dispatch = useAppDispatch();
	const innerRefFormik = useRef<FormikProps<any>>(null);
	const userInfo = useAppSelector(state => state.userInfoReducer.userInfo);

	const [name, setName] = useState(userInfo?.name);
	const [phone, setPhone] = useState(userInfo?.phone);
	const [address, setAddress] = useState(userInfo?.address);
	const [loading, setLoading] = useState(false);

	// const onChangeAddress = (text: string) => innerRefFormik.current?.setFieldValue('address', text);
	const onChangeAddress = (text: string) => {
		console.log("Adress: " + text);
		setAddress(text)
	};
	const modalChooseProvinceRef = useRef<ModalObject>(null);

	const onPressUpdateAvatar = async () => {
		Spinner.show();

		const image = await getImageFromDevice();
		if (image) {
			setLoading(true);
			const avatar = await uploadImage(image.uri);
			Spinner.hide();

			const res = await API.put(`${TABLE.USERS}/${userInfo?.id}`, { ...userInfo, avatar });
			dispatch(cacheUserInfo(res));
			setLoading(false);
		}
		Spinner.hide();
	};

	const onPressSave = async () => {
		if (!name?.trim()) {
			return showMessage(text.showmessagename);
		}

		if (!phone?.trim()) {
			return showMessage(text.missingPhoneNumber);
		}
		Spinner.show();
		const res = await API.put(`${TABLE.USERS}/${userInfo?.id}`, { ...userInfo, name: name, phone: phone, address: address });
		Spinner.hide();
		if (res) {
			dispatch(cacheUserInfo(res));
			showMessage(text.saveSuccess);
			navigation.goBack();
		} else {
			showMessage(text.saveFailure);
		}
	};

	return (
		<FixedContainer>
			<CustomHeader title={text.title} />

			<ScrollView style={styles.view}>
				<TouchableOpacity
					disabled={loading}
					onPress={onPressUpdateAvatar}
					style={{
						alignSelf: 'center',
						borderRadius: 100,
						width: widthScale(100),
						height: widthScale(100),
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: `${colors.grayLine}30`,
					}}>
					{loading ? (
						<ActivityIndicator />
					) : (
						<>
							<Image style={styles.avatar} source={userInfo?.avatar ? { uri: userInfo?.avatar } : ICONS.user} />
							<View style={styles.viewEdit}>
								<Image style={{ width: widthScale(25), height: widthScale(25) }} source={ICONS.edit} />
							</View>
						</>
					)}
				</TouchableOpacity>

				<CustomText text={text.fullname} font={FONT_FAMILY.BOLD} size={14} />
				<TextInput onChangeText={setName} value={name} style={styles.input} />

				{userInfo?.type === TYPE_USER.USER && (
					<View>
						<CustomText text={text.phonenumber} font={FONT_FAMILY.BOLD} size={14} />
						<TextInput keyboardType="numeric" onChangeText={setPhone} value={phone} style={styles.input} />
					</View>
				)}
				{userInfo?.type === TYPE_USER.SERVICER && (
					<View>
						<CustomText text={text.phonenumber} font={FONT_FAMILY.BOLD} size={14} />
						<TextInput keyboardType="numeric" onChangeText={setPhone} editable={false} value={phone} style={styles.input} />
						<CustomText text={text.addresss} font={FONT_FAMILY.BOLD} size={14} />
						<TouchableOpacity onPress={() => modalChooseProvinceRef.current?.show({})} style={styles.buttonProvince}>
							<CustomText color={address ? colors.black : colors.grayText} text={address || text.addresss} />
						</TouchableOpacity>
					</View>
				)}
				<ModalChooseProvince ref={modalChooseProvinceRef} onPressSave={onChangeAddress} />
				<CustomButton onPress={onPressSave} text={text.save} />
			</ScrollView>
		</FixedContainer>
	);
};

export default UpdateInformation;
const styles = StyleSheet.create({
	view: {
		paddingHorizontal: widthScale(20),
		marginTop: heightScale(20),
	},
	input: {
		borderRadius: 8,
		borderWidth: 1,
		paddingLeft: widthScale(10),
		marginTop: heightScale(5),
		marginBottom: heightScale(20),
		color: colors.black,
	},
	avatar: {
		width: widthScale(100),
		height: widthScale(100),
		borderRadius: 100,
	},
	viewEdit: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		backgroundColor: colors.white,
		borderRadius: 100,
		padding: 5,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	buttonProvince: {
		borderRadius: 10,
		borderWidth: 1,
		borderColor: colors.blackGray,
		marginTop: heightScale(5),
		marginBottom: heightScale(30),
		height: heightScale(50),
		alignItems: 'center',
		flexDirection: 'row',
		paddingLeft: widthScale(5),
	},
});
