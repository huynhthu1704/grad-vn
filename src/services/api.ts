import axios from 'axios';
import {BASE_URL} from '../constants/constants';
import {parseObjectToArray} from '../utils';
import {logAPI} from '../utils/logger';
import {TABLE} from '../constants/enum';
const initializeAxios = () => axios.create({baseURL: BASE_URL, timeout: 10000, validateStatus: () => true});

const API_AXIOS = initializeAxios();

API_AXIOS.interceptors.response.use(response => response.data);

const API = {
	get: async (url: string, isParseArray?: boolean, isNoLogAPI?: boolean) => {
		try {
			!isNoLogAPI && logAPI('GET', url);
			const data = await API_AXIOS.get(url + '.json');
			return (isParseArray ? parseObjectToArray(data) : data) as any;
		} catch (error) {
			console.error(error);
			return (isParseArray ? [] : undefined) as any;
		}
	},

	post: async (url: string, data?: any, isParseArray?: boolean, isNoLogAPI?: boolean) => {
		try {
			!isNoLogAPI && logAPI('POST', url, data);
			const res = await API_AXIOS.post(url + '.json', data);
			return (isParseArray ? parseObjectToArray(res) : res) as any;
		} catch (error) {
			console.error(error);
			return (isParseArray ? [] : undefined) as any;
		}
	},

	put: async (url: string, data?: any, isParseArray?: boolean, isNoLogAPI?: boolean) => {
		try {
			!isNoLogAPI && logAPI('PUT', url, data);
			const res = await API_AXIOS.put(url + '.json', data);
			return (isParseArray ? parseObjectToArray(res) : res) as any;
		} catch (error) {
			console.error(error);
			return (isParseArray ? [] : undefined) as any;
		}
	},
	getDataFromMultipleTables: async <T extends TABLE>(arrTable: T[]): Promise<Record<T, any>> => {
		try {
			console.log('\nURL -> ' + `\x1b[32;1m${'GET'}\x1b[0m : ` + `\x1b[34;1m${''}${arrTable}\x1b[0m\n`);
			const res = (await API_AXIOS.get('.json')) as any;
			const data: Record<T, {}> = {} as Record<T, {}>;

			for (let i = 0; i < arrTable.length; i++) {
				data[arrTable[i]] = res?.[arrTable[i]];
			}

			return data;
		} catch (error) {
			return {} as any;
		}
	},
};

export default API;
