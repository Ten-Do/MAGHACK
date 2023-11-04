import { MetaData, MetaDataField } from "@/types/apiResponse.js";
import { Field, Metric, RequestCubeBody } from "@/types/requestCubeBody.js";
import { getConfig } from "@/utils/getConfig.js";
import { useState } from "react";
import { Modal } from "../../modal/modal.js";
import styles from "../styles.module.css";

export const ColRows = ({
  meta,
  reqBody,
  setReqBody,
}: {
  meta: MetaData;
  reqBody: RequestCubeBody;
  setReqBody: React.Dispatch<React.SetStateAction<RequestCubeBody>>;
}) => {
  const { rows, cols, free } = getConfig(reqBody, meta);
  const [place, setPlace] = useState<
    "columnFields" | "rowFields" | null
  >(null);
  const [draggedItem, setDraggedItem] = useState<MetaDataField | null>(null);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: MetaDataField
  ) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", item);
    setDraggedItem(item);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add(styles.over);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove(styles.over);
  };

  const handleDragDrop = (item: MetaDataField) => {
    if (draggedItem !== null && draggedItem.id !== item.id) {
      // swap draggedItem and item
      for (let i = 0; i < reqBody.columnFields.length; i++) {
        const element = reqBody.columnFields[i];
        if (element.fieldId === draggedItem.id) {
          element.fieldId = item.id;
        } else if (element.fieldId === item.id) {
          element.fieldId = draggedItem.id;
        }
      }

      for (let i = 0; i < reqBody.rowFields.length; i++) {
        const element = reqBody.rowFields[i];
        if (element.fieldId === draggedItem.id) {
          element.fieldId = item.id;
        } else if (element.fieldId === item.id) {
          element.fieldId = draggedItem.id;
        }
      }
    }

    setReqBody({ ...reqBody });
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    document.querySelector("." + styles.over)?.classList.remove(styles.over);
  };

  const addNewItem = (newElem: Field | Metric) => {
    if (place) {
      setReqBody((currBody) => ({
        ...currBody,
        [place]: [...currBody[place], newElem],
      }));
    }
  };

  const removeItem = (place: "columnFields" | "rowFields", itemId: number) => {
    setReqBody((currBody) => ({
      ...currBody,
      [place]: currBody[place].filter((elem) => elem.fieldId !== itemId),
    }));
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div className={styles.container}>
        <h2>Ряды</h2>
        <div
          className={styles.adder}
          onClick={() => {
            setPlace("rowFields");
          }}
        >
          <img src="icons/add.svg" alt="Добавить" />
        </div>
        <ul>
          {rows.map((item) => (
            <li key={item.name}>
              <div
                className={styles.draggable + " card"}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDragDrop(item)}
                onDragEnd={handleDragEnd}
              >
                {item.name}
              </div>
              <div
                className={styles.remover}
                onClick={() => removeItem("rowFields", item.id)}
              >
                <img src="icons/remove.svg" alt="Убрать" />
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* ========================== */}
      <div className={styles.container}>
        <h2>Колонки</h2>
        <div
          className={styles.adder}
          onClick={() => {
            setPlace("columnFields");
          }}
        >
          <img src="icons/add.svg" alt="Добавить" />
        </div>
        <ul>
          {cols.map((item) => (
            <li key={item.name}>
              <div
                className={styles.draggable + " card"}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDragDrop(item)}
                onDragEnd={handleDragEnd}
              >
                {item.name}
              </div>
              <div
                className={styles.remover}
                onClick={() => removeItem("columnFields", item.id)}
              >
                <img src="icons/remove.svg" alt="убрать" />
              </div>
            </li>
          ))}
        </ul>
      </div>
      {place && (
        <Modal
          hide={() => {
            setPlace(null);
          }}
        >
          {free.map((elem) => (
            <button
              className="btn accent"
              onClick={() => {
                addNewItem({ fieldId: elem.id, fieldType: "REPORT_FIELD" });
              }}
            >
              {elem.name}
            </button>
          ))}
        </Modal>
      )}
    </div>
  );
};
