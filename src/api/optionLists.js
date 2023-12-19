import axios from './xhr_libs/axios';
import { processResponse } from '.';

const putOptionListAPI = async (optionList) => {
  return processResponse(
    await axios.put(
      `/option_lists/${optionList.user_id}/${optionList.option_type}`,
      optionList
    )
  );
};

const postOptionListAPI = async (user_id, optionList) => {
  return processResponse(
    await axios.post(
      `/option_lists/${user_id}/${optionList.option_type}`,
      optionList
    )
  );
};

export { putOptionListAPI, postOptionListAPI };
