import moment from 'moment';
import React, {memo, useEffect, useState} from 'react';
import {FlatList, Image, Linking, Modal, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {ICONS} from '../assets/image-paths';
import CustomButton from '../components/custom-button';
import CustomHeader from '../components/custom-header';
import CustomRadioButton from '../components/custom-radio-button';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import LoadingScreen from '../components/loading-screen';
import Spinner from '../components/spinner';
import {WIDTH} from '../constants/constants';
import {FONT_FAMILY, TABLE, TYPE_ORDER_SERVICE, TYPE_USER} from '../constants/enum';
import {ImageProps} from '../constants/types';
import {useLanguage} from '../hooks/useLanguage';
import {ROUTE_KEY} from '../navigator/routers';
import {RootStackScreenProps} from '../navigator/stacks';
import API from '../services/api';
import {useAppSelector} from '../stores/store/storeHooks';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';
import {AlertYesNo, generateRandomId, getColorStatusOrder, getStatusOrder, showMessage} from '../utils';
import {getImageFromDevice, uploadImage} from '../utils/image';
import {pushNotificationToServiceCancelOrder, pushNotificationToUserConfirmOrder} from '../utils/notification';

const DetailOrder = (props: RootStackScreenProps<'DetailOrder'>) => {
	const text = useLanguage().DetailOrder;
	const {navigation, route} = props;

	const status = useLanguage().StatusOrder;

	const userInfo = useAppSelector(state => state.userInfoReducer.userInfo);

	const [data, setData] = useState(route.params.data);
	const [visibleCancel, setVisibleCancel] = useState(false);
	const [modalConfirmDone, setModalConfirmDone] = useState(false);
	const [modalReport, setModalReport] = useState(false);
	const [reasonReport, setReasonReport] = useState('');

	const [loading, setLoading] = useState(false);
	const [reasonCancel, setReasonCancel] = useState('');
	const [imageDone, setImageDone] = useState<ImageProps[]>([]);

	const getDataCategory = () => API.get(`${TABLE.CATEGORY}/${data.serviceObject.category}`) as any;

	const getDataEvaluate = async () => { };

	const getDataUser = () => API.get(`${TABLE.USERS}/${data.idUser}`) as any;

	const getData = async () => {
		setLoading(true);
		const category = await getDataCategory();
		const evaluate = await getDataEvaluate();
		const dataUser = await getDataUser();

		setData({ ...data, categoryObject: category, userObject: dataUser });
		setLoading(false);
	};

	useEffect(() => {
		getData();
	}, []);

	// Hiển thị thông báo
	const showAlert = (message: string) => {
		showMessage(message);
	};

	// Hàm hiển thị hộp thoại xác nhận huỷ đơn hàng
	const onPressCancel = async () => {
		AlertYesNo(undefined, text.cancel, async () => {
			Spinner.show();
			const newData = await API.get(`${TABLE.ORDERS}/${data.id}`);
			if (newData?.status === TYPE_ORDER_SERVICE.OrderPending) {
				await API.put(`${TABLE.ORDERS}/${data.id}`, {
					...newData,
					status: TYPE_ORDER_SERVICE.OrderCanceled,
					statusCancel: reasonCancel,
				}).then(() => {
					pushNotificationToServiceCancelOrder(data.idService, data.idUser, data.id);
					showAlert(text.cancelSuccess);
					navigation.goBack();
				});
			} else {
				showAlert(text.cannotCancel);
			}
			Spinner.hide();
		});
	};

	// Hàm xử lý xác nhận đơn hàng
	const handleConfirm = async () => {
		AlertYesNo(undefined, text.comform, async () => {
			Spinner.show();
			const newData = await API.get(`${TABLE.ORDERS}/${data.id}`);
			if (newData?.status !== TYPE_ORDER_SERVICE.OrderCanceled) {
				await API.put(`${TABLE.ORDERS}/${data.id}`, {...newData, status: TYPE_ORDER_SERVICE.OrderInProcess}).then(() => {
					pushNotificationToUserConfirmOrder(data.idService, data.idUser, data.id);
					showAlert(text.confirmSuccess);
					navigation.goBack();
				});
			} else {
				showAlert(text.orderCancelled);
			}
			Spinner.hide();
		});
	};

	// Hàm xử lý hoàn thành đơn hàng
	const handleDone = () => {
		AlertYesNo(undefined, text.comform, async () => {
			Spinner.show();
			const newData = await API.get(`${TABLE.ORDERS}/${data.id}`);
			if (newData?.status !== TYPE_ORDER_SERVICE.OrderCanceled) {
				const imageDoneUp = [];

				for (let i = 0; i < imageDone.length; i++) {
					const url = await uploadImage(imageDone[i].uri);
					imageDoneUp.push(url);
				}

				await API.put(`${TABLE.ORDERS}/${data.id}`, {
					...newData,
					status: TYPE_ORDER_SERVICE.OrderCompleted,
					imageDone: imageDoneUp,
				}).then(() => {
					showAlert(text.completionSuccess);
				});
			} else {
				showAlert(text.orderCancelled);
			}
			Spinner.hide();
			navigation.goBack();
		});
	};
	const handleReport = (reasonReport: string) => {
		console.log('report')
		AlertYesNo(undefined, 'Xác nhận?', async () => {
			Spinner.show();
			API.get(`${TABLE.ORDERS}/${data.id}`)
				.then(async (newData: any) => {
					if (newData?.status !== TYPE_ORDER_SERVICE.OrderCanceled) {
						await API.put(`${TABLE.ORDERS}/${data.id}`, {...newData, status: TYPE_ORDER_SERVICE.OrderInProcess}).then(() => {
							showMessage('Báo cáo thành công!');
						});
					} else {
						showMessage('Báo cáo đã bị huỷ!');
					}
				})
				.finally(() => Spinner.hide())
				.finally(() => navigation.goBack());
			});
	};
	const handleEvaluate = () => {
		navigation.navigate(ROUTE_KEY.EvaluateService, {data: data});
	};

	if (loading) return <LoadingScreen />;

	return (
		<FixedContainer>
			<CustomHeader title={text.title} />
			<ScrollView style={styles.view}>
				<View style={styles.viewTop}>
					<Image source={{ uri: data.serviceObject.image }} style={styles.image} />
					<View style={{ flex: 1, justifyContent: 'center', marginLeft: widthScale(30) }}>
						<CustomText text={data.categoryObject?.name} />
						<CustomText text={data.serviceObject?.name} font={FONT_FAMILY.BOLD} />
					</View>
				</View>
				{userInfo?.type !== TYPE_USER.SERVICER && (
					<View style={{marginVertical: heightScale(20), flexDirection: 'row'}}>
						<Image source={{uri: data.servicerObject?.avatar}} style={{width: widthScale(50), height: widthScale(50), borderRadius: 100}} />
						<View style={{flex: 1, marginLeft: widthScale(10)}}>
							<CustomText text={data.servicerObject?.name} font={FONT_FAMILY.BOLD} />
							<CustomText text={data.servicerObject.phone} />
						</View>
					</View>
				)}
				<View style={styles.viewInfo}>
					<CustomText font={FONT_FAMILY.BOLD} text={text.status} />
					<CustomText
						font={data.status === TYPE_ORDER_SERVICE.OrderCanceled ? FONT_FAMILY.BOLD : undefined}
						color={getColorStatusOrder(data.status)}
						text={getStatusOrder(data.status, status)}
					/>
				</View>

				{data.status === TYPE_ORDER_SERVICE.OrderCanceled && (
					<View style={[styles.viewInfo, {justifyContent: 'space-between'}]}>
						<CustomText font={FONT_FAMILY.BOLD} text={text.reason} />
						<CustomText style={{maxWidth: widthScale(260)}} color="red" text={data?.statusCancel} />
					</View>
				)}

				<View style={styles.viewInfo}>
					<CustomText font={FONT_FAMILY.BOLD} text={text.timebooking} />
					<CustomText text={moment(data?.timeBooking).format('hh:mm - DD/MM/YYYY')} />
				</View>

				<View style={styles.viewInfo}>
					<CustomText font={FONT_FAMILY.BOLD} text={text.appointmentschedule} />
					<CustomText text={moment(data?.time).format('hh:mm - DD/MM/YYYY')} />
				</View>

				<View style={{marginTop: heightScale(15)}}>
					<CustomText font={FONT_FAMILY.BOLD} text={text.address} />
					<View style={{padding: 10, borderWidth: 1, borderRadius: 5, marginTop: heightScale(5)}}>
						<CustomText text={data?.userObject?.name} />
						<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
							<CustomText text={data?.userObject?.phone} />
							{userInfo?.type === TYPE_USER.SERVICER && (
								<TouchableOpacity onPress={() => Linking.openURL(`tel:${data?.userObject?.phone}`)}>
									<Image source={ICONS.call} style={{width: widthScale(25), height: widthScale(25)}} />
								</TouchableOpacity>
							)}
						</View>

						<CustomText text={data?.address} />
					</View>
				</View>

				<View style={{marginTop: heightScale(15)}}>
					<CustomText font={FONT_FAMILY.BOLD} text={'MÔ TẢ'} />
					<View style={{padding: 10, marginTop: heightScale(5), borderWidth: 1, borderRadius: 5}}>
						<CustomText text={data?.description} />
					</View>
				</View>

				<ScrollView horizontal>
					{data?.images?.map(item => (
						<Image key={generateRandomId()} style={styles.imageReview} source={{ uri: item }} />
					))}
				</ScrollView>

				{!!data?.imageDone?.length && (
					<View style={{marginTop: heightScale(15)}}>
						<CustomText font={FONT_FAMILY.BOLD} text={text.result} />
						<ScrollView horizontal>
							{data?.imageDone?.map((item: any) => (
								<Image key={generateRandomId()} style={styles.imageReview} source={{ uri: item }} />
							))}
						</ScrollView>
					</View>
				)}

				{/* SERVICER */}
				{userInfo?.type === TYPE_USER.SERVICER && (
					<>
						{data.status === TYPE_ORDER_SERVICE.OrderPending ? (
							<View style={{flexDirection: 'row', padding: 20, justifyContent: 'space-between'}}>
								<CustomButton onPress={() => setVisibleCancel(true)} text={text.cancel} style={{width: WIDTH / 2.8}} />
								<CustomButton onPress={handleConfirm} text={text.comform} style={{width: WIDTH / 2.8}} />
							</View>
						) : (
							<>
								{data.status === TYPE_ORDER_SERVICE.OrderInProcess && (
									<View style={{alignItems: 'center', width: '100%', marginTop: heightScale(20)}}>
										<CustomButton onPress={() => setModalConfirmDone(true)} text={text.complete} style={{width: WIDTH / 2.8}} />
									</View>
								)}
							</>
						)}
					</>
				)}

				{/* USER */}
				{userInfo?.type === TYPE_USER.USER && (
					<>
						{data.status === TYPE_ORDER_SERVICE.OrderPending && (
							<View style={{alignItems: 'center', width: '100%', marginTop: heightScale(20)}}>
								<CustomButton onPress={() => setVisibleCancel(true)} text={text.cancel} style={{width: WIDTH / 3}} />
							</View>
						)}
						{data.status === TYPE_ORDER_SERVICE.OrderCompleted && !data?.isEvaluate && (
							<View style={{flexDirection: 'row', padding: 20, justifyContent: 'space-between'}}>
								<CustomButton onPress={() => setModalReport(true)} text={text.report} style={{width: WIDTH / 2.8}} />
								<CustomButton onPress={handleEvaluate} text={text.evulate} style={{width: WIDTH / 2.8}} />
							</View>
						)}
					</>
				)}
			</ScrollView>

			{/* CANCEL  */}
			<Modal
				statusBarTranslucent
				transparent
				onDismiss={() => setVisibleCancel(false)}
				onRequestClose={() => setVisibleCancel(false)}
				visible={visibleCancel}>
				<Pressable onPress={() => setVisibleCancel(false)} style={styles.viewModal}>
					<Pressable style={styles.content}>
						<CustomText font={FONT_FAMILY.BOLD} text={text.cancelorder} style={{alignSelf: 'center'}} />
						<View style={{padding: widthScale(10)}}>
							<CustomText font={FONT_FAMILY.BOLD} text={text.enterdes} size={14} />
							<View style={styles.viewInput}>
								<ScrollView>
									<TextInput value={reasonCancel} onChangeText={setReasonCancel} multiline style={{ color: colors.black }} />
								</ScrollView>
							</View>
						</View>

						<View style={styles.viewButton1}>
							<CustomButton onPress={() => setVisibleCancel(false)} text={text.cancel} style={{width: WIDTH / 3}} />
							<CustomButton disabled={!reasonCancel.trim()} onPress={onPressCancel} text={text.complete} style={{width: WIDTH / 3}} />
						</View>
					</Pressable>
				</Pressable>
			</Modal>

			{/* DONE SERVICE  */}
			<Modal
				animationType="fade"
				statusBarTranslucent
				transparent
				onDismiss={() => setModalConfirmDone(false)}
				onRequestClose={() => setModalConfirmDone(false)}
				visible={modalConfirmDone}>
				<Pressable onPress={() => setModalConfirmDone(false)} style={styles.viewModal}>
					<Pressable style={styles.contentCompleted}>
						<CustomText font={FONT_FAMILY.BOLD} text={text.Provideslevelresults} style={{alignSelf: 'center'}} />
						<View style={{padding: widthScale(10)}}>
							<CustomText text={text.des} size={14} />
							<ScrollView style={{height: heightScale(150), marginTop: heightScale(10)}}>
								<FlatList
									scrollEnabled={false}
									renderItem={({item, index}) => {
										if (index === 0) {
											return (
												<TouchableOpacity
													onPress={async () => {
														const image = await getImageFromDevice(10);
														setImageDone([...imageDone, ...image]);
													}}
													style={{
														width: widthScale(80),
														height: widthScale(80),
														borderRadius: 5,
														justifyContent: 'center',
														alignItems: 'center',
														borderWidth: 1,
													}}>
													<Image style={{width: widthScale(25), height: widthScale(25)}} source={ICONS.camera} />
												</TouchableOpacity>
											);
										} else {
											return (
												<View>
													<TouchableOpacity
														onPress={() => {
															const newImages = [...imageDone];
															newImages.splice(index - 1, 1);
															setImageDone(newImages);
														}}
														style={{
															position: 'absolute',
															zIndex: 10,
															right: 0,
															backgroundColor: colors.white,
															borderRadius: 100,
															width: widthScale(25),
															height: widthScale(25),
															justifyContent: 'center',
															alignItems: 'center',
														}}>
														<Image
															source={ICONS.delete}
															style={{
																width: widthScale(18),
																height: widthScale(18),
															}}
														/>
													</TouchableOpacity>
													<Image style={{width: widthScale(80), height: widthScale(80), borderRadius: 5}} source={item} />
												</View>
											);
										}
									}}
									numColumns={3}
									columnWrapperStyle={{justifyContent: 'space-evenly', marginBottom: heightScale(10)}}
									data={[1, ...imageDone]}
								/>
							</ScrollView>
						</View>
						<View style={styles.viewButton}>
							<CustomButton onPress={() => setModalConfirmDone(false)} text={text.cancel} style={{width: WIDTH / 3}} />
							<CustomButton disabled={!imageDone?.length} onPress={handleDone} text={text.comform} style={{width: WIDTH / 3}} />
						</View>
					</Pressable>
				</Pressable>
			</Modal>

			<Modal
				statusBarTranslucent
				transparent
				onDismiss={() => setModalReport(false)}
				onRequestClose={() => setModalReport(false)}
				visible={modalReport}>
				<Pressable onPress={() => setModalReport(false)} style={styles.viewModal}>
					<Pressable style={styles.content}>
						<ScrollView>
							<CustomText font={FONT_FAMILY.BOLD} text={text.report} style={{alignSelf: 'center'}} />
							<View style={{padding: widthScale(20)}}>
								<CustomRadioButton text={text.des1} isChecked={reasonReport === text.des1} onPress={() => setReasonReport(text.des1)} />
								<View style={{height: 10}} />
								<CustomRadioButton text={text.other} isChecked={reasonReport !== text.des1} onPress={() => setReasonReport('')} />
								<View style={{height: 10}} />

								{reasonReport !== text.des1 && (
									<TextInput
										onChangeText={setReasonReport}
										value={reasonReport}
										multiline
										placeholder={text.enterdo}
										style={{
											width: '100%',
											backgroundColor: `${colors.grayLine}40`,
											maxHeight: heightScale(200),
											borderRadius: 5,
										}}
									/>
								)}
							</View>
						</ScrollView>
						<View style={styles.viewButton1}>
							<CustomButton onPress={() => setModalReport(false)} text={text.cancel} style={{width: WIDTH / 3}} />
							<CustomButton
								disabled={!reasonReport.trim()}
								onPress={() => handleReport(reasonReport)}
								text={text.complete}
								style={{width: WIDTH / 3}}
							/>
						</View>
					</Pressable>
				</Pressable>
			</Modal>
		</FixedContainer>
	);
};

export default memo(DetailOrder);
const styles = StyleSheet.create({
	image: {
		width: widthScale(140),
		height: widthScale(100),
		borderRadius: 10,
	},
	viewTop: {
		flexDirection: 'row',
	},
	view: {
		paddingHorizontal: widthScale(20),
	},
	viewInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: heightScale(10),
	},
	imageReview: {
		width: widthScale(140),
		height: widthScale(100),
		marginRight: widthScale(10),
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
		height: heightScale(220),
		backgroundColor: colors.white,
		borderRadius: 10,
		paddingTop: heightScale(10),
	},
	contentCompleted: {
		width: widthScale(300),
		height: heightScale(320),
		backgroundColor: colors.white,
		borderRadius: 10,
		paddingTop: heightScale(10),
	},
	viewInput: {
		width: '100%',
		borderRadius: 5,
		borderWidth: 1,
		maxHeight: heightScale(70),
		color: colors.black,
	},
	viewButton: {
		flexDirection: 'row',
		paddingHorizontal: widthScale(15),
		justifyContent: 'space-between',
		paddingBottom: heightScale(15),
	},
	viewButton1: {
		flexDirection: 'row',
		paddingHorizontal: widthScale(15),
		justifyContent: 'space-between',
		paddingBottom: heightScale(15),
	},
});
