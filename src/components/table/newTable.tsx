import { CubeData, MetaData } from "@/types/apiResponse.js";
import { RequestCubeBody } from "@/types/requestCubeBody.js";
import { getConfig } from "@/utils/getConfig.js";
import { useState } from "react";
import { FilterField } from "../filter/filterField.js";
import { FilterModalContent } from "../filter/filterModalContent.js";
import { Modal } from "../modal/modal.js";
import styles from "./styles.module.css";

export const NewTable = ({
  meta,
  reqBody,
  setReqBody,
  data,
}: {
  meta: MetaData;
  reqBody: RequestCubeBody;
  setReqBody: React.Dispatch<React.SetStateAction<RequestCubeBody>>;
  data: CubeData;
}) => {
  const { rows, cols } = getConfig(reqBody, meta);
  const { columnValues, rowValues, metricValues } = data;
  const [split, setSplit] = useState(true);
  const [tupleValue, setTupleValue] = useState<{
    value: string;
    dim: string;
  } | null>(null);
  const fields: string[] = [];
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
  const addSort = (index: number) => {
    setReqBody((curr) => {
      return {
        ...curr,
        columnSort: [
          {
            metricId: index,
            order:
              curr.columnSort?.filter((e) => e.metricId == index)[0]?.order ===
              "Descending"
                ? "Ascending"
                : "Descending",
            tuple: [],
          },
        ],
      };
    });
  };
  return (
    <>
      <div>
        <div className={styles.table_container}>
          <button className="btn" onClick={() => setSplit((curr) => !curr)}>
            {split ? "Объединить " : "Разделить "}ячейки
          </button>
          <div className={styles.table}>
            <table
              onClick={(e) => {
                const value = e.target.getAttribute("tupleValue") ?? "";
                if (value && metricValues.length) {
                  setTupleValue({
                    value,
                    dim: e.target.getAttribute("sortDim"),
                  });
                }
              }}
            >
              <thead>
                {cols.length === 0 && (
                  <>
                    {rows.map((row) => (
                      <th className={styles.width200} key={row.id + "q"}>
                        {row.name}
                        <FilterField
                          setFilter={(
                            pattern: string,
                            invertResult: boolean
                          ) => {
                            handleFilterChange(row.id, pattern, invertResult);
                          }}
                        />
                      </th>
                    ))}
                    {metricValues.map((metricValue) => (
                      <th key={metricValue.fieldId + "qq"}>
                        {metricValue.aggregationType +
                          ": " +
                          fields[metricValue.fieldId]}
                      </th>
                    ))}
                  </>
                )}
                {cols.map((elem, i) => (
                  <tr key={elem.id + "|" + i}>
                    {i === cols.length - 1 ? (
                      rows.map((row) => (
                        <th className={styles.width200} key={row.id + "q"}>
                          {row.name}
                          <FilterField
                            setFilter={(
                              pattern: string,
                              invertResult: boolean
                            ) => {
                              handleFilterChange(row.id, pattern, invertResult);
                            }}
                          />
                        </th>
                      ))
                    ) : rows.length ? (
                      <th colSpan={rows.length}></th>
                    ) : (
                      <></>
                    )}
                    <th className={styles.width200}>
                      {elem.name}
                      <FilterField
                        setFilter={(pattern: string, invertResult: boolean) => {
                          handleFilterChange(elem.id, pattern, invertResult);
                        }}
                      />
                    </th>
                    {/* HEREEEEEEEEEEEEEEEE */}
                    {columnValues.map((column, columnIndex) => {
                      if (split)
                        return (
                          <th
                            tupleValue={column[i]}
                            sortDim="columnSort"
                            key={columnIndex + "z"}
                          >
                            {column[i]}
                          </th>
                        );
                      if (
                        columnIndex !== 0 &&
                        columnValues[columnIndex - 1][i] == column[i]
                      )
                        return <></>;
                      let count = 1;
                      while (
                        columnIndex + count < columnValues.length &&
                        columnValues[columnIndex + count][i] == column[i]
                      ) {
                        count++;
                      }
                      return (
                        <th
                          tupleValue={column[i]}
                          sortDim="columnSort"
                          key={columnIndex + "z"}
                          colSpan={count}
                        >
                          {column[i]}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {rowValues.map((row, rowIndex) => (
                  <tr key={rowIndex + "rowInd"}>
                    {row.map((cell, cellIndex) => {
                      if (split)
                        return (
                          <th
                            tupleValue={cell}
                            sortDim="rowSort"
                            className={styles.width200}
                            key={cellIndex + "cellInd"}
                          >
                            {cell}
                          </th>
                        );
                      if (
                        rowIndex !== 0 &&
                        cell === rowValues[rowIndex - 1][cellIndex]
                      )
                        return <></>;

                      let count = 1;
                      while (
                        rowIndex + count < rowValues.length &&
                        cell === rowValues[rowIndex + count][cellIndex]
                      )
                        count++;
                      return (
                        <th
                          tupleValue={cell}
                          sortDim="rowSort"
                          className={styles.width200}
                          key={cellIndex + "cellInd"}
                          rowSpan={count}
                        >
                          {cell}
                        </th>
                      );
                    })}
                    {rowIndex === 0 && metricValues.length > 0 && (
                      <td
                        style={{ backgroundColor: "#333333", padding: "0" }}
                        rowSpan={
                          metricValues.length * metricValues[0].values[0].length
                        }
                        colSpan={metricValues[0].values.length + 1}
                      >
                        <table className={styles.metric_table}>
                          <tbody>
                            {cols.length > 0
                              ? Array.from(
                                  { length: metricValues[0].values[0].length },
                                  (x, i) => i
                                ).map((metricRowInd) =>
                                  metricValues.map(
                                    (metricValue, metricIndex) => (
                                      <tr>
                                        <th className={styles.width200}>
                                          {metricValue.aggregationType +
                                            ": " +
                                            fields[metricValue.fieldId].slice(
                                              0,
                                              4
                                            )}
                                        </th>
                                        {metricValue.values.map(
                                          (metricColumn) => (
                                            <td
                                              key={
                                                metricIndex +
                                                "mi" +
                                                Math.random()
                                              }
                                            >
                                              {metricColumn[metricRowInd]}
                                            </td>
                                          )
                                        )}
                                      </tr>
                                    )
                                  )
                                )
                              : Array.from(
                                  { length: metricValues[0].values[0].length },
                                  (x, i) => i
                                ).map((i) => (
                                  <tr>
                                    {metricValues.map((metricValue) => (
                                      <td key={"mi" + Math.random()}>
                                        {metricValue.values[0][i]}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                          </tbody>
                        </table>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* {tupleValue?.value && metricValues.length && (
        <Modal hide={() => setTupleValue(null)}>
          <FilterModalContent callback={() => {}} />
        </Modal>
      )} */}
    </>
  );
};
