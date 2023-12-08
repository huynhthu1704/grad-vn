import {NavigationContainer, NavigationContainerRef, NavigationState, useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import React, {useEffect, useRef, useState} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Spinner from './components/spinner';
import {RootStackScreensParams} from './navigator/params';
import Stacks from './navigator/stacks';
import store, {persistor} from './stores/store/store';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {CHANNEL_ID} from './constants/constants';
import {NotificationProps} from './constants/types';
import API from './services/api';
import {Linking} from 'react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {onDisplayNotification} from '..';
import {ROUTE_KEY} from './navigator/routers';
import {getServiceDetailFromID} from './utils';	
const App = () => {
	const navigationRef = useRef<NavigationContainerRef<RootStackScreensParams>>(null);

	useEffect(() => {
		messaging().onNotificationOpenedApp(remoteMessage => {
			console.log('Notification caused app to open from background state:', remoteMessage.notification);
		});

		messaging()
			.getInitialNotification()
			.then(remoteMessage => {
				if (remoteMessage) {
					console.log('Notification caused app to open from quit state:', remoteMessage.notification);
				}
			});
	}, []);

	useEffect(() => {
		const unsubscribe = messaging().onMessage(async remoteMessage => {
			console.log('Message handled in the foreground!');
			onDisplayNotification(remoteMessage);
		});
		return unsubscribe;
	}, []);

	const screenTracking = (state?: NavigationState) => {
		if (state) {
			const route = state?.routes[state.index];
			if (route.state) {
				screenTracking(route?.state as any);
				return;
			}
			console.log(`------> ${route?.name}`);
		}
	};

	useEffect(() => {
		notifee.createChannel({
			id: CHANNEL_ID,
			importance: AndroidImportance.HIGH,
			name: CHANNEL_ID,
			sound: 'custom_sound',
		});
	}, []);
	
	const prefixes = ['https://srm150851.page.link'];
	const linking = {
		prefixes,
		subscribe: (listener: any) => {
			try {
				const onReceiveURL = async ({url}: {url: string}) => {
					const idService = url?.split?.('?')?.[1]?.split?.('=')?.[1];

					if (idService) {
						if (navigationRef.current?.getCurrentRoute?.()?.name == ROUTE_KEY.ServiceDetail) {
							navigationRef.current.goBack();
						}
						const data = await getServiceDetailFromID(idService);
						navigationRef?.current?.navigate(ROUTE_KEY.ServiceDetail, {serviceData: data});
					}

					return listener(url);
				};
				const dynamicLinksListener = dynamicLinks().onLink((link: any) => {
					return onReceiveURL(link);
				});

				const sub = Linking.addEventListener('url', link => {
					if (link.url.startsWith('/link')) {
						return;
					}
					onReceiveURL(link);
				});

				return () => {
					dynamicLinksListener();
					sub.remove();
				};
			} catch (error) {}
		},
		getInitialURL: async () => {
			const dynamicLinkInitialURL = await dynamicLinks().getInitialLink();
			if (dynamicLinkInitialURL?.url) {
				return dynamicLinkInitialURL?.url;
			}
			const initialURL = await Linking.getInitialURL();
			if (!initialURL || initialURL.startsWith('/link')) {
				return;
			}
			return initialURL;
		},
	};
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<NavigationContainer ref={navigationRef} onStateChange={screenTracking}>
					<Stacks />
					<Spinner />
				</NavigationContainer>
			</PersistGate>
		</Provider>
	);
};

export default App;
