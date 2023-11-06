/* eslint-disable no-case-declarations */
import { FilterType } from "@/types/requestCubeBody.js";

export const isValueValid = (
  checkType: FilterType,
  value: number | string,
  checkArgs: number[] | string[] = [],
  invert: boolean = false
): boolean => {
  const isTypeString = (input: unknown): boolean => typeof input === "string";
  const isTypeNumber = (input: unknown): boolean => typeof input === "number";

  switch (checkType) {
    case "EMPTY":
      const isEmpty = isTypeString(value) ? value.trim() === "" : false;
      return invert ? !isEmpty : isEmpty;
    case "IN_LIST":
      const isInList = checkArgs.includes(value);
      return invert ? !isInList : isInList;
    case "CONTAINS_CS":
      const containsCS = checkArgs.some(
        (item) =>
          isTypeString(value) && isTypeString(item) && value.includes(item)
      );
      return invert ? !containsCS : containsCS;
    case "CONTAINS_CI":
      const containsCI = checkArgs.some(
        (item) =>
          isTypeString(value) &&
          isTypeString(item) &&
          value.toLowerCase().includes(item.toLowerCase())
      );
      return invert ? !containsCI : containsCI;
    case "EQUALS":
      const equals = value === checkArgs[0];
      return invert ? !equals : equals;
    case "GREATER":
      const greater = isTypeNumber(value) && value > checkArgs[0];
      return invert ? !greater : greater;
    case "LESSER":
      const lesser = isTypeNumber(value) && value < checkArgs[0];
      return invert ? !lesser : lesser;
    case "GREATER_OR_EQUALS":
      const greaterOrEquals = isTypeNumber(value) && value >= checkArgs[0];
      return invert ? !greaterOrEquals : greaterOrEquals;
    case "LESSER_OR_EQUALS":
      const lesserOrEquals = isTypeNumber(value) && value <= checkArgs[0];
      return invert ? !lesserOrEquals : lesserOrEquals;
    case "BETWEEN":
      const [min, max] = checkArgs;
      const between = isTypeNumber(value) && value >= min && value <= max;
      return invert ? !between : between;
    case "BLANK":
      const isBlank = value === null || value === undefined;
      return invert ? !isBlank : isBlank;
  }
};
