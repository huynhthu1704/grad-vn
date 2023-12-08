import React, {memo} from 'react';
import {RootStackScreenProps} from '../../navigator/stacks';
import FixedContainer from '../../components/fixed-container';
import moment from 'moment';
import {DeviceEventEmitter, ScrollView, View, Image, StyleSheet} from 'react-native';
import CustomButton from '../../components/custom-button';
import CustomHeader from '../../components/custom-header';
import CustomText from '../../components/custom-text';
import {EMIT_EVENT, FONT_FAMILY, TABLE} from '../../constants/enum';
import {heightScale, widthScale} from '../../styles/scaling-utils';
import {AlertYesNo, showMessage} from '../../utils';
import Spinner from '../../components/spinner';
import API from '../../services/api';

const InfoAcceptServicer = (props: RootStackScreenProps<'InfoAcceptServicer'>) => {
	const {navigation, route} = props;

	const data = route.params.data;
	const onPressStart = () => {
		AlertYesNo(undefined, 'Đồng ý người này cung cấp dịch vụ?', async () => {
			Spinner.show();
			API.put(`${TABLE.USERS}/${data.id}`, {...data, isAccept: true})
				.then(() => {
					showMessage('Kích hoạt thành công!');
					navigation.goBack();
					DeviceEventEmitter.emit(EMIT_EVENT.LOAD_SERVICE_ACCEPT);
				})
				.finally(() => Spinner.hide());
		});
	};
	return (
		<FixedContainer>
			<CustomHeader title="THÔNG TIN XÉT DUYỆT" />
			<ScrollView style={styles.view}>
				<View style={{borderRadius: 5, borderWidth: 0.5, padding: 5, marginBottom: heightScale(10)}}>
					<CustomText text={'HỌ VÀ TÊN:   '} font={FONT_FAMILY.BOLD} size={14} rightContent={<CustomText text={data.name} size={15} />} />
				</View>

				<View style={{borderRadius: 5, borderWidth: 0.5, padding: 5, marginBottom: heightScale(10)}}>
					<CustomText text={'SỐ ĐIỆN THOẠI:   '} font={FONT_FAMILY.BOLD} size={14} rightContent={<CustomText text={data.phone} size={15} />} />
				</View>

				<View style={{borderRadius: 5, borderWidth: 0.5, padding: 5, marginBottom: heightScale(10)}}>
					<CustomText
						text={'NGÀY ĐĂNG KÝ:   '}
						font={FONT_FAMILY.BOLD}
						size={14}
						rightContent={<CustomText text={moment(data.dateRegister).format('DD/MM/YYYY')} size={15} />}
					/>
				</View>

				<View style={{borderRadius: 5, borderWidth: 0.5, padding: 5, marginBottom: heightScale(10)}}>
					<CustomText text={'ẢNH CCCD:   '} font={FONT_FAMILY.BOLD} size={14} />
					<Image style={{width: widthScale(120), height: heightScale(80), borderRadius: 5}} source={{uri: data.CCCD?.image}} />
				</View>

				<View style={{borderRadius: 5, borderWidth: 0.5, padding: 5, marginBottom: heightScale(10)}}>
					<CustomText text={'CCCD:   '} font={FONT_FAMILY.BOLD} size={14} rightContent={<CustomText text={data.CCCD?.id} size={15} />} />
				</View>

				<View style={{borderRadius: 5, borderWidth: 0.5, padding: 5, marginBottom: heightScale(10)}}>
					<CustomText text={'ĐỊA CHỈ:   '} font={FONT_FAMILY.BOLD} size={14} rightContent={<CustomText text={data.address} size={15} />} />
				</View>
			</ScrollView>
			<View style={{padding: widthScale(20)}}>
				<CustomButton onPress={onPressStart} text="KÍCH HOẠT" />
			</View>
		</FixedContainer>
	);
};

export default memo(InfoAcceptServicer);

const styles = StyleSheet.create({
	view: {
		paddingHorizontal: widthScale(20),
	},
});
