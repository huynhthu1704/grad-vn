import moment from 'moment';

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve as any, ms));

export const convertDateTime = (dateTime: Date) => {
	return moment(dateTime).utcOffset('+07:00').format('hh:mm - DD/MM/yyyy');
};
