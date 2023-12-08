import React, {memo, useRef, useState} from 'react';
import {Pressable, StyleSheet, TextInput, View, ViewStyle} from 'react-native';
import {FONT_FAMILY} from '../../constants/enum';
import {colors} from '../../styles/colors';
import {heightScale, widthScale} from '../../styles/scaling-utils';
import {isNumber} from '../../utils';
import CustomText from '../custom-text';

interface Props {
	style?: ViewStyle;
	onChangeCode?: (text: string) => void;
}
const InputOtp = ({onChangeCode, style}: Props) => {
	const [code, setCode] = useState('');
	const refInput = useRef<TextInput>(null);

	const onChangeText = (text: string) => {
		if (!text) {
			setCode('');
			onChangeCode?.('');
		} else if (isNumber(text)) {
			setCode(text);
			onChangeCode?.(text);
		}
	};

	return (
		<>
			<Pressable onPress={() => refInput.current?.focus()} style={[styles.view, style]}>
				<View style={styles.viewText}>
					<CustomText text={code?.split('')?.[0]} size={30} font={FONT_FAMILY.BOLD} />
				</View>
				<View style={styles.viewText}>
					<CustomText text={code?.split('')?.[1]} size={30} font={FONT_FAMILY.BOLD} />
				</View>
				<View style={styles.viewText}>
					<CustomText text={code?.split('')?.[2]} size={30} font={FONT_FAMILY.BOLD} />
				</View>
				<View style={styles.viewText}>
					<CustomText text={code?.split('')?.[3]} size={30} font={FONT_FAMILY.BOLD} />
				</View>
				<View style={styles.viewText}>
					<CustomText text={code?.split('')?.[4]} size={30} font={FONT_FAMILY.BOLD} />
				</View>
				<View style={styles.viewText}>
					<CustomText text={code?.split('')?.[5]} size={30} font={FONT_FAMILY.BOLD} />
				</View>
			</Pressable>
			<TextInput
				keyboardType={'numeric'}
				maxLength={6}
				autoFocus={true}
				ref={refInput}
				contextMenuHidden={true}
				caretHidden={true}
				onChangeText={_ => onChangeText(_.trim())}
				value={code}
				style={styles.input}
			/>
		</>
	);
};

export default memo(InputOtp);
const styles = StyleSheet.create({
	view: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	input: {
		color: colors.transparent,
		backgroundColor: colors.transparent,
		position: 'absolute',
		fontSize: 0,
		width: '100%',
		height: '100%',
	},
	viewText: {
		width: widthScale(50),
		height: heightScale(55),
		borderWidth: 1.8,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: colors.grayText,
	},
});
