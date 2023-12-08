import React, { memo, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ICONS } from '../../assets/image-paths';
import CustomButton from '../../components/custom-button';
import CustomHeader from '../../components/custom-header';
import CustomRadioButton from '../../components/custom-radio-button';
import CustomText from '../../components/custom-text';
import FixedContainer from '../../components/fixed-container';
import Spinner from '../../components/spinner';
import { FONT_FAMILY, TABLE } from '../../constants/enum';
import { BankType, ImageProps } from '../../constants/types';
import { RootStackScreenProps } from '../../navigator/stacks';
import API from '../../services/api';
import { colors } from '../../styles/colors';
import { heightScale, widthScale } from '../../styles/scaling-utils';
import { showMessage } from '../../utils';
import { getImageFromDevice, uploadImage } from '../../utils/image';

import { useLanguage } from '../../hooks/useLanguage';

const AddPayment = (props: RootStackScreenProps<'AddPayment'>) => {
	const { navigation, route } = props;
	const payment = route.params?.data;
	console.log(payment);

	const text = useLanguage().AddPayment;
	const [isShow, setIsShow] = useState('QR');
	const [image, setImage] = useState<ImageProps>();
	const [nameBank, setNameBank] = useState('');
	const [nameCard, setNameCard] = useState('');
	const [number, setNumber] = useState('');

	const disable = isShow === 'INFO' ? !nameBank || !nameCard || !number : !image;

	useEffect(() => {
		if (payment) {
			setIsShow(payment?.image ? 'QR' : 'INFO');
			payment.image && setImage({ uri: payment.image } as any);
			setNameBank(payment.nameBank);
			setNameCard(payment.nameCard);
			setNumber(payment.number);
		}
	}, []);

	const onPressAdd = async () => {
		if (isShow === 'INFO') {
			Spinner.show();
			API.post(`${TABLE.ADMIN}/ACCOUNT_BANK`, { nameBank: nameBank, number: number, nameCard: nameCard })
				.then(() => {
					showMessage('Thêm thành công');
					navigation.goBack();
				})
				.finally(() => Spinner.hide());
		} else {
			Spinner.show();
			const uri = image?.uri ? await uploadImage(image?.uri) : '';
			API.post(`${TABLE.ADMIN}/ACCOUNT_BANK`, { image: uri })
				.then(() => {
					showMessage('Thêm thành công');
					navigation.goBack();
				})
				.finally(() => Spinner.hide());
		}
	};

	const onPressEdit = async () => {
		if (isShow === 'INFO') {
			Spinner.show();
			API.put(`${TABLE.ADMIN}/ACCOUNT_BANK/${payment?.id}`, { nameBank: nameBank, number: number, nameCard: nameCard })
				.then(() => {
					showMessage('Sửa thành công!');
					navigation.goBack();
				})
				.finally(() => Spinner.hide());
		} else {
			Spinner.show();
			const uri = image?.uri ? await uploadImage(image?.uri) : '';
			API.put(`${TABLE.ADMIN}/ACCOUNT_BANK/${payment?.id}`, { image: uri })
				.then(() => {
					showMessage('Sửa thành công');
					navigation.goBack();
				})
				.finally(() => Spinner.hide());
		}
	};

	const onPressDelete = () => {
		Spinner.show();
		API.put(`${TABLE.ADMIN}/ACCOUNT_BANK/${payment?.id}`, {})
			.then(() => {
				showMessage('Xoá thành công!');
				navigation.goBack();
			})
			.finally(() => Spinner.hide());
	};

	return (
		<FixedContainer>

			<CustomHeader title={text.title} />
			<ScrollView style={styles.view}>
				<View style={{ marginTop: heightScale(20) }}>
					<CustomText font={FONT_FAMILY.BOLD} text={'CÁCH HIỂN THỊ'} size={14} />
				</View>

				<CustomRadioButton isChecked={isShow === 'QR'} onPress={() => setIsShow('QR')} text="Quét mã QR" />
				{isShow === 'QR' && (
					<TouchableOpacity
						onPress={async () => {
							const _ = await getImageFromDevice();
							_ && setImage(_);
						}}
						style={styles.uploadImage}>
						{image?.uri ? (
							<Image source={{ uri: image.uri }} style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'contain' }} />
						) : (
							<>
								<Image source={ICONS.upload} style={styles.upload} />
								<CustomText text={'Tải lên QR'} size={12} />
							</>
						)}
					</TouchableOpacity>
				)}

				<View style={{ marginTop: heightScale(20) }} />

				<CustomRadioButton isChecked={isShow === 'INFO'} onPress={() => setIsShow('INFO')} text="Nhập thông tin" />
				{isShow === 'INFO' && (
					<View style={{ marginLeft: widthScale(10), margin: widthScale(5) }}>
						<CustomText font={FONT_FAMILY.BOLD} text={'TÊN NGÂN HÀNG'} size={14} />
						<View style={styles.viewInput}>
							<TextInput value={nameBank} onChangeText={setNameBank} style={{ color: 'black' }} />
						</View>
						<CustomText font={FONT_FAMILY.BOLD} text={'TÊN CHỦ THẺ'} size={14} />
						<View style={styles.viewInput}>
							<TextInput value={nameCard} onChangeText={setNameCard} style={{ color: 'black' }} />
						</View>
						<CustomText font={FONT_FAMILY.BOLD} text={'SỐ TÀI KHOẢN'} size={14} />
						<View style={styles.viewInput}>
							<TextInput value={number} onChangeText={setNumber} style={{ color: 'black' }} />
						</View>

					</View>
				)}

				{/* <View style={{marginTop: heightScale(20)}}>
					<CustomText font={FONT_FAMILY.BOLD} text={'NỘI DUNG CHUYỂN KHOẢN'} size={14} />
					<View style={styles.viewInput}>
						<TextInput />
					</View>
				</View> */}
			</ScrollView>

			<View style={{ padding: widthScale(20) }}>
				<CustomButton onPress={payment ? onPressEdit : onPressAdd} disabled={disable} text={payment ? 'SỬA' : 'THÊM'} />
			</View>
			{!!payment && (
				<View style={{ paddingHorizontal: widthScale(20) }}>
					<CustomButton onPress={onPressDelete} text="XOÁ" />
				</View>
			)}
		</FixedContainer>
	);
};

export default memo(AddPayment);
const styles = StyleSheet.create({
	view: {
		paddingHorizontal: widthScale(20),
	},
	viewInput: {
		width: '100%',
		borderRadius: 5,
		borderWidth: 1,
	},
	upload: {
		width: widthScale(25),
		height: widthScale(25),
	},
	uploadImage: {
		width: widthScale(200),
		height: heightScale(100),
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: colors.black,
		borderWidth: 1,
		margin: widthScale(10),
	},
});