import React, {memo, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import CustomButton from '../components/custom-button';
import CustomHeader from '../components/custom-header';
import FixedContainer from '../components/fixed-container';
import InputOtp from '../components/sign-up/input-otp';
import Spinner from '../components/spinner';
import {ROUTE_KEY} from '../navigator/routers';
import {RootStackScreenProps} from '../navigator/stacks';
import {widthScale} from '../styles/scaling-utils';

const Otp = (props: RootStackScreenProps<'Otp'>) => {
	const {navigation, route} = props;

	const confirm = route.params.confirm;
	const userPhone = route.params.userPhone;

	const [code, setCode] = useState('');
	const text = {
		title: 'Xác thực OTP',
		accuracy: 'Xác thực',
	};

	const handleOtp = () => {
		Spinner.show();
		confirm
			.confirm(code)
			.then(() => {
				navigation.replace(ROUTE_KEY.ChangePasswordForgot, {userPhone});
			})
			.catch(() => Alert.alert('Sai mã xác thực'))
			.finally(() => Spinner.hide());
	};

	return (
		<FixedContainer>
			<CustomHeader title={text.title} />
			<View style={styles.view}>
				<InputOtp onChangeCode={setCode} />
				<CustomButton onPress={handleOtp} text={text.accuracy} style={{marginTop: 'auto'}} />
			</View>
		</FixedContainer>
	);
};

export default memo(Otp);
const styles = StyleSheet.create({
	view: {
		padding: widthScale(20),
		flex: 1,
	},
});
