import {StyleProp, StyleSheet, Text, TouchableOpacity, View,ViewStyle} from 'react-native';
import React, {memo} from 'react';
import {widthScale} from '../styles/scaling-utils';
import {colors} from '../styles/colors';
import CustomText from './custom-text';

interface Props {
	isChecked: boolean;
	text: string;
	onPress: () => void;
	style?: StyleProp<ViewStyle>;
}

const CustomRadioButton = (props: Props) => {
	const {isChecked, text, onPress, style} = props;

	return (
		<TouchableOpacity onPress={onPress} style={[{flexDirection: 'row', alignItems: 'center', gap: widthScale(6)}, style]}>
			<View
				style={{
					width: widthScale(13),
					height: widthScale(13),
					borderRadius: 100,
					borderWidth: 0.5,
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				{isChecked && <View style={styles.item} />}
			</View>

			<CustomText text={text} />
		</TouchableOpacity>
	);
};

export default memo(CustomRadioButton);
const styles = StyleSheet.create({
	item: {
		width: widthScale(8),
		height: widthScale(8),
		backgroundColor: colors.appColor,
		borderRadius: 100,
	},
});
