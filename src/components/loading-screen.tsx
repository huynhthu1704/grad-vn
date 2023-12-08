import React, {memo} from 'react';
import {ActivityIndicator} from 'react-native';
import FixedContainer from './fixed-container';

const LoadingScreen = () => {
	return (
		<FixedContainer style={{justifyContent: 'center', alignItems: 'center'}}>
			<ActivityIndicator />
		</FixedContainer>
	);
};

export default memo(LoadingScreen);