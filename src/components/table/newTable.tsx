import { CubeData, MetaData } from "@/types/apiResponse.js";
import { RequestCubeBody } from "@/types/requestCubeBody.js";
import { getConfig } from "@/utils/getConfig.js";
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
  return (
    <>
      <div>
        <div className={styles.table_container}>
          <div className={styles.table}>
            <table>
              <thead>
                {cols.map((elem, i) => (
                  <tr key={elem.id + "|" + i}>
                    {i === cols.length - 1 ? (
                      rows.map((row) => (
                        <th className={styles.width200} key={row.id + "q"}>
                          {row.name}
                        </th>
                      ))
                    ) : (
                      <th colSpan={rows.length}></th>
                    )}
                    <th className={styles.width200}>{elem.name}</th>
                    {columnValues.map((column, columnIndex) => (
                      <th key={columnIndex + "z"}>{column[i]}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {rowValues.map((row, rowIndex) => (
                  <tr key={rowIndex + "rowInd"}>
                    {row.map((cell, cellIndex) => (
                      <th
                        className={styles.width200}
                        key={cellIndex + "cellInd"}
                      >
                        {cell}
                      </th>
                    ))}
                    {/* <td>{metricValues[]}</td> */}
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
                            {Array.from(
                              { length: metricValues[0].values[0].length },
                              (x, i) => i
                            ).map((metricRowInd) =>
                              metricValues.map((metricValue, metricIndex) => (
                                <tr>
                                  <th className={styles.width200}>
                                    {metricValue.aggregationType}
                                  </th>
                                  {metricValue.values.map((metricColumn) => (
                                    <td
                                      key={metricIndex + "mi" + Math.random()}
                                    >
                                      {metricColumn[metricRowInd]}
                                    </td>
                                  ))}
                                </tr>
                              ))
                            )}
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
    </>
  );
};
