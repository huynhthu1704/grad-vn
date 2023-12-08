import React, {memo} from 'react';
import {Image, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {ICONS} from '../assets/image-paths';
import {FONT_FAMILY} from '../constants/enum';
import {colors} from '../styles/colors';
import {widthScale} from '../styles/scaling-utils';
import CustomText from './custom-text';

interface Props {
	text: string;
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
	isCheck: boolean;
}
const CustomCheckbox = (props: Props) => {
	const {text, onPress, isCheck, style} = props;

	return (
		<TouchableOpacity style={[styles.view, style]} onPress={onPress}>
			<View
				style={[
					styles.viewCheck,
					{
						backgroundColor: isCheck ? colors.appColor : undefined,
						borderColor: isCheck ? colors.appColor : colors.black,
					},
				]}>
				<Image
					source={ICONS.check}
					style={[styles.icon, {tintColor: isCheck ? colors.white : colors.black}]}
				/>
			</View>
			<CustomText text={text} font={FONT_FAMILY.BOLD} size={12} />
		</TouchableOpacity>
	);
};

export default memo(CustomCheckbox);
const styles = StyleSheet.create({
	viewCheck: {
		width: widthScale(25),
		height: widthScale(25),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		borderWidth: 1,
		marginRight: widthScale(8),
	},
	icon: {
		width: widthScale(20),
		height: widthScale(20),
	},
	view: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});