import React, {useEffect, useState} from 'react';
import {Image, Modal, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ICONS} from '../assets/image-paths';
import CustomButton from '../components/custom-button';
import CustomHeader from '../components/custom-header';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import Spinner from '../components/spinner';
import {FONT_FAMILY, TABLE} from '../constants/enum';
import {BankType, ImageProps} from '../constants/types';
import {RootStackScreenProps} from '../navigator/stacks';
import API from '../services/api';
import {useAppSelector} from '../stores/store/storeHooks';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';
import {formatNumber, generateRandomId, showMessage} from '../utils';
import {getImageFromDevice, uploadImage} from '../utils/image';
import {pushNotificationAdminNewPayment} from '../utils/notification';

const FeeService = (props: RootStackScreenProps<'FeeService'>) => {
	const {navigation} = props;

	const userInfo = useAppSelector(state => state.userInfoReducer.userInfo);

	const [modal, setModal] = useState(false);

	const [image, setImage] = useState<ImageProps>();
	const [refreshing, setRefreshing] = useState(false);
	const [fee, setFee] = useState(0);
	const [listPayment, setListPayment] = useState<BankType[]>([]);

	useEffect(() => {
		onRefresh();
	}, []);

	const onRefresh = () => {
		setRefreshing(true);
		Promise.all([
			API.get(`${TABLE.ADMIN}/PAYMENT`).then(res => setFee(res?.price)),
			API.get(`${TABLE.ADMIN}/ACCOUNT_BANK`, true).then(res => setListPayment(res)),
		]).finally(() => setRefreshing(false));
	};

	const handlePayment = async () => {
		if (image) {
			Spinner.show();
			const img = await uploadImage(image?.uri);
			API.post(`${TABLE.PAYMENT_FEE_SERVICE}/${userInfo?.id}`, {
				date: new Date().valueOf(),
				idServicer: userInfo?.id,
				image: img,
			})
				.then(async res => {
					await pushNotificationAdminNewPayment(userInfo?.id!, res.id, userInfo?.name!);
					showMessage('Thanh toán thành công, chờ admin xác nhận! ');
					navigation.goBack();
				})
				.finally(() => Spinner.hide());
		}
	};

	return (
		<FixedContainer>
			<CustomHeader title={`THANH TOÁN PHÍ DỊCH VỤ THÁNG ${new Date().getMonth() + 1}`} />

			<TouchableOpacity
				onPress={() => setModal(true)}
				style={{backgroundColor: 'red', borderRadius: 5, alignSelf: 'flex-end', padding: 5, marginHorizontal: 20}}>
				<CustomText color={colors.white} font={FONT_FAMILY.BOLD} text={'Xác Minh'} />
			</TouchableOpacity>
			<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
				<CustomText text={`Phí: ${formatNumber(fee)} VND/Tháng`} style={{textAlign: 'center', paddingVertical: heightScale(10)}} />
				<View style={{width: '100%', height: 2, backgroundColor: colors.black}} />
				{listPayment.map(item => (
					<View key={generateRandomId()}>
						<View style={{marginLeft: widthScale(40)}}>
							{item.image ? (
								<Image style={{width: widthScale(200), height: heightScale(250), resizeMode: 'contain'}} source={{uri: item.image}} />
							) : (
								<>
									<CustomText text={'STK: ' + item.number} style={{paddingVertical: heightScale(10)}} />
									<CustomText text={'Ngân hàng: ' + item.nameBank} style={{paddingVertical: heightScale(10)}} />
									<CustomText text={'Chủ thẻ: ' + item.nameCard} style={{paddingVertical: heightScale(10)}} />
									<CustomText text={'Nội dung: HoVaTen_SoDienThoai'} style={{paddingVertical: heightScale(10)}} />
								</>
							)}
						</View>
						<View style={{width: '100%', height: 1, backgroundColor: colors.black}} />
					</View>
				))}
			</ScrollView>
			<Modal
				statusBarTranslucent
				onDismiss={() => setModal(false)}
				onRequestClose={() => setModal(false)}
				transparent
				animationType="fade"
				visible={modal}>
				<View style={{backgroundColor: colors.backgroundModal, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
					<View
						style={{
							width: widthScale(300),
							height: heightScale(400),
							backgroundColor: colors.white,
							borderRadius: 8,
							padding: widthScale(10),
							justifyContent: 'space-between',
							alignItems: 'center',
						}}>
						<CustomText text={'Tải lên hình ảnh xác nhận chuyển tiền'} />

						<TouchableOpacity
							onPress={async () => {
								const newImg = await getImageFromDevice();
								newImg && setImage(newImg);
							}}
							style={{
								width: widthScale(150),
								height: heightScale(200),
								borderRadius: 10,
								borderWidth: 1,
								alignSelf: 'center',
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							{image ? (
								<Image source={{uri: image.uri}} style={{width: '100%', height: '100%', resizeMode: 'contain'}} />
							) : (
								<Image style={{width: widthScale(25), height: widthScale(25)}} source={ICONS.camera} />
							)}
						</TouchableOpacity>
						<CustomButton onPress={handlePayment} style={{width: widthScale(100), alignSelf: 'center'}} text="Xác nhận" />
					</View>
				</View>
			</Modal>
		</FixedContainer>
	);
};

export default FeeService;
const styles = StyleSheet.create({});