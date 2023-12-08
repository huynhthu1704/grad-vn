import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, Image, ScrollView, Share, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ICONS} from '../assets/image-paths';
import CustomButton from '../components/custom-button';
import CustomHeader from '../components/custom-header';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import Spinner from '../components/spinner';
import Star from '../components/star';
import {WIDTH} from '../constants/constants';
import {FONT_FAMILY, TABLE, TYPE_USER} from '../constants/enum';
import {EvaluateProps, ServicerBlockUser, UserProps} from '../constants/types';
import {useLanguage} from '../hooks/useLanguage';
import {ROUTE_KEY} from '../navigator/routers';
import {RootStackScreenProps} from '../navigator/stacks';
import API from '../services/api';
import {useAppSelector} from '../stores/store/storeHooks';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';
import {generateRandomId, getServiceFromID, showMessage} from '../utils';
import {ReviewAndRating} from './all-review';

const DetailService = (props: RootStackScreenProps<'ServiceDetail'>) => {
	const text = useLanguage().DetailService;
	const {navigation, route} = props;

	const data = route.params.serviceData;

	const userInfo = useAppSelector(state => state.userInfoReducer.userInfo);

	const [evaluates, setEvaluates] = useState<EvaluateProps[]>([]);

	const [servicer, setServicer] = useState<UserProps[]>([]);

	const starTotal = useMemo(() => {
		let total = 0;
		for (let i = 0; i < evaluates.length; i++) {
			total += evaluates[i].star;
		}

		return total / evaluates.length || 0;
	}, [evaluates]);

	useEffect(() => {
		(async () => {
			const evaluate = (await API.get(`${TABLE.EVALUATE}/${data.id}`, true)) as EvaluateProps[];
			for (let i = 0; i < evaluate.length; i++) {
				evaluate[i].userObject = (await API.get(`${TABLE.USERS}/${evaluate[i].user_id}`)) as unknown as UserProps;
			}
			setEvaluates(evaluate);

			const listServicerRecommendation: UserProps[] = [];
			const newServicer = (await API.get(`${TABLE.USERS}`, true)) as UserProps[];
			for (let i = 0; i < newServicer.length; i++) {
				const servicerId = newServicer[i].id;
				if (newServicer[i].type === TYPE_USER.SERVICER && servicerId !== data.servicer) {
					await getServiceFromID(servicerId).then(res => {
						for (let j = 0; j < res.length; j++) {
							if (res[j].category.match(data.category)) {
								listServicerRecommendation.push(newServicer[i]);
							}
						}
					});
				}
			}
			setServicer(listServicerRecommendation);
		})();
	}, [data.id]);

	const onPressBooking = async () => {
		const servicer = (await API.get(`${TABLE.USERS}/${data.servicer}`)) as UserProps;
		if (!servicer?.receiveBooking) {
			return showMessage(text.servicerNotActive);
		}
		Spinner.show();
		API.get(`${TABLE.SERVICE_BLOCK_USER}`, true)
			.then((res: ServicerBlockUser[]) => {
				let check = false;
				for (let i = 0; i < res.length; i++) {
					if (res[i].phone === userInfo?.phone && data.servicer === res[i].idServicer) {
						check = true;
					}
				}

				if (check) {
					showMessage(text.servicerBlocked);
				} else {
					navigation.navigate(ROUTE_KEY.Booking, {service: data});
				}
			})
			.finally(() => Spinner.hide());
	};

	const onPressViewInfoServicer = (servicerId: string) => {
		navigation.navigate(ROUTE_KEY.InfoServicer, {idServicer: servicerId});
	};

	const onPressViewAllReview = () => navigation.navigate(ROUTE_KEY.AllReview, {idService: data.id});

	return (
		<FixedContainer>
			<CustomHeader title={text.title} />
			<ScrollView style={styles.view}>
				<View style={styles.viewTop}>
					<Image source={{uri: data?.image}} style={styles.image} />
					<View style={{flex: 1, justifyContent: 'center', marginLeft: widthScale(30)}}>
						<CustomText text={data.categoryObject?.name} />
						<CustomText text={data?.name} font={FONT_FAMILY.BOLD} />
					</View>
				</View>
				<View style={{marginVertical: heightScale(20)}}>
					<CustomText text={text.descriptionservices} font={FONT_FAMILY.BOLD} />
					<CustomText text={data?.description} />
				</View>

				<TouchableOpacity style={{flexDirection: 'row'}} onPress={() => onPressViewInfoServicer(data.servicerObject?.id)}>
					<Image
						style={styles.avatar}
						source={{uri: data.servicerObject?.avatar || 'https://assets.stickpng.com/images/585e4bcdcb11b227491c3396.png'}}
					/>
					<View style={{marginLeft: widthScale(10), flex: 1}}>
						<TouchableOpacity style={{alignSelf: 'baseline'}}>
							<CustomText text={data.servicerObject.name} font={FONT_FAMILY.BOLD} />
						</TouchableOpacity>
						<CustomText text={data.servicerObject?.phone} />
					</View>
				</TouchableOpacity>

				<View style={{marginVertical: widthScale(10)}}>
					<CustomText text={text.evulate} font={FONT_FAMILY.BOLD} />
					<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
						<Star star={starTotal} isShowNumber />
						{!!evaluates.length && (
							<TouchableOpacity onPress={onPressViewAllReview}>
								<CustomText style={{textDecorationLine: 'underline'}} size={13} text={text.allevulate} font={FONT_FAMILY.BOLD} />
							</TouchableOpacity>
						)}
					</View>
				</View>

				<View style={{padding: widthScale(10)}}>
					{evaluates.slice(0, 5).map(item => {
						return <ReviewAndRating key={generateRandomId()} item={item} />;
					})}
					{!evaluates.length && <CustomText color={colors.grayLine} style={{textAlign: 'center'}} text={text.noevulate} />}
				</View>

				<View style={{marginVertical: heightScale(20)}}>
					<CustomText text={text.suggestions} font={FONT_FAMILY.BOLD} />

					<FlatList
						showsHorizontalScrollIndicator={false}
						horizontal
						renderItem={({item, index}) => (
							<TouchableOpacity
								style={{
									flexDirection: 'row',
									marginVertical: heightScale(5),
									alignItems: 'center',
									marginRight: widthScale(20),
									paddingVertical: heightScale(10),
								}}
								onPress={() => onPressViewInfoServicer(item.id)}
								key={generateRandomId()}>
								<Image style={styles.avatarComment} source={{uri: item?.avatar || ''}} />
								<View style={{marginLeft: widthScale(10)}}>
									<CustomText text={item?.name} font={FONT_FAMILY.BOLD} />
									<CustomText text={item?.phone} />
								</View>
							</TouchableOpacity>
						)}
						data={servicer}
					/>
				</View>
			</ScrollView>
			{userInfo?.type === TYPE_USER.USER && (
				<View style={{flexDirection: 'row', justifyContent: 'center', paddingVertical: heightScale(10)}}>
					{/* <CustomButton style={{width: WIDTH / 2.5}} text="THÔNG TIN THỢ" onPress={onPressViewInfoServicer} /> */}
					<View style={{width: widthScale(15)}} />
					<CustomButton style={{width: WIDTH / 2.5}} text={text.booking} onPress={onPressBooking} />
				</View>
			)}
		</FixedContainer>
	);
};

export default DetailService;
const styles = StyleSheet.create({
	view: {
		paddingHorizontal: widthScale(20),
	},
	image: {
		width: widthScale(100),
		height: widthScale(100),
		borderRadius: 10,
	},
	viewTop: {
		flexDirection: 'row',
	},
	avatar: {
		width: widthScale(50),
		height: widthScale(50),
		borderRadius: 100,
	},
	avatarComment: {
		width: widthScale(40),
		height: widthScale(40),
		borderRadius: 100,
	},
	line: {
		height: heightScale(1),
		backgroundColor: colors.black,
		width: widthScale(200),
		marginVertical: heightScale(10),
		alignSelf: 'center',
	},
});
