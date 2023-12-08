import axios from 'axios';
import {RAPID_API_KEY} from '../constants/constants';

export const translate = async (textToTranslate: string, targetLanguage: string) => {
	if (__DEV__) return `${textToTranslate}-${targetLanguage}` as string;

	const options = {
		method: 'POST',
		url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			'Accept-Encoding': 'application/gzip',
			'X-RapidAPI-Key': RAPID_API_KEY,
			'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com',
		},
		data: `q=${encodeURIComponent(textToTranslate)}&source=${''}&target=${targetLanguage}`,
	};
	try {
		const response = await axios.request(options);
		return (response?.data?.data?.translations?.[0]?.translatedText || textToTranslate) as string;
	} catch (error) {
		return textToTranslate as string;
	}
};
