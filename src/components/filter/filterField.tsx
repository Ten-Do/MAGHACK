import { useEffect, useState } from "react";
import styles from "./styles.module.css";

export const FilterField = ({
  setFilter,
  setSorting,
  initValue,
}: {
  setFilter: CallableFunction;
  setSorting?: CallableFunction;
  initValue?: string;
}) => {
  const [pattern, setPattern] = useState(initValue || "");
  const [invertResult, setInvertResult] = useState(false);
  const [sort, setSort] = useState(false);
  const [timer, setTimer] = useState<any>(null);
  const handleTextChange = (text: string) => {
    setPattern(text);
    timer && clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        setFilter(text, invertResult);
      }, 1000)
    );
  };
  useEffect(() => {
    if (!pattern && invertResult) return;
    setFilter(pattern, invertResult);
  }, [invertResult]);
  useEffect(() => {
    setSort(sort);
  }, [sort]);
  return (
    <div
      className="input-container"
      style={{ display: "flex", alignItems: "center" }}
    >
      <input
        style={{ borderColor: invertResult ? "#bb2222" : "#2222bb" }}
        value={pattern}
        type="text"
        placeholder="filter"
        onChange={({ target }) => handleTextChange(target.value)}
      />
      <div
        className={"info " + styles.button}
        onClick={() => setInvertResult((curr) => !curr)}
      >
        <span className="tooltip">инвертировать</span>
        <img
          style={{ maxWidth: "100%", minWidth: "100%" }}
          src="icons/invert.svg"
          alt="инвертировать"
        />
      </div>
      {setSorting && (
        <div
          className={"info " + styles.button}
          onClick={() => setSort((curr) => !curr)}
        >
          <span className="tooltip">сортировать</span>
          <img
            style={{ maxWidth: "100%", minWidth: "100%" }}
            src="icons/sort.svg"
            alt="инвертировать"
          />
        </div>
      )}
    </div>
  );
};
