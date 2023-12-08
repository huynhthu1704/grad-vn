import React, {memo, useEffect, useRef, useState} from 'react';
import {DeviceEventEmitter, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {ICONS} from '../../assets/image-paths';
import ChooseCategoriesService from '../../components/choose-categories-service';
import CustomButton from '../../components/custom-button';
import CustomHeader from '../../components/custom-header';
import CustomText from '../../components/custom-text';
import FixedContainer from '../../components/fixed-container';
import Spinner from '../../components/spinner';
import {ModalRefObject} from '../../components/time-picker';
import {EMIT_EVENT, FONT_FAMILY, TABLE} from '../../constants/enum';
import {Category, ImageProps} from '../../constants/types';
import {RootStackScreenProps} from '../../navigator/stacks';
import API from '../../services/api';
import {useAppSelector} from '../../stores/store/storeHooks';
import {colors} from '../../styles/colors';
import {heightScale, widthScale} from '../../styles/scaling-utils';
import {AlertYesNo, showMessage} from '../../utils';
import {getImageFromDevice, uploadImage} from '../../utils/image';

const AddCategory = (props: RootStackScreenProps<'AddCategory'>) => {
	const {navigation, route} = props;
	const data = route.params?.data;

	const chooseCategoriesRef = useRef<ModalRefObject>(null);

	const [image, setImage] = useState<ImageProps>();

	const [category, setCategory] = useState<Category>();
	const [name, setName] = useState('');

	useEffect(() => {
		if (data) {
			console.log('data image: ' + JSON.stringify(data.uri));
			setName(data?.name);
			setImage(data);
		}
	}, []);

	const handleAdd = async () => {
		Spinner.show();
		const categoryImage = await uploadImage(image?.uri || '');
		Spinner.show();
		const body = {
			name: name,
			uri: categoryImage,
		};

		if (data) {
			API.put(`${TABLE.CATEGORY}/${data.id}`, body)
				.then(() => {
					showMessage('Sửa loại dịch vụ thành công!');
					DeviceEventEmitter.emit(EMIT_EVENT.LOAD_SERVICE);
					navigation.goBack();
				})
				.finally(() => Spinner.hide());
		} else {
			API.post(`${TABLE.CATEGORY}`, body)
				.then(() => {
					showMessage('Thêm loại dịch vụ thành công');
					navigation.goBack();
				})
				.finally(() => Spinner.hide());
			Spinner.hide();
		}
	};

	return (
		<FixedContainer>
			<CustomHeader title="THÊM DỊCH VỤ" />
			<ScrollView style={styles.view}>
				{/* NAME  */}
				<CustomText font={FONT_FAMILY.BOLD} text={'TÊN DỊCH VỤ'} size={14} />
				<TextInput value={name} onChangeText={setName} style={styles.input} />
				<TouchableOpacity
					onPress={async () => {
						const newImage = await getImageFromDevice();
						setImage(newImage);
						console.log('set image: ' + newImage.uri);
					}}
					style={styles.uploadImage}>
					{image && <Image source={{uri: image.uri}} style={{flex: 1, width: '100%', height: '100%', resizeMode: 'contain'}} />}
					{!image && <Image source={ICONS.upload} style={styles.upload} />}
				</TouchableOpacity>
			</ScrollView>
			<View style={{padding: widthScale(20)}}>
				<CustomButton
					onPress={() => {
						AlertYesNo(undefined, 'Bạn chắc chắn đã kiểm tra kĩ thông tin?', handleAdd);
					}}
					text={data ? 'SỬA' : 'THÊM'}
				/>
			</View>
			<ChooseCategoriesService onPressChoose={setCategory} ref={chooseCategoriesRef} />
		</FixedContainer>
	);
};

export default memo(AddCategory);
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
		flex: 1,
		resizeMode: 'contain',
	},
	viewInput: {
		width: '100%',
		borderRadius: 5,
		borderWidth: 1,
	},
});
