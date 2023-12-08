import {CardStyleInterpolators, createStackNavigator, StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import React, {memo} from 'react';
import {Settings, StyleSheet} from 'react-native';
import {
	Onboarding,
	Splash,
	Home,
	Search,
	Notification,
	NotificationDetail,
	ServiceDetail,
	LogIn,
	ForgotPass,
	SignUp,
	Otp,
	AllReview,
	InfoServicer,
	AdminServiceAndServiceType,
	AdminAddService,
} from '../screens';
import BottomTab from './bottom-tab';
import ChangePasswordForgot from '../screens/change-password-forgot';
import SignUpServices from '../screens/sign-up-servives';
import {RootStackScreensParams} from './params';
import {ROUTE_KEY} from './routers';
import UpdateInformation from '../screens/update-infomation';
import Booking from '../screens/booking';
import Setting from '../screens/setting';
import FAQs from '../screens/FAQs';
import Privacypolicy from '../screens/Privacy policy';
import Termsandconditions from '../screens/Termsandconditions';
import ChangePassword from '../screens/change-password';
import ListAddress from '../screens/list-address';
import Order from '../screens/order';
import Listblock from '../screens/listblock';
import DetailOrder from '../screens/detail-order';
import EvaluateService from '../screens/EvaluateService';
import AddService from '../screens/add-service';
import AcceptServicer from '../screens/admin/accept-servicer';
import ManagePayment from '../screens/admin/manage-payment';

import ManageUser from '../screens/admin/manage-user';
import InfoDetailUser from '../screens/admin/info-detail-user';
import Payment from '../screens/admin/payment';
import InfoDetailServicer from '../screens/admin/info-detail-servicer';

import AddPayment from '../screens/admin/add-payment';
import EditPaymentFee from '../screens/admin/edit-payment-fee';

import FeeService from '../screens/fee-service';
import ManageServicer from '../screens/admin/manage-servicer';
import infoAcceptServicer from '../screens/admin/info-accept-servicer';

import AddCategory from '../screens/admin/add-category';
export type RootStackScreens = keyof RootStackScreensParams;
export type RootStackScreenProps<T extends RootStackScreens> = StackScreenProps<RootStackScreensParams, T>;
export type UseRootStackNavigation<T extends RootStackScreens = 'Splash'> = StackNavigationProp<RootStackScreensParams, T>;

const {Navigator, Screen} = createStackNavigator<RootStackScreensParams>();

const Stacks = () => {
	return (
		<Navigator
			screenOptions={{
				headerShown: false,
				cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
			}}>
			<Screen name={ROUTE_KEY.Splash} component={Splash} />
			<Screen name={ROUTE_KEY.Onboarding} component={Onboarding} />
			<Screen name={ROUTE_KEY.Home} component={Home} />
			<Screen name={ROUTE_KEY.Search} component={Search} />
			<Screen name={ROUTE_KEY.Notification} component={Notification} />
			<Screen name={ROUTE_KEY.NotificationDetail} component={NotificationDetail} />
			<Screen name={ROUTE_KEY.BottomTab} component={BottomTab} />
			<Screen name={ROUTE_KEY.UpdateInformation} component={UpdateInformation} />
			<Screen name={ROUTE_KEY.ServiceDetail} component={ServiceDetail} />
			<Screen name={ROUTE_KEY.SignUp} component={SignUp} />
			<Screen name={ROUTE_KEY.LogIn} component={LogIn} />
			<Screen name={ROUTE_KEY.SignUpServices} component={SignUpServices} />
			<Screen name={ROUTE_KEY.ForgotPass} component={ForgotPass} />
			<Screen name={ROUTE_KEY.Otp} component={Otp} />
			<Screen name={ROUTE_KEY.ChangePasswordForgot} component={ChangePasswordForgot} />
			<Screen name={ROUTE_KEY.Booking} component={Booking} />
			<Screen name={ROUTE_KEY.Setting} component={Setting} />
			<Screen name={ROUTE_KEY.FAQs} component={FAQs} />
			<Screen name={ROUTE_KEY.Privacypolicy} component={Privacypolicy} />
			<Screen name={ROUTE_KEY.Termsandconditions} component={Termsandconditions} />
			<Screen name={ROUTE_KEY.ChangePassword} component={ChangePassword} />
			<Screen name={ROUTE_KEY.ListAddress} component={ListAddress} />
			<Screen name={ROUTE_KEY.Order} component={Order} />
			<Screen name={ROUTE_KEY.DetailOrder} component={DetailOrder} />
			<Screen name={ROUTE_KEY.Listblock} component={Listblock} />
			<Screen name={ROUTE_KEY.EvaluateService} component={EvaluateService} />
			<Screen name={ROUTE_KEY.AddService} component={AddService} />
			<Screen name={ROUTE_KEY.AcceptServicer} component={AcceptServicer} />
			<Screen name={ROUTE_KEY.ManagePayment} component={ManagePayment} />
			<Screen name={ROUTE_KEY.ManageUser} component={ManageUser} />
			<Screen name={ROUTE_KEY.ManageServicer} component={ManageServicer} />
			<Screen name={ROUTE_KEY.InfoDetailUser} component={InfoDetailUser} />
			<Screen name={ROUTE_KEY.Payment} component={Payment} />
			<Screen name={ROUTE_KEY.FeeService} component={FeeService} />
			<Screen name={ROUTE_KEY.InfoAcceptServicer} component={infoAcceptServicer} />
			<Screen name={ROUTE_KEY.EditPaymentFee} component={EditPaymentFee} />
			<Screen name={ROUTE_KEY.AdminServiceAndServiceType} component={AdminServiceAndServiceType} />
			<Screen name={ROUTE_KEY.AddCategory} component={AddCategory} />
			<Screen name={ROUTE_KEY.AdminAddService} component={AdminAddService} />
			<Screen name={ROUTE_KEY.AddPayment} component={AddPayment} />
			<Screen name={ROUTE_KEY.InfoDetailServicer} component={InfoDetailServicer} />
			<Screen name={ROUTE_KEY.InfoServicer} component={InfoServicer} />
			<Screen name={ROUTE_KEY.AllReview} component={AllReview} />
		</Navigator>
	);
};

export default memo(Stacks);
const styles = StyleSheet.create({});
