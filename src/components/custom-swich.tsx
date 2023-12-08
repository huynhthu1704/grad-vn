import React, {memo, useEffect} from 'react';
import {Animated, StyleSheet, TouchableOpacity,View} from 'react-native';
import {colors} from '../styles/colors';
import {widthScale} from '../styles/scaling-utils';
interface Props {
	onPress?: () => void;
	isOn: boolean;
	isDisable?: boolean;
}
const CustomSwitch = ({onPress, isOn, isDisable = false}: Props) => {
	const thumbPosition = React.useRef(new Animated.Value(widthScale(2))).current;

	useEffect(() => {
		handleSwitch(isOn);
	}, [isOn]);

	const handleSwitch = (isCheck: boolean) => {
		const toValue = isCheck ? widthScale(26) : widthScale(2);
		Animated.timing(thumbPosition, {
			toValue,
			duration: 300,
			useNativeDriver: false,
		}).start();
	};

	return (
		<TouchableOpacity
			activeOpacity={0.5}
			onPress={onPress}
			disabled={isDisable}
			style={[{backgroundColor: isOn ? colors.appColor : colors.grayText}, styles.view]}>
			<Animated.View style={[{transform: [{translateX: thumbPosition}]}, styles.shadowColor, styles.viewBorder]} />
		</TouchableOpacity>
	);
};

export default memo(CustomSwitch);
const styles = StyleSheet.create({
	view: {
		width: widthScale(50),
		borderRadius: widthScale(20),
		height: widthScale(25),
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	viewBorder: {
		backgroundColor: colors.white,
		width: widthScale(20),
		height: widthScale(20),
		borderRadius: widthScale(100),
	},
	shadowColor: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		elevation: 5,
	},
});
