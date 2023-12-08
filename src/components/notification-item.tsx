import React from 'react';
import {FlatList, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ICONS} from '../assets/image-paths';
import CustomText from './custom-text';
import {FONT_FAMILY} from '../constants/enum';
import {ROUTE_KEY} from '../navigator/routers';
import {RootStackScreenProps} from '../navigator/stacks';
import {heightScale, widthScale} from '../styles/scaling-utils';
import moment from 'moment';

export const NotificationItem =
	(props: RootStackScreenProps<'NotificationDetail'>, onNotificationItemClick, onNotificationItemDelete) =>
	({item}) => {
		const {navigation, route} = props;

		const onPressDetail = () => {
			onNotificationItemClick(item);
			navigation.navigate(ROUTE_KEY.NotificationDetail, {notificationData: item});
		};
		return (
			<TouchableOpacity
				onPress={onPressDetail}
				style={{
					flexDirection: 'row',
					marginVertical: heightScale(12),
					gap: 10,
					width: '100%',
					height: heightScale(120),
					alignItems: 'center',
					borderRadius: 8,
				}}>
				<View style={{width: widthScale(40), height: '100%', justifyContent: 'center', alignItems: 'center'}}>
					{item.isRead ? (
						<Image style={styles.notificationIcon} source={ICONS.notification_read} />
					) : (
						<Image style={styles.notificationIcon} source={ICONS.notification_unread} />
					)}
				</View>

				<View style={{flex: 1, height: '100%', justifyContent: 'space-between'}}>
					<CustomText font={FONT_FAMILY.BOLD} text={item.title} />
					<CustomText text={item.body} numberOfLines={2} />
					<CustomText text={moment(item.time).format('hh:mm:ss - DD/MM/YYYY')} />
				</View>

				<TouchableOpacity
					style={{width: widthScale(30), height: '100%', justifyContent: 'center', alignItems: 'center'}}
					onPress={() => onNotificationItemDelete(item)}>
					<Image style={styles.deleteIcon} source={ICONS.delete} />
				</TouchableOpacity>
			</TouchableOpacity>
		);
	};

const styles = StyleSheet.create({
	notificationIcon: {
		width: widthScale(40),
		height: widthScale(40),
	},

	deleteIcon: {
		width: widthScale(30),
		height: widthScale(30),
	},
});
