import api from './api';

const contactService = {
  async sendMessage(payload) {
    const { data } = await api.post('/contact', payload);
    return data;
  },
};

export default contactService;
