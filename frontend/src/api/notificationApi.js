import api from './axiosInstance';

export const getNotifications = () =>
  api.get('/api/notifications');

export const getUnreadCount = () =>
  api.get('/api/notifications/unread-count');

export const createNotification = (data) =>
  api.post('/api/notifications', data);

export const markAllRead = () =>
  api.put('/api/notifications/mark-read');
