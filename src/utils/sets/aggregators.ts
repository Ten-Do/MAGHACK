import { AggregationType } from "@/types/requestCubeBody.js";

export const AGGREGATORS: {
  allTypes: { [key in AggregationType]?: string };
  intTypes: { [key in AggregationType]?: string };
} = {
  allTypes: { COUNT: "Количество", COUNT_DISTINCT: "Количество уникальных" },
  intTypes: { SUM: "Сумма", MAX: "Максимум", MIN: "Минимум", AVG: "Среднее" },
};
