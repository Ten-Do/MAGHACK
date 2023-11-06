import { useEffect, useState } from "react";
import { Loader } from "./components/loader/loader.js";
import { ColRows } from "./components/pickers/colrows/colrows.js";
import { Metrics } from "./components/pickers/metrics/metrics.js";
import { NewTable } from "./components/table/newTable.js";
import { Table } from "./components/table/table.js";
import { getCube } from "./http/getCube.js";
import { getMETA } from "./http/getMeta.js";
import { InitReqBody } from "./http/initReqBody.js";
import { CubeData, MetaData } from "./types/apiResponse.js";
import { RequestCubeBody } from "./types/requestCubeBody.js";
import { createAndPopulateTable } from "./utils/export.js";
import { showSnackbar } from "./utils/showSnackbar.js";

function App() {
  const [META, setMETA] = useState<MetaData | null>(null);
  const [cube, setCube] = useState<CubeData | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cubeReq, setCubeReq] = useState<RequestCubeBody>(InitReqBody);
  useEffect(() => {
    getMETA().then((res) => setMETA(res));
  }, []);
  useEffect(() => {
    if (!isSuccess) {
      setIsSuccess(true);
    } else {
      setIsLoading(true);
      getCube(cubeReq)
        .then((data) => {
          setCube(data);
          localStorage.setItem("backup", JSON.stringify(cubeReq));
          setIsSuccess(true);
        })
        .catch((err) => {
          setIsSuccess(false);
          setCubeReq(JSON.parse(localStorage.getItem("backup") || ""));
          showSnackbar("Неудалось выполнить запрос.\n" + JSON.stringify(err));
        })
        .finally(() => setIsLoading(false));
    }
  }, [cubeReq]);
  const cr = JSON.parse(localStorage.getItem("backup")) || cubeReq;
  return (
    <>
      {isLoading && <Loader />}
      {META && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            padding: "30px 5vw 0",
          }}
        >
          <ColRows reqBody={cr} meta={META} setReqBody={setCubeReq} />
          <Metrics reqBody={cr} meta={META} setReqBody={setCubeReq} />
        </div>
      )}
      {cube &&
      META ? (
        <>
          <NewTable
            reqBody={cr}
            meta={META}
            data={cube}
            setReqBody={setCubeReq}
          />
          <button
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20vw",
              right: "20vw",
            }}
            className="btn card access"
            onClick={() => {
              createAndPopulateTable(cr, META);
            }}
          >
            Экспортировать данные в XLSX таблицу
          </button>
        </>
      ) : null}
    </>
  );
}


export default App;
