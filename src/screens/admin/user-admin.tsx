import React, {memo} from 'react';
import {DeviceEventEmitter, StyleSheet, TouchableOpacity, View} from 'react-native';
import CustomHeader from '../../components/custom-header';
import CustomText from '../../components/custom-text';
import FixedContainer from '../../components/fixed-container';
import {EMIT_EVENT, FONT_FAMILY} from '../../constants/enum';
import {useLanguage} from '../../hooks/useLanguage';
import {ROUTE_KEY} from '../../navigator/routers';
import {RootStackScreenProps} from '../../navigator/stacks';
import {heightScale, widthScale} from '../../styles/scaling-utils';
import {AlertYesNo} from '../../utils';

const UserAdmin = (props: RootStackScreenProps<'User'>) => {
	const text = useLanguage().UserAdmin;
	const text1 = useLanguage().User;
	const {navigation} = props;

	const onPressChangePassword = () => navigation.navigate(ROUTE_KEY.ChangePassword);
	const onPressPayment = () => navigation.navigate(ROUTE_KEY.Payment);
	const onPressTermsAndConditions = () => navigation.navigate(ROUTE_KEY.Termsandconditions);
	const onPressFAQs = () => navigation.navigate(ROUTE_KEY.FAQs);
	const onPressLogout = () => DeviceEventEmitter.emit(EMIT_EVENT.LOGOUT);
	const onPressDataPrivacy = () => navigation.navigate(ROUTE_KEY.Privacypolicy);
	const onPressSetting = () => navigation.navigate(ROUTE_KEY.Setting);
	return (
		<FixedContainer>
			<CustomHeader title={text.title} hideBack />

			<View style={styles.viewContent}>
				<CustomText text={text.accountManagement} font={FONT_FAMILY.BOLD} size={14} />

				<TouchableOpacity onPress={onPressChangePassword} style={styles.button}>
					<CustomText text={text.changePassword} size={13} />
				</TouchableOpacity>
			</View>

			<View style={styles.viewContent}>
				<CustomText text={text.otherInformation} font={FONT_FAMILY.BOLD} size={14} />

				<TouchableOpacity onPress={onPressPayment} style={styles.button}>
					<CustomText text={text.updatePaymentMethod} size={13} />
				</TouchableOpacity>

				<TouchableOpacity onPress={onPressTermsAndConditions} style={styles.button}>
					<CustomText text={text.termsAndConditions} size={13} />
				</TouchableOpacity>

				<TouchableOpacity onPress={onPressDataPrivacy} style={styles.button}>
					<CustomText text={text.privacyPolicy} size={13} />
				</TouchableOpacity>

				<TouchableOpacity onPress={onPressFAQs} style={styles.button}>
					<CustomText text={text.faqs} size={13} />
				</TouchableOpacity>
				<TouchableOpacity onPress={onPressSetting} style={styles.button}>
					<CustomText text={text1.settingsButtonText} size={13} />
				</TouchableOpacity>
			</View>

			<View style={styles.viewContent}>
				<TouchableOpacity onPress={() => AlertYesNo(undefined, text.logoutConfirmation, onPressLogout)} style={styles.button}>
					<CustomText text={text.logout} size={13} />
				</TouchableOpacity>
			</View>
		</FixedContainer>
	);
};

export default memo(UserAdmin);

const styles = StyleSheet.create({
	viewContent: {
		paddingHorizontal: widthScale(20),
		marginTop: heightScale(20),
	},
	button: {
		height: heightScale(40),
		justifyContent: 'center',
		paddingLeft: widthScale(10),
	},
});
