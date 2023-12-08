import {Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import FixedContainer from '../../components/fixed-container';
import CustomHeader from '../../components/custom-header';
import {RootStackScreenProps} from '../../navigator/stacks';
import {ICONS} from '../../assets/image-paths';
import CustomText from '../../components/custom-text';
import {FONT_FAMILY} from '../../constants/enum';
import {ROUTE_KEY} from '../../navigator/routers';
import {colors} from '../../styles/colors';
import {heightScale, widthScale} from '../../styles/scaling-utils';
import {generateRandomId, getUserAll} from '../../utils';
import {UserProps} from '../../constants/types';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import { useLanguage } from '../../hooks/useLanguage';

const ManageUser = (props: RootStackScreenProps<'ManageUser'>) => {
	const {navigation} = props;
	const text = useLanguage().ManageUser;

	 
	const [data, setData] = useState<UserProps[]>([]);
	const [refreshing, setRefreshing] = useState(false);

	useFocusEffect(
		useCallback(() => {
			onRefresh();
		}, []),
	);
	const onRefresh = async () => {
		setRefreshing(true);
		const newData = await getUserAll();
		setData(newData);
		setRefreshing(false);
	};

	return (
		<FixedContainer>
			<CustomHeader title={text.title} />
			<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={styles.view}>
				{/* <View style={styles.viewInput}>
					<Image source={ICONS.search} style={styles.iconSearch} />
					<TextInput placeholder="Tìm kiếm" style={styles.input} />
				</View> */}

				<View style={{marginVertical: heightScale(10)}}></View>

				{data.map(item => (
					<TouchableOpacity
						onPress={() => navigation.navigate(ROUTE_KEY.InfoDetailUser, {data: item})}
						key={generateRandomId()}
						style={{borderRadius: 5, borderWidth: 1, marginBottom: heightScale(20), padding: widthScale(10), flexDirection: 'row'}}>
						<View
							style={{
								borderRadius: 100,
								backgroundColor: `${colors.gray}80`,
								width: widthScale(90),
								height: widthScale(90),
								justifyContent: 'center',
								alignItems: 'center',
								marginRight: widthScale(10),
							}}>
							<Image
								style={{width: widthScale(80), height: widthScale(80), borderRadius: 100}}
								source={item.avatar ? {uri: item.avatar} : ICONS.user_accept}
							/>
						</View>

						<View style={{flex: 1}}>
							{item.isBlocked && (
								<View
									style={{
										position: 'absolute',
										zIndex: -1,
										right: 0,
										backgroundColor: colors.orange,
										width: widthScale(60),
										height: widthScale(30),
										borderRadius: 80,
										justifyContent: 'center',
										alignItems: 'center',
									}}>
									<CustomText size={12} text={'Blocked'} />
								</View>
							)}
							<CustomText font={FONT_FAMILY.BOLD} text={item.name} />
							<CustomText text={item.phone} />
							<CustomText text={`Ngày đăng ký: ${moment(item.dateRegister).format('DD/MM/YYYY')}`} />
						</View>
					</TouchableOpacity>
				))}
			</ScrollView>
		</FixedContainer>
	);
};

export default ManageUser;
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