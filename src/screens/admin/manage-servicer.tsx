import {useFocusEffect, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Image, RefreshControl, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {ICONS} from '../../assets/image-paths';
import CustomHeader from '../../components/custom-header';
import CustomText from '../../components/custom-text';
import FixedContainer from '../../components/fixed-container';
import {FONT_FAMILY, TABLE} from '../../constants/enum';
import {PaymentServicer, UserProps} from '../../constants/types';
import {ROUTE_KEY} from '../../navigator/routers';
import {RootStackScreenProps, UseRootStackNavigation} from '../../navigator/stacks';
import API from '../../services/api';
import {colors} from '../../styles/colors';
import {heightScale, widthScale} from '../../styles/scaling-utils';
import {generateRandomId, getServicerALl} from '../../utils';

const ManageServicer = (props: RootStackScreenProps<'ManageServicer'>) => {
	const {navigation} = props;

	const [data, setData] = useState<UserProps[]>([]);
	const [refreshing, setRefreshing] = useState(false);

	useFocusEffect(
		useCallback(() => {
			onRefresh();
		}, []),
	);

	const onRefresh = async () => {
		setRefreshing(true);
		getServicerALl()
			.then(res => {
				setData(res);
			})
			.finally(() => setRefreshing(false));
	};

	return (
		<FixedContainer>
			<CustomHeader title="DANH SÁCH NHÀ CUNG CẤP DỊCH VỤ" />
			<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={styles.view}>
				{/* <View style={styles.viewInput}>
					<Image source={ICONS.search} style={styles.iconSearch} />
					<TextInput placeholder="Tìm kiếm" style={styles.input} />
				</View> */}

				<View style={{marginVertical: heightScale(10)}}></View>

				{data.map(item => {
					return <Item item={item} />;
				})}
			</ScrollView>
		</FixedContainer>
	);
};

export default ManageServicer;
const styles = StyleSheet.create({
	viewInput: {
		borderRadius: 8,
		borderColor: colors.grayLine,
		borderWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: widthScale(5),
	},
	view: {
		paddingHorizontal: widthScale(20),
	},
	iconSearch: {
		width: widthScale(20),
		height: widthScale(20),
	},
	input: {
		flex: 1,
		color: colors.black,
		fontFamily: FONT_FAMILY.REGULAR,
		fontSize: widthScale(15),
	},
});

const Item = memo(({item}: {item: UserProps}) => {
	const [load, setLoad] = useState(false);
	const [status, setStatus] = useState('');

	const navigation = useNavigation<UseRootStackNavigation>();

	useEffect(() => {
		getStatusPayment();
	}, [item]);

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
		API.get(`${TABLE.PAYMENT_FEE_SERVICE}/${item?.id}`, true)
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

	return (
		<TouchableOpacity
			onPress={() => navigation.navigate(ROUTE_KEY.InfoDetailServicer, {data: item})}
			key={generateRandomId()}
			style={{borderRadius: 5, borderWidth: 1, marginBottom: heightScale(20), padding: widthScale(10), flexDirection: 'row'}}>
			<View
				style={{
					borderRadius: 100,
					backgroundColor: `${colors.gray}80`,
					width: widthScale(70),
					height: widthScale(70),
					justifyContent: 'center',
					alignItems: 'center',
					marginRight: widthScale(10),
				}}>
				<Image style={{width: widthScale(50), height: widthScale(50)}} source={{uri: item.avatar}} />
			</View>

			<View style={{flex: 1}}>
				{item.isBlocked && (
					<View
						style={{
							position: 'absolute',
							zIndex: -1,
							right: 0,
							backgroundColor: colors.gray,
							width: widthScale(60),
							height: widthScale(50),
							borderRadius: 100,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<CustomText size={12} text={'Blocked'} />
					</View>
				)}

				<CustomText font={FONT_FAMILY.BOLD} text={item.name} />
				<CustomText text={item.phone} />
				<CustomText text={'Ngày đăng ký: ' + moment(item.dateRegister).format('DD/MM/YYYY')} />
				<CustomText
					text={'Tình trạng phí: '}
					rightContent={load ? <ActivityIndicator /> : <CustomText font={FONT_FAMILY.BOLD} color={getColor()} text={status} />}
				/>
			</View>
		</TouchableOpacity>
	);
});
