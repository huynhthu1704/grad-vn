import React, {memo, useCallback, useEffect, useState} from 'react';
import {Button, DeviceEventEmitter, FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ICONS} from '../../assets/image-paths';
import CustomHeader from '../../components/custom-header';
import CustomText from '../../components/custom-text';
import FixedContainer from '../../components/fixed-container';
import Spinner from '../../components/spinner';
import Star from '../../components/star';
import {EMIT_EVENT, FONT_FAMILY, TABLE} from '../../constants/enum';
import {Category, ServiceProps} from '../../constants/types';
import {ROUTE_KEY} from '../../navigator/routers';
import {RootStackScreenProps} from '../../navigator/stacks';
import API from '../../services/api';
import {useAppSelector} from '../../stores/store/storeHooks';
import {colors} from '../../styles/colors';
import {heightScale, widthScale} from '../../styles/scaling-utils';
import {AlertYesNo, getServiceFromID, showMessage} from '../../utils';
import {MaterialTopTabBarProps, createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import CategoryType from '../category-type';
import {AdminService} from '..';

const Tab = createMaterialTopTabNavigator();

const AdminServiceAndServiceType = (props: RootStackScreenProps<'AdminServiceAndServiceType'>) => {
	const navigation = props.navigation;

	const [selectedTab, setSelectedTab] = useState<string>('');
	const onPressAdd = (item: ServiceProps) => {
		if (selectedTab == 'SERVICE') {
			navigation.navigate(ROUTE_KEY.AdminAddService, {});
		} else {
			navigation.navigate(ROUTE_KEY.AddCategory, {});
		}
	};

	const renderTapBarItem = useCallback(
		(props: MaterialTopTabBarProps) => (
			<View style={styles.viewTab}>
				<View style={{paddingHorizontal: widthScale(20), flexDirection: 'row', marginTop: heightScale(10), marginBottom: heightScale(20)}}>
					{props.state.routes.map((item, index) => (
						<TouchableOpacity
							key={index}
							onPress={() => {
								const routeName = props.navigation.getState().routeNames[index];
								if (routeName == 'Loại dịch vụ') {
									setSelectedTab('CATEGORY');
								} else {
									setSelectedTab('SERVICE');
								}
								props.navigation.navigate(item);
							}}
							style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: widthScale(10)}}>
							<CustomText text={item.name} font={props.state?.index === index ? FONT_FAMILY.BOLD : undefined} />
						</TouchableOpacity>
					))}
				</View>
			</View>
		),
		[],
	);

	return (
		<FixedContainer>
			<CustomHeader
				title="QUẢN LÝ DỊCH VỤ"
				hideBack
				rightContent={
					<TouchableOpacity onPress={onPressAdd}>
						<Image style={styles.iconAdd} source={ICONS.add} />
					</TouchableOpacity>
				}
			/>
			<Tab.Navigator screenOptions={{lazy: true, swipeEnabled: false}} tabBar={renderTapBarItem}>
				<Tab.Screen key={'ServiceCategory'} name={'Loại dịch vụ'} component={CategoryType} />
				<Tab.Screen key={'AdminService'} name={'Dịch vụ'} component={AdminService} />
			</Tab.Navigator>
		</FixedContainer>
	);
};

export default memo(AdminServiceAndServiceType);
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
	icon: {
		width: widthScale(25),
		height: widthScale(25),
	},
	viewTab: {
		// height: heightScale(55),
		borderTopColor: colors.white,
		borderTopWidth: 1.5,
		alignItems: 'center',
	},
});
