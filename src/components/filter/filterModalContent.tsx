import { FilterType } from "@/types/requestCubeBody.js";
import { FILTERS, FILTERS_DESCRIPTIONS } from "@/utils/sets/filters.js";
import { useState } from "react";
import styles from "./styles.module.css";

export const FilterModalContent = ({
  callback,
}: {
  callback: (filter: FilterType, filterParams: string[]) => unknown;
}) => {
  const [filter, setFilter] = useState<FilterType | null>(null);
  const [filterArgs, setFilterArgs] = useState<string[]>([]);
  const [newFilterArg, setNewFilterArg] = useState("");

  const handleAddFilterArg = () => {
    if (newFilterArg.trim() !== "") {
      setFilterArgs([...filterArgs, newFilterArg]);
      setNewFilterArg("");
    }
  };

  const handleDeleteFilterArg = (index: number) => {
    const updatedFilterArgs = [...filterArgs];
    updatedFilterArgs.splice(index, 1);
    setFilterArgs(updatedFilterArgs);
  };

  return (
    <>
      <div className={styles.validators}>
        {FILTERS.map((elem) => (
          <div
            className={"card" + (filter === elem ? " active" : "")}
            onClick={() => {
              setFilter(elem);
              setFilterArgs([]);
            }}
          >
            <p>{elem}</p>
            <p className="subtext">{FILTERS_DESCRIPTIONS[elem].description}</p>
          </div>
        ))}
      </div>
      {filter && (
        <div className={styles.args}>
          {FILTERS_DESCRIPTIONS[filter].args === -1 && (
            <>
              <h1>Ввдедите параметры</h1>
              <div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddFilterArg();
                  }}
                  className={"input-container " + styles.input_container}
                >
                  <input
                    type="text"
                    id="filArgInp"
                    placeholder=" "
                    value={newFilterArg}
                    onChange={(e) => setNewFilterArg(e.target.value)}
                  />
                  <label htmlFor="filArgInp">param</label>
                  <button className={styles.imgContainer}>
                    <img src="icons/add.svg" alt="добавить" />
                  </button>
                </form>
                <div className={styles.filterArgs}>
                  {filterArgs.map((task, index) => (
                    <div className={"btn " + styles.filterArg}>
                      <p key={index}>{task}</p>
                      <button
                        onClick={() => handleDeleteFilterArg(index)}
                        className={styles.imgContainer}
                      >
                        <img src="icons/backspace.svg" alt="добавить" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {FILTERS_DESCRIPTIONS[filter].args > 0 && (
            <>
              <h1>Ввдедите параметры</h1>
              {Array.from(
                { length: FILTERS_DESCRIPTIONS[filter].args },
                (v, i) => i
              ).map((i) => (
                <div className={"input-container " + styles.input_container}>
                  <input
                    type="text"
                    id="filArgInp"
                    placeholder=" "
                    value={filterArgs[i]}
                    onChange={(e) =>
                      setFilterArgs((curr) => {
                        const newArr = [...curr];
                        newArr[i] = e.target.value;
                        return newArr;
                      })
                    }
                  />
                  <label htmlFor="filArgInp">param {i + 1}</label>
                </div>
              ))}
            </>
          )}
          {((FILTERS_DESCRIPTIONS[filter].args === -1 &&
            filterArgs.length > 0) ||
            FILTERS_DESCRIPTIONS[filter].args === filterArgs.length ||
            FILTERS_DESCRIPTIONS[filter].args === 0) && (
            <div
              className={"card btn access " + styles.submit}
              onClick={() => callback(filter, filterArgs)}
            >
              <p>Фильровать</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};
