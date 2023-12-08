import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {Image, RefreshControl, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import CustomText from '../components/custom-text';
import {FONT_FAMILY, TABLE} from '../constants/enum';
import {Category, ServiceProps, UserProps} from '../constants/types';
import {ROUTE_KEY} from '../navigator/routers';
import API from '../services/api';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';
import {AlertConfirm, AlertYesNo, showMessage} from '../utils';
import {ICONS} from '../assets/image-paths';
import Spinner from '../components/spinner';

const CategoryType = () => {
	const navigation = useNavigation<any>();

	const [refreshing, setRefreshing] = useState(false);
	const [keyword, setKeyword] = useState('');
	const [data, setData] = useState<Category[]>();
	const [categoryList, setCategoryList] = useState<Category[]>();

	const isFocused = useIsFocused();

	useEffect(() => {
		isFocused && onRefresh();
	}, [isFocused]);

	const onRefresh = async () => {
		setRefreshing(true);

		await API.get(`${TABLE.CATEGORY}`, true).then(res => {
			console.log('category: ' + JSON.stringify(res));
			setData(res);
			setCategoryList(res);
			setRefreshing(false);
		});
	};

	const searchCategory = async (keyword: string) => {
		console.log('search: keyword' + keyword + ' length: ' + keyword.length);
		if (keyword && keyword.length > 0) {
			setKeyword(keyword);

			await API.get(`${TABLE.CATEGORY}`, true).then(res => {
				console.log('category: ' + JSON.stringify(res));
				const filterList = res.filter(item => item.name.toLowerCase().includes(keyword.toLowerCase()));
				setData(filterList);
			});
		} else {
			setKeyword('');
			console.log('data: ' + JSON.stringify(data));
			setData(categoryList ? [...categoryList] : []);
		}
	};
	const onPressDelete = (item: Category) => {
		AlertYesNo(undefined, 'Bạn chắc chắn muốn xoá?', async () => {
			Spinner.show();

			let isCategoryValidToDelete = true;

			const arr = (await API.get(`${TABLE.SERVICE}`, true)) as ServiceProps[];

			console.log('service list: ' + JSON.stringify(arr));
			for (let i = 0; i <= arr.length; i++) {
				if (arr[i]?.category && arr[i]?.category == item.id) {
					isCategoryValidToDelete = false;
					AlertConfirm('Thông báo', 'Danh mục này đã tồn tại dịch vụ và đơn hàng. Không thể xóa.', () => {
						Spinner.hide();
					});
					return;
				}
			}
			if (isCategoryValidToDelete) {
				API.put(`${TABLE.CATEGORY}/${item.id}`, {})
					.then(() => {
						showMessage('Xoá dịch vụ thành công!');
						onRefresh();
					})
					.finally(() => Spinner.hide());
			}
		});
	};

	const onPressEdit = (item: Category) => navigation.navigate(ROUTE_KEY.AddCategory, {data: item});

	return (
		<ScrollView refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />} style={styles.view}>
			<TouchableOpacity onPress={() => {}} style={styles.viewInput}>
				<Image source={ICONS.search} style={styles.iconSearch} />
				<TextInput placeholder="Tìm kiếm" editable={true} style={styles.input} onChangeText={searchCategory} value={keyword} numberOfLines={1} />
			</TouchableOpacity>
			<FlatList
				style={{marginVertical: heightScale(20)}}
				scrollEnabled={false}
				renderItem={({item}) => {
					return (
						<TouchableOpacity
							onPress={() => {}}
							style={{
								padding: widthScale(10),
								flexDirection: 'row',
								marginBottom: widthScale(10),
								borderRadius: 10,
								borderWidth: 1,
								borderColor: colors.gray,
								justifyContent: 'space-between',
								marginVertical: heightScale(10),
							}}>
							<CustomText font={FONT_FAMILY.BOLD} text={item.name} />
							<View style={{flexDirection: 'row'}}>
								<TouchableOpacity onPress={() => onPressEdit(item)}>
									<Image source={ICONS.edit} style={styles.icon} />
								</TouchableOpacity>
								<TouchableOpacity onPress={() => onPressDelete(item)}>
									<Image source={ICONS.delete} style={styles.icon} />
								</TouchableOpacity>
							</View>
						</TouchableOpacity>
					);
				}}
				ListEmptyComponent={
					<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
						<CustomText color={colors.grayText} text={'Không có loại dịch vụ'} />
					</View>
				}
				data={data}
			/>
		</ScrollView>
	);
};

export default memo(CategoryType);
const styles = StyleSheet.create({
	view: {
		flex: 1,
		backgroundColor: colors.white,
		paddingHorizontal: widthScale(20),
	},
	iconAdd: {
		width: widthScale(25),
		height: widthScale(25),
	},
	image: {
		width: widthScale(150),
		height: heightScale(100),
		borderRadius: 5,
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
	// view: {
	// 	marginHorizontal: widthScale(20),
	// },
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
