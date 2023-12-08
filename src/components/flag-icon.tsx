import React, {memo} from 'react';
import {Image, ImageSourcePropType, StyleSheet} from 'react-native';
import {heightScale, widthScale} from '../styles/scaling-utils';

const FlagIcon = ({icon}: {icon: ImageSourcePropType}) => {
	return <Image source={icon} style={styles.icon} />;
};

export default memo(FlagIcon);
const styles = StyleSheet.create({
	icon: {width: widthScale(30), height: heightScale(25)},
});
