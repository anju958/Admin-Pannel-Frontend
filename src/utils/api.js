import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function fetchMessages(userA, userB) {
  const res = await axios.get(`${API_URL}/api/chat/messages`, {
    params: { user1: userA, user2: userB },
  });
  return res.data; // [{senderId, receiverId, message, timestamp, read}]
}

export async function sendMessageREST(body) {
  const res = await axios.post(`${API_URL}/api/chat/send`, body);
  return res.data;
}

export async function markAsReadAPI(userA, userB) {
  const res = await axios.post(`${API_URL}/api/chat/mark-read`, {
    user1: userA,
    user2: userB,
  });
  return res.data;
}

export async function fetchAllChatsForAdmin() {
  const res = await axios.get(`${API_URL}/api/chat/all`);
  return res.data;
}
