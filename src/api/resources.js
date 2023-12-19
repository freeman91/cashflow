import axios from './xhr_libs/axios';
import { processResponse } from '.';

const putResourceAPI = async (resource) => {
  const id = resource[`${resource._type}_id`];
  return processResponse(
    await axios.put(`/${resource._type}s/${resource.user_id}/${id}`, resource)
  );
};

const postResourceAPI = async (user_id, resource) => {
  return processResponse(
    await axios.post(`/${resource._type}s/${user_id}`, resource)
  );
};

const deleteResourceAPI = async (user_id, type, resource_id) => {
  return processResponse(
    await axios.delete(`/${type}s/${user_id}/${resource_id}`)
  );
};

export { putResourceAPI, postResourceAPI, deleteResourceAPI };
