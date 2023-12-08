import {useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {FlatList, Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {FONT_FAMILY, TABLE, TYPE_ORDER_SERVICE} from '../constants/enum';
import {OrderProps, ServiceProps, UserProps} from '../constants/types';
import {RootStackScreensParams} from '../navigator/params';
import {ROUTE_KEY} from '../navigator/routers';
import API from '../services/api';
import {useAppSelector} from '../stores/store/storeHooks';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';
import {getOrderAllFromIDServicer} from '../utils';
import CustomText from './custom-text';

interface Props {
	navigation: StackNavigationProp<RootStackScreensParams>;
	type: TYPE_ORDER_SERVICE;
}
const RenderListService = (props: Props) => {
	const {navigation, type} = props;

	const userInfo = useAppSelector(state => state.userInfoReducer.userInfo);

	const [refreshing, setRefreshing] = useState(false);
	const [data, setData] = useState<OrderProps[]>([]);

	useFocusEffect(
		useCallback(() => {
			onRefresh();
		}, []),
	);

	const onRefresh = async () => {
		setRefreshing(true);
		const newData = await getOrderAllFromIDServicer(userInfo?.id!);

		const _data = [];
		for (let i = 0; i < newData.length; i++) {
			if (newData[i].status === type) {
				newData[i].servicerObject = userInfo!;
				_data.push(newData[i]);
			}
		}

		setData(_data);
		setRefreshing(false);
	};

	const onPressDetail = (item: OrderProps) => navigation.navigate(ROUTE_KEY.DetailOrder, {data: item});

	// // xác nhận đơn
	// const onPressConfirm = () => {};

	// // huỷ đơn
	// const onPressCancel = () => {};

	// // xong đơn
	// const onPressCompleted = () => {};

	return (
		<ScrollView style={{flex: 1, backgroundColor: colors.white}} refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}>
			<FlatList
				scrollEnabled={false}
				contentContainerStyle={styles.view}
				data={data}
				renderItem={({item}) => (
					<TouchableOpacity onPress={() => onPressDetail(item)} style={{marginBottom: heightScale(20), flexDirection: 'row'}}>
						<Image style={styles.viewImage} source={{uri: item?.serviceObject?.image}} />
						<View style={{marginLeft: widthScale(10), flex: 1}}>
							<CustomText font={FONT_FAMILY.BOLD} text={item?.serviceObject?.name} />
							<CustomText text={item?.userObject?.name} />
							<CustomText text={moment(item?.time).format('hh:mm DD/MM/YYYY')} />
						</View>
					</TouchableOpacity>
				)}
				ListEmptyComponent={
					<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
						<CustomText color={colors.grayText} text={'Không có đơn đặt hàng!'} />
					</View>
				}
			/>
		</ScrollView>
	);
};

export default memo(RenderListService);
const styles = StyleSheet.create({
	view: {
		padding: widthScale(20),
		backgroundColor: colors.white,
		flex: 1,
	},
	viewImage: {
		width: widthScale(150),
		height: heightScale(100),
		borderRadius: 5,
	},
	buttonItem: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
