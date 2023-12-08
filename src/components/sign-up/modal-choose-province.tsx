import React, {forwardRef, memo, Ref, useImperativeHandle, useMemo, useState} from 'react';
import {FlatList, Image, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {ICONS} from '../../assets/image-paths';
import {FONT_FAMILY} from '../../constants/enum';
import {PROVINCE} from '../../constants/province';
import {AddressProps} from '../../constants/types';
import {colors} from '../../styles/colors';
import {heightScale, widthScale} from '../../styles/scaling-utils';
import {parseObjectToArray} from '../../utils';
import CustomButton from '../custom-button';
import CustomText from '../custom-text';

export interface ModalObject {
	show: (data?: any) => void;
	hide: () => void;
}
interface Props {
	onPressSave: (text: string, name?: string, phone?: string) => void;
	isInputName?: boolean;
	onEdit?: (text: string, name?: string, phone?: string, id?: string) => void;
}
const ModalChooseProvince = forwardRef((props: Props, ref: Ref<ModalObject>) => {
	const {onPressSave, isInputName, onEdit} = props;
	const PROVINCE_ALL = parseObjectToArray(PROVINCE);

	const [visible, setVisible] = useState(false);
	const [fullAddress, setFullAddress] = useState('');

	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');

	const [province, setProvince] = useState<any>();
	const [district, setDistrict] = useState<any>();
	const [ward, setWard] = useState<any>();
	const [idEdit, setIdEdit] = useState('');

	const districtAll = province ? parseObjectToArray(province?.['quan-huyen']) : undefined;

	const wardAll = district ? parseObjectToArray(district?.['xa-phuong']) : undefined;

	const address = province ? (district ? (ward ? [] : wardAll) : districtAll) : PROVINCE_ALL;

	const show = ({address, id, name, phone}: AddressProps) => {
		setVisible(true);
		setIdEdit(id);

		if (address) {
			setFullAddress(address.split(',')[0]);
			setName(name);
			setPhone(phone);

			setProvince(true);
			setDistrict(true);
			setWard({path_with_type: address.replace(address.split(',')[0] + ', ', '')});
		}
	};

	const hide = () => {
		setVisible(false);
		resetData();
	};

	const resetData = () => {
		setFullAddress('');
		setName('');
		setPhone('');
		setProvince(undefined);
		setDistrict(undefined);
		setWard(undefined);
	};

	useImperativeHandle(ref, () => ({show, hide}), []);

	const onPressBack = () => {
		if (idEdit) {
			setProvince(undefined);
			setDistrict(undefined);
			setWard(undefined);
			setFullAddress('');
		} else {
			if (ward) {
				return setWard(undefined);
			}

			if (district) {
				return setDistrict(undefined);
			}

			if (province) {
				return setProvince(undefined);
			}
		}
	};

	const onPressItem = (item: any) => {
		if (!province) {
			return setProvince(item);
		}
		if (!district) {
			return setDistrict(item);
		}
		if (!ward) {
			return setWard(item);
		}
	};

	const onPressDone = () => {
		if (idEdit) {
			onEdit?.(fullAddress + ',' + ' ' + ward?.path_with_type, name, phone, idEdit);
		} else {
			onPressSave?.(fullAddress + ',' + ' ' + ward?.path_with_type, name, phone);
		}

		hide();
	};

	const disabledSave = useMemo(() => !fullAddress || (isInputName ? !name || !phone : false), [isInputName, name, phone, fullAddress]);

	const renderItem = ({item}: any) => (
		<TouchableOpacity onPress={() => onPressItem(item)} style={styles.viewItem}>
			<CustomText text={item?.name} />
		</TouchableOpacity>
	);

	return (
		<Modal statusBarTranslucent transparent onDismiss={hide} onRequestClose={hide} visible={visible}>
			<View style={styles.view}>
				<View style={styles.content}>
					<CustomText font={FONT_FAMILY.BOLD} text={'Hãy chọn địa chỉ của bạn'} style={{alignSelf: 'center'}} />

					{(province || district || ward) && (
						<TouchableOpacity style={styles.viewBack} onPress={onPressBack}>
							<Image source={ICONS.back} style={styles.iconBack} />
						</TouchableOpacity>
					)}

					{address?.length ? (
						<FlatList renderItem={renderItem} data={address} />
					) : (
						<View style={{marginTop: heightScale(10), flex: 1}}>
							<ScrollView>
								<CustomText style={{margin: widthScale(5)}} text={ward?.path_with_type || fullAddress} />
								<View style={{marginTop: heightScale(20)}}>
									<CustomText style={styles.textTitle} size={12} font={FONT_FAMILY.BOLD} text={'NHẬP ĐỊA CHỈ'} />
									<View style={styles.viewInput}>
										<TextInput
											value={fullAddress}
											onChangeText={setFullAddress}
											style={styles.input}
											placeholder="Hãy nhập địa chỉ cụ thể"
											placeholderTextColor={colors.grayText}
										/>
									</View>

									{isInputName && (
										<>
											<CustomText style={styles.textTitle} size={12} font={FONT_FAMILY.BOLD} text={'HỌ VÀ TÊN'} />
											<View style={styles.viewInput}>
												<TextInput
													value={name}
													onChangeText={setName}
													style={styles.input}
													placeholder="Hãy nhập họ và tên"
													placeholderTextColor={colors.grayText}
												/>
											</View>

											<CustomText style={styles.textTitle} size={12} font={FONT_FAMILY.BOLD} text={'SỐ ĐIỆN THOẠI'} />
											<View style={styles.viewInput}>
												<TextInput
													keyboardType="numeric"
													value={phone}
													onChangeText={setPhone}
													style={styles.input}
													placeholder="Hãy nhập số điện thoai"
													placeholderTextColor={colors.grayText}
												/>
											</View>
										</>
									)}
								</View>
							</ScrollView>
							<View style={styles.viewButton}>
								<CustomButton disabled={disabledSave} text="Lưu" style={{width: widthScale(100)}} onPress={onPressDone} />
							</View>
						</View>
					)}
				</View>
			</View>
		</Modal>
	);
});

export default memo(ModalChooseProvince);
const styles = StyleSheet.create({
	view: {
		width: '100%',
		height: '100%',
		backgroundColor: colors.backgroundModal,
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		width: widthScale(300),
		height: heightScale(500),
		backgroundColor: colors.white,
		borderRadius: 10,
		paddingTop: heightScale(10),
	},
	viewItem: {
		paddingVertical: heightScale(5),
		height: heightScale(40),
		justifyContent: 'center',
		paddingHorizontal: widthScale(20),
	},
	iconBack: {
		width: widthScale(20),
		height: widthScale(20),
	},
	viewBack: {
		alignSelf: 'center',
		width: widthScale(25),
		height: widthScale(25),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.grayText,
		borderRadius: 100,
		marginVertical: heightScale(5),
	},
	viewButton: {
		alignSelf: 'center',
		marginTop: 'auto',
		marginBottom: heightScale(5),
	},
	viewInput: {
		borderWidth: 1,
		marginTop: 5,
		margin: widthScale(5),
		borderRadius: 5,
	},
	textTitle: {
		marginHorizontal: widthScale(5),
		marginTop: heightScale(10),
	},
	input: {
		color: colors.black,
		padding: 0,
		paddingLeft: widthScale(5),
		height: heightScale(30),
	},
});