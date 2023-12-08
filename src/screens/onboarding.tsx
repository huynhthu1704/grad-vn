import React, {memo, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import FixedContainer from '../components/fixed-container';
import {ROUTE_KEY} from '../navigator/routers';
import {RootStackScreenProps} from '../navigator/stacks';

const Onboarding = (props: RootStackScreenProps<'Onboarding'>) => {
	const {navigation} = props;

	useEffect(() => {
		navigation.navigate(ROUTE_KEY.Home);
	}, []);

	return <FixedContainer></FixedContainer>;
};

export default memo(Onboarding);
const styles = StyleSheet.create({});
