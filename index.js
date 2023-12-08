/**
 * @format
 */
import messaging from '@react-native-firebase/messaging';
import {AppRegistry} from 'react-native';
import App from './src';
import {name as appName} from './app.json';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {CHANNEL_ID, CHANNEL_NAME} from './src/constants/constants';

import NewRelic from 'newrelic-react-native-agent';
import * as appVersion from './package.json';
import {Platform} from 'react-native';

let appToken;

if (Platform.OS === 'ios') {
	appToken = 'AA8fc77683bcbce0208f4eedee995b5ce8559f719c-NRMA';
} else {
	appToken = 'AA4bb1cb576c5a38bc5dd2db9b650b349782325b74-NRMA';
}

const agentConfiguration = {
	//Android Specific
	// Optional:Enable or disable collection of event data.
	analyticsEventEnabled: true,

	// Optional:Enable or disable crash reporting.
	crashReportingEnabled: true,

	// Optional:Enable or disable interaction tracing. Trace instrumentation still occurs, but no traces are harvested. This will disable default and custom interactions.
	interactionTracingEnabled: true,

	// Optional:Enable or disable reporting successful HTTP requests to the MobileRequest event type.
	networkRequestEnabled: true,

	// Optional:Enable or disable reporting network and HTTP request errors to the MobileRequestError event type.
	networkErrorRequestEnabled: true,

	// Optional:Enable or disable capture of HTTP response bodies for HTTP error traces, and MobileRequestError events.
	httpResponseBodyCaptureEnabled: true,

	// Optional:Enable or disable agent logging.
	loggingEnabled: true,

	// Optional:Specifies the log level. Omit this field for the default log level.
	// Options include: ERROR (least verbose), WARNING, INFO, VERBOSE, AUDIT (most verbose).
	logLevel: NewRelic.LogLevel.INFO,

	// iOS Specific
	// Optional:Enable/Disable automatic instrumentation of WebViews
	webViewInstrumentation: true,

	// Optional:Set a specific collector address for sending data. Omit this field for default address.
	// collectorAddress: "",

	// Optional:Set a specific crash collector address for sending crashes. Omit this field for default address.
	// crashCollectorAddress: ""
};

export async function onDisplayNotification(remoteMessage: any) {
	// Request permissions (required for iOS)
	await notifee.requestPermission();

	// Create a channel (required for Android)
	const channelId = await notifee.createChannel({
		id: CHANNEL_ID,
		name: CHANNEL_NAME,
		vibration: true,
		sound: 'custom_sound',
		importance: AndroidImportance.HIGH,
	});

	// Display a notification
	await notifee.displayNotification({
		title: remoteMessage.notification.title,
		body: remoteMessage.notification.body,
		android: {
			importance: AndroidImportance.HIGH,
			sound: 'custom_sound',
			channelId: channelId,
			pressAction: {
				id: 'default',
			},
		},
	});
}

messaging().setBackgroundMessageHandler(async remoteMessage => {
	console.log('Message handled in the background!', remoteMessage);
	onDisplayNotification(remoteMessage);
});

NewRelic.startAgent(appToken, agentConfiguration);
NewRelic.setJSAppVersion(appVersion.version);
AppRegistry.registerComponent(appName, () => App);
