import { MetaData, MetaDataField } from "@/types/apiResponse.js";
import { Field, RequestCubeBody } from "@/types/requestCubeBody.js";

// Function to find matching MetaDataFields
function findMatchingFields(
  requestFields: Field[],
  metaDataFields: MetaDataField[]
): MetaDataField[] {
  const matchingFields: MetaDataField[] = [];
  for (const requestField of requestFields) {
    const matchingField = metaDataFields.find(
      (metaDataField) => metaDataField.id === requestField.fieldId
    );
    if (matchingField) {
      matchingFields.push(matchingField);
    }
  }
  return matchingFields;
}

export const getConfig = (requestBody: RequestCubeBody, metadata: MetaData) => {
  // Initialize arrays to store the results
  const cols: MetaDataField[] = [];
  const rows: MetaDataField[] = [];
  // const metrics: MetaDataField[] = [];
  const free: MetaDataField[] = [];

  // Find matching fields for columnFields, rowFields, and metrics
  cols.push(...findMatchingFields(requestBody.columnFields, metadata.fields));
  rows.push(...findMatchingFields(requestBody.rowFields, metadata.fields));
  // metrics.push(
  //   ...findMatchingFields(
  //     requestBody.metrics.map((metric) => metric.field),
  //     metadata.fields
  //   )
  // );

  // Find free (non-matching) fields
  free.push(
    ...metadata.fields.filter((metaDataField) => {
      const isUsed =
        cols.some((col) => col.id === metaDataField.id) ||
        rows.some((row) => row.id === metaDataField.id);
      // metrics.some((metric) => metric.id === metaDataField.id);
      return !isUsed;
    })
  );
  return { cols, rows, /*metrics,*/ free };
};
