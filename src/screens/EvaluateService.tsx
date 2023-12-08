import React, {memo, useState} from 'react';
import {Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {ICONS} from '../assets/image-paths';
import CustomButton from '../components/custom-button';
import CustomHeader from '../components/custom-header';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import Spinner from '../components/spinner';
import {FONT_FAMILY, TABLE} from '../constants/enum';
import {ImageProps} from '../constants/types';
import {useLanguage} from '../hooks/useLanguage';
import {RootStackScreenProps} from '../navigator/stacks';
import API from '../services/api';
import {useAppSelector} from '../stores/store/storeHooks';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';
import {showMessage} from '../utils';
import {getImageFromDevice, uploadImage} from '../utils/image';

const EvaluateService = (props: RootStackScreenProps<'EvaluateService'>) => {
	const text = useLanguage().EvaluateService;
	const {navigation, route} = props;

	const data = route.params.data;

	const userInfo = useAppSelector(state => state.userInfoReducer.userInfo);

	const [star, setStar] = useState(5);
	const [images, setImages] = useState<ImageProps[]>([]);
	const [content, setContent] = useState('');

	const handleEvaluate = async () => {
		Spinner.show();
		const listImage = [];
		for (let i = 0; i < images.length; i++) {
			const url = await uploadImage(images[i].uri);
			listImage.push(url);
		}

		API.post(`${TABLE.EVALUATE}/${data.idService}`, {
			id_service: data?.idService,
			images: listImage,
			star: star,
			user_id: userInfo?.id,
			content: content,
		})
			.then(async () => {
				const newData = await API.get(`${TABLE.ORDERS}/${data.id}`);
				API.put(`${TABLE.ORDERS}/${data.id}`, {...newData, isEvaluate: true}).then(() => {
					showMessage(text.successMessage);
					navigation.goBack();
					navigation.goBack();
				});
			})
			.finally(() => Spinner.hide());
	};

	return (
		<FixedContainer>
			<CustomHeader title={text.title} />
			<ScrollView style={{paddingHorizontal: widthScale(20)}}>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<Image style={{width: widthScale(120), height: widthScale(120), borderRadius: 10}} source={{uri: data?.serviceObject?.image}} />
					<View style={{marginLeft: widthScale(20)}}>
						<CustomText font={FONT_FAMILY.BOLD} text={data?.categoryObject.name} />
						<CustomText text={data?.serviceObject?.name} />
					</View>
				</View>

				<View style={{flexDirection: 'row', alignItems: 'center', marginVertical: heightScale(10)}}>
					<Image style={{width: widthScale(50), height: widthScale(50), borderRadius: 100}} source={{uri: data?.servicerObject?.avatar}} />
					<View>
						<CustomText font={FONT_FAMILY.BOLD} text={data?.servicerObject.name} />
						<CustomText text={data?.servicerObject?.phone} />
					</View>
				</View>

				<View
					style={{
						width: widthScale(300),
						height: 1,
						backgroundColor: colors.black,
						alignSelf: 'center',
						marginVertical: 10,
					}}
				/>

				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						alignSelf: 'center',
						marginVertical: 10,
					}}>
					<TouchableOpacity onPress={() => setStar(1)}>
						<Image
							source={star >= 1 ? ICONS.star_full : ICONS.star}
							style={[styles.star, {tintColor: star >= 1 ? colors.yellow : undefined}]}
						/>
					</TouchableOpacity>
					{/* ... (Tương tự cho 5 sao) */}
				</View>

				<CustomText text={text.description} style={{textAlign: 'center'}} />
				<View
					style={{
						borderRadius: 5,
						borderWidth: 1,
						borderColor: 'black',
						marginBottom: heightScale(20),
					}}>
					<TextInput value={content} onChangeText={setContent} multiline placeholder={text.enterdescription} style={{}} />
				</View>

				<CustomText text={text.image} style={{textAlign: 'center'}} />

				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<TouchableOpacity
						onPress={async () => {
							const image = await getImageFromDevice(10);
							setImages([...images, ...image]);
						}}
						style={{
							width: widthScale(80),
							height: widthScale(80),
							borderRadius: 5,
							justifyContent: 'center',
							alignItems: 'center',
							borderWidth: 1,
							marginRight: 10,
						}}>
						<Image style={{width: widthScale(25), height: widthScale(25)}} source={ICONS.camera} />
					</TouchableOpacity>
					<ScrollView showsHorizontalScrollIndicator={false} horizontal>
						{images?.map((item, index) => (
							<View style={{marginRight: 10}}>
								<TouchableOpacity
									onPress={() => {
										const newImages = [...images];
										newImages.splice(index, 1);
										setImages(newImages);
									}}
									style={{
										position: 'absolute',
										zIndex: 10,
										right: 0,
										backgroundColor: colors.white,
										borderRadius: 100,
										width: widthScale(25),
										height: widthScale(25),
										justifyContent: 'center',
										alignItems: 'center',
									}}>
									<Image
										source={ICONS.delete}
										style={{
											width: widthScale(18),
											height: widthScale(18),
										}}
									/>
								</TouchableOpacity>
								<Image
									style={{
										width: widthScale(80),
										height: widthScale(80),
										borderRadius: 5,
										justifyContent: 'center',
										alignItems: 'center',
										borderWidth: 1,
									}}
									source={item}
								/>
							</View>
						))}
					</ScrollView>
				</View>
			</ScrollView>
			<View style={{padding: widthScale(20)}}>
				<CustomButton disabled={!content || !images.length} text={text.evulate} onPress={handleEvaluate} />
			</View>
		</FixedContainer>
	);
};

export default memo(EvaluateService);
const styles = StyleSheet.create({
	star: {
		width: widthScale(30),
		height: widthScale(30),
	},
});
