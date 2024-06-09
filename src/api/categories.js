import axios from './xhr_libs/axios';
import { processResponse } from '.';

const putCategoryAPI = async (item) => {
  return processResponse(
    await axios.put(`/categories/${item.user_id}/${item.category_type}`, item)
  );
};

export { putCategoryAPI };
