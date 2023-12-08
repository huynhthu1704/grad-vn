import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import CustomHeader from '../../components/custom-header';
import CustomText from '../../components/custom-text';
import FixedContainer from '../../components/fixed-container';
import Spinner from '../../components/spinner';
import {TABLE, TYPE_USER} from '../../constants/enum';
import {PaymentProps, UserProps} from '../../constants/types';
import API from '../../services/api';
import {colors} from '../../styles/colors';
import {heightScale, widthScale} from '../../styles/scaling-utils';
import {AlertYesNo, showMessage} from '../../utils';
import { useLanguage } from '../../hooks/useLanguage';

const ManagePayment = () => {
	const [data, setData] = useState<PaymentProps[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const text = useLanguage().Transactionsrequireconfirmation;
	useEffect(() => {
		onRefresh();
	}, []);

	const onRefresh = async () => {
		setRefreshing(true);
		const newData: PaymentProps[] = [];

		const allServicer = ((await API.get(`${TABLE.USERS}`, true)) as UserProps[]).filter(o => o.type === TYPE_USER.SERVICER);

		for (let i = 0; i < allServicer.length; i++) {
			const res = await API.get(`${TABLE.PAYMENT_FEE_SERVICE}/${allServicer[i].id}`, true);
			newData.push(...res);
		}
		const newNewData: PaymentProps[] = [];
		for (let i = 0; i < newData.length; i++) {
			!newData[i].isAccept && newNewData.push(newData[i]);
		}

		for (let i = 0; i < newNewData.length; i++) {
			newNewData[i].servicerObject = allServicer.find(o => o.id === newNewData[i].idServicer);
		}

		setData(newNewData);
		setRefreshing(false);
	};

	const onPressItem = (item: PaymentProps) => {
		AlertYesNo(undefined, 'Xác nhận!', () => {
			Spinner.show();
			API.put(`${TABLE.PAYMENT_FEE_SERVICE}/${item.idServicer}/${item.id}`, {...item, isAccept: true})
				.then(() => {
					showMessage('Xác nhận thành công!');
					onRefresh();
				})
				.finally(() => Spinner.hide());
		});
	};

	return (
		<FixedContainer>
			<CustomHeader title={text.title} />

			<FlatList
				refreshing={refreshing}
				onRefresh={onRefresh}
				contentContainerStyle={{paddingHorizontal: widthScale(20)}}
				renderItem={({item}) => (
					<View>
						<CustomText text={item?.servicerObject?.name} />
						<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
							<CustomText text={'Ngày: ' + moment(item.date).format('DD/MM/YYYY')} />
							<TouchableOpacity
								disabled={refreshing}
								onPress={() => onPressItem(item)}
								style={{backgroundColor: 'red', padding: 5, borderRadius: 5}}>
								<CustomText color={colors.white} text={'Duyệt'} />
							</TouchableOpacity>
						</View>
						<Image style={styles.image} source={{uri: item.image}} />
					</View>
				)}
				ListEmptyComponent={
					<View style={{marginTop: heightScale(40), alignItems: 'center'}}>
						<CustomText color={colors.grayText} text={'Không có giao dịch nào'} />
					</View>
				}
				data={data}
			/>
		</FixedContainer>
	);
};

export default ManagePayment;
const styles = StyleSheet.create({
	image: {
		width: widthScale(100),
		height: heightScale(200),
		alignSelf: 'center',
		borderWidth: 1,
		borderColor: colors.gray,
		resizeMode: 'contain',
	},
});