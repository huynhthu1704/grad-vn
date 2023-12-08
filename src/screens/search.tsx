import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, Image, RefreshControl, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {ICONS} from '../assets/image-paths';
import CustomHeader from '../components/custom-header';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import Filter, {Sort} from '../components/search/filter';
import Star from '../components/star';
import {FONT_FAMILY} from '../constants/enum';
import {ServiceProps} from '../constants/types';
import {useLanguage} from '../hooks/useLanguage';
import {ROUTE_KEY} from '../navigator/routers';
import {RootStackScreenProps} from '../navigator/stacks';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';
import {generateRandomId, getServiceAll} from '../utils';
import {sleep} from '../utils/time';

const Search = (props: RootStackScreenProps<'Search'>) => {
	const text = useLanguage().Search;

	const sort = [
		{title: text.sort1, id: '333', function: (a: any, b: any) => a?.star - b?.star},
		{title: text.sort2, id: '444', function: (a: any, b: any) => b?.star - a?.star},
	];
	const {navigation, route} = props;
	const categories = route.params.categories;

	const [textSearch, setTextSearch] = useState('');
	const [isShow, setIsShow] = useState(false);
	const [serviceAll, setServiceAll] = useState<ServiceProps[]>(route.params.data);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sortData , setSortData] = useState<Sort>();

	const [filter, setFilter] = useState<Sort[]>([]);
	const [isShowFilter, setIsShowFilter] = useState(false);
	const [filterData, setFilterData] = useState<Sort>();

	const allServiceRef = useRef<ServiceProps[]>(route.params.data);

	useEffect(() => {
		const all = {id: 'ALL', name: text.all};
		const newCategories = [all, ...categories] as any;
		setFilter(newCategories);
	}, []);

	const onRefresh = async () => {
		setRefreshing(true);
		const data = await getServiceAll();
		allServiceRef.current = data;
		setRefreshing(false);
	};
	const onPressFilter = (data: Sort) => {
		setFilterData(data);
		setIsShowFilter(false);

		if (data.id === 'ALL') {
			return setServiceAll(allServiceRef.current);
		}

		const newData = [];
		for (let i = 0; i < allServiceRef.current.length; i++) {
			if (allServiceRef.current[i].category === data.id) {
				newData.push(allServiceRef.current[i]);
			}
		}
		setServiceAll(newData);
	};
	const onPressSort = (data: Sort) => {
		setSortData(data);
		setIsShow(false);
		const newData = [...allServiceRef.current];
		setServiceAll(newData.sort(data.function));
	};

	const onSearch = (text: string) => {
		setLoading(true);
		setTextSearch(text);

		const changeText = (_: string) =>
			_.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '');

		const newText = changeText(text);

		const newArr = [...allServiceRef.current];
		setServiceAll(newArr.filter(item => changeText(item?.name).includes(newText)));

		sleep(500).finally(() => setLoading(false));
	};
	const renderItemOutstandingService = ({item}: {item: ServiceProps}) => {
		return (
			<TouchableOpacity
				onPress={() => navigation.navigate(ROUTE_KEY.ServiceDetail, {serviceData: item})}
				style={[styles.itemService, {marginRight: 0}]}>
				<Image source={{uri: item?.image}} style={styles.imageService} />

				<View style={{flex: 1, padding: widthScale(15)}}>
					<CustomText numberOfLines={1} font={FONT_FAMILY.BOLD} text={item?.name} />
					<Star star={item.star} />
					<CustomText text={item.servicerObject.name} />
					<CustomText text={item.servicerObject.phone} />
				</View>
			</TouchableOpacity>
		);
	};
	return (
		<FixedContainer>
			<CustomHeader title={text.title} />
			<ScrollView
				refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
				showsVerticalScrollIndicator={false}
				style={styles.view}>
				<View style={styles.viewInput}>
					<Image source={ICONS.search} style={styles.iconSearch} />
					<TextInput
						placeholderTextColor={colors.grayText}
						placeholder={text.entersearch}
						autoFocus
						onChangeText={onSearch}
						style={styles.input}
						value={textSearch}
					/>
				</View>

				<Filter
					onPressSort={onPressSort}
					onPressShow={() => setIsShow(!isShow)}
					isOn={isShow}
					title={text.sort}
					textButton={sortData?.title!}
					filter={sort}
				/>

				<Filter
					onPressSort={onPressFilter}
					onPressShow={() => setIsShowFilter(!isShowFilter)}
					isOn={isShowFilter}
					title={text.filters}
					textButton={filterData?.name!}
					filter={filter}
				/>
				{loading ? (
					<View style={{width: '100%', height: heightScale(200), justifyContent: 'center', alignItems: 'center'}}>
						<ActivityIndicator />
					</View>
				) : (
					<FlatList
						contentContainerStyle={{marginTop: heightScale(20)}}
						scrollEnabled={false}
						columnWrapperStyle={{justifyContent: 'space-between', marginBottom: heightScale(20)}}
						numColumns={2}
						keyExtractor={generateRandomId}
						showsHorizontalScrollIndicator={false}
						data={serviceAll}
						renderItem={renderItemOutstandingService}
						ListEmptyComponent={
							<View style={{marginTop: heightScale(50)}}>
								<CustomText style={{textAlign: 'center'}} color={colors.grayText} text={text.servicesavailable} />
							</View>
						}
						showsVerticalScrollIndicator={false}
					/>
				)}
			</ScrollView>
		</FixedContainer>
	);
};

export default Search;
const styles = StyleSheet.create({
	viewInput: {
		borderRadius: 8,
		borderColor: colors.grayLine,
		borderWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: widthScale(5),
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
	view: {
		marginHorizontal: widthScale(20),
	},
	imageService: {
		width: '100%',
		height: widthScale(100),
		alignSelf: 'center',
	},
	itemService: {
		width: widthScale(150),
		borderRadius: 10,
		marginRight: widthScale(15),
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: `${colors.grayLine}50`,
	},
});
