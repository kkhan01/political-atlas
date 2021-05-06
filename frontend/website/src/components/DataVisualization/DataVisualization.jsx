import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";

import BarChart from "./BarChart";
import PieChart from "./PieChart";
import TreeMap from "./TreeMap";
import DoubleBarChart from "./DoubleBarChart";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  center: {
    textAlign: "center",
  },
}));

const Visualization = ({ type, ...props }) =>
  ({
    "Bar Chart": <BarChart {...props} />,
    "Pie Chart": <PieChart {...props} />,
    "Tree Map": <TreeMap {...props} />,
    "Double Bar Chart": <DoubleBarChart {...props} />,
  }[type]);

const DataVisualization = ({ ibm, da }) => {
  const classes = useStyles();
  const charts = ["Bar Chart", "Pie Chart", "Tree Map", "Double Bar Chart"];

  const [vizType, setVizType] = useState(charts[0]);

  const handleChange = (e) => {
    setVizType(e.target.value);
  };

  return (
    <>
      <FormControl className={classes.formControl}>
        <NativeSelect
          className={classes.selectEmpty}
          value={vizType}
          name="Visualization Chart"
          onChange={handleChange}
        >
          {charts.map((chart) => (
            <option key={chart} value={chart}>
              {chart}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
      <br />

      <div aria-label={"Data Visualization"} className={classes.center}>
        <Visualization type={vizType} ibm={ibm} da={da} />
      </div>
    </>
  );
};

export default DataVisualization;
