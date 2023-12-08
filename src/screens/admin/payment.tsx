import {Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {RootStackScreenProps} from '../../navigator/stacks';
import FixedContainer from '../../components/fixed-container';
import CustomHeader from '../../components/custom-header';
import {heightScale, widthScale} from '../../styles/scaling-utils';
import CustomText from '../../components/custom-text';
import {ICONS} from '../../assets/image-paths';
import {FONT_FAMILY, TABLE} from '../../constants/enum';
import {formatNumber, generateRandomId} from '../../utils';
import {colors} from '../../styles/colors';
import {ROUTE_KEY} from '../../navigator/routers';
import {useFocusEffect} from '@react-navigation/native';
import API from '../../services/api';
import LoadingScreen from '../../components/loading-screen';
import {BankType} from '../../constants/types';

const Payment = (props: RootStackScreenProps<'Payment'>) => {
	const {navigation} = props;

	const [loading, setLoading] = useState(false);
	const [price, setPrice] = useState(0);
	const [list, setList] = useState<BankType[]>([]);

	useFocusEffect(
		useCallback(() => {
			onRefresh();
		}, []),
	);

	const onRefresh = () => {
		setLoading(true);
		Promise.all([
			API.get(`${TABLE.ADMIN}/PAYMENT`).then(res => {
				setPrice(res?.price);
			}),
			API.get(`${TABLE.ADMIN}/ACCOUNT_BANK`, true).then(res => {
			console.log(res)
				setList(res);
			}),
		]).finally(() => setLoading(false));
	};

	const onPressEditFee = () => navigation.navigate(ROUTE_KEY.EditPaymentFee, {fee: price});
	const onPressAddPayment = () => navigation.navigate(ROUTE_KEY.AddPayment);
	const onPressEditPayment = (item: BankType) => navigation.navigate(ROUTE_KEY.AddPayment, {data: item});

	return (
		<FixedContainer>
			<CustomHeader
				title="THANH TOÁN"
				rightContent={
					<TouchableOpacity onPress={onPressAddPayment}>
						<Image style={styles.icon} source={ICONS.add} />
					</TouchableOpacity>
				}
			/>

			<ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />} style={styles.view}>
				<View style={styles.viewContent}>
					<CustomText font={FONT_FAMILY.BOLD} text={'Phí dịch vụ: '} rightContent={<CustomText text={`${formatNumber(price)} VND/tháng`} />} />
					<TouchableOpacity onPress={onPressEditFee}>
						<Image style={styles.icon} source={ICONS.edit} />
					</TouchableOpacity>
				</View>

				{list?.map(item => (
					<View
						key={generateRandomId()}
						style={{marginBottom: heightScale(10), backgroundColor: `${colors.gray}80`, padding: 10, borderRadius: 5, paddingHorizontal: 15}}>
						<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
							{!item?.image ? (
								<CustomText font={FONT_FAMILY.BOLD} text={'Ngân hàng: '} rightContent={<CustomText text={item?.nameBank} />} />
							) : (
								<View />
							)}

							<TouchableOpacity
								onPress={() => {
									onPressEditPayment(item);
								}}>
								<Image style={styles.icon} source={ICONS.edit} />
							</TouchableOpacity>
						</View>
						<View
							style={{
								alignSelf: 'center',
								width: widthScale(200),
								height: 1,
								backgroundColor: colors.gray,
								borderRadius: 100,
								marginVertical: heightScale(5),
							}}
						/>

						{item?.image ? (
							<Image
								resizeMode="contain"
								source={{
									uri: item?.image,
								}}
								style={{width: widthScale(250), height: heightScale(400), alignSelf: 'center'}}
							/>
						) : (
							<>
								<CustomText font={FONT_FAMILY.BOLD} text={'Số tài khoản: '} rightContent={<CustomText text={item?.number} />} />
								<CustomText font={FONT_FAMILY.BOLD} text={'Tên chủ thẻ: '} rightContent={<CustomText text={item?.nameCard} />} />
							</>
						)}
					</View>
				))}
			</ScrollView>
		</FixedContainer>
	);
};

export default memo(Payment);
const styles = StyleSheet.create({
	view: {
		paddingHorizontal: widthScale(20),
	},
	viewContent: {
		marginVertical: heightScale(20),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	icon: {
		width: widthScale(20),
		height: widthScale(20),
	},
});