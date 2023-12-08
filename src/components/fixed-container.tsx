import React, {memo} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {NativeSafeAreaViewProps, SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../styles/colors';

const FixedContainer: React.FC<NativeSafeAreaViewProps> = ({children, style, edges = ['bottom', 'left', 'right', 'top'], ...rest}) => {
	return (
		<SafeAreaView style={[styles.safeAreaView, style]} edges={edges} {...rest}>
			<StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
			{children}
		</SafeAreaView>
	);
};

export default memo(FixedContainer);
const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
		backgroundColor: colors.white,
	},
});
