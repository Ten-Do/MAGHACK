import { CubeData, MetaData } from "@/types/apiResponse.js";
import { RequestCubeBody } from "@/types/requestCubeBody.js";
import { getConfig } from "@/utils/getConfig.js";
import { useState } from "react";
import { FilterField } from "../filter/filterField.js";
import { FilterModalContent } from "../filter/filterModalContent.js";
import { Modal } from "../modal/modal.js";
import styles from "./styles.module.css";

interface Props {
  reqBody: RequestCubeBody;
  meta: MetaData;
  setReqBody: React.Dispatch<React.SetStateAction<RequestCubeBody>>;
  data: CubeData;
}

export const Table: React.FC<Props> = ({ reqBody, meta, setReqBody, data }) => {
  const { rows, cols } = getConfig(reqBody, meta);
  const { columnValues, rowValues, metricValues } = data;
  const [split, setSplit] = useState(true);

  const fields: { [key: number]: string } = {};
  meta.fields.forEach((elem) => (fields[elem.id] = elem.name));

  const handleFilterChange = (
    id: number,
    text: string,
    invertResult: boolean
  ) => {
    setReqBody((curr) => {
      // Check if the filterGroup exists, and if not, create one
      if (!curr.filterGroup) {
        curr.filterGroup = {
          operationType: "AND",
          invertResult: false,
          childGroups: [],
          filters: [],
        };
      }

      // Find the filter with the matching fieldId and filterType
      const matchingFilterIndex = curr.filterGroup.filters.findIndex(
        (filter) =>
          filter.field.fieldId === id && filter.filterType === "CONTAINS_CI"
      );

      if (matchingFilterIndex !== -1) {
        // Update the values field of the existing filter
        curr.filterGroup.filters[matchingFilterIndex].values = [text];
        curr.filterGroup.filters[matchingFilterIndex].invertResult =
          invertResult;
      } else {
        // Create a new filter and add it to the filters array
        const newFilter = {
          field: {
            fieldId: id,
            fieldType: "REPORT_FIELD",
          },
          filterType: "CONTAINS_CI",
          invertResult: invertResult,
          rounding: 0,
          canRounding: false,
          values: [text],
        };

        curr.filterGroup.filters.push(newFilter);
      }
      return { ...curr };
    });
  };
  return (
    <div className={styles.table_container}>
      <button className="btn" onClick={() => setSplit((curr) => !curr)}>
        {split ? "Объединить " : "Разделить "}ячейки
      </button>
      <div className={styles.table}>
        <table>
          <tbody>
            {/* пустая ячейка */}
            {cols.length > 1 &&
              // rows.length > 0 &&
              cols.map((col, i) => (
                <tr>
                  {i === 0 && rows.length > 0 && (
                    <td colSpan={rows.length} rowSpan={cols.length - 1}></td>
                  )}
                  {i === cols.length - 1 &&
                    rows.map((row, j) => (
                      <td
                        className={styles.th + " " + styles.width200}
                        key={j + "mmc"}
                      >
                        {row.name}
                        <FilterField
                          setFilter={(
                            pattern: string,
                            invertResult: boolean
                          ) => {
                            handleFilterChange(row.id, pattern, invertResult);
                          }}
                        />
                      </td>
                    ))}
                  <td className={styles.th + " " + styles.width200}>
                    {col.name}
                    <FilterField
                      setFilter={(pattern: string, invertResult: boolean) => {
                        handleFilterChange(col.id, pattern, invertResult);
                      }}
                    />
                  </td>
                  {columnValues.map((colValue, j) => (
                    <td key={j + "ccv"} className={styles.th}>
                      {colValue[i]}
                    </td>
                  ))}
                </tr>
              ))}

            {/* макушка ?? */}
            {cols.length <= 1 &&
              cols.map((col, i) => (
                <tr key={i + "mr"}>
                  {i === cols.length - 1 &&
                    rows.map((row, j) => (
                      <td
                        key={j + "mc"}
                        className={styles.th + " " + styles.width200}
                      >
                        {row.name}
                        <FilterField
                          setFilter={(
                            pattern: string,
                            invertResult: boolean
                          ) => {
                            handleFilterChange(row.id, pattern, invertResult);
                          }}
                        />
                      </td>
                    ))}
                  <td className={styles.th + " " + styles.width200}>
                    {col.name}
                    <FilterField
                      setFilter={(pattern: string, invertResult: boolean) => {
                        handleFilterChange(col.id, pattern, invertResult);
                      }}
                    />
                  </td>
                  {columnValues.map((colValue, j) => (
                    <td key={j + "cv"} className={styles.th}>
                      {colValue[i]}
                    </td>
                  ))}
                </tr>
              ))}

            {!cols.length && (
              <tr>
                {rows.map((row, i) => (
                  <td
                    key={i + "rowmap"}
                    className={styles.th + " " + styles.width200}
                  >
                    {row.name}
                    <FilterField
                      setFilter={(pattern: string, invertResult: boolean) => {
                        handleFilterChange(row.id, pattern, invertResult);
                      }}
                    />
                  </td>
                ))}
                {metricValues.map((mv, i) => (
                  <td key={i + "metmap"}>{`${mv.aggregationType}(${
                    fields[mv.fieldId]
                  })`}</td>
                ))}
              </tr>
            )}

            {/* данные */}
            {metricValues.map((metric, i) => (
              <>
                {rowValues.length > 0 &&
                  rowValues.map((rowValue, rowInd) => (
                    <tr key={i + "rvm" + Math.random()}>
                      {((rowValues.length * i + rowInd) %
                        metricValues.length ===
                        0 ||
                        cols.length === 0) &&
                        rows.map((row, j) => (
                          <td
                            className={styles.th}
                            key={j + "rowname"}
                            rowSpan={
                              cols.length > 0 ? metricValues.length || 1 : 1
                            }
                          >
                            {rowValue[j]}
                          </td>
                        ))}

                      {cols.length > 0 ? (
                        <>
                          <td className={styles.th}>
                            {metric.aggregationType +
                              "(" +
                              fields[metric.fieldId] +
                              ")"}
                          </td>
                          {metric.values.map((mvcol) => (
                            <td key={mvcol[rowInd] + Math.random()}>
                              {mvcol[rowInd]}
                            </td>
                          ))}
                        </>
                      ) : (
                        metricValues.map((mmvv) => (
                          <td>{mmvv.values[0][rowInd]}</td>
                        ))
                      )}
                    </tr>
                  ))}
              </>
            ))}
            {metricValues.length === 0 &&
              rowValues.map((rowValue, rowIndex) => (
                <tr>
                  {rowValue.map((row) => (
                    <td>{row}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
