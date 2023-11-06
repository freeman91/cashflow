import axios from './xhr_libs/axios';

export const processResponse = (response) => {
  if (response?.status === 200) {
    return response?.data?.result;
  }
};

export const getUserAPI = async (userId) => {
  return processResponse(await axios.get(`/users/${userId}`));
};

export * from './optionLists';
