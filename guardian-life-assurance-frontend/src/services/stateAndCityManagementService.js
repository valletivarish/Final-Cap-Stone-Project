import axios from "axios";
import { handleApiError } from "../utils/helpers/apiErrorHandler";

export const getStateCount = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/guardian-life-assurance/states/count"
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
