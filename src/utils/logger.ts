import {consoleTransport, logger} from 'react-native-logs';
import {BASE_URL} from '../constants/constants';

function Logger(type: 'info' | 'debug' | 'error' | 'warn', message: any) {
	const configDefault = {
		levels: {debug: 0, info: 1, warn: 2, error: 3},
		severity: 'debug',
		transport: consoleTransport,
		transportOptions: {colors: {info: 'blueBright', warn: 'yellowBright', error: 'redBright'}},
		async: true,
		dateFormat: 'time',
		printLevel: true,
		printDate: true,
		enabled: true,
	};
	const log = logger.createLogger(configDefault);

	switch (type) {
		case 'info':
			return log.info(message);
		case 'debug':
			return log.debug(message);
		case 'error':
			return log.error(message);
		case 'warn':
			return log.warn(message);
	}
}

export const logAPI = (method: string, url: string, body?: Object) => {
	console.log('');
	console.log('URL -> ' + `\x1b[32;1m${method}\x1b[0m : ` + `\x1b[34;1m${BASE_URL}${url}.json\x1b[0m`);
	body && console.log('BODY -> ' + `\x1b[32;1m${JSON.stringify(body)}\x1b[0m`);
	console.log('');
};

export default Logger;
