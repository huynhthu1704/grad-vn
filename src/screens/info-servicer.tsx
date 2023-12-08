import React, {useEffect, useState} from 'react';
import {FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import CustomHeader from '../components/custom-header';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import CustomScrollHorizontal from '../components/home/custom-scroll-horizontal';
import LoadingScreen from '../components/loading-screen';
import Star from '../components/star';
import {FONT_FAMILY, TABLE} from '../constants/enum';
import {EvaluateProps, ServiceProps, UserProps} from '../constants/types';
import {useLanguage} from '../hooks/useLanguage';
import {ROUTE_KEY} from '../navigator/routers';
import {RootStackScreenProps} from '../navigator/stacks';
import API from '../services/api';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';
import {generateRandomId, getServiceFromID} from '../utils';
import {ReviewAndRating} from './all-review';

const InfoServicer = (props: RootStackScreenProps<'InfoServicer'>) => {
	const text = useLanguage().InfoServicer;
	const {navigation, route} = props;

	const idServicer = route.params.idServicer;

	const [loading, setLoading] = useState(false);

	const [data, setData] = useState<UserProps>();

	const [service, setService] = useState<ServiceProps[]>([]);

	const [evaluates, setEvaluates] = useState<EvaluateProps[]>([]);

	useEffect(() => {
		setLoading(true);
		getData();
		getService();
	}, [idServicer]);

	const getData = () => {
		console.log('Loading: ' + loading);
		API.get(`${TABLE.USERS}/${idServicer}`).then(res => {
			setData(res as any);
		});
	};

	const getService = async () => {
		console.log('Loading: ' + loading);

		await getServiceFromID(idServicer)
			.then(res => {
				console.log('evaluate' + JSON.stringify(res));
				for (let i = 0; i < res.length; i++) {
					if (res[i].evaluate) {
						const evaluateList: EvaluateProps[] = res[i].evaluate;
						if (evaluateList !== undefined && evaluateList.length > 0) {
							for (let j = 0; j < evaluateList.length; j++) {
								evaluates.push(evaluateList[j]);
							}
						}
						setService(res);
						setEvaluates([...evaluateList]);
						// setLoading(false);
					}
				}
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<FixedContainer>
			<CustomHeader title={text.title} />
			<ScrollView style={styles.view}>
				{loading && <LoadingScreen />}
				{!loading && (
					<View>
						<Image style={styles.avatar} source={{uri: data?.avatar || ''}} />
						<CustomText font={FONT_FAMILY.BOLD} text={data?.name} style={{textAlign: 'center'}} />
						<CustomText text={data?.phone} style={{textAlign: 'center'}} />

						<CustomText font={FONT_FAMILY.BOLD} text={text.all} style={{marginTop: heightScale(20)}} />
						{!service.length && <CustomText color={colors.grayLine} style={{textAlign: 'center'}} text={text.noservicer} />}
						{service.length > 0 && (
							<CustomScrollHorizontal>
								<FlatList
									scrollEnabled={false}
									keyExtractor={generateRandomId}
									horizontal
									showsHorizontalScrollIndicator={false}
									renderItem={({item}) => (
										<TouchableOpacity
											onPress={() => navigation.navigate(ROUTE_KEY.ServiceDetail, {serviceData: item})}
											style={{
												width: widthScale(150),
												height: heightScale(200),
												marginVertical: heightScale(10),
												marginRight: widthScale(20),
												borderRadius: 10,
											}}>
											<Image
												style={{width: '100%', height: '60%', alignSelf: 'center', marginTop: widthScale(20)}}
												source={{uri: item.image}}
											/>
											<View style={{flex: 1, padding: widthScale(10)}}>
												<CustomText text={item.name} />
												<Star star={item?.star} />
											</View>
										</TouchableOpacity>
									)}
									data={service}
								/>
							</CustomScrollHorizontal>
						)}

						<CustomText font={FONT_FAMILY.BOLD} text={text.allevulate} style={{marginTop: heightScale(20)}} />
						<View style={{padding: widthScale(10)}}>
							{evaluates.map(item => {
								return <ReviewAndRating key={generateRandomId()} item={item} />;
							})}
							{!evaluates.length && <CustomText color={colors.grayLine} style={{textAlign: 'center'}} text={text.noevulate} />}
						</View>
					</View>
				)}
			</ScrollView>
		</FixedContainer>
	);
};

export default InfoServicer;
const styles = StyleSheet.create({
	avatar: {
		width: widthScale(100),
		height: widthScale(100),
		borderRadius: 100,
		alignSelf: 'center',
		marginTop: heightScale(30),
	},
	view: {
		paddingHorizontal: widthScale(20),
	},
	avatarComment: {
		width: widthScale(40),
		height: widthScale(40),
		borderRadius: 100,
		backgroundColor: 'red',
	},
});
