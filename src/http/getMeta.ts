import { ApiResponse, MetaData } from "@/types/apiResponse.js";
import { BASE_CONFIG, ENDPOINTS } from "./conf.ts";

export const getMETA = async (): Promise<MetaData | null> => {
  return await fetch(ENDPOINTS.getMETA, BASE_CONFIG)
    .then((response) => response.json() as unknown as ApiResponse<MetaData>)
    .then((data) => {
      if (data.success) {
        return data.data;
      } else throw data.message;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};
