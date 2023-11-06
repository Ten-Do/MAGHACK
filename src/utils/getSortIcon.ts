export const getSortIcon = (order?: string) => {
  if (order === "Ascending") return "icons/sort_down.svg";
  if (order) return "icons/sort_up.svg";
  return "icons/sort.svg";
};
