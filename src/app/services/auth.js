import { api } from "./api";

export const login = async (username, password) => {
  const { data } = await api.post('/Security/login',
    {
      username,
      password,
      loginSource: 1
    }, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  if (data?.data?.auth_ticket) {
    return data.data.auth_ticket;
  }

  return null;
};
