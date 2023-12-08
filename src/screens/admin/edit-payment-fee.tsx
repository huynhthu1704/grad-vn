import React, {memo, useState} from 'react';
import {ScrollView, StyleSheet, TextInput, View} from 'react-native';
import CustomButton from '../../components/custom-button';
import CustomHeader from '../../components/custom-header';
import CustomText from '../../components/custom-text';
import FixedContainer from '../../components/fixed-container';
import Spinner from '../../components/spinner';
import {FONT_FAMILY, TABLE} from '../../constants/enum';
import {RootStackScreenProps} from '../../navigator/stacks';
import API from '../../services/api';
import {widthScale} from '../../styles/scaling-utils';
import {showMessage} from '../../utils';
import { colors } from '../../styles/colors';

const EditPaymentFee = (props: RootStackScreenProps<'EditPaymentFee'>) => {
	const {navigation, route} = props;
	const [fee, setFee] = useState(route?.params?.fee?.toString());

	const onPressSave = () => {
		const price = Number(fee);
		if (price > 0) {
			Spinner.show();
			API.put(`${TABLE.ADMIN}/PAYMENT`, {price: price})
				.then(() => {
					showMessage('Sửa thành công!');
					navigation.goBack();
				})
				.finally(() => Spinner.hide());
		}
	};

	return (
		<FixedContainer>
			<CustomHeader title="CHỈNH SỬA PHÍ DỊCH VỤ" />

			<ScrollView style={styles.view}>
				<CustomText font={FONT_FAMILY.BOLD} text={'PHÍ DỊCH VỤ'} size={14} />
				<View style={styles.viewInput}>
					<TextInput value={fee?.toString()} onChangeText={setFee} keyboardType="numeric" style={{color: colors.black,}}/>
				</View>
			</ScrollView>

			<View style={{padding: widthScale(20)}}>
				<CustomButton onPress={onPressSave} text="CẬP NHẬT" />
			</View>
		</FixedContainer>
	);
};

export default memo(EditPaymentFee);
const styles = StyleSheet.create({
	view: {
		paddingHorizontal: widthScale(20),
	},
	viewInput: {
		width: '100%',
		borderRadius: 5,
		borderWidth: 1,
	},
});