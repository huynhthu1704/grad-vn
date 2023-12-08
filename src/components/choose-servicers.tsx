import React, {forwardRef, memo, Ref, useEffect, useImperativeHandle, useState} from 'react';
import {ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {FONT_FAMILY, TABLE, TYPE_USER} from '../constants/enum';
import {Category, UserProps} from '../constants/types';
import API from '../services/api';
import {colors} from '../styles/colors';
import {heightScale, widthScale} from '../styles/scaling-utils';
import {generateRandomId} from '../utils';
import CustomText from './custom-text';
import {ModalObject} from './sign-up/modal-choose-province';

interface Props {
	onPressChoose: (item: UserProps) => void;
}
const ChooseServicer = forwardRef((props: Props, ref: Ref<ModalObject>) => {
	const {onPressChoose} = props;

	const [visible, setVisible] = useState(false);

	const [data, setData] = useState<UserProps[]>([]);
	const [loading, setLoading] = useState(false);

	const show = () => {
		setVisible(true);
	};

	const hide = () => {
		setVisible(false);
	};

	useImperativeHandle(ref, () => ({show, hide}), []);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		setLoading(true);
		const result = (await API.get(`${TABLE.USERS}`, true)) as UserProps[];
		const servicers = result.filter(item => item.type == TYPE_USER.SERVICER);
		setData(servicers);
		setLoading(false);
	};

	return (
		<Modal statusBarTranslucent transparent onDismiss={hide} onRequestClose={hide} visible={visible}>
			<Pressable onPress={hide} style={styles.view}>
				<Pressable style={styles.content}>
					<CustomText font={FONT_FAMILY.BOLD} text={'Hãy chọn nhà cung cấp dịch vụ'} style={{alignSelf: 'center'}} />

					{loading ? (
						<View style={{marginTop: heightScale(50)}}>
							<ActivityIndicator />
						</View>
					) : (
						<ScrollView style={{paddingHorizontal: widthScale(20), marginTop: heightScale(20)}}>
							{data.map(item => (
								<TouchableOpacity
									onPress={() => {
										onPressChoose(item);
										hide();
									}}
									key={generateRandomId()}
									style={{
										paddingVertical: heightScale(10),
										backgroundColor: colors.gray,
										justifyContent: 'center',
										marginBottom: heightScale(10),
										paddingLeft: widthScale(10),
										borderRadius: 5,
									}}>
									<CustomText font={FONT_FAMILY.BOLD} text={item.name} />
								</TouchableOpacity>
							))}
						</ScrollView>
					)}
				</Pressable>
			</Pressable>
		</Modal>
	);
});

export default memo(ChooseServicer);
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
});
