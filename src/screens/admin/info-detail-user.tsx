import moment from 'moment';
import React, {memo, useState} from 'react';
import {Image, Modal, Pressable, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import CustomButton from '../../components/custom-button';
import CustomHeader from '../../components/custom-header';
import CustomRadioButton from '../../components/custom-radio-button';
import CustomText from '../../components/custom-text';
import FixedContainer from '../../components/fixed-container';
import Spinner from '../../components/spinner';
import {WIDTH} from '../../constants/constants';
import {FONT_FAMILY, TABLE, TYPE_BLOCK_SERVICER} from '../../constants/enum';
import {RootStackScreenProps} from '../../navigator/stacks';
import API from '../../services/api';
import {colors} from '../../styles/colors';
import {heightScale, widthScale} from '../../styles/scaling-utils';
import {AlertYesNo, showMessage} from '../../utils';

const InfoDetailUser = (props: RootStackScreenProps<'InfoDetailUser'>) => {
	const {navigation, route} = props;

	const data = route.params.data;

	const [visibleBlock, setVisibleBlock] = useState(false);
	const [reason, setReason] = useState<TYPE_BLOCK_SERVICER>();
	const [reasonText, setReasonText] = useState('');

	// const handleBlock = () => {
	// 	AlertYesNo(undefined, 'Bạn chắc chắn muốn chặn user này?', async () => {
	// 		// Spinner.show();
	// 		// const userInfo = await API.get(`${TABLE.USERS}/${data.id}`);
	// 		// API.put(`${TABLE.USERS}/${data.id}`, {...userInfo, isBlocked: true})
	// 		// 	.then(() => {
	// 		// 		showMessage('Chặn user thành công!');
	// 		// 		navigation.goBack();
	// 		// 	})
	// 		// 	.finally(() => Spinner.hide());
	// 	});
	// };

	const handleBlock = async () => {
		if (!reasonText) {
			return showMessage('Vui lòng nhập lí do!');
		}

		Spinner.show();
		const newData = await API.get(`${TABLE.USERS}/${data.id}`);
		API.put(`${TABLE.USERS}/${data.id}`, {...newData, isBlocked: true, reasonBlock: reason})
			.then(() => {
				showMessage('Đã chặn ' + data.name);
				navigation.goBack();
			})
			.finally(() => Spinner.hide());
	};
	const handleUnBlock = async () => {
		Spinner.show();
		const newData = await API.get(`${TABLE.USERS}/${data.id}`);
		API.put(`${TABLE.USERS}/${data.id}`, {...newData, isBlocked: false, reasonBlock: ''})
			.then(() => {
				showMessage('Đã mở khoá cho ' + data.name);
				navigation.goBack();
			})
			.finally(() => Spinner.hide());
	};

	return (
		<FixedContainer>
			<CustomHeader title="THÔNG TIN CHI TIẾT" />
			<ScrollView style={styles.view}>
				{!!data.avatar && (
					<Image
						style={{width: widthScale(100), height: heightScale(100), alignSelf: 'center', borderRadius: 100, marginVertical: heightScale(20)}}
						source={{uri: data.avatar}}
					/>
				)}

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
			</ScrollView>

			<View style={{padding: widthScale(20)}}>
				{data.isBlocked ? (
					<CustomButton onPress={handleUnBlock} text="MỞ KHOÁ TÀI KHOẢN" />
				) : (
					<CustomButton onPress={() => setVisibleBlock(true)} text="KHOÁ TÀI KHOẢN" />
				)}
			</View>

			<Modal
				animationType="fade"
				statusBarTranslucent
				transparent
				onDismiss={() => setVisibleBlock(false)}
				onRequestClose={() => setVisibleBlock(false)}
				visible={visibleBlock}>
				<Pressable onPress={() => setVisibleBlock(false)} style={styles.viewModal}>
					<Pressable style={styles.content}>
						<ScrollView>
							<CustomText font={FONT_FAMILY.BOLD} text={'Khoá tài khoản'} style={{alignSelf: 'center'}} />
							<View style={{padding: widthScale(20)}}>
								<View style={{gap: heightScale(10), marginTop: heightScale(10)}}>
									<CustomRadioButton
										onPress={() => {
											setReason(TYPE_BLOCK_SERVICER.ThereIsUnusualSpamBehavior);
											setReasonText('Có hành vi spam bất thường');
										}}
										isChecked={reason === TYPE_BLOCK_SERVICER.ThereIsUnusualSpamBehavior}
										text="Có hành vi spam bất thường"
									/>

									<CustomRadioButton
										onPress={() => {
											setReason(TYPE_BLOCK_SERVICER.Other);
											setReasonText('');
										}}
										isChecked={reason === TYPE_BLOCK_SERVICER.Other}
										text="Khác"
									/>

									{reason === TYPE_BLOCK_SERVICER.Other && (
										<View>
											<CustomText font={FONT_FAMILY.BOLD} text={'NHẬP LÝ DO'} size={14} />
											<View style={styles.viewInput}>
												<TextInput value={reasonText} onChangeText={setReasonText} multiline />
											</View>
										</View>
									)}
								</View>
							</View>
						</ScrollView>
						<View
							style={{
								flexDirection: 'row',
								paddingHorizontal: widthScale(15),
								justifyContent: 'space-between',
								paddingBottom: heightScale(15),
							}}>
							<CustomButton onPress={() => setVisibleBlock(false)} text="HUỶ" style={{width: WIDTH / 3}} />
							<CustomButton onPress={handleBlock} text="XÁC NHẬN" style={{width: WIDTH / 3}} />
						</View>
					</Pressable>
				</Pressable>
			</Modal>
		</FixedContainer>
	);
};

export default memo(InfoDetailUser);
const styles = StyleSheet.create({
	view: {
		paddingHorizontal: widthScale(20),
	},
	viewModal: {
		width: '100%',
		height: '100%',
		backgroundColor: colors.backgroundModal,
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		width: widthScale(300),
		height: heightScale(400),
		backgroundColor: colors.white,
		borderRadius: 10,
		paddingTop: heightScale(10),
	},
	viewInput: {
		width: '100%',
		borderRadius: 5,
		borderWidth: 1,
		maxHeight: heightScale(200),
	},
});