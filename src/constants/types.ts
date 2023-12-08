import {NOTIFICATION_TYPE, TYPE_ORDER_SERVICE, TYPE_USER,LANGUAGE} from './enum';

export interface ImageProps {
	name: string;
	height?: number;
	width?: number;
	uri: string;
	type?: string;
}

export interface UserProps {
	id: string;
	name: string;
	address: string[];
	avatar: string;
	phone: string;
	tokenDevice: string;
	type: TYPE_USER;
	password: string;
	isBlocked?: boolean;
	CCCD?: {
		id: string;
		image: string;
	};
	receiveBooking?: boolean;
	isAccept?: boolean;
	dateRegister?: number;
	reasonBlock: string;
	language?: LANGUAGE;
}

export interface NotificationProps {
	id: string;
	title: string;
	body: string;
	time: number;
	isRead: boolean;
	data: {
		userId: string;
		status: string;
	};
}
export interface ServiceProps {
	id: string;
	name: string;
	category: string;
	servicer: string;
	description: string;
	image: string;
	categoryObject: {idCategoryService: string; name: string};
	servicerObject: UserProps;
	evaluate: EvaluateProps[];
	star: number;
	disable?: boolean;
}
export interface EvaluateProps {
	id: string;
	id_service: string;
	star: number;
	review: string;
	images: string[];
	user_id: string;
	userObject?: UserProps;
	content?: string;
}
export interface Category {
	id: string;
	name: string;
	uri: string;
	// image: string;
	// idCategoryService: string;
}
export interface AddressProps {
	id: string;
	name: string;
	phone: string;
	address: string;
}

export interface OrderProps {
	imageDone: any;
	isEvaluate: any;
	id: string;
	idService: string;
	idUser: string;
	time: number;
	status: TYPE_ORDER_SERVICE;
	serviceObject: ServiceProps;
	servicerObject: UserProps;
	images: string[];
	nameUser: string;
	address: string;
	phone: string;
	description: string;
	timeBooking: number;
	categoryObject: Category;
	userObject: UserProps;
	statusCancel: string;
}
export interface ServicerBlockUser {
	idServicer: string;
	phone: string;
	id: string;
}
export interface FAQType {
	id?: string;
	question: string;
	answer: string;
}
export interface PaymentProps {
	date: number;
	id: string;
	idServicer: string;
	image: string;
	servicerObject?: UserProps;
	isAccept?: boolean;
}
export interface PaymentServicer {
	idServicer: string;
	image: string;
	id: string;
	date: number;
	paymentTime: string;  //'10-2023'
	isAccept?: boolean;
}
export interface InfoPaymentAdmin {
	id: string;
	number: number;
	nameBank: string;
	name: string;
	content: string;
	image?: string;
}
export interface BankType {
	id: string;
	name: string;
	number: string;
	image?: string;
	nameBank: string;
	nameCard: string;
}
export interface Notification {}