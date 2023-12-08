import {Image, Modal, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import FixedContainer from '../components/fixed-container';
import CustomHeader from '../components/custom-header';
import {RootStackScreenProps} from '../navigator/stacks';
import Star from '../components/star';
import {heightScale, widthScale} from '../styles/scaling-utils';
import CustomText from '../components/custom-text';
import {FONT_FAMILY, TABLE} from '../constants/enum';
import {generateRandomId} from '../utils';
import {EvaluateProps, UserProps} from '../constants/types';
import API from '../services/api';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { useLanguage } from '../hooks/useLanguage';

// export const PopupWithImage = ({imageUrl, visibility, onClose}) => {
// 	console.log('visibility: ' + visibility);
// 	// const [modalVisible, setModalVisible] = useState(visibility);
// 	// console.log('modalVisible: ' + modalVisible);

// 	console.log('Appear 1st');
// 	return (
// 		<Modal
// 			animationType="slide"
// 			transparent={true}
// 			visible={visibility}
// 			onRequestClose={() => {
// 				console.log('onRequestClose');
// 				// setModalVisible(false);
// 				onClose && onClose();
// 			}}>
// 			<View style={styles.centeredView}>
// 				<View style={styles.modalView}>
// 					<Image source={{uri: imageUrl}} style={styles.image} />
// 					<TouchableOpacity
// 						style={styles.closeButton}
// 						onPress={() => {
// 							console.log('Close');
// 							// setModalVisible(!modalVisible);
// 							onClose && onClose();
// 						}}>
// 						<Text style={styles.closeButtonText}>Close</Text>
// 					</TouchableOpacity>
// 				</View>
// 			</View>
// 		</Modal>
// 	);
// };

export const ReviewAndRating = ({item}) => {
	// console.log('ReviewAndRating New' + JSON.stringify(item));
	
	return (
		<View style={{flexDirection: 'row', marginVertical: heightScale(5)}} key={generateRandomId()}>
			<Image style={styles.avatarComment} source={{uri: item.userObject?.avatar}} />
			<View style={{marginLeft: widthScale(10)}}>
				<CustomText text={item.userObject?.name} font={FONT_FAMILY.BOLD} />
				<Star star={item.star} />
				{!!item.content && <CustomText text={item.content} />}
				<View style={{flexDirection: 'row', flexWrap: 'wrap', paddingVertical: heightScale(10)}}>
					{item.images?.map(image => (
						<Image
							style={{
								width: widthScale(120),
								height: heightScale(90),
								borderRadius: 8,
								marginRight: widthScale(5),
								marginVertical: heightScale(5),
							}}
							key={generateRandomId()}
							source={{uri: image}}
						/>
					))}
				</View>
			</View>
		</View>
	);
};
const AllReview = (props: RootStackScreenProps<'AllReview'>) => {
	const {navigation, route} = props;
	const text = useLanguage().AllReview;
	const [allReview, setAllReview] = useState<EvaluateProps[]>([]);
	// const [modalVisible, setModalVisible] = useState(false);
	// const [image, setImage] = useState();

	// const onImageClick = image => {
	// 	console.log('Image: ' + image);
	// 	setImage(image);
	// 	setModalVisible(true);
	// 	// showPopup();
	// };
	// const onClose = () => {
	// 	console.log('Close');
	// 	setModalVisible(false);
	// };

	const starTotal = useMemo(() => {
		let total = 0;
		for (let i = 0; i < allReview.length; i++) {
			total += allReview[i].star;
		}

		return total / allReview.length;
	}, [allReview]);

	useEffect(() => {
		(async () => {
			const evaluate = (await API.get(`${TABLE.EVALUATE}/${route.params.idService}`, true)) as EvaluateProps[];
			for (let i = 0; i < evaluate.length; i++) {
				evaluate[i].userObject = (await API.get(`${TABLE.USERS}/${evaluate[i].user_id}`)) as UserProps;
			}
			setAllReview(evaluate);
		})();
	}, []);

	return (
		<FixedContainer>
			<CustomHeader title={text.title}  />
			<ScrollView style={styles.view}>
				<Star star={starTotal} isShowNumber />

				<View style={{marginTop: widthScale(10)}}>
					{allReview.map(item => (
						<ReviewAndRating item={item} />
					))}
				</View>
			</ScrollView>
			{/* <PopupWithImage imageUrl={image} visibility={modalVisible} onClose={onClose} /> */}
		</FixedContainer>
	);
};

export default AllReview;
const styles = StyleSheet.create({
	view: {
		paddingHorizontal: widthScale(20),
		marginTop: heightScale(20),
	},
	avatarComment: {
		width: widthScale(40),
		height: widthScale(40),
		borderRadius: 100,
	},
	// centeredView: {
	// 	flex: 1,
	// 	justifyContent: 'center',
	// 	alignItems: 'center',
	// },
	// modalView: {
	// 	margin: 20,
	// 	backgroundColor: 'white',
	// 	borderRadius: 20,
	// 	padding: 35,
	// 	alignItems: 'center',
	// 	elevation: 5,
	// },
	// image: {
	// 	width: 200,
	// 	height: 200,
	// 	resizeMode: 'cover',
	// 	borderRadius: 10,
	// },
	// closeButton: {
	// 	marginTop: 20,
	// 	padding: 10,
	// 	backgroundColor: '#2196F3',
	// 	borderRadius: 10,
	// },
	// closeButtonText: {
	// 	color: 'white',
	// 	fontWeight: 'bold',
	// 	textAlign: 'center',
	// },
});
