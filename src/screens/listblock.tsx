import React, {useEffect, useState} from 'react';
import {FlatList, Image, Modal, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {ICONS, IMAGES} from '../assets/image-paths';
import CustomButton from '../components/custom-button';
import CustomHeader from '../components/custom-header';
import CustomText from '../components/custom-text';
import FixedContainer from '../components/fixed-container';
import Spinner from '../components/spinner';
import {TABLE} from '../constants/enum';
import {ServicerBlockUser} from '../constants/types';
import {useLanguage} from '../hooks/useLanguage';
import {RootStackScreenProps} from '../navigator/stacks';
import API from '../services/api';
import {useAppSelector} from '../stores/store/storeHooks';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';
import {AlertYesNo, generateRandomId, showMessage} from '../utils';

const Listblock = (props: RootStackScreenProps<'Listblock'>) => {
	const text = useLanguage().Listblock;
	const {navigation} = props;

	const [showBlock, setShowBlock] = useState(false);
	const phoneRegex = /(0)+([0-9]{9})\b/;
	const [phone, setPhone] = useState('');
	const [refreshing, setRefreshing] = useState(false);

	const [data, setData] = useState<ServicerBlockUser[]>([]);
	const userInfo = useAppSelector(state => state.userInfoReducer.userInfo);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		onRefresh();
	}, []);

	const onRefresh = () => {
		setRefreshing(true);
		API.get(`${TABLE.SERVICE_BLOCK_USER}`, true)
			.then((res: ServicerBlockUser[]) => {
				const arr = [];
				for (let i = 0; i < res.length; i++) {
					res[i].idServicer === userInfo?.id && arr.push(res[i]);
				}
				setData(arr);
			})
			.finally(() => setRefreshing(false));
	};

	const handleAddBlock = () => {
		setError('');
		if (!phone.trim()) {
			setError(text.enterPhoneNumber);
			return showMessage(text.enterPhoneNumber);
		} else if (phoneRegex.test(phone) == false) {
			setError(text.invalidPhoneNumber);
			return showMessage(text.invalidPhoneNumber);
		} else {
			setShowBlock(false);
			Spinner.show();
			API.post(`${TABLE.SERVICE_BLOCK_USER}`, {idServicer: userInfo?.id, phone: phone})
				.then(() => {
					showMessage(text.blockSuccess);
					onRefresh();
					setPhone('');
				})
				.catch(error => {
					console.error('Error posting data:', error);
				})
				.finally(() => Spinner.hide());
		}
	};

	const deleteBlock = (id: string) => {
		AlertYesNo(undefined, text.confirmDelete, () => {
			Spinner.show();
			API.put(`${TABLE.SERVICE_BLOCK_USER}/${id}`, {})
				.then(() => {
					showMessage(text.deleteSuccess);
					onRefresh();
				})
				.finally(() => Spinner.hide());
		});
	};

	return (
		<FixedContainer>
			<CustomHeader
				title={text.title}
				rightContent={
					<TouchableOpacity onPress={() => setShowBlock(true)}>
						<Image style={{width: widthScale(25), height: widthScale(25)}} source={ICONS.add} />
					</TouchableOpacity>
				}
			/>

			<FlatList
				onRefresh={onRefresh}
				refreshing={refreshing}
				contentContainerStyle={{paddingHorizontal: widthScale(30)}}
				renderItem={({item}) => (
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginBottom: heightScale(10),
							paddingVertical: heightScale(10),
						}}>
						<Image source={IMAGES.LOGO} style={{width: widthScale(30), height: widthScale(30)}} />
						<CustomText text={item.phone} />
						<TouchableOpacity onPress={() => deleteBlock(item.id)}>
							<Image source={ICONS.delete} style={{width: widthScale(30), height: widthScale(30)}} />
						</TouchableOpacity>
					</View>
				)}
				keyExtractor={generateRandomId}
				data={data}
			/>
			<Modal
				statusBarTranslucent
				onDismiss={() => setShowBlock(false)}
				onRequestClose={() => setShowBlock(false)}
				transparent
				animationType="fade"
				visible={showBlock}>
				<View style={{backgroundColor: colors.backgroundModal, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
					<View
						style={{
							width: widthScale(300),
							height: heightScale(160),
							backgroundColor: colors.white,
							borderRadius: 8,
							padding: widthScale(10),
							justifyContent: 'space-between',
						}}>
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<CustomText text={'SDT:'} />
							<TextInput
								keyboardType="numeric"
								onChangeText={setPhone}
								value={phone}
								style={{
									borderRadius: 5,
									borderWidth: 1,
									borderColor: colors.black,
									padding: 0,
									height: heightScale(40),
									flex: 1,
									marginLeft: widthScale(10),
									paddingHorizontal: 10,
									color: colors.black,
								}}
							/>
						</View>

						<CustomButton onPress={handleAddBlock} style={{width: widthScale(100), alignSelf: 'center'}} text={text.block} />
					</View>
				</View>
			</Modal>
		</FixedContainer>
	);
};

export default Listblock;

const styles = StyleSheet.create({});
