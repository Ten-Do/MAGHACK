type FieldType = "REPORT_FIELD";

export type AggregationType =
  | "COUNT"
  | "COUNT_DISTINCT"
  | "SUM"
  | "MAX"
  | "MIN"
  | "AVG";

export type FilterType =
  | "EMPTY"
  | "IN_LIST"
  | "CONTAINS_CS"
  | "CONTAINS_CI"
  | "EQUALS"
  | "GREATER"
  | "LESSER"
  | "GREATER_OR_EQUALS"
  | "LESSER_OR_EQUALS"
  | "BETWEEN"
  | "BLANK";

type LogicalOperationType = "AND" | "OR";

type SortOrder = "Ascending" | "Descending";

export interface Field {
  fieldId: number;
  fieldType: FieldType;
}

export interface Metric {
  field: Field;
  aggregationType: AggregationType;
}

interface Filter {
  metricId: number;
  filterType: FilterType;
  invertResult: boolean;
  rounding: number;
  values: string[];
}

interface FilterGroup {
  operationType: LogicalOperationType;
  invertResult: boolean;
  childGroups: string[];
  filters: Filter[];
}

interface MetricFilterGroup {
  operationType: LogicalOperationType;
  invertResult: boolean;
  childGroups: string[];
  filters: Filter[];
  allMetricIds?: number[];
}

interface Interval {
  from: number;
  count: number;
}

interface SortDefinition {
  order: SortOrder;
  tuple: string[];
  metricId: number;
}

export interface RequestCubeBody {
  columnFields: Field[];
  rowFields: Field[];
  metrics: Metric[];
  metricPlacement?: "COLUMNS" | "ROWS";
  filterGroup?: FilterGroup;
  metricFilterGroup: MetricFilterGroup;
  columnsInterval?: Interval;
  rowsInterval?: Interval;
  columnSort: SortDefinition[];
  rowSort: SortDefinition[];
  allFields?: Field[];
}
