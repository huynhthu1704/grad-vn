import React, {memo, useEffect, useRef} from 'react';
import {Animated, ScrollView, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {colors} from '../../styles/colors';
import {heightScale} from '../../styles/scaling-utils';

interface Props {
	widthIndicator?: number;
	widthItemIndicator?: number;
	children: React.JSX.Element | any;
	style?: StyleProp<ViewStyle>;
}
const CustomScrollHorizontal = (props: Props) => {
	const {widthIndicator = 100, widthItemIndicator = 20, children, style} = props;

	const widthScrollViewRef = useRef(0); // width thật tế
	const widthScrollDisplay = useRef(0); // width hiển thị

	const scrollViewRef = useRef<any>(null);
	const scrollX = useRef(new Animated.Value(0)).current;
	const marginLeft = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		scrollX.addListener(({value}) => {
			const indicatorPosition = (value / (widthScrollViewRef.current - widthScrollDisplay.current)) * (widthIndicator - widthItemIndicator);
			Animated.timing(marginLeft, {toValue: indicatorPosition, duration: 0, useNativeDriver: false}).start();
		});

		return () => scrollX.removeAllListeners();
	}, [scrollX]);

	return (
		<View style={style}>
			<ScrollView
				onContentSizeChange={width => {
					widthScrollViewRef.current = width;
				}}
				ref={scrollViewRef}
				onLayout={e => {
					widthScrollDisplay.current = e.nativeEvent.layout.width;
				}}
				onScroll={event => {
					scrollX.setValue(event.nativeEvent.contentOffset.x);
				}}
				scrollEventThrottle={16}
				showsHorizontalScrollIndicator={false}
				horizontal={true}
				style={styles.view}>
				{children}
			</ScrollView>
			<Animated.View style={[styles.viewItemIndicator, {width: widthIndicator}]}>
				<Animated.View style={[styles.indicator, {marginLeft: marginLeft, width: widthItemIndicator}]} />
			</Animated.View>
		</View>
	);
};

export default memo(CustomScrollHorizontal);
const styles = StyleSheet.create({
	view: {
		marginBottom: heightScale(5),
	},
	viewItemIndicator: {
		height: 5,
		backgroundColor: colors.grayLine,
		alignSelf: 'center',
		borderRadius: 100,
	},
	indicator: {
		height: '100%',
		backgroundColor: '#8acef1',
		borderRadius: 100,
	},
});
