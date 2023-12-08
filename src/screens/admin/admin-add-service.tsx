import React, {memo, useEffect, useRef, useState} from 'react';
import {DeviceEventEmitter, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {ICONS} from '../../assets/image-paths';
import ChooseCategoriesService from '../../components/choose-categories-service';
import ChooseServicer from '../../components/choose-servicers';
import CustomButton from '../../components/custom-button';
import CustomHeader from '../../components/custom-header';
import CustomText from '../../components/custom-text';
import FixedContainer from '../../components/fixed-container';
import Spinner from '../../components/spinner';
import {ModalRefObject} from '../../components/time-picker';
import {EMIT_EVENT, FONT_FAMILY, TABLE} from '../../constants/enum';
import {Category, ImageProps, UserProps} from '../../constants/types';
import {RootStackScreenProps} from '../../navigator/stacks';
import API from '../../services/api';
import {useAppSelector} from '../../stores/store/storeHooks';
import {colors} from '../../styles/colors';
import {heightScale, widthScale} from '../../styles/scaling-utils';
import {AlertYesNo, showMessage} from '../../utils';
import {getImageFromDevice, uploadImage} from '../../utils/image';

const AdminAddService = (props: RootStackScreenProps<'AddService'>) => {
	const {navigation, route} = props;
	const data = route.params?.data;

	const chooseCategoriesRef = useRef<ModalRefObject>(null);
	const chooseServicerRef = useRef<ModalRefObject>(null);

	const [category, setCategory] = useState<Category>();
	const [servicer, setServicer] = useState<UserProps>();
	const [name, setName] = useState('');
	const [image, setImage] = useState<ImageProps>();
	const [description, setDescription] = useState('');

	useEffect(() => {
		if (data) {
			console.log('data: ' + JSON.stringify(data));
			API.get(`${TABLE.USERS}/${data.servicer}`, false).then(res => {
				setServicer(res);
				setCategory({id: data.categoryObject.idCategoryService, name: data.categoryObject.name} as any);
				setName(data.name);
				setImage({uri: data.image} as any);
				setDescription(data.description);
			});
		}
	}, []);

	const handleAdd = async () => {
		if (data) {
			console.log('data cate' + JSON.stringify(category));
			Spinner.show();
			const body = {
				name: name,
				category: category?.id!,
				servicer: servicer?.id!,
				description: description,
				image: await uploadImage(image?.uri!),
			};

			API.put(`${TABLE.SERVICE}/${data.id}`, body)
				.then(() => {
					showMessage('Sửa dịch vụ thành công!');
					DeviceEventEmitter.emit(EMIT_EVENT.LOAD_SERVICE);
					navigation.goBack();
				})
				.finally(() => Spinner.hide());
		} else {
			Spinner.show();
			const imageUrl = await uploadImage(image?.uri!);
			const body = {
				name: name,
				category: category?.id!,
				servicer: servicer?.id!,
				description: description,
				image: imageUrl!,
			};

			API.post(`${TABLE.SERVICE}`, body)
				.then(() => {
					showMessage('Thêm dịch vụ thành công');
					navigation.goBack();
				})
				.finally(() => Spinner.hide());
		}
	};

	return (
		<FixedContainer>
			<CustomHeader title="THÊM DỊCH VỤ" />
			<ScrollView style={styles.view}>
				{/* CATEGORY  */}
				<CustomText font={FONT_FAMILY.BOLD} text={'LOẠI DỊCH VỤ'} size={14} />
				<TouchableOpacity
					onPress={() => chooseCategoriesRef.current?.show()}
					style={{
						borderWidth: 1,
						height: heightScale(50),
						justifyContent: 'center',
						borderRadius: 5,
						paddingLeft: widthScale(20),
						marginBottom: heightScale(20),
					}}>
					<CustomText text={category?.name || 'Chọn loại dịch vụ'} />
				</TouchableOpacity>
				{/* SERVICER  */}
				<CustomText font={FONT_FAMILY.BOLD} text={'NHÀ CUNG CẤP DỊCH VỤ'} size={14} />
				<TouchableOpacity
					onPress={() => chooseServicerRef.current?.show()}
					style={{
						borderWidth: 1,
						height: heightScale(50),
						justifyContent: 'center',
						borderRadius: 5,
						paddingLeft: widthScale(20),
						marginBottom: heightScale(20),
					}}>
					<CustomText text={servicer?.name || 'Chọn nhà cung cấp dịch vụ'} />
				</TouchableOpacity>

				{/* NAME  */}
				<CustomText font={FONT_FAMILY.BOLD} text={'TÊN DỊCH VỤ'} size={14} />
				<TextInput value={name} onChangeText={setName} style={styles.input} />

				{/* IMAGE  */}
				<CustomText font={FONT_FAMILY.BOLD} text={'HÌNH ẢNH'} size={14} />
				<TouchableOpacity
					onPress={async () => {
						const image = await getImageFromDevice();
						image && setImage(image);
					}}
					style={styles.uploadImage}>
					{image?.uri ? (
						<Image source={{uri: image.uri}} style={{flex: 1, width: '100%', height: '100%', resizeMode: 'contain'}} />
					) : (
						<Image source={ICONS.upload} style={styles.upload} />
					)}
				</TouchableOpacity>

				{/* DESCRIPTION  */}
				<CustomText font={FONT_FAMILY.BOLD} text={'MÔ TẢ'} size={14} />
				<View style={styles.viewInput}>
					<TextInput value={description} onChangeText={setDescription} style={{color: colors.black}} multiline />
				</View>
			</ScrollView>
			<View style={{padding: widthScale(20)}}>
				<CustomButton
					disabled={!category || !name || !image || !description}
					onPress={() => {
						AlertYesNo(undefined, 'Bạn chắc chắn đã kiểm tra kĩ thông tin?', handleAdd);
					}}
					text={data ? 'SỬA' : 'THÊM'}
				/>
			</View>
			<ChooseCategoriesService onPressChoose={setCategory} ref={chooseCategoriesRef} />
			<ChooseServicer onPressChoose={setServicer} ref={chooseServicerRef} />
		</FixedContainer>
	);
};

export default memo(AdminAddService);
const styles = StyleSheet.create({
	view: {
		paddingHorizontal: widthScale(20),
	},
	input: {
		height: heightScale(50),
		borderWidth: 1,
		borderRadius: 5,
		paddingLeft: widthScale(10),
		marginBottom: heightScale(20),
		color: colors.black,
	},
	uploadImage: {
		width: widthScale(200),
		height: heightScale(100),
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: colors.black,
		borderWidth: 1,
		marginBottom: heightScale(20),
	},
	upload: {
		width: widthScale(25),
		height: widthScale(25),
	},
	viewInput: {
		width: '100%',
		borderRadius: 5,
		borderWidth: 1,
		color: colors.black,
	},
});
