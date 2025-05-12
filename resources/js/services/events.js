import api from './api';

// Exemplo de funções para consumir a API de eventos

export const getEvents = () => api.get('/events');
export const getEvent = (uuid) => api.get(`/events/${uuid}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (uuid, data) => api.put(`/events/${uuid}`, data);
export const deleteEvent = (uuid) => api.delete(`/events/${uuid}`);
export const subscribeEvent = (uuid) => api.post(`/events/${uuid}/subscribe`);
export const unsubscribeEvent = (uuid) => api.delete(`/events/${uuid}/unsubscribe`);
export const getMyEvents = () => api.get('/my-events');
