import React, {memo, useEffect, useState} from 'react';
import {Button, DeviceEventEmitter, FlatList, Image, RefreshControl, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {ICONS} from '../../assets/image-paths';
import CustomHeader from '../../components/custom-header';
import CustomText from '../../components/custom-text';
import FixedContainer from '../../components/fixed-container';
import Spinner from '../../components/spinner';
import Star from '../../components/star';
import {EMIT_EVENT, FONT_FAMILY, TABLE} from '../../constants/enum';
import {OrderProps, ServiceProps} from '../../constants/types';
import {ROUTE_KEY} from '../../navigator/routers';
import {RootStackScreenProps} from '../../navigator/stacks';
import API from '../../services/api';
import {useAppSelector} from '../../stores/store/storeHooks';
import {colors} from '../../styles/colors';
import {heightScale, widthScale} from '../../styles/scaling-utils';
import {AlertConfirm, AlertYesNo, getServiceAll, getServiceFromID, showMessage} from '../../utils';
import {useIsFocused} from '@react-navigation/native';

const AdminService = (props: RootStackScreenProps<'Order'>) => {
	const {navigation} = props;
	const [data, setData] = useState<ServiceProps[]>([]);
	const [keyword, setKeyword] = useState('');
	const [serviceList, setServiceList] = useState<ServiceProps[]>();

	const [refreshing, setRefreshing] = useState(false);

	const onPressDetail = (item: ServiceProps) => navigation.navigate(ROUTE_KEY.ServiceDetail, {serviceData: item});

	const isFocused = useIsFocused();

	useEffect(() => {
		isFocused && onRefresh();
	}, [isFocused]);

	const onRefresh = async () => {
		setRefreshing(true);
		await getServiceAll().then(res => {
			setServiceList(res);
			setData(res);
			setRefreshing(false);
		});
	};

	const onPressEdit = (item: ServiceProps) => {
		navigation.navigate(ROUTE_KEY.AdminAddService, {data: item});
	};

	const onPressDelete = (item: ServiceProps) => {
		AlertYesNo(undefined, 'Bạn chắc chắn muốn xoá?', async () => {
			Spinner.show();

			let isCategoryValidToDelete = true;

			const arr = (await API.get(`${TABLE.ORDERS}`, true)) as OrderProps[];

			for (let i = 0; i <= arr.length; i++) {
				if (arr[i]?.idService && arr[i]?.idService == item.id) {
					isCategoryValidToDelete = false;
					AlertConfirm('Thông báo', 'Dịch vụ này đã tồn tại đơn hàng. Không thể xóa.', () => {
						Spinner.hide();
					});
					return;
				}
			}
			if (isCategoryValidToDelete) {
				Spinner.show();
				API.put(`${TABLE.SERVICE}/${item.id}`, {})
					.then(() => {
						showMessage('Xoá dịch vụ thành công!');
						onRefresh();
					})
					.finally(() => Spinner.hide());
			}
		});
	};

	const searchService = async (keyword: string) => {
		if (keyword && keyword.length > 0) {
			setKeyword(keyword);

			await API.get(`${TABLE.SERVICE}`, true).then(res => {
				console.log('service: ' + JSON.stringify(res));
				const filterList = res.filter(item => item.name.toLowerCase().includes(keyword.toLowerCase()));
				setData(filterList);
			});
		} else {
			setKeyword('');
			console.log('data: ' + JSON.stringify(serviceList));
			setData(serviceList ? [...serviceList] : []);
		}
	};

	return (
		<FixedContainer>
			<ScrollView refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />} style={styles.view}>
				<TouchableOpacity onPress={() => {}} style={styles.viewInput}>
					<Image source={ICONS.search} style={styles.iconSearch} />
					<TextInput
						placeholder="Tìm kiếm"
						editable={true}
						style={styles.input}
						onChangeText={searchService}
						value={keyword}
						numberOfLines={1}
					/>
				</TouchableOpacity>
				<FlatList
					scrollEnabled={false}
					contentContainerStyle={{paddingVertical: widthScale(20)}}
					renderItem={({item}) => {
						return (
							<TouchableOpacity
								onPress={() => onPressDetail(item)}
								style={{
									padding: widthScale(10),
									flexDirection: 'row',
									marginBottom: widthScale(10),
									borderRadius: 10,
									borderWidth: 1,
									borderColor: colors.gray,
								}}>
								<Image style={styles.image} source={{uri: item.image}} />
								<View style={{flex: 1, marginLeft: widthScale(10)}}>
									<CustomText font={FONT_FAMILY.BOLD} text={item.name} />
									<CustomText text={item?.categoryObject?.name} />
									<Star star={item?.star || 0} />
									<View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row', gap: 10}}>
										<TouchableOpacity onPress={() => onPressEdit(item)}>
											<Image source={ICONS.edit} style={styles.icon} />
										</TouchableOpacity>
										<TouchableOpacity onPress={() => onPressDelete(item)}>
											<Image source={ICONS.delete} style={styles.icon} />
										</TouchableOpacity>
									</View>
								</View>
							</TouchableOpacity>
						);
					}}
					ListEmptyComponent={
						<View style={{marginTop: heightScale(50)}}>
							<CustomText style={{textAlign: 'center'}} color={colors.grayText} text={'Bạn không có dịch vụ nào'} />
						</View>
					}
					data={data}
				/>
			</ScrollView>
		</FixedContainer>
	);
};

export default memo(AdminService);
const styles = StyleSheet.create({
	iconAdd: {
		width: widthScale(25),
		height: widthScale(25),
	},
	image: {
		width: widthScale(150),
		height: heightScale(100),
		borderRadius: 5,
	},

	view: {
		flex: 1,
		backgroundColor: colors.white,
		paddingHorizontal: widthScale(20),
	},

	icon: {
		width: widthScale(25),
		height: widthScale(25),
		marginHorizontal: widthScale(5),
	},
	viewInput: {
		borderRadius: 8,
		borderColor: colors.grayLine,
		borderWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: widthScale(5),
		gap: widthScale(5),
	},

	iconSearch: {
		width: widthScale(25),
		height: widthScale(25),
	},
	input: {
		flex: 1,
		color: colors.black,
		fontFamily: FONT_FAMILY.REGULAR,
		fontSize: widthScale(15),
	},
});
