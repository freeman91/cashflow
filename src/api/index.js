import axios from './xhr_libs/axios';

export const processResponse = (response) => {
  if (response?.status === 200) {
    return response?.data?.result;
  }
};

export const getUserAPI = async (userId) => {
  return processResponse(await axios.get(`/users/${userId}`));
};

export const putUserAPI = async (user) => {
  return processResponse(await axios.put(`/users/${user.user_id}`, user));
};

export const saveNetworthAPI = async (networth) => {
  return processResponse(await axios.post('/cronjobs/networth_snapshot'));
};

export * from './optionLists';
export * from './resources';
