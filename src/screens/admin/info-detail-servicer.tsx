import moment from 'moment';
import React, {memo, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import CustomButton from '../../components/custom-button';
import CustomHeader from '../../components/custom-header';
import CustomRadioButton from '../../components/custom-radio-button';
import CustomText from '../../components/custom-text';
import FixedContainer from '../../components/fixed-container';
import Spinner from '../../components/spinner';
import Star from '../../components/star';
import {WIDTH} from '../../constants/constants';
import {FONT_FAMILY, TABLE, TYPE_BLOCK_SERVICER} from '../../constants/enum';
import {PaymentServicer, ServiceProps, UserProps} from '../../constants/types';
import {RootStackScreenProps} from '../../navigator/stacks';
import API from '../../services/api';
import {colors} from '../../styles/colors';
import {heightScale, widthScale} from '../../styles/scaling-utils';
import {generateRandomId, getServiceFromID, showMessage} from '../../utils';

const InfoDetailServicer = (props: RootStackScreenProps<'InfoDetailServicer'>) => {
	const {navigation, route} = props;
	const data = route.params.data;

	const [visibleBlock, setVisibleBlock] = useState(false);
	const [load, setLoad] = useState(false);
	const [status, setStatus] = useState('');
	const [reason, setReason] = useState<TYPE_BLOCK_SERVICER>();
	const [service, setService] = useState<ServiceProps[]>([]);
	const [loadService, setLoadService] = useState(false);

	useEffect(() => {
		getStatusPayment();
		getService();
	}, []);

	const getService = () => {
		setLoadService(true);
		getServiceFromID(data.id)
			.then(res => setService(res))
			.finally(() => setLoadService(false));
	};

	const getColor = () => {
		switch (status) {
			case 'Chưa thanh toán':
				return colors.red;
			case 'Đã thanh toán':
				return colors.green;
			case 'Chờ xét duyệt':
				return colors.appColor;
		}
	};
	const getStatusPayment = () => {
		setLoad(true);
		API.get(`${TABLE.PAYMENT_FEE_SERVICE}/${data?.id}`, true)
			.then(async (res: PaymentServicer[]) => {
				const payment = (await findClosestDateObject(res)) as PaymentServicer;
				if (payment) {
					const monthCurrent = new Date().getMonth() + 1;

					if (monthCurrent > new Date(payment.date).getMonth() + 1) {
						setStatus('Chưa thanh toán');
					} else {
						if (payment.isAccept) {
							setStatus('Đã thanh toán');
						} else {
							setStatus('Chờ xét duyệt');
						}
					}
				} else {
					setStatus('Chưa thanh toán');
				}
			})
			.catch(() => setStatus('Chưa thanh toán'))
			.finally(() => setLoad(false));
	};
	const findClosestDateObject = (data: PaymentServicer[]) => {
		return new Promise((resolve, reject) => {
			!data.length && reject(undefined);
			const currentDate = new Date().getTime();
			let closestItem = data?.[0];
			let closestDifference = Math.abs(currentDate - data[0]?.date);

			for (let i = 1; i < data.length; i++) {
				const difference = Math.abs(currentDate - data[i].date);
				if (difference < closestDifference) {
					closestItem = data[i];
					closestDifference = difference;
				}
			}

			resolve(closestItem as PaymentServicer | undefined);
		});
	};

	const handleBlock = async () => {
		if (!reason) {
			return showMessage('Vui lòng nhập lí do!');
		}

		Spinner.show();
		const newData = await API.get(`${TABLE.USERS}/${data.id}`);
		API.put(`${TABLE.USERS}/${data.id}`, {...newData, isBlocked: true, reasonBlock: reason} as UserProps)
			.then(() => {
				showMessage('Đã chặn ' + data.name);
				navigation.goBack();
			})
			.finally(() => Spinner.hide());
	};
	const handleUnBlock = async () => {
		Spinner.show();
		const newData = await API.get(`${TABLE.USERS}/${data.id}`);
		API.put(`${TABLE.USERS}/${data.id}`, {...newData, isBlocked: false, reasonBlock: ''} as UserProps)
			.then(() => {
				showMessage('Đã mở khoá cho ' + data.name);
				navigation.goBack();
			})
			.finally(() => Spinner.hide());
	};

	return (
		<FixedContainer>
			<CustomHeader title="THÔNG TIN CHI TIẾT" />
			<ScrollView style={styles.view}>
				<Image
					style={{width: widthScale(100), height: heightScale(100), borderRadius: 100, alignSelf: 'center', marginVertical: heightScale(20)}}
					source={{uri: data.avatar}}
				/>

				<View style={{borderRadius: 5, borderWidth: 0.5, padding: 5, marginBottom: heightScale(10)}}>
					<CustomText
						text={'TÌNH TRẠNG:   '}
						font={FONT_FAMILY.BOLD}
						size={14}
						rightContent={load ? <ActivityIndicator /> : <CustomText font={FONT_FAMILY.BOLD} color={getColor()} text={status} size={15} />}
					/>
				</View>

				<View style={{borderRadius: 5, borderWidth: 0.5, padding: 5, marginBottom: heightScale(10)}}>
					<CustomText text={'HỌ VÀ TÊN:   '} font={FONT_FAMILY.BOLD} size={14} rightContent={<CustomText text={data.name} size={15} />} />
				</View>

				<View style={{borderRadius: 5, borderWidth: 0.5, padding: 5, marginBottom: heightScale(10)}}>
					<CustomText text={'SỐ ĐIỆN THOẠI:   '} font={FONT_FAMILY.BOLD} size={14} rightContent={<CustomText text={data.phone} size={15} />} />
				</View>

				<View style={{borderRadius: 5, borderWidth: 0.5, padding: 5, marginBottom: heightScale(10)}}>
					<CustomText
						text={'NGÀY ĐĂNG KÝ:   '}
						font={FONT_FAMILY.BOLD}
						size={14}
						rightContent={<CustomText text={moment(data.dateRegister).format('DD/MM/YYYY')} size={15} />}
					/>
				</View>

				<View style={{borderRadius: 5, borderWidth: 0.5, padding: 5, marginBottom: heightScale(10)}}>
					<CustomText text={'ẢNH CCCD:   '} font={FONT_FAMILY.BOLD} size={14} />
					<Image style={{width: widthScale(120), height: heightScale(80)}} source={{uri: data.CCCD?.image}} />
				</View>

				<View style={{borderRadius: 5, borderWidth: 0.5, padding: 5, marginBottom: heightScale(10)}}>
					<CustomText text={'CCCD:   '} font={FONT_FAMILY.BOLD} size={14} rightContent={<CustomText text={data.CCCD?.id} size={15} />} />
				</View>

				{/* <View style={{borderRadius: 5, borderWidth: 0.5, padding: 5, marginBottom: heightScale(10)}}>
					<CustomText text={'ĐỊA CHỈ:   '} font={FONT_FAMILY.BOLD} size={14} rightContent={<CustomText text={'Nguyen Van A'} size={15} />} />
				</View> */}

				<View style={{marginVertical: heightScale(20)}}>
					<CustomText size={14} text={'DANH SÁCH DỊCH VỤ'} font={FONT_FAMILY.BOLD} />

					<FlatList
						ListEmptyComponent={
							<View
								style={{
									height: heightScale(120),
									justifyContent: 'center',
									alignItems: 'center',
									alignSelf: 'center',
									width: WIDTH - widthScale(40),
								}}>
								{loadService ? <ActivityIndicator /> : <CustomText color={colors.grayText} text={'Không có dịch vụ'} />}
							</View>
						}
						showsHorizontalScrollIndicator={false}
						horizontal
						renderItem={({item}) => (
							<TouchableOpacity
								style={{
									marginVertical: heightScale(5),
									marginRight: widthScale(20),
									paddingVertical: heightScale(10),
								}}
								key={generateRandomId()}>
								<Image style={styles.avatarComment} source={{uri: item.image}} />
								<CustomText text={item?.name} font={FONT_FAMILY.BOLD} />
								{/* <CustomText text={item.categoryObject.name} /> */}
								<Star star={item.star} />
							</TouchableOpacity>
						)}
						data={service}
					/>
				</View>

				<View style={{flexDirection: 'row', justifyContent: 'center', paddingVertical: heightScale(10)}}>
					{data.isBlocked ? (
						<CustomButton backgroundColor={colors.appColor} style={{width: WIDTH / 1.5}} text="MỞ KHOÁ TÀI KHOẢN" onPress={handleUnBlock} />
					) : (
						<CustomButton
							backgroundColor="red"
							style={{width: WIDTH / 2.5, backgroundColor: 'red'}}
							text="KHOÁ TÀI KHOẢN"
							onPress={() => setVisibleBlock(true)}
						/>
					)}
				</View>
			</ScrollView>

			<Modal
				animationType="fade"
				statusBarTranslucent
				transparent
				onDismiss={() => setVisibleBlock(false)}
				onRequestClose={() => setVisibleBlock(false)}
				visible={visibleBlock}>
				<Pressable onPress={() => setVisibleBlock(false)} style={styles.viewModal}>
					<Pressable style={styles.content}>
						<ScrollView>
							<CustomText font={FONT_FAMILY.BOLD} text={'Khoá tài khoản'} style={{alignSelf: 'center'}} />
							<View style={{padding: widthScale(20)}}>
								<View style={{gap: heightScale(10), marginTop: heightScale(10)}}>
									<CustomRadioButton
										onPress={() => setReason(TYPE_BLOCK_SERVICER.ReportedManyTimes)}
										isChecked={reason === TYPE_BLOCK_SERVICER.ReportedManyTimes}
										text="Bị báo cáo nhiều lần"
									/>
									<CustomRadioButton
										onPress={() => setReason(TYPE_BLOCK_SERVICER.LatePaymentOfFees)}
										isChecked={reason === TYPE_BLOCK_SERVICER.LatePaymentOfFees}
										text="Trễ thanh toán phí"
									/>
									<CustomRadioButton
										onPress={() => setReason('' as any)}
										isChecked={reason !== TYPE_BLOCK_SERVICER.ReportedManyTimes && reason !== TYPE_BLOCK_SERVICER.LatePaymentOfFees}
										text="Khác"
									/>

									{(!reason || (reason !== TYPE_BLOCK_SERVICER.ReportedManyTimes && reason !== TYPE_BLOCK_SERVICER.LatePaymentOfFees)) && (
										<View>
											<CustomText font={FONT_FAMILY.BOLD} text={'NHẬP LÝ DO'} size={14} />
											<View style={styles.viewInput}>
												<TextInput multiline value={reason} onChangeText={setReason as any} />
											</View>
										</View>
									)}
								</View>
							</View>
						</ScrollView>
						<View
							style={{
								flexDirection: 'row',
								paddingHorizontal: widthScale(15),
								justifyContent: 'space-between',
								paddingBottom: heightScale(15),
							}}>
							<CustomButton onPress={() => setVisibleBlock(false)} text="HUỶ" style={{width: WIDTH / 3}} />
							<CustomButton onPress={handleBlock} text="XÁC NHẬN" style={{width: WIDTH / 3}} />
						</View>
					</Pressable>
				</Pressable>
			</Modal>
		</FixedContainer>
	);
};

export default memo(InfoDetailServicer);
const styles = StyleSheet.create({
	view: {
		paddingHorizontal: widthScale(20),
	},
	avatarComment: {
		width: widthScale(120),
		height: widthScale(80),
		borderRadius: 5,
	},
	viewModal: {
		width: '100%',
		height: '100%',
		backgroundColor: colors.backgroundModal,
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		width: widthScale(300),
		height: heightScale(400),
		backgroundColor: colors.white,
		borderRadius: 10,
		paddingTop: heightScale(10),
	},
	viewInput: {
		width: '100%',
		borderRadius: 5,
		borderWidth: 1,
		maxHeight: heightScale(200),
	},
});
