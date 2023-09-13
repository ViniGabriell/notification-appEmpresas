import { api } from "./api";

export const newNotification = async (token, data) => {
  const response = await api.post('/Integration/Save', {
    tid: 'VF9BUFBfRU1QUkVTQVNfTk9USUZJQ0FDT0VTOjIwODkxOA==',
    fid: 254,
    type: 1,
    data,
  }, {
    headers: {
      'auth': token,
    }
  });

  console.log(response.data)
  return response;
};

export const updateNotification = async (token, data, notificationId) => {
  return await api.post('/Integration/Save', {
    tid: 'VF9BUFBfRU1QUkVTQVNfTk9USUZJQ0FDT0VTOjIwODkxOA==',
    fid: 254,
    type: 1,
    data,
    key: {
      id: notificationId,
    },
  }, {
    headers: {
      'Accept': 'application/json',
      'auth': token,
    }
  });
};

export const getAllUnreadNotifications = async (token, userId) => {
  const { data } = await api.post('/Integration/Query', {
    qid: 'NOTIFICACOES:GET_ALL_UNREAD_NOTIFICATION_EMPRESAS',
    conditions: [{
      "filterid": "FK_USUARIO",
      "values": userId
    }]
  }, {
    headers: {
      'Accept': 'application/json',
      'auth': token,
    },

  });

  return data.list || [];
};
