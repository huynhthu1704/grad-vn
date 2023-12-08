import messaging from '@react-native-firebase/messaging';
import LottieView from 'lottie-react-native';
import React, {memo, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {ANIMATIONS} from '../assets/image-paths';
import FixedContainer from '../components/fixed-container';
import {LANGUAGE, TABLE} from '../constants/enum';
import {UserProps} from '../constants/types';
import {ROUTE_KEY} from '../navigator/routers';
import {RootStackScreenProps} from '../navigator/stacks';
import API from '../services/api';
import {changeLanguage, updateUserInfo} from '../stores/reducers/userReducer';
import {useAppDispatch, useAppSelector} from '../stores/store/storeHooks';
import {widthScale} from '../styles/scaling-utils';
const Splash = (props: RootStackScreenProps<'Splash'>) => {
	const {navigation} = props;
	const dispatch = useAppDispatch();

	const userInfo = useAppSelector(state => state.userInfoReducer.userInfo);

	const updateTokenDevice = async (isNull?: boolean) => {
		const userCurrent = await API.get(`${TABLE.USERS}/${userInfo?.id}`);

		const token = await messaging().getToken();
		const newUser = (await API.put(`${TABLE.USERS}/${userInfo?.id}`, {...userCurrent, tokenDevice: isNull ? '' : token})) as UserProps;
		console.log('TOKEN FCM-->', token);

		dispatch(updateUserInfo(newUser));
		dispatch(changeLanguage(newUser?.language || LANGUAGE.VI));
	};

	useEffect(() => {
		(async () => {
			if (userInfo && !userInfo?.isBlocked) {
				updateTokenDevice(true).then(() => navigation.replace(ROUTE_KEY.BottomTab));
			} else {
				dispatch(changeLanguage(LANGUAGE.VI));
				navigation.replace(ROUTE_KEY.LogIn);
			}
		})();
	}, []);

	return (
		<FixedContainer style={styles.view}>
			<LottieView style={styles.image} source={ANIMATIONS.SPLASH} autoPlay loop speed={1.5} />
		</FixedContainer>
	);
};
export default memo(Splash);
const styles = StyleSheet.create({
	view: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: widthScale(300),
		height: widthScale(300),
	},
});
