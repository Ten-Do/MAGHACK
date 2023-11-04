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
    .then((response) => response.json() as unknown as ApiResponse<CubeData>)
    .then((resJSON) => {
      if (resJSON.success) {
        return resJSON.data;
      } else throw resJSON.message;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};
