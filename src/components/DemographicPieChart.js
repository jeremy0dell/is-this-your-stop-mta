import { useEffect, useRef } from "react";
import * as d3 from "d3";
import omit from "lodash/omit";

const DemographicPieChart = ({
  data,
  chartType, // 'race' or 'income'
  chartTypeInfo,
  position,
  svgWidth = 250,
  svgHeight = 250,
}) => {
  const chartRef = useRef(null);
  const groupClass = `${chartType}-${position}`;

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const radius = Math.min(svgWidth, svgHeight) / 2;

    // Convert data to pie format
    const pieData = Object.entries(omit(data, "stop"));
    const pie = d3.pie().value((d) => d[1]);
    const arcs = pie(pieData);
    const total = arcs.reduce((acc, next) => acc + next.value, 0);

    // Select the group and bind data
    const selection = d3
      .select(chartRef.current)
      .selectAll("path.slice")
      .data(arcs)
      .join((enter) =>
        enter
          .append("path")
          .attr("class", (d) =>
            `slice ${d.data[0].replaceAll(" ", "").replaceAll(":", "")}`
          )
          .style("fill", (d) => chartTypeInfo[chartType].colors(d.data[0]))
          .attr("d", (d) => d3.arc().innerRadius(50).outerRadius(radius)(d))
      );

    // Add hover interactions
    selection
      .on("mouseover", (e, d) => {
        const tooltip = d3.select("#tooltip");

        tooltip
          .style("top", e.clientY - 30 + "px")
          .style("left", e.clientX + 30 + "px")
          .html(
            `<div style="text-align: center; width: 120px;">
Proportion of ${chartTypeInfo[chartType].shortKeys[d.data[0]]} riders at this stop:
<br>
<span style="font-weight: bold; color: #FF9C28">${
              ((d.value / total) * 100).toFixed(2) + "%"
            }</span>
            </div>`
          );

        tooltip.transition().style("opacity", 1);

        d3.selectAll(
          `path.${d.data[0].replaceAll(" ", "").replaceAll(":", "")}`
        ).style(
          "filter",
          "brightness(1.3) drop-shadow(rgba(255, 170, 51, 0.5) 0px 0px 10.63545px)"
        );
      })
      .on("mouseout", (e, d) => {
        const tooltip = d3.select("#tooltip");
        tooltip.transition().style("opacity", 0);

        d3.selectAll(
          `path.${d.data[0].replaceAll(" ", "").replaceAll(":", "")}`
        ).style(
          "filter",
          "brightness(1) drop-shadow(rgba(255, 170, 51, 0.5) 0px 0px 0px)"
        );
      });
  }, [data, chartType, chartTypeInfo, svgWidth, svgHeight, position]);

  return <g ref={chartRef} className={groupClass} />;
};

export default DemographicPieChart;
