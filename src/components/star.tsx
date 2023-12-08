import React, {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {ICONS} from '../assets/image-paths';
import {colors} from '../styles/colors';
import {widthScale} from '../styles/scaling-utils';
import CustomText from './custom-text';

interface Props {
	star: number;
	isShowNumber?: boolean;
}
const Star = (props: Props) => {
	const {star, isShowNumber} = props;

	const starLine = <Image style={styles.star} source={ICONS.star} />;
	const startFull = <Image style={styles.starFull} source={ICONS.star_full} />;

	return (
		<View style={styles.view}>
			{star >= 1 ? startFull : starLine}
			{star >= 2 ? startFull : starLine}
			{star >= 3 ? startFull : starLine}
			{star >= 4 ? startFull : starLine}
			{star >= 5 ? startFull : starLine}
			{isShowNumber && <CustomText text={`${star}/5`} style={styles.text} />}
		</View>
	);
};

export default memo(Star);
const styles = StyleSheet.create({
	view: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	star: {
		width: widthScale(20),
		height: widthScale(20),
		resizeMode: 'contain',
	},
	starFull: {
		tintColor: colors.yellow,
		width: widthScale(20),
		height: widthScale(20),
		resizeMode: 'contain',
	},
	text: {
		marginLeft: widthScale(5),
	},
});
