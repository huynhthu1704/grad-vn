import React from 'react';
import {ActivityIndicator, Modal, StatusBar, StyleSheet, View} from 'react-native';
import {colors} from '../styles/colors';
import {widthScale} from '../styles/scaling-utils';

interface State {
	visible: boolean;
}

export default class Spinner extends React.PureComponent<{}, State> {
	static instance: any;

	constructor(props: {}) {
		super(props);
		Spinner.instance = this;
		this.state = {
			visible: false,
		};
	}

	static show() {
		if (Spinner.instance) {
			!Spinner.instance.state.visible && Spinner.instance.setState({visible: true});
		}
	}

	static hide() {
		if (Spinner.instance) {
			Spinner.instance.setState({visible: false});
		}
	}

	render() {
		if (!this.state.visible) {
			return null;
		}
		return (
			<Modal onDismiss={() => {}} statusBarTranslucent animationType="fade" transparent visible={this.state.visible || false} style={styles.view}>
				<View style={styles.content}>
					<View style={styles.icon}>
						<ActivityIndicator size={'large'} animating={true} color={colors.white} />
					</View>
				</View>
			</Modal>
		);
	}
}
const styles = StyleSheet.create({
	view: {
		margin: 0,
		padding: 0,
		flex: 1,
		zIndex: 10000,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.backgroundModal,
	},
	icon: {
		width: widthScale(100),
		height: widthScale(100),
		backgroundColor: '#3c3939',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 15,
	},
});
