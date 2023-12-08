import {Dimensions, Platform} from 'react-native';
export const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');

export const BASE_URL = 'https://grad-project-e5ef6-default-rtdb.firebaseio.com/';
export const BASE_URL_MAP = 'https://maps.googleapis.com/maps/api/';
export const WEB_API_KEY = 'AIzaSyDSkMpCqba9WUuIWpNnLK6xKokVj1slryM';
export const YOUR_SERVER_KEY =
	'AAAAvNbnHFU:APA91bEPgKUjFyVWSwuUuol_ThvydAfrAaYsf1529OV_Ezum_R02kMRjuHKDE5JOYN8uhvac5ROYVwllsSB7itZShYNEt6pFYeskM3vG76vCKVqWDjV5eWSdZ9I0xIqBz3KsGKRxmxK-';
export const RAPID_API_KEY = '5736319ad5msh0367bbf360098e5p1345ebjsnbae5028d65bd';
export const API_GET_INFO_COORDINATE = (lat: number, long: number) =>
	`${BASE_URL_MAP}geocode/json?latlng=${lat},${long}&language=ja&key=${WEB_API_KEY}`;

export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';

export const baseWidth = 375;
export const baseHeight = 812;

export const CHANNEL_ID = 'SRM_MAIN';
export const CHANNEL_NAME = 'SRM MAIN';
