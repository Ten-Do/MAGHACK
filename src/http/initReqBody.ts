import { RequestCubeBody } from "@/types/requestCubeBody.js";

export const InitReqBody: RequestCubeBody = JSON.parse(localStorage.getItem('backup')) || {
  columnFields: [],
  rowFields: [],
  metrics: [],
  columnsInterval: {
    from: 0,
    count: 100,
  },
  rowsInterval: {
    from: 0,
    count: 100,
  },
  filterGroup: {
    childGroups: [],
    filters: [],
    invertResult: false,
    operationType: "AND",
  },
  metricFilterGroup: {
    childGroups: [],
    filters: [],
    invertResult: false,
    operationType: "AND",
  },
  columnSort: [],
  rowSort: [],
};
