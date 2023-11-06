import { getCube } from "@/http/getCube.js";
import { MetaData } from "@/types/apiResponse.js";
import { RequestCubeBody } from "@/types/requestCubeBody.js";
import { getConfig } from "./getConfig.js";

export const createAndPopulateTable = async (
  requestBody: RequestCubeBody,
  metadata: MetaData
) => {
  const { rows, cols } = getConfig(requestBody, metadata);
  const data = await getCube(requestBody);
  const table = document.createElement("table");
  const rowValues = data!.rowValues;
  const columnValues = data!.columnValues;
  const metricValues = data!.metricValues;
  const fields: string[] = [];
  metadata.fields.forEach((elem) => (fields[elem.id] = elem.name));
  // Создаем заголовок таблицы
  let tableRow = table.insertRow();
  let cell: HTMLTableCellElement;

  // Пустая ячейка
  if (cols.length > 1 && rows.length) {
    const cell = tableRow.insertCell();
    cell.colSpan = rows.length;
    cell.rowSpan = cols.length - 1;
  }

  // макушка
  for (let i = 0; i < cols.length; i++) {
    if (i) tableRow = table.insertRow();
    // названия измерений
    if (i === cols.length - 1) {
      rows.forEach((row) => {
        cell = tableRow.insertCell();
        cell.textContent = row.name;
      });
    }
    cell = tableRow.insertCell();
    cell.textContent = cols[i].name;
    // данные колонок
    for (let j = 0; j < columnValues.length; j++) {
      cell = tableRow.insertCell();
      cell.textContent = columnValues[j][i];
    }
  }
  // тоже макушка
  if (!cols.length) {
    rows.forEach((row) => {
      cell = tableRow.insertCell();
      cell.textContent = row.name;
    });
    metricValues.forEach((mv) => {
      cell = tableRow.insertCell();
      cell.textContent = mv.aggregationType + "(" + fields[mv.fieldId] + ")";
    });
  }

  // данные
  // индекс строки
  for (
    let i = 0;
    i < (rowValues.length || 1) * (metricValues.length || 1);
    i++
  ) {
    // название ряда
    tableRow = table.insertRow();
    if (!(i % (metricValues.length || 1))) {
      for (let j = 0; j < rows.length; j++) {
        cell = tableRow.insertCell();
        cell.rowSpan = metricValues.length;
        cell.textContent = rowValues[i / (metricValues.length || 1)][j];
      }
    }

    // название метрики
    if (cols.length) {
      if (metricValues.length) {
        cell = tableRow.insertCell();
        cell.textContent =
          metricValues[i % metricValues.length].aggregationType +
          "(" +
          fields[metricValues[i % metricValues.length].fieldId] +
          ")";
      }
    }

    // индекс колонки
    for (let j = 0; j < columnValues.length; j++) {
      cell = tableRow.insertCell();
      cell.textContent =
        metricValues[i % metricValues.length].values[j][
          (i - (i % metricValues.length)) / metricValues.length
        ];
    }
  }

  const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
  XLSX.writeFile(wb, "exported_data.xlsx");
};
