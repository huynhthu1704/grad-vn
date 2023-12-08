import {createMaterialTopTabNavigator, MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import React, {memo, useCallback} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import CustomHeader from '../components/custom-header';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import {FONT_FAMILY} from '../constants/enum';
import {useLanguage} from '../hooks/useLanguage';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';
import OrderAll from './order-all';
import OrderCanceled from './order-canceled';
import OrderCompleted from './order-completed';
import OrderInProcess from './order-in-process';
import OrderPending from './order-pending';

const Tab = createMaterialTopTabNavigator();

const Order = () => {
	const text = useLanguage().Order;

	const renderTapBarItem = useCallback(
		(props: MaterialTopTabBarProps) => (
			<View style={styles.viewTab}>
				<ScrollView showsHorizontalScrollIndicator={false} horizontal>
					<View style={{paddingHorizontal: widthScale(20), flexDirection: 'row'}}>
						{props.state.routes.map((item, index) => (
							<TouchableOpacity
								key={index}
								onPress={() => props.navigation.navigate(item)}
								style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: widthScale(10)}}>
								<CustomText text={item.name} font={props.state?.index === index ? FONT_FAMILY.BOLD : undefined} />
							</TouchableOpacity>
						))}
					</View>
				</ScrollView>
			</View>
		),
		[],
	);

	return (
		<FixedContainer>
			<CustomHeader title={text.title} hideBack />
			<Tab.Navigator screenOptions={{lazy: true, swipeEnabled: false}} tabBar={renderTapBarItem}>
				<Tab.Screen key={'OrderAll'} name={text.all} component={OrderAll} />
				<Tab.Screen key={'OrderPending'} name={text.pending} component={OrderPending} />
				<Tab.Screen key={'OrderInProcess'} name={text.inprocess} component={OrderInProcess} />
				<Tab.Screen key={'OrderCompleted'} name={text.completed} component={OrderCompleted} />
				<Tab.Screen key={'OrderCanceled'} name={text.canceled} component={OrderCanceled} />
			</Tab.Navigator>
		</FixedContainer>
	);
};

export default memo(Order);
const styles = StyleSheet.create({
	viewTab: {
		height: heightScale(55),
		borderTopColor: colors.grayLine,
		borderTopWidth: 1.5,
	},
});
