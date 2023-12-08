import React, {useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet} from 'react-native';
import CustomHeader from '../components/custom-header';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import ItemFaq from '../components/item-faq';
import {LANGUAGE, TABLE} from '../constants/enum';
import {FAQType} from '../constants/types';
import {useLanguage} from '../hooks/useLanguage';
import API from '../services/api';
import {useAppSelector} from '../stores/store/storeHooks';
import {widthScale} from '../styles/scaling-utils';
import {generateRandomId} from '../utils';

const FAQs = () => {
	const text = useLanguage().FAQ;
	const lanaguage = useAppSelector(state => state.userInfoReducer.language);

	const [list, setList] = useState<FAQType[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		onRefresh();
	}, []);

	const onRefresh = async () => {
		setLoading(true);
		const newList = await API.get(`${TABLE.FAQ}/${lanaguage || LANGUAGE.VI}`, true);
		setList(newList);
		setLoading(false);
	};

	return (
		<FixedContainer>
			<CustomHeader title={text.title} />
			<ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />} style={{paddingHorizontal: widthScale(20)}}>
				<CustomText size={13} text={text.content} />
				{list.map((item, index) => (
					<ItemFaq key={generateRandomId()} item={item} index={index} />
				))}
			</ScrollView>
		</FixedContainer>
	);
};

const styles = StyleSheet.create({
	scrollView: {
		padding: 20,
	},
	paragraph: {
		fontSize: 16,
		marginVertical: 5,
	},
	heading: {
		fontSize: 18,
		fontWeight: 'bold',
		marginVertical: 10,
	},
});

export default FAQs;
