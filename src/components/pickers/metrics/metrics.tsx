import { MetaData, MetaDataField } from "@/types/apiResponse.js";
import {
  RequestCubeBody,
  AggregationType,
  Metric,
} from "@/types/requestCubeBody.js";
import styles from "../styles.module.css";
import { Modal } from "@/components/modal/modal.js";
import { useState } from "react";
import { AGGREGATORS } from "@/utils/sets/aggregators.js";
import { getSortIcon } from "@/utils/getSortIcon.js";
import { FilterModalContent } from "@/components/filter/filterModalContent.js";

export const Metrics = ({
  meta,
  reqBody,
  setReqBody,
}: {
  meta: MetaData;
  reqBody: RequestCubeBody;
  setReqBody: React.Dispatch<React.SetStateAction<RequestCubeBody>>;
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [metricItem, setMetricItem] = useState<MetaDataField | null>(null);
  const [agregator, setAgregator] = useState<AggregationType | null>(null);
  const [filterMetricId, setFilterMetricId] = useState<number | null>(null);

  const addNewItem = () => {
    if (metricItem && agregator) {
      setReqBody((currBody) => ({
        ...currBody,
        metrics: [
          ...currBody.metrics,
          {
            aggregationType: agregator,
            field: { fieldId: metricItem?.id, fieldType: "REPORT_FIELD" },
          },
        ],
      }));
    }
  };

  const removeItem = (item: Metric) => {
    setReqBody((currBody) => ({
      ...currBody,
      metrics: currBody.metrics.filter(
        (elem) =>
          !(
            elem.field.fieldId === item.field.fieldId &&
            elem.aggregationType === item.aggregationType
          )
      ),
    }));
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
      <div className={styles.container}>
        <h2>Агрегации</h2>
        <div
          className={styles.adder}
          onClick={() => {
            setShowModal(true);
          }}
        >
          <img src="icons/add.svg" alt="Добавить" />
        </div>
        <ul>
          {reqBody.metrics.map((item, metricIndex) => (
            <li key={item.field.fieldId + item.aggregationType}>
              <div className={styles.metric + " card"}>
                <p>
                  {item.aggregationType +
                    ": (" +
                    meta.fields.filter(
                      (metaItem) => metaItem.id === item.field.fieldId
                    )[0].name +
                    ")"}
                </p>
                <div className={styles.actions}>
                  <div
                    className={styles.sorter}
                    onClick={() => addSort(metricIndex)}
                  >
                    <img
                      src={getSortIcon(
                        reqBody.columnSort?.filter(
                          (e) => e.metricId == metricIndex
                        )[0]?.order
                      )}
                      alt="сортировка"
                    />
                  </div>
                  <div
                    className={styles.filter}
                    onClick={() => setFilterMetricId(metricIndex)}
                  >
                    <img src="icons/filter.svg" alt="фильтр" />
                  </div>
                  <div
                    className={styles.remover}
                    onClick={() => removeItem(item)}
                  >
                    <img src="icons/remove.svg" alt="Убрать" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* === ADD MODAL === */}
      {showModal && (
        <Modal hide={() => setShowModal(false)}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "80px" }}
          >
            <div>
              <h1>Метрика</h1>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                {meta.fields.map((value) => (
                  <button
                    key={value.id + "metr"}
                    onClick={() => {
                      if (
                        value.type === "STRING" &&
                        value.type !== metricItem?.type
                      )
                        setAgregator(null);
                      setMetricItem(value);
                    }}
                    className={"card"}
                    style={
                      metricItem?.id === value.id
                        ? { backgroundColor: "rgba(var(--accent-rgba))" }
                        : {}
                    }
                  >
                    <p>{value.name}</p>
                    <p className="subtext">описание: {value.description}</p>
                    <p className="subtext">тип: {value.type}</p>
                  </button>
                ))}
              </div>
            </div>

            {metricItem && (
              <div>
                <h1>Агрегация</h1>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "10px",
                  }}
                >
                  {Object.keys(
                    metricItem.type === "STRING"
                      ? AGGREGATORS.allTypes
                      : { ...AGGREGATORS.allTypes, ...AGGREGATORS.intTypes }
                  ).map((value) => (
                    <button
                      key={value}
                      onClick={() => setAgregator(value as AggregationType)}
                      className={"btn"}
                      style={
                        agregator === value
                          ? { backgroundColor: "rgba(var(--accent-rgba))" }
                          : {}
                      }
                    >
                      <p>
                        {value in AGGREGATORS.allTypes
                          ? AGGREGATORS.allTypes[value as AggregationType]
                          : AGGREGATORS.intTypes[value as AggregationType]}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {metricItem && agregator && (
              <div>
                <p>{metricItem.name + " -> " + agregator}</p>
                <button
                  className="btn access card"
                  onClick={() => addNewItem()}
                >
                  Подтвердить
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
      {/* === FILTER MODAL === */}
      {filterMetricId !== null && (
        <Modal hide={() => setFilterMetricId(null)}>
          <FilterModalContent
            callback={(filter, filterParams) => {
              setReqBody((curr) => ({
                ...curr,
                metricFilterGroup: {
                  ...curr.metricFilterGroup,
                  filters: [
                    ...curr.metricFilterGroup.filters.filter(
                      (e) =>
                        e.filterType !== filter || e.metricId !== filterMetricId
                    ),
                    {
                      filterType: filter,
                      invertResult: false,
                      metricId: filterMetricId,
                      rounding: 0,
                      values: filterParams,
                    },
                  ],
                },
              }));
            }}
          />
        </Modal>
      )}
    </>
  );
};
