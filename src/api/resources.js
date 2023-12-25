import axios from './xhr_libs/axios';
import { processResponse } from '.';

const getResourcesAPI = async (user_id, resource_type) => {
  return processResponse(await axios.get(`/${resource_type}/${user_id}`));
};

const getResourcesInRangeAPI = async (user_id, resource_type, range) => {
  const start = range.start.format('YYYY-MM-DD');
  const end = range.end.format('YYYY-MM-DD');
  return processResponse(
    await axios.get(`/${resource_type}/${user_id}`, { params: { start, end } })
  );
};

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

export {
  getResourcesAPI,
  getResourcesInRangeAPI,
  putResourceAPI,
  postResourceAPI,
  deleteResourceAPI,
};
