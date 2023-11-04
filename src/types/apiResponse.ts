export type MetaDataField = {
  id: number;
  type: string;
  name: string;
  description: string;
  ordinal: number;
  visible: boolean;
};

export type MetaData = {
  id: number;
  totalRows: number;
  fields: MetaDataField[];
};

export type MetricValue = {
  fieldId: number;
  aggregationType: string;
  values: string[][];
  dataType: string;
}

export type CubeData = {
  columnValues: string[][];
  rowValues: string[][];
  metricValues: MetricValue[];
  totalColumns: number;
  totalRows: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
