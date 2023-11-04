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
          {reqBody.metrics.map((item) => (
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
                <div
                  className={styles.remover}
                  onClick={() => removeItem(item)}
                >
                  <img src="icons/remove.svg" alt="Убрать" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* ================ */}
      {showModal && (
        <Modal hide={() => setShowModal(false)}>
          <h3>Метрика</h3>
          <ul>
            {meta.fields.map((value) => (
              <li key={value.id + "metr"}>
                <button
                  onClick={() => setMetricItem(value)}
                  className={`btn ${metricItem?.id === value.id && "accent"}`}
                >
                  <p>{value.name}</p>
                  <p className="subtext">описание: {value.description}</p>
                  <p className="subtext">тип: {value.type}</p>
                </button>
              </li>
            ))}
          </ul>

          {metricItem && (
            <div>
              <h3>Агрегация</h3>
              <ul>
                {Object.keys(
                  metricItem.type === "STRING"
                    ? AGGREGATORS.allTypes
                    : { ...AGGREGATORS.allTypes, ...AGGREGATORS.intTypes }
                ).map((value) => (
                  <li key={value}>
                    <button
                      onClick={() => setAgregator(value as AggregationType)}
                      className={`btn ${agregator === value && "accent"}`}
                    >
                      {value in AGGREGATORS.allTypes
                        ? AGGREGATORS.allTypes[value as AggregationType]
                        : AGGREGATORS.intTypes[value as AggregationType]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {metricItem && agregator && (
            <div>
              <h3>Выбрано:</h3>
              <p>
                {metricItem.name} - {agregator}
              </p>
              <button className="btn access" onClick={() => addNewItem()}>
                Подтвердить
              </button>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};
