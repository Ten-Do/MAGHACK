import { FilterType } from "@/types/requestCubeBody.js";

export const FILTERS: FilterType[] = [
  "EMPTY",
  "IN_LIST",
  "CONTAINS_CS",
  "CONTAINS_CI",
  "EQUALS",
  "GREATER",
  "LESSER",
  "GREATER_OR_EQUALS",
  "LESSER_OR_EQUALS",
  "BETWEEN",
  "BLANK",
];

export const FILTERS_DESCRIPTIONS: Record<
  FilterType,
  { args: number; description: string }
> = {
  EMPTY: {
    args: 0,
    description:
      "Проверяет, является ли значение пустым, то есть равным null, undefined или пустой строкой.",
  },
  IN_LIST: {
    args: -1,
    description: "Проверяет, находится ли значение в списке заданных значений.",
  },
  CONTAINS_CS: {
    args: -1,
    description:
      "Проверяет, содержит ли значение хотя бы одно из заданных подстрок (регистр учитывается).",
  },
  CONTAINS_CI: {
    args: -1,
    description:
      "Проверяет, содержит ли значение хотя бы одно из заданных подстрок (регистр не учитывается).",
  },
  EQUALS: {
    args: 1,
    description: "Проверяет, равно ли значение заданному значению.",
  },
  GREATER: {
    args: 1,
    description: "Проверяет, больше ли значение заданного значения.",
  },
  LESSER: {
    args: 1,
    description: "Проверяет, меньше ли значение заданного значения.",
  },
  GREATER_OR_EQUALS: {
    args: 1,
    description: "Проверяет, больше или равно ли значение заданному значению.",
  },
  LESSER_OR_EQUALS: {
    args: 1,
    description: "Проверяет, меньше или равно ли значение заданному значению.",
  },
  BETWEEN: {
    args: 2,
    description:
      "Проверяет, находится ли значение между двумя заданными значениями (включительно).",
  },
  BLANK: {
    args: 0,
    description:
      "Проверяет, является ли значение пустым, то есть равным null или undefined.",
  },
};
