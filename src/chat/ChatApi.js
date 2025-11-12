

import axios from "axios";
import { API_URL } from "../config";

export const ChatApi = {
  async getChatUsers(role, token) {
    const res = await axios.get(`${API_URL}/api/chat/users?role=${role}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data.users || [];
  },
  async getMessages(params, token) {
    const res = await axios.get(`${API_URL}/api/chat/messages`, {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data.messages || [];
  },
  async markRead(body, token) {
    return axios.post(`${API_URL}/api/chat/mark-read`, body, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
  async sendMessage(body, token) {
    const res = await axios.post(`${API_URL}/api/chat/send`, body, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data.chat;
  },
};
