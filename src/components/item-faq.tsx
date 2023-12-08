import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FONT_FAMILY} from '../constants/enum';
import {FAQType} from '../constants/types';
import {heightScale} from '../styles/scaling-utils';
import {generateRandomId} from '../utils';
import CustomText from './custom-text';

const ItemFaq = ({item, index}: {item: FAQType; index: number}) => {
	const [text, setText] = useState((item?.answer).substring(0, 50));

	const viewAll = useMemo(() => {
		if (item?.answer?.length <= 50) {
			return undefined;
		}

		if (text === item.answer) {
			return <CustomText font={FONT_FAMILY.SEMI_BOLD} onPress={() => setText(item.answer.substring(0, 50))} text={'Rút gọn'} />;
		}

		if (text.length < item.answer.length) {
			return <CustomText font={FONT_FAMILY.SEMI_BOLD} onPress={() => setText(item.answer)} text={'Xem thêm'} />;
		}
	}, [text]);

	return (
		<View style={{marginTop: heightScale(20), gap: heightScale(5)}} key={generateRandomId()}>
			<CustomText font={FONT_FAMILY.SEMI_BOLD} text={'Câu hỏi ' + (index + 1) + ': ' + item?.question} />
			<CustomText text={'- Trả lời: ' + text} rightContent={viewAll} />
		</View>
	);
};

export default ItemFaq;
const styles = StyleSheet.create({});
