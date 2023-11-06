import { useEffect, useState } from "react";
import { Loader } from "./components/loader/loader.js";
import { ColRows } from "./components/pickers/colrows/colrows.js";
import { Metrics } from "./components/pickers/metrics/metrics.js";
import { NewTable } from "./components/table/newTable.js";
import { getCube } from "./http/getCube.js";
import { getMETA } from "./http/getMeta.js";
import { CubeData, MetaData } from "./types/apiResponse.js";
import { RequestCubeBody } from "./types/requestCubeBody.js";
import { showSnackbar } from "./utils/showSnackbar.js";

const InitReqBody: RequestCubeBody = {
  columnFields: [],
  rowFields: [],
  metrics: [],
  columnsInterval: {
    from: 0,
    count: 100,
  },
  rowsInterval: {
    from: 0,
    count: 100,
  },
  filterGroup: {
    childGroups: [],
    filters: [],
    invertResult: false,
    operationType: "AND",
  },
  metricFilterGroup: {
    childGroups: [],
    filters: [],
    invertResult: false,
    operationType: "AND",
  },
  columnSort: [],
  rowSort: [],
};

function App() {
  const [META, setMETA] = useState<MetaData | null>(null);
  const [cube, setCube] = useState<CubeData | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
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
  const cr = JSON.parse(localStorage.getItem("backup") || "");
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
      cube.columnValues[0].length +
        cube.rowValues[0].length +
        cube.metricValues.length &&
      META ? (
        <NewTable
          reqBody={cr}
          meta={META}
          data={cube}
          setReqBody={setCubeReq}
        />
      ) : null}
    </>
  );
}

export default App;
