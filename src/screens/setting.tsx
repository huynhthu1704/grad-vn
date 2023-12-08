import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ICONS} from '../assets/image-paths';
import CustomHeader from '../components/custom-header';
import CustomRadioButton from '../components/custom-radio-button';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import FlagIcon from '../components/flag-icon';
import {FONT_FAMILY, LANGUAGE, TABLE} from '../constants/enum';
import {useLanguage} from '../hooks/useLanguage';
import {RootStackScreenProps} from '../navigator/stacks';
import API from '../services/api';
import {changeLanguage} from '../stores/reducers/userReducer';
import {useAppDispatch, useAppSelector} from '../stores/store/storeHooks';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';
import {generateRandomId} from '../utils';
import React from 'react';

const Setting = (props: RootStackScreenProps<'Setting'>) => {
	const {navigation} = props;
	const dispatch = useAppDispatch();
	const language = useAppSelector(state => state.userInfoReducer.language);
	const userInfo = useAppSelector(state => state.userInfoReducer.userInfo);
	const text = useLanguage().Setting;

	const LAN = [
		{name: text.listLanguage[0], language: LANGUAGE.VI},
		{name: text.listLanguage[1], language: LANGUAGE.EN},
		{name: text.listLanguage[2], language: LANGUAGE.ZH},
		{name: text.listLanguage[3], language: LANGUAGE.JA},
		{name: text.listLanguage[4], language: LANGUAGE.KO},
	];

	return (
		<FixedContainer>
			<CustomHeader title={text?.title} />
			<View style={{paddingHorizontal: widthScale(20)}}>
				<View style={styles.button}>
					<CustomText font={FONT_FAMILY.BOLD} text={text.Language} />
				</View>

				<View style={{paddingHorizontal: widthScale(20), marginTop: heightScale(10)}}>
					{LAN.map(item => {
						const onPress = () => {
							dispatch(changeLanguage(item.language));
							API.put(`${TABLE.USERS}/${userInfo?.id}`, {...userInfo, language: item.language});
						};

						return (
							<TouchableOpacity onPress={onPress} key={generateRandomId()} style={styles.item}>
								<CustomRadioButton
									isChecked={language === item.language}
									text={item.name}
									onPress={onPress}
									style={{marginVertical: heightScale(15)}}
								/>
								<FlagIcon icon={ICONS[item.language]} />
							</TouchableOpacity>
						);
					})}
				</View>
			</View>
		</FixedContainer>
	);
};

export default Setting;
const styles = StyleSheet.create({
	button: {
		backgroundColor: colors.gray,
		borderRadius: 100,
		flexDirection: 'row',
		paddingVertical: heightScale(10),
		paddingHorizontal: widthScale(20),
		justifyContent: 'space-between',
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
});
