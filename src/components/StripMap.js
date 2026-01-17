import React from "react";
import { stops } from "../logic/data";

const stripMapColor = (curr, i) => {
  if (curr === i) {
    return "#ffa812";
  } else if (curr > i) {
    return "#a75c00";
  } else {
    return "#231f20";
  }
};

const StripMap = ({ currentStop, dimensions }) => {
  return (
    <>
      {stops.map((stop, i) => (
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
      ))}
    </>
  );
};

export default StripMap;
