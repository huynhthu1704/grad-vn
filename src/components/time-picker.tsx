import React, {forwardRef, memo, Ref, useImperativeHandle, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {colors} from '../styles/colors';
import {widthScale} from '../styles/scaling-utils';

export interface ModalRefObject {
	show: (data?: any) => void;
	hide: () => void;
}
interface Props {
	onConfirm?: (date: Date, _: boolean) => void;
	title: string;
	date?: Date;
	minimumDate?: Date;
	maximumDate?: Date;
}

const ModalTimePickerBooking = forwardRef(({onConfirm, title, date, minimumDate, maximumDate}: Props, ref: Ref<ModalRefObject>) => {
	const [showModal, setShowModal] = useState(false);
	const [isHour, setIsHour] = useState(true);

	useImperativeHandle(ref, () => ({show, hide}), []);

	const show = (_: boolean) => {
		setShowModal(true);
		setIsHour(!!_);
	};

	const hide = () => {
		setShowModal(false);
	};

	const onConfirmDate = (e: Date) => {
		hide();
		onConfirm?.(e, isHour);
	};

	return (
		<View style={styles.viewContent}>
			<StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
			<DatePicker
				title={title}
				theme={'light'}
				onConfirm={onConfirmDate}
				modal
				open={showModal}
				mode={isHour ? 'time' : 'date'}
				locale={'vi'}
				date={date || new Date()}
				cancelText={'HUỶ'}
				confirmText={'OK'}
				onCancel={hide}
				minimumDate={minimumDate}
				maximumDate={maximumDate || new Date(new Date().setDate(new Date().getDate() + 7))}
			/>
		</View>
	);
});
export default memo(ModalTimePickerBooking);
const styles = StyleSheet.create({
	view: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	viewContent: {
		flex: 1,
		paddingHorizontal: widthScale(50),
		justifyContent: 'center',
		alignItems: 'center',
	},
});
