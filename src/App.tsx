import { useEffect, useState } from "react";
import { ColRows } from "./components/pickers/colrows/colrows.js";
// import { FilterField } from "./components/filter/filterField.js";
import { Metrics } from "./components/pickers/metrics/metrics.js";
import { Table } from "./components/table/table.js";
import { getCube } from "./http/getCube.js";
import { getMETA } from "./http/getMeta.js";
import { CubeData, MetaData } from "./types/apiResponse.js";
import { RequestCubeBody } from "./types/requestCubeBody.js";
import { getConfig } from "./utils/getConfig.js";

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
    count: 1000,
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

const test_reqbody: RequestCubeBody = {
  columnFields: [
    {
      fieldId: 18,
      fieldType: "REPORT_FIELD",
    },
  ],
  rowFields: [
    {
      fieldId: 15,
      fieldType: "REPORT_FIELD",
    },
  ],
  metrics: [
    {
      field: {
        fieldId: 19,
        fieldType: "REPORT_FIELD",
      },
      aggregationType: "SUM",
    },
  ],
  columnsInterval: {
    from: 0,
    count: 39,
  },
  rowsInterval: {
    from: 0,
    count: 135,
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
    getCube(cubeReq).then((data) => setCube(data));
  }, [cubeReq]);

  return (
    <>
      {META && (
        <div style={{display: 'flex'}}>
          <ColRows reqBody={cubeReq} meta={META} setReqBody={setCubeReq} />
          <Metrics reqBody={cubeReq} meta={META} setReqBody={setCubeReq} />
        </div>
      )}
      {/* <FilterField set={}/> */}
      {cube && <Table data={cube} />}
    </>
  );
}

export default App;
