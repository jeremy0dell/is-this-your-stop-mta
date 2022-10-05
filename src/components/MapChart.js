import React, { useState, useEffect, useRef } from "react";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";

import * as d3 from "d3";
import * as C from "../logic/constants";

import { stops, chartSeries, chartTypeInfo } from "../logic/data";

const stripMapColor = (curr, i) => {
  if (curr === i) {
    return "#ffa812";
  } else if (curr > i) {
    return "#a75c00";
  } else {
    return "#231f20";
  }
};

const whiteStyle = {
  color: "white",
  fontSize: "22px !important",
  "&.Mui-checked": {
    color: "#FF9C28",
    fontSize: "22px !important",
  },
  "&.MuiFormControlLabel-label": {
    fontSize: "22px !important",
  },
  "& span": {
    fontSize: "22px !important",
  },
};

const ArrowPath = ({ transform, isGlowing }) => (
  <path
    transform={transform}
    style={{
      // background: isGlowing ? '#FF9C28' : '',
      filter: !isGlowing
        ? "drop-shadow(rgb(255, 170, 51, 0.5) 0px 0px 0.6354499999999916px) drop-shadow(rgb(255, 170, 51, 0.5) 0px 0px 2.64883px) drop-shadow(rgb(255, 170, 51, 0.5) 0px 0px 1.54515px) drop-shadow(rgb(255, 170, 51) 0px 0px 0.772575px) drop-shadow(rgb(255, 170, 51) 0px 0px 0.220736px) drop-shadow(rgb(255, 170, 51, 0.5) 0px 0px 17.110368px)"
        : "",
    }}
    d="M39.4853 12.0238C38.9208 11.5325 38.0805 11.5325 37.516 12.0237L35.2762 13.9727C34.5895 14.5702 34.589 15.6368 35.2752 16.235L48.8614 28.0779C49.9066 28.989 49.2622 30.7087 47.8758 30.7087H14.334C13.5056 30.7087 12.834 31.3802 12.834 32.2087V34.792C12.834 35.6204 13.5056 36.292 14.334 36.292H47.8758C49.2622 36.292 49.9066 38.0117 48.8614 38.9227L35.2752 50.7657C34.589 51.3638 34.5895 52.4304 35.2762 53.028L37.516 54.9769C38.0805 55.4681 38.9208 55.4681 39.4853 54.9769L62.8668 34.6319C63.554 34.034 63.554 32.9666 62.8668 32.3687L39.4853 12.0238Z"
    fill="#FF9C28"
  />
);

const ArrowText = ({ step }) => (
  <text
    fill="white"
    fontSize="20px"
    fontFamily="Helvetica"
    transform="translate(-25 -10)"
  >
    {step === 0 ? "Begin Simulation" : "Travel to Next Station"}
  </text>
);

