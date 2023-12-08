import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ICONS} from '../assets/image-paths';
import {FONT_FAMILY} from '../constants/enum';
import {heightScale, widthScale} from '../styles/scaling-utils';
import CustomText from './custom-text';

interface Props {
	title: string;
	hideBack?: boolean;
	rightContent?: JSX.Element;
}
const CustomHeader = (props: Props) => {
	const {title, hideBack, rightContent} = props;
	const navigation = useNavigation();

	return (
		<View style={styles.view}>
			{hideBack ? (
				<View style={styles.icon} />
			) : (
				<TouchableOpacity onPress={navigation.goBack}>
					<Image source={ICONS.back} style={styles.icon} />
				</TouchableOpacity>
			)}
			<CustomText size={18} text={title} font={FONT_FAMILY.BOLD} />
			<View style={styles.icon}>{rightContent}</View>
		</View>
	);
};

export default memo(CustomHeader);
const styles = StyleSheet.create({
	view: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: heightScale(50),
		alignItems: 'center',
		paddingHorizontal: widthScale(10),
	},
	icon: {
		width: widthScale(25),
		height: widthScale(25),
	},
});
