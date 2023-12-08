import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import CustomHeader from '../components/custom-header';
import FixedContainer from '../components/fixed-container';
import {useLanguage} from '../hooks/useLanguage';

const Privacypolicy = () => {
	const text = useLanguage().PrivacyPolicy;
	return (
		<FixedContainer>
			<CustomHeader title={text.title} />
			<WebView
				source={{html: text.HTML}}
				startInLoadingState={true}
				renderLoading={() => (
					<View style={styles.loading}>
						<ActivityIndicator />
					</View>
				)}
			/>
		</FixedContainer>
	);
};

const styles = StyleSheet.create({
	loading: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Privacypolicy;
