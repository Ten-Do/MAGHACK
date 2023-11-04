import { useEffect, useState } from "react";
import { ColRows } from "./components/pickers/colrows/colrows.js";
// import { FilterField } from "./components/filter/filterField.js";
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
    count: 10,
  },
  rowsInterval: {
    from: 0,
    count: 10,
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
};

function App() {
  const [META, setMETA] = useState<MetaData | null>(null);
  const [cube, setCube] = useState<CubeData | null>(null);
  const [cubeReq, setCubeReq] = useState<RequestCubeBody>(InitReqBody);
  useEffect(() => {
    getMETA().then((res) => setMETA(res));
  }, []);
  useEffect(() => {
    getCube(cubeReq)
      .then((data) => setCube(data))
      .catch((err) =>
        showSnackbar("Неудалось выполнить запрос.\n" + JSON.stringify(err))
      );
  }, [cubeReq]);

  return (
    <>
      {META && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            padding: "30px 5vw 0",
          }}
        >
          <ColRows reqBody={cubeReq} meta={META} setReqBody={setCubeReq} />
          <Metrics reqBody={cubeReq} meta={META} setReqBody={setCubeReq} />
        </div>
      )}
      {/* <FilterField set={}/> */}
      {cube && META && (
        <NewTable
          reqBody={cubeReq}
          meta={META}
          data={cube}
          setReqBody={setCubeReq}
        />
      )}
    </>
  );
}

export default App;
