import React, {memo} from 'react';
import {StyleSheet, Text, TextProps, TextStyle} from 'react-native';
import {FONT_FAMILY} from '../constants/enum';
import {colors} from '../styles/colors';
import {widthScale} from '../styles/scaling-utils';

interface Props {
	text?: string | number | any;
	color?: string;
	font?: FONT_FAMILY;
	size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30;
	style?: TextStyle;
	rightContent?: JSX.Element;
}
const CustomText = (props: Props & TextProps) => {
	const {text = '', color = colors.black, font = FONT_FAMILY.REGULAR, size = 15, style, rightContent, ...rest} = props;

	return (
		<Text
			{...rest}
			style={[
				styles.text,
				{
					color: color,
					fontSize: widthScale(size),
					fontFamily: font,
				},
				style,
			]}>
			{text}
			{rightContent}
		</Text>
	);
};

export default memo(CustomText);
const styles = StyleSheet.create({
	text: {color: colors.black},
});
