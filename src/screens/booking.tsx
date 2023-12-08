import axios from 'axios';
import moment from 'moment';
import React, {useRef, useState} from 'react';
import {Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {ICONS} from '../assets/image-paths';
import CustomButton from '../components/custom-button';
import CustomHeader from '../components/custom-header';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import Spinner from '../components/spinner';
import TimePicker, {ModalRefObject} from '../components/time-picker';
import {FONT_FAMILY, TABLE, TYPE_ORDER_SERVICE} from '../constants/enum';
import {ImageProps} from '../constants/types';
import {useLanguage} from '../hooks/useLanguage';
import {ROUTE_KEY} from '../navigator/routers';
import {RootStackScreenProps} from '../navigator/stacks';
import API from '../services/api';
import {useAppSelector} from '../stores/store/storeHooks';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';
import {AlertYesNo, generateRandomId, getLocationMyDevice, showMessage} from '../utils';
import {getImageFromDevice, uploadImage} from '../utils/image';
import {pushNotificationToServiceNewOrder} from '../utils/notification';

const Booking = (props: RootStackScreenProps<'Booking'>) => {
	const text = useLanguage().Booking;

	const {navigation, route} = props;
	const service = route.params?.service;

	const timeRef = useRef<ModalRefObject>(null);

	const userInfo = useAppSelector(state => state.userInfoReducer.userInfo);

	const [name, setName] = useState(userInfo?.name);
	const [phone, setPhone] = useState(userInfo?.phone);
	const [address, setAddress] = useState('');
	const [date, setDate] = useState(new Date().valueOf());
	const [description, setDescription] = useState('');
	const [images, setImages] = useState<ImageProps[]>([]);

	const onPressGetMyAddress = async () => {
		Spinner.show();
		const location = await getLocationMyDevice();
		if (location) {
			const result = await axios.get(
				`https://api.opencagedata.com/geocode/v1/json?q=${location.lat}+${location.long}&key=${'8cbc638bd870448c9a0c9a120321f330'}`,
			);

			const address = result?.data?.results?.[0]?.formatted;

			if (address) {
				setAddress(address);
			} else {
				showMessage(text.alertMessage);
			}
		} else {
			showMessage(text.alertMessage);
		}
		Spinner.hide();
	};

	const onPressChooseAddress = () =>
		navigation.navigate(ROUTE_KEY.ListAddress, {
			onChoose: (newAddress: string) => setAddress(newAddress),
		});

	const onPressOrder = () => {
		AlertYesNo(undefined, text.alertMessage, async () => {
			Spinner.show();
			const arrImage = [];

			for (let i = 0; i < images.length; i++) {
				const urlImage = await uploadImage(images[i]?.uri!);
				arrImage.push(urlImage);
			}

			const body = {
				address: address,
				description: description,
				idService: service.id,
				idUser: userInfo?.id,
				images: arrImage,
				nameUser: name,
				phone: phone,
				status: TYPE_ORDER_SERVICE.OrderPending,
				time: date.valueOf(),
				timeBooking: new Date().valueOf(),
			};

			API.post(`${TABLE.ORDERS}`, body)
				.then((res: any) => {
					showMessage(text.booking_success(JSON.stringify(res)));
					pushNotificationToServiceNewOrder(service.id, userInfo?.id!, res?.name!);
					navigation.goBack();
				})
				.finally(() => Spinner.hide());
		});
	};

	return (
		<FixedContainer>
			<CustomHeader title={text.title} />
			<CustomText style={{textAlign: 'center'}} font={FONT_FAMILY.BOLD} />

			<ScrollView style={styles.view}>
				{/* NAME  */}
				<View style={styles.viewInput}>
					<CustomText text={text.namecustomer} font={FONT_FAMILY.BOLD} />
					<TextInput onChangeText={setName} value={name} style={styles.input} />
				</View>

				{/* PHONE  */}
				<View style={styles.viewInput}>
					<CustomText text={text.phonecustomer} font={FONT_FAMILY.BOLD} />
					<TextInput onChangeText={setPhone} value={phone} keyboardType={'numeric'} style={styles.input} />
				</View>

				{/* ADDRESS  */}
				<View style={styles.viewInput}>
					<CustomText text={text.addresscustomer} font={FONT_FAMILY.BOLD} />
					<View style={styles.addressButtonsContainer}>
						<View style={styles.addressButton}>
							<TouchableOpacity onPress={onPressGetMyAddress} style={styles.buttonUseCurrentLocation}>
								<View style={{flexDirection: 'row', alignItems: 'center'}}>
									<Image source={ICONS.location} style={styles.icon} />
									<CustomText style={styles.textUseCurrentLocation} text={text.localaddress} />
								</View>
							</TouchableOpacity>
						</View>
						<View style={styles.addressButton}>
							<TouchableOpacity style={styles.buttonChooseAddress} onPress={onPressChooseAddress}>
								<View style={{flexDirection: 'row', alignItems: 'center'}}>
									<Image source={ICONS.bookaddress} style={styles.icon} />
									<CustomText style={styles.textChooseAddress} size={12} text={text.chooseaddress} />
								</View>
							</TouchableOpacity>
						</View>
					</View>
					<TextInput multiline value={address} editable={false} style={styles.inputAddress} />
				</View>

				{/* DATE  */}
				<View style={styles.viewInput}>
					<CustomText text={text.datebooking} font={FONT_FAMILY.BOLD} />
					<TouchableOpacity
						onPress={() => {
							timeRef.current?.show();
						}}>
						<TextInput editable={false} value={moment(date).format('DD/MM/YYYY')} keyboardType={'numeric'} style={styles.input} />
					</TouchableOpacity>
				</View>

				{/* TIME  */}
				<View style={styles.viewInput}>
					<CustomText text={text.timebooking} font={FONT_FAMILY.BOLD} />
					<TouchableOpacity
						onPress={() => {
							timeRef.current?.show(true);
						}}>
						<TextInput editable={false} value={moment(date).format('hh:mm')} keyboardType={'numeric'} style={styles.input} />
					</TouchableOpacity>
				</View>

				{/* DESCRIPTION  */}
				<View style={styles.viewInput}>
					<CustomText text={text.desprolem} font={FONT_FAMILY.BOLD} />
					<TextInput value={description} onChangeText={setDescription} multiline style={styles.inputDescription} />
				</View>

				{/* IMAGES  */}
				<View style={styles.viewInput}>
					<CustomText text={text.image} font={FONT_FAMILY.BOLD} />
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						<TouchableOpacity
							onPress={async () => {
								const newImages = await getImageFromDevice(10);
								newImages?.length && setImages([...images, ...newImages]);
							}}
							style={{
								width: widthScale(100),
								height: widthScale(100),
								borderWidth: 1,
								borderRadius: 5,
								justifyContent: 'center',
								alignItems: 'center',
								marginRight: widthScale(15),
							}}>
							<Image style={{width: 50, height: 50}} source={ICONS.camera} />
						</TouchableOpacity>
						<ScrollView showsHorizontalScrollIndicator={false} style={{marginVertical: heightScale(20)}} horizontal>
							{images.map((item, index) => (
								<View style={{marginRight: widthScale(15)}} key={generateRandomId()}>
									<TouchableOpacity
										onPress={() => {
											const newImages = [...images];
											newImages.splice(index, 1);
											setImages(newImages);
										}}
										activeOpacity={0.5}
										style={{
											position: 'absolute',
											zIndex: 100,
											width: widthScale(25),
											height: widthScale(25),
											backgroundColor: colors.white,
											borderRadius: 100,
											justifyContent: 'center',
											alignItems: 'center',
											right: 0,
											shadowColor: '#000',
											shadowOffset: {width: 0, height: 2},
											shadowOpacity: 0.25,
											shadowRadius: 3.84,
											elevation: 5,
										}}>
										<Image style={{width: widthScale(20), height: widthScale(20)}} source={ICONS.delete} />
									</TouchableOpacity>
									<Image style={{width: widthScale(100), height: widthScale(100), borderRadius: 5}} source={{uri: item.uri}} />
								</View>
							))}
						</ScrollView>
					</View>
				</View>
			</ScrollView>
			<View style={{padding: widthScale(20)}}>
				<CustomButton
					onPress={onPressOrder}
					disabled={!name || !phone || !address || !date || !description || !images.length}
					text={text.booking}
				/>
			</View>
			<TimePicker
				date={new Date()}
				maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
				minimumDate={new Date()}
				title={text.choosebooking}
				ref={timeRef}
				onConfirm={newDate => setDate(newDate.valueOf())}
			/>
		</FixedContainer>
	);
};

export default Booking;
const styles = StyleSheet.create({
	view: {
		paddingHorizontal: widthScale(20),
	},
	input: {
		height: heightScale(45),
		borderRadius: 10,
		borderWidth: 1,
		marginTop: heightScale(5),
		paddingHorizontal: widthScale(10),
		borderColor: colors.grayLine,
		color: colors.black,
	},
	viewInput: {
		marginTop: heightScale(20),
	},
	inputDescription: {
		height: heightScale(100),
		borderRadius: 10,
		borderWidth: 1,
		marginTop: heightScale(5),
		paddingHorizontal: widthScale(10),
		borderColor: colors.grayLine,
		color: colors.black,
	},
	inputAddress: {
		minHeight: heightScale(45),
		borderRadius: 10,
		borderWidth: 1,
		marginTop: heightScale(5),
		paddingHorizontal: widthScale(10),
		borderColor: colors.grayLine,
		color: colors.black,
	},
	viewInputAdress: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	buttonUseCurrentLocation: {
		backgroundColor: '#ffffff',
		width: 150,
		borderRadius: 10,
		justifyContent: 'center',
		margin: widthScale(5),
		marginLeft: 20,
	},
	buttonChooseAddress: {
		backgroundColor: '#ffffff',
		width: 150,
		borderRadius: 10,
		justifyContent: 'center',
		margin: widthScale(5),
		marginLeft: 20,
	},
	textUseCurrentLocation: {
		color: colors.blackGray,
		fontFamily: FONT_FAMILY.BOLD,
		fontSize: 12,
	},
	textChooseAddress: {
		color: colors.blackGray,
		fontFamily: FONT_FAMILY.BOLD,
		fontSize: 12,
	},
	addressButtonsContainer: {
		flexDirection: 'column',
		marginTop: heightScale(5),
	},
	addressButton: {
		marginTop: heightScale(5),
	},
	icon: {
		width: 24,
		height: 24,
		marginRight: 10,
	},
});
