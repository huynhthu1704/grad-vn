import axios from 'axios';
import {YOUR_SERVER_KEY} from '../constants/constants';
import {Notification} from '@notifee/react-native';
import {NotificationProps, ServiceProps, UserProps} from '../constants/types';
import API from '../services/api';
import {NOTIFICATION_TYPE, TABLE} from '../constants/enum';
import moment from 'moment';

export const sendNotificationToDevices = async (token: string, title: string, body: string, data: Notification) => {
	try {
		const response = await axios.post(
			'https://fcm.googleapis.com/fcm/send',
			{
				to: token,
				notification: {
					title: title,
					body: body,
				},
				data,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `key=${YOUR_SERVER_KEY}`,
				},
			},
		);

		console.log('Notification sent:', response.data);
	} catch (error) {
		console.error('Error sending notification:', error);
	}
};
const getTokenDeviceFromID = async (id: string) => {
	const servicer = await API.get(`${TABLE.USERS}/${id}`);
	return servicer?.tokenDevice as string | undefined;
};

// + có 1 giao dịch cần được xác thực
export const pushNotificationAdminNewPayment = async (idServicer: string, idPayment: string, nameServicer: string) => {
	const idAdmin = 'admin';
	const token = await getTokenDeviceFromID(idAdmin);
	const data = {
		data: {idOrder: idPayment},
		idUser: idAdmin,
		status: NOTIFICATION_TYPE.NEW_PAYMENT,
	};
	const title = 'Có giao dịch cần được xác nhận!';
	const body = `Bạn có 1 giao dịch cần được xác nhận tên ${nameServicer}`;

	API.post(`${TABLE.NOTIFICATION}/${idAdmin}`, {data, title, body, time: new Date().valueOf()});
	token && sendNotificationToDevices(token, title, body, data);
};



const saveNotification = async (userId: string, data: NotificationProps) => {
	// save notification
	await API.post(`${TABLE.NOTIFICATION}/${userId}`, data).then(async res => {
		console.log('res noti: ' + JSON.stringify(res));
		const id = res.name;
		data.id = id;
		await API.put(`${TABLE.NOTIFICATION}/${userId}/${id}`, data);
	});
};

// Push notification cho servicer khi người dùng đặt hàng thành công.
export const pushNotificationToServiceNewOrder = async (serviceId: string, userId: string, orderId: string) => {
	console.log('PN cho đơn hàng thành công');

	const service = (await API.get(`${TABLE.SERVICE}/${serviceId}`, false)) as ServiceProps;

	const servicer = (await API.get(`${TABLE.USERS}/${service.servicer}`, false)) as UserProps;

	const user = (await API.get(`${TABLE.USERS}/${userId}`, false)) as UserProps;

	const servicerToken = servicer.tokenDevice;
	console.log('service: ' + JSON.stringify(service) + 'servicerToken: ' + servicerToken);

	const title = `Có đơn đặt hàng mới từ người dùng ${user?.name}`;
	const time = new Date().getTime();
	const body = `Đơn hàng ${service.name} đã được đặt. Xác nhận ngay`;

	const data: NotificationProps = {
		id: '',
		title,
		body,
		time,
		isRead: false,
		data: {
			userId: serviceId,
			status: '',
		},
	};
	sendNotificationToDevices(servicerToken, title, body, data);

	saveNotification(servicer.id, data);
};

// Push notification cho servicer khi user huỷ đơn đặt hàng.
export const pushNotificationToServiceCancelOrder = async (serviceId: string, userId: string, orderId: string) => {
	console.log('PN cho đơn hàng bị hủy bởi user');

	const service = (await API.get(`${TABLE.SERVICE}/${serviceId}`, false)) as ServiceProps;

	const servicer = (await API.get(`${TABLE.USERS}/${service.servicer}`, false)) as UserProps;

	const servicerToken = servicer.tokenDevice;
	console.log('user: ' + JSON.stringify(servicer) + 'userToken: ' + servicerToken);

	const title = `Đơn hàng ID ${orderId} đã bị hủy`;
	const time = new Date().getTime();
	const body = `Đơn hàng đã bị hủy bởi người đặt. Vui lòng kiểm tra.`;

	const data: NotificationProps = {
		id: '',
		title,
		body,
		time,
		isRead: false,
		data: {
			userId,
			status: '',
		},
	};
	sendNotificationToDevices(servicerToken, title, body, data);

	saveNotification(servicer.id, data);
};

// Push notification cho user khi service provider huỷ đơn đặt hàng.
export const pushNotificationToUserCancelOrder = async (serviceId: string, userId: string, orderId: string) => {
	console.log('PN cho đơn hàng bị hủy bởi nhà cung cấp');

	const user = (await API.get(`${TABLE.USERS}/${userId}`, false)) as UserProps;

	const userToken = user.tokenDevice;
	console.log('user: ' + JSON.stringify(user) + 'userToken: ' + userToken);

	const title = `Đơn hàng ID ${orderId} đã bị hủy`;
	const time = new Date().getTime();
	const body = `Đơn hàng đã bị hủy bởi người cung cấp dịch vụ. Vui lòng kiểm tra.`;

	const data: NotificationProps = {
		id: '',
		title,
		body,
		time,
		isRead: false,
		data: {
			userId,
			status: '',
		},
	};
	sendNotificationToDevices(userToken, title, body, data);

	saveNotification(user.id, data);
};
// Push notification cho user khi service provider huỷ đơn đặt hàng.
export const pushNotificationToUserConfirmOrder = async (serviceId: string, userId: string, orderId: string) => {
	console.log('PN cho đơn hàng xác nhận bởi nhà cung cấp');

	const user = (await API.get(`${TABLE.USERS}/${userId}`, false)) as UserProps;

	const userToken = user.tokenDevice;
	console.log('user: ' + JSON.stringify(user) + 'userToken: ' + userToken);

	const title = `Đơn hàng ID ${orderId} đã được xác nhận`;
	const time = new Date().getTime();
	const body = `Đơn hàng đã được xác nhận bởi người cung cấp dịch vụ. Thời gian thực tế để hoàn thành sửa chữa dịch vụ sẽ tùy thuộc vào tình trạng hư hại của thiết bị`;

	const data: NotificationProps = {
		id: '',
		title,
		body,
		time,
		isRead: false,
		data: {
			userId,
			status: '',
		},
	};
	sendNotificationToDevices(userToken, title, body, data);

	saveNotification(userId, data);
};
// Bắn thông báo cho Admin khi có 1 tài khoản mới cần được duyệt
export const pushNotificationAdminNewServicer = async (idServicer: string) => {
	const idAdmin = 'admin';
	const token = await getTokenDeviceFromID(idAdmin);
	const nameServicer = await API.get(`${TABLE.USERS}/${idServicer}`).then(({name}) => name);

	const title = 'Có tài khoản dịch vụ cần được duyệt!';
	const body = `Bạn có 1 tài khoản dịch vụ cần được duyệt ${nameServicer}`;

	const data = {
		data: {idOrder: idServicer},
		idUser: idAdmin,
		status: NOTIFICATION_TYPE.NEW_SERVICER,
	};
	console.log('Tài khoản SP mới!')
	token && sendNotificationToDevices(token, title, body, data);
};
