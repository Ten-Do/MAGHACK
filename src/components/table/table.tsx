import { CubeData } from "@/types/apiResponse.js";
import styles from "./styles.module.css";

export const Table = ({ data }: { data: CubeData }) => {
  const { columnValues, rowValues, metricValues } = data;

  return (
    <div className={styles.table_container}>
      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              {columnValues.map((column, columnIndex) => (
                <th key={columnIndex}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowValues.map((row, rowIndex) => (
              <tr key={rowIndex + Math.random()}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex + Math.random()}>{cell}</td>
                ))}
                {metricValues.map((metric, metricIndex) =>
                  metric.values.map((mv) => (
                    <td key={metricIndex + Math.random()}>{mv[rowIndex]}</td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
