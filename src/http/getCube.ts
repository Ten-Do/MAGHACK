import { ApiResponse, CubeData } from "@/types/apiResponse.js";
import { RequestCubeBody } from "@/types/requestCubeBody.js";
import { BASE_CONFIG, ENDPOINTS } from "./conf.ts";

export const getCube = async (
  body: RequestCubeBody
): Promise<CubeData | null> => {
  return await fetch(ENDPOINTS.getOLAP, {
    ...BASE_CONFIG,
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.ok)
        return response.json() as unknown as ApiResponse<CubeData>;
      else throw response.status;
    })
    .then((resJSON) => {
      if (resJSON.success) {
        return resJSON.data;
      } else throw resJSON.message;
    });
};
