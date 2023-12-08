import moment from 'moment';
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {ICONS} from '../assets/image-paths';
import CustomHeader from '../components/custom-header';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import {FONT_FAMILY} from '../constants/enum';
import {useLanguage} from '../hooks/useLanguage';
import {RootStackScreenProps} from '../navigator/stacks';
import {heightScale, widthScale} from '../styles/scaling-utils';

const NotificationDetail = ({navigation, route}: RootStackScreenProps<'NotificationDetail'>) => {
	const text = useLanguage().NotificationDetail;
	const {notificationData} = route.params;

	return (
		<FixedContainer>
			<CustomHeader title={text.title} hideBack={false} />
			<View style={{paddingHorizontal: widthScale(20), flexDirection: 'column', gap: heightScale(10)}}>
				<View style={{flexDirection: 'row', gap: widthScale(10), width: '100%'}}>
					<Image style={styles.notificationIcon} source={ICONS.notification_read} />
					<View style={{flexDirection: 'column', gap: heightScale(10), width: '80%'}}>
						<CustomText font={FONT_FAMILY.BOLD} text={notificationData.title} />
						<CustomText text={moment(notificationData.time).format('hh:mm:ss - DD/MM/YYYY')} />
					</View>
				</View>
				<View style={{width: '100%'}}>
					<CustomText text={notificationData.body} />
				</View>
			</View>
		</FixedContainer>
	);
};

const styles = StyleSheet.create({
	notificationIcon: {
		width: widthScale(40),
		height: widthScale(40),
	},
});
export default NotificationDetail;
