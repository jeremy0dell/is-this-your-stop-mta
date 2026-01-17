import { useEffect, useRef } from "react";
import * as d3 from "d3";
import DemographicPieChart from "./DemographicPieChart";
import { chartTypeInfo, stops } from "../logic/data";

const Outro = ({ height, width, raceStack, incomeStack }) => {
  const svgRef = useRef(null);

  const svgWidth = 250;
  const svgHeight = 250;

  // Stop indices to display (beginning, middle, end)
  const stopIndices = [3, 11, 21];

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Add stop labels for race charts
    stopIndices.forEach((stopIdx, i) => {
      svg
        .append("text")
        .attr("transform", `translate(${svgWidth * 0.5}, ${svgHeight * (i + 1) + 50 * i - 100})`)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "26px")
        .text(stops[stopIdx][0]);
    });

    // Add "Race Demographics" header
    svg
      .append("text")
      .attr("transform", `translate(${svgWidth * 2.5}, 50)`)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "26px")
      .text("Race Demographics");

    // Add stop labels for income charts
    stopIndices.forEach((stopIdx, i) => {
      svg
        .append("text")
        .attr("transform", `translate(${svgWidth * 2.5}, ${svgHeight * (i + 1) + 50 * i - 100})`)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "26px")
        .text(stops[stopIdx][0]);
    });

    // Add "Income Demographics" header
    svg
      .append("text")
      .attr("transform", `translate(${svgWidth * 5.5}, 50)`)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "26px")
      .text("Income Demographics");
  }, []);

  return (
    <div
      style={{
        height: height,
        width: width,
        display: "flex",
      }}
    >
      {/* Text content */}
      <div
        style={{
          width: "30%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <div style={{ fontSize: 35, paddingLeft: 40 }}>
          Now that we've reached the end of our journey on the L Train, we can
          reflect upon what we've learned by observing the demographic shifting
          of the riders.
        </div>
        <div style={{ fontSize: 35, paddingLeft: 40 }}>
          Due to the systemic inequalities between neighborhoods along to L
          Train, we can see radically different racial and income demographics
          between stops at the beginning, middle, and end of the ride.
        </div>
        <div style={{ fontSize: 35, paddingLeft: 40 }}>
          Because no two rides on the subway are the same, these demographics
          might have minor changes if this simulation is ran again. Still, the
          overall shape of these demographics are likely to remain the same.
        </div>
      </div>

      {/* Visualizations */}
      <svg ref={svgRef} id="visualizations" height={height} width={width * 0.7}>
        {/* Race pie charts */}
        {stopIndices.map((stopIdx, i) => (
          <g
            key={`race-${i}`}
            transform={`translate(${svgWidth}, ${svgHeight * (i + 1) + 50 * i - 75})`}
          >
            <DemographicPieChart
              data={raceStack[stopIdx]}
              chartType="race"
              chartTypeInfo={chartTypeInfo}
              position={i}
              svgWidth={svgWidth}
              svgHeight={svgHeight}
            />
          </g>
        ))}

        {/* Income pie charts */}
        {stopIndices.map((stopIdx, i) => (
          <g
            key={`income-${i}`}
            transform={`translate(${svgWidth * 4}, ${svgHeight * (i + 1) + 50 * i - 75})`}
          >
            <DemographicPieChart
              data={incomeStack[stopIdx]}
              chartType="income"
              chartTypeInfo={chartTypeInfo}
              position={i}
              svgWidth={svgWidth}
              svgHeight={svgHeight}
            />
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      <div
        id="tooltip"
        style={{
          opacity: 0,
          position: "absolute",
          padding: 10,
          backgroundColor: "#4d4d4d",
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></div>
    </div>
  );
};

export default Outro;
