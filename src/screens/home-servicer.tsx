import {createMaterialTopTabNavigator, MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import React, {memo, useCallback} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import CustomHeader from '../components/custom-header';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import RenderListService from '../components/render-list-service';
import {FONT_FAMILY, TYPE_ORDER_SERVICE} from '../constants/enum';
import {useLanguage} from '../hooks/useLanguage';
import {RootStackScreenProps} from '../navigator/stacks';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';

const Tab = createMaterialTopTabNavigator();

const HomeServicer = (props: RootStackScreenProps<'Home'>) => {
	const text = useLanguage().HomeServicer;

	const {navigation} = props;
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

	const render = (type: TYPE_ORDER_SERVICE) => <RenderListService navigation={navigation} type={type} />;

	const OrderPending = () => render(TYPE_ORDER_SERVICE.OrderPending);
	const OrderCanceled = () => render(TYPE_ORDER_SERVICE.OrderCanceled);
	const OrderInProcess = () => render(TYPE_ORDER_SERVICE.OrderInProcess);
	const OrderCompleted = () => render(TYPE_ORDER_SERVICE.OrderCompleted);

	return (
		<FixedContainer>
			<CustomHeader title={text.title} hideBack />
			<Tab.Navigator screenOptions={{lazy: true, swipeEnabled: false}} tabBar={renderTapBarItem}>
				<Tab.Screen key={TYPE_ORDER_SERVICE.OrderPending} name={text.pending} component={OrderPending} />
				<Tab.Screen key={TYPE_ORDER_SERVICE.OrderInProcess} name={text.inprocess} component={OrderInProcess} />
				<Tab.Screen key={TYPE_ORDER_SERVICE.OrderCompleted} name={text.completed} component={OrderCompleted} />
				<Tab.Screen key={TYPE_ORDER_SERVICE.OrderCanceled} name={text.canceled} component={OrderCanceled} />
			</Tab.Navigator>
		</FixedContainer>
	);
};

export default memo(HomeServicer);
const styles = StyleSheet.create({
	viewTab: {
		height: heightScale(55),
		borderTopColor: colors.grayLine,
		borderTopWidth: 1.5,
	},
});