const MapChart = ({
  height,
  width,
  currentStop,
  action,
  people,
  raceStack,
  incomeStack,
  stepHandlers,
  isMoving,
  currentMapChart,
  setCurrentMapChart,
  currentMapType,
  setCurrentMapType,
  opacity,
  showOutro,
}) => {
  const [step, setStep] = useState(0);
  const [value, setValue] = useState(currentMapChart);
  const [type, setType] = useState(currentMapType);

  // const [isGlowing, setIsGlowing] = useState(true)
  const circlesRef = useRef(null);

  // add axis
  useEffect(() => {
    var y = d3
      .scaleLinear()
      .domain([0, C.maxOccupancy])
      .range([dimensions.barHeight, 0]);

    var yProp = d3
      .scaleLinear()
      .domain([0, 100])
      .range([dimensions.barHeight, 0]);

    var formatPercent = d3.format(".0%");

    var axis = d3.axisLeft(y);
    var axisProp = d3.axisLeft(yProp).tickFormat(formatPercent);

    if (circlesRef.current) {
      // add axis
      d3.select(circlesRef.current)
        .append("g")
        .attr("class", "axis")
        .style("font-size", 20)
        .attr("transform", `translate(0, -${dimensions.barHeight})`)
        .attr("opacity", 0)
        .call(currentMapType === C.standard ? axis : axisProp)
        .call((g) => g.select(".domain").remove());

      // // add prop axis
      // d3.select(circlesRef.current)
      //   .append('g')
      //   .attr('class', 'axis')
      //   .style("font-size",20)
      //   .attr('transform', `translate(0, -${dimensions.barHeight})`)
      //   .attr('opacity', 0)
      //   .call(axis)
      //   .call(g => g.select(".domain").remove())

      // add label
      d3.select(circlesRef.current)
        .append("text")
        .attr("class", "label")
        .attr(
          "transform",
          `translate(-60, -${dimensions.barHeight - 225}) rotate(-90)`
        )
        .attr("fill", "white")
        .attr("opacity", 0)
        .text(chartTypeInfo[currentMapChart].axisTitle(currentMapType))
        .style("font-size", 20);

      // add legend
      d3.select(circlesRef.current)
        .append("g")
        .attr("class", "legend")
        .attr("transform", "translate(0, -26)")
        .selectAll("g")
        .data(chartTypeInfo[currentMapChart].keys)
        .join((enter) => {
          const selection = enter.append("g").attr("class", "legend-marker");

          selection
            .append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("x", (_, i) =>
              i % 2 === 0
                ? (i + 1) * dimensions.legendSpacing
                : i * dimensions.legendSpacing
            )
            .attr("y", (_, i) =>
              i % 2 === 0
                ? dimensions.barHeight * -1 - 60
                : dimensions.barHeight * -1 - 25
            )
            .attr("fill", (d) => chartTypeInfo[currentMapChart].colors(d));

          selection
            .append("text")
            .attr("x", (_, i) =>
              i % 2 === 0
                ? (i + 1) * dimensions.legendSpacing + 20
                : i * dimensions.legendSpacing + 20
            )
            .attr("y", (_, i) =>
              i % 2 === 0
                ? dimensions.barHeight * -1 - 45
                : dimensions.barHeight * -1 - 10
            )
            .attr("fill", "white")
            .attr("font-size", "22px")
            .text((d) => chartTypeInfo[currentMapChart].shortKeys[d]);

          return selection;
        });

      d3.select("g.legend").attr("opacity", 0);

      d3.select("foreignObject#controls").attr("opacity", 0);
    }
  }, []);

  useEffect(() => {
    var axis = d3.axisLeft(y);

    if (action === C.board) {
      /*******ON FIRST BOARD*******/
      if (step === 2) {
        // bring in g.axis, text.label
        showElement("g.axis");
        showElement("text.label");
        showElement("g.legend");
        showElement("foreignObject#controls");
      }
      /*******END ON FIRST BOARD*******/
      var series = chartSeries(
        chartTypeInfo[currentMapChart].keys,
        stacks[currentMapChart],
        currentMapType === C.proportional
      );

      var y = d3
        .scaleLinear()
        .domain([0, C.maxOccupancy])
        .range([dimensions.barHeight, 0]);

      if (circlesRef.current) {
        // eslint-disable-next-line
        const selection = d3
          .select(circlesRef.current)
          .selectAll("g.bar")
          .data(series)
          .join(
            (enter) =>
              enter
                .append("g")
                .attr("class", "bar")
                .attr("opacity", 1)
                .transition()
                .duration(1000)
                .attr("fill", (d, i) =>
                  chartTypeInfo[currentMapChart].colors(d.key)
                ),
            (update) =>
              update
                .transition()
                .duration(1000)
                .attr("fill", (d, i) =>
                  chartTypeInfo[currentMapChart].colors(d.key)
                ),
            (exit) =>
              exit.transition().duration(1000).attr("opacity", 0).remove()
          )
          .selectAll("rect.bar-rect")
          .data((d) => d)
          .join(
            (enter) =>
              enter
                .append("rect")
                .attr("class", "bar-rect")
                .attr(
                  "x",
                  (d, i, a) =>
                    (dimensions.width / stops.length) * (i + 1) -
                    46 +
                    dimensions.paddingSides * 1.5
                )
                .attr("width", 42)
                .attr("height", 0)
                .attr("y", 0)
                // transition stuff
                .transition()
                .duration(1000)
                .delay(2200)
                .attr("height", (d) => {
                  return y(d[0]) - y(d[1]);
                })
                .attr("y", (d, i) => y(d[1]) - dimensions.barHeight),
            (update) =>
              update
                .transition()
                .duration(1000)
                // .delay(2000)
                .attr("height", (d) => y(d[0]) - y(d[1]))
                .attr("y", (d, i) => y(d[1]) - dimensions.barHeight),
            (exit) =>
              exit
                .transition()
                .duration(1000)
                // .delay(2000)
                .attr("height", 0)
                .attr("y", 0)
                .remove()
          );
      }
    }
  }, [people]);

  useEffect(() => {
    var series = chartSeries(
      chartTypeInfo[currentMapChart].keys,
      stacks[currentMapChart],
      currentMapType === C.proportional
    );

    var y = d3
      .scaleLinear()
      .domain([0, C.maxOccupancy])
      .range([dimensions.barHeight, 0]);

    if (circlesRef.current) {
      const selection = d3
        .select(circlesRef.current)
        .selectAll("g.bar")
        .data(series)
        .join(
          (enter) =>
            enter
              .append("g")
              .attr("class", "bar")
              .attr("opacity", 0)
              .transition()
              .duration(1000)
              .attr("fill", (d, i) =>
                chartTypeInfo[currentMapChart].colors(d.key)
              )
              .attr("opacity", 1),
          (update) =>
            update
              .transition()
              .duration(1000)
              .attr("fill", (d, i) =>
                chartTypeInfo[currentMapChart].colors(d.key)
              ),
          (exit) => exit.transition().duration(1000).attr("opacity", 0).remove()
        );

      selection
        .selectAll("rect.bar-rect")
        .data((d) => d)
        .join(
          (enter) =>
            enter
              .append("rect")
              .attr("class", "bar-rect")
              .attr(
                "x",
                (d, i, a) =>
                  (dimensions.width / stops.length) * (i + 1) -
                  46 +
                  dimensions.paddingSides * 1.5
              )
              .attr("width", 42)
              .attr("height", 0)
              .attr("y", 0)
              // transition stuff
              .transition()
              .duration(1000)
              // .delay(2000)
              .attr("height", (d) => y(d[0]) - y(d[1]))
              .attr("y", (d, i) => y(d[1]) - dimensions.barHeight),

          (update) =>
            update
              .transition()
              .duration(1000)
              // .delay(2000)
              .attr("height", (d) => y(d[0]) - y(d[1]))
              .attr("y", (d, i) => y(d[1]) - dimensions.barHeight),
          (exit) =>
            exit
              .transition()
              .duration(1000)
              // .delay(2000)
              .attr("height", 0)
              .attr("y", 0)
              .remove()
        );

      if (step >= 2) {
        d3.select("g.legend").remove();

        d3.select(circlesRef.current)
          .append("g")
          .attr("class", "legend")
          .attr("transform", "translate(0, -26)")
          .selectAll("g")
          .data(chartTypeInfo[currentMapChart].keys)
          .join((enter) => {
            const selection = enter.append("g").attr("class", "legend-marker");

            selection
              .append("rect")
              .attr("width", 15)
              .attr("height", 15)
              .attr("x", (_, i) =>
                i % 2 === 0
                  ? (i + 1) * dimensions.legendSpacing
                  : i * dimensions.legendSpacing
              )
              .attr("y", (_, i) =>
                i % 2 === 0
                  ? dimensions.barHeight * -1 - 60
                  : dimensions.barHeight * -1 - 25
              )
              .attr("fill", (d) => chartTypeInfo[currentMapChart].colors(d));

            selection
              .append("text")
              .attr("x", (_, i) =>
                i % 2 === 0
                  ? (i + 1) * dimensions.legendSpacing + 20
                  : i * dimensions.legendSpacing + 20
              )
              .attr("y", (_, i) =>
                i % 2 === 0
                  ? dimensions.barHeight * -1 - 45
                  : dimensions.barHeight * -1 - 10
              )
              .attr("fill", "white")
              .attr("font-size", "22px")
              .text((d) => chartTypeInfo[currentMapChart].shortKeys[d]);

            return selection;
          });

        d3.selectAll("text.label").remove();

        var a = d3
          .select(circlesRef.current)
          .append("text")
          .attr("class", "label")
          .attr(
            "transform",
            `translate(-60, -${dimensions.barHeight - 225}) rotate(-90)`
          )
          .attr("fill", "white")
          .text(chartTypeInfo[currentMapChart].axisTitle(currentMapType))
          .style("font-size", 20);

        var y = d3
          .scaleLinear()
          .domain([0, C.maxOccupancy])
          .range([dimensions.barHeight, 0]);

        var yProp = d3
          .scaleLinear()
          .domain([0, 1])
          .range([dimensions.barHeight, 0]);

        var formatPercent = d3.format(".0%");

        var axis = d3.axisLeft(y);
        var axisProp = d3.axisLeft(yProp).tickFormat(formatPercent);

        d3.selectAll("g.axis").remove();

        var b = d3
          .select(circlesRef.current)
          .append("g")
          .attr("class", "axis")
          .style("font-size", 20)
          .attr("transform", `translate(0, -${dimensions.barHeight})`)
          .attr("opacity", 1)
          .call(currentMapType === C.standard ? axis : axisProp)
          .call((g) => g.select(".domain").remove());
      }
    }
  }, [currentMapChart, currentMapType]);

  useEffect(() => {}, [currentMapType]);

  const dimensions = {
    height: 40,
    width: width * 0.8,
    paddingSides: 15,
    barHeight: 40 * 6,
    legendSpacing: 120,
  };

  const margins = {
    top: dimensions.height * 9,
    left: width * 0.175,
  };

  const stacks = {
    [C.race]: raceStack,
    [C.income]: incomeStack,
  };

  const stepper = (i) => {
    // for testing!
    // if (step === 3) stepHandlers['showOutro']()

    if (step === 0) {
      stepHandlers["introduceTrain"]();
    } else if (step === 1) {
      stepHandlers["moveFirstStep"]();
    } else if (step > 1 && step < 5) {
      stepHandlers["noMoveMiddleSteps"]();
    } else if (step === stops.length + 1) {
      stepHandlers["showOutro"]();
    } else {
      stepHandlers["moveMiddleSteps"]();
    }
    setStep(step + 1);
  };

  const showElement = (selection) =>
    d3
      .select(selection)
      .transition()
      .duration(1000)
      .delay(2000)
      .attr("opacity", 1);

  const stopCircs = stops.map((stop, i) => (
    <React.Fragment key={stop[0]}>
      <circle
        r={10}
        cx={
          (dimensions.width / stops.length) * (i + 1) -
          30 +
          dimensions.paddingSides * 2
        }
        cy={dimensions.height / 2}
        fill={stripMapColor(currentStop, i)}
      />
      <text
        fill="white"
        fontSize="22px"
        fontFamily="Helvetica"
        transform={`translate(${
          (dimensions.width / stops.length) * (i + 1) -
          30 +
          dimensions.paddingSides * 1.5
        },${dimensions.height + 15}) rotate(35)`}
      >
        {stop[0]}
      </text>
    </React.Fragment>
  ));

  const handleMapChange = (event) => {
    setValue(event.target.value);
    setCurrentMapChart(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
    setCurrentMapType(event.target.value);
  };
  return (
    <>
      <svg opacity={opacity} height={height} width={width}>
        <foreignObject
          style={{ fontSize: 22 }}
          id="controls"
          x={width - 220}
          y="30"
          width="700"
          height="240"
        >
          <FormControl sx={{ fontSize: "22px  !important" }}>
            <div>Demgraphic Option:</div>
            <RadioGroup value={value} onChange={handleMapChange}>
              <FormControlLabel
                sx={{ fontSize: "22px  !important" }}
                value={C.race}
                control={<Radio sx={whiteStyle} />}
                label={<Typography style={{ fontSize: 22 }}>Race</Typography>}
              />
              <FormControlLabel
                sx={{ fontSize: "22px  !important" }}
                value={C.income}
                control={<Radio sx={whiteStyle} />}
                label={<Typography style={{ fontSize: 22 }}>Income</Typography>}
              />
            </RadioGroup>
            <div>Map Type:</div>
            <RadioGroup value={type} onChange={handleTypeChange}>
              <FormControlLabel
                sx={{ fontSize: "22px  !important" }}
                value={C.standard}
                control={<Radio sx={whiteStyle} />}
                label={
                  <Typography style={{ fontSize: 22 }}>Standard</Typography>
                }
              />
              <FormControlLabel
                sx={{ fontSize: "22px  !important" }}
                value={C.proportional}
                control={<Radio sx={whiteStyle} />}
                label={
                  <Typography style={{ fontSize: 22 }}>Proportional</Typography>
                }
              />
            </RadioGroup>
          </FormControl>
          {/* <FormControl sx={{ fontSize: '22px  !important' }}>
            <RadioGroup value={type} onChange={handleTypeChange}>
              <FormControlLabel sx={{ fontSize: '22px  !important' }} value={C.standard} control={<Radio sx={whiteStyle} />}
                label={<Typography style={{ fontSize: 22 }}>Standard</Typography>}/>
              <FormControlLabel sx={{ fontSize: '22px  !important' }} value={C.proportional} control={<Radio sx={whiteStyle} />}
                label={<Typography style={{ fontSize: 22 }}>Proportional</Typography>}/>
            </RadioGroup>
          </FormControl> */}
        </foreignObject>
        <g
          transform={`translate(${margins.left * 0.28},${margins.top})`}
          ref={circlesRef}
        >
          <rect
            width={dimensions.width + dimensions.paddingSides * 4}
            height={dimensions.height}
            rx={20}
            ry={20}
            fill="#a8a9ac"
          />
          {stopCircs}
        </g>
        <g
          transform={`translate(${width / 1.125} ${margins.top / 1.1})`}
          style={{ cursor: "pointer" }}
          // onClick={step > 2 ? stepper(2) : stepper(step)}
          onClick={() => {
            if (isMoving) return;

            stepper(step);
          }}
        >
          {!isMoving ? <ArrowText step={step} /> : ""}
          <ArrowPath isGlowing={isMoving} transform={`scale(1.5 1.5)`} />
        </g>
      </svg>
    </>
  );
};

export default MapChart;
