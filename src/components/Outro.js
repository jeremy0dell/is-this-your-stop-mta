import { useEffect } from "react";
import * as d3 from "d3";
import omit from "lodash/omit";

import { chartTypeInfo, stops } from "../logic/data";

const dummyRaces = [
  {
    stop: 0,
    "Hispanic or Latino": 5,
    "White alone": 3,
    "Black or African American alone": 28,
    "American Indian and Alaska Native alone": 1,
    "Asian alone": 0,
    "Native Hawaiian and Other Pacific Islander alone": 0,
    "Some Other Race alone": 1,
    "Population of two or more races:": 0,
  },
  {
    stop: 1,
    "Hispanic or Latino": 6,
    "White alone": 3,
    "Black or African American alone": 22,
    "American Indian and Alaska Native alone": 1,
    "Asian alone": 0,
    "Native Hawaiian and Other Pacific Islander alone": 0,
    "Some Other Race alone": 1,
    "Population of two or more races:": 0,
  },
  {
    stop: 2,
    "Hispanic or Latino": 8,
    "White alone": 3,
    "Black or African American alone": 29,
    "American Indian and Alaska Native alone": 1,
    "Asian alone": 0,
    "Native Hawaiian and Other Pacific Islander alone": 0,
    "Some Other Race alone": 1,
    "Population of two or more races:": 1,
  },
  {
    stop: 3,
    "Hispanic or Latino": 13,
    "White alone": 1,
    "Black or African American alone": 32,
    "American Indian and Alaska Native alone": 1,
    "Asian alone": 1,
    "Native Hawaiian and Other Pacific Islander alone": 0,
    "Some Other Race alone": 1,
    "Population of two or more races:": 2,
  },
  {
    stop: 4,
    "Hispanic or Latino": 19,
    "White alone": 2,
    "Black or African American alone": 32,
    "American Indian and Alaska Native alone": 0,
    "Asian alone": 1,
    "Native Hawaiian and Other Pacific Islander alone": 0,
    "Some Other Race alone": 1,
    "Population of two or more races:": 3,
  },
  {
    stop: 5,
    "Hispanic or Latino": 23,
    "White alone": 3,
    "Black or African American alone": 30,
    "American Indian and Alaska Native alone": 0,
    "Asian alone": 0,
    "Native Hawaiian and Other Pacific Islander alone": 0,
    "Some Other Race alone": 1,
    "Population of two or more races:": 1,
  },
  {
    stop: 6,
    "Hispanic or Latino": 23,
    "White alone": 5,
    "Black or African American alone": 32,
    "American Indian and Alaska Native alone": 0,
    "Asian alone": 3,
    "Native Hawaiian and Other Pacific Islander alone": 0,
    "Some Other Race alone": 1,
    "Population of two or more races:": 0,
  },
  {
    stop: 7,
    "Hispanic or Latino": 24,
    "White alone": 5,
    "Black or African American alone": 30,
    "American Indian and Alaska Native alone": 1,
    "Asian alone": 4,
    "Native Hawaiian and Other Pacific Islander alone": 1,
    "Some Other Race alone": 1,
    "Population of two or more races:": 1,
  },
  {
    stop: 8,
    "Hispanic or Latino": 27,
    "White alone": 10,
    "Black or African American alone": 27,
    "American Indian and Alaska Native alone": 2,
    "Asian alone": 5,
    "Native Hawaiian and Other Pacific Islander alone": 1,
    "Some Other Race alone": 1,
    "Population of two or more races:": 1,
  },
  {
    stop: 9,
    "Hispanic or Latino": 36,
    "White alone": 11,
    "Black or African American alone": 24,
    "American Indian and Alaska Native alone": 2,
    "Asian alone": 5,
    "Native Hawaiian and Other Pacific Islander alone": 0,
    "Some Other Race alone": 0,
    "Population of two or more races:": 1,
  },
  {
    stop: 10,
    "Hispanic or Latino": 27,
    "White alone": 8,
    "Black or African American alone": 21,
    "American Indian and Alaska Native alone": 1,
    "Asian alone": 5,
    "Native Hawaiian and Other Pacific Islander alone": 0,
    "Some Other Race alone": 0,
    "Population of two or more races:": 1,
  },
  {
    stop: 11,
    "Hispanic or Latino": 49,
    "White alone": 31,
    "Black or African American alone": 16,
    "American Indian and Alaska Native alone": 1,
    "Asian alone": 11,
    "Native Hawaiian and Other Pacific Islander alone": 1,
    "Some Other Race alone": 2,
    "Population of two or more races:": 4,
  },
  {
    stop: 12,
    "Hispanic or Latino": 58,
    "White alone": 37,
    "Black or African American alone": 12,
    "American Indian and Alaska Native alone": 0,
    "Asian alone": 10,
    "Native Hawaiian and Other Pacific Islander alone": 3,
    "Some Other Race alone": 1,
    "Population of two or more races:": 4,
  },
  {
    stop: 13,
    "Hispanic or Latino": 57,
    "White alone": 35,
    "Black or African American alone": 16,
    "American Indian and Alaska Native alone": 1,
    "Asian alone": 10,
    "Native Hawaiian and Other Pacific Islander alone": 3,
    "Some Other Race alone": 3,
    "Population of two or more races:": 5,
  },
  {
    stop: 14,
    "Hispanic or Latino": 59,
    "White alone": 34,
    "Black or African American alone": 22,
    "American Indian and Alaska Native alone": 1,
    "Asian alone": 12,
    "Native Hawaiian and Other Pacific Islander alone": 3,
    "Some Other Race alone": 3,
    "Population of two or more races:": 7,
  },
  {
    stop: 15,
    "Hispanic or Latino": 55,
    "White alone": 46,
    "Black or African American alone": 20,
    "American Indian and Alaska Native alone": 1,
    "Asian alone": 14,
    "Native Hawaiian and Other Pacific Islander alone": 3,
    "Some Other Race alone": 3,
    "Population of two or more races:": 6,
  },
  {
    stop: 16,
    "Hispanic or Latino": 44,
    "White alone": 64,
    "Black or African American alone": 16,
    "American Indian and Alaska Native alone": 1,
    "Asian alone": 11,
    "Native Hawaiian and Other Pacific Islander alone": 3,
    "Some Other Race alone": 3,
    "Population of two or more races:": 6,
  },
  {
    stop: 17,
    "Hispanic or Latino": 33,
    "White alone": 80,
    "Black or African American alone": 13,
    "American Indian and Alaska Native alone": 1,
    "Asian alone": 15,
    "Native Hawaiian and Other Pacific Islander alone": 2,
    "Some Other Race alone": 2,
    "Population of two or more races:": 7,
  },
  {
    stop: 18,
    "Hispanic or Latino": 43,
    "White alone": 91,
    "Black or African American alone": 8,
    "American Indian and Alaska Native alone": 2,
    "Asian alone": 21,
    "Native Hawaiian and Other Pacific Islander alone": 3,
    "Some Other Race alone": 1,
    "Population of two or more races:": 5,
  },
  {
    stop: 19,
    "Hispanic or Latino": 33,
    "White alone": 101,
    "Black or African American alone": 7,
    "American Indian and Alaska Native alone": 2,
    "Asian alone": 24,
    "Native Hawaiian and Other Pacific Islander alone": 3,
    "Some Other Race alone": 0,
    "Population of two or more races:": 4,
  },
  {
    stop: 20,
    "Hispanic or Latino": 25,
    "White alone": 105,
    "Black or African American alone": 8,
    "American Indian and Alaska Native alone": 1,
    "Asian alone": 26,
    "Native Hawaiian and Other Pacific Islander alone": 1,
    "Some Other Race alone": 0,
    "Population of two or more races:": 8,
  },
  {
    stop: 21,
    "Hispanic or Latino": 11,
    "White alone": 119,
    "Black or African American alone": 9,
    "American Indian and Alaska Native alone": 1,
    "Asian alone": 26,
    "Native Hawaiian and Other Pacific Islander alone": 0,
    "Some Other Race alone": 2,
    "Population of two or more races:": 12,
  },
  {
    stop: 22,
    "Hispanic or Latino": 14,
    "White alone": 114,
    "Black or African American alone": 5,
    "American Indian and Alaska Native alone": 0,
    "Asian alone": 21,
    "Native Hawaiian and Other Pacific Islander alone": 0,
    "Some Other Race alone": 1,
    "Population of two or more races:": 9,
  },
  {
    stop: 23,
    "Hispanic or Latino": 19,
    "White alone": 99,
    "Black or African American alone": 7,
    "American Indian and Alaska Native alone": 2,
    "Asian alone": 14,
    "Native Hawaiian and Other Pacific Islander alone": 4,
    "Some Other Race alone": 1,
    "Population of two or more races:": 5,
  },
];
const dummyIncomes = [
  {
    stop: 0,
    "Less than $10,000": 2,
    "$10,000 to $14,999": 0,
    "$15,000 to $24,999": 2,
    "$25,000 to $34,999": 3,
    "$35,000 to $49,999": 6,
    "$50,000 to $74,999": 8,
    "$75,000 to $99,999": 8,
    "$100,000 to $149,999": 4,
    "$150,000 to $199,999": 4,
    "$200,000 or more": 1,
  },
  {
    stop: 1,
    "Less than $10,000": 3,
    "$10,000 to $14,999": 0,
    "$15,000 to $24,999": 1,
    "$25,000 to $34,999": 3,
    "$35,000 to $49,999": 5,
    "$50,000 to $74,999": 7,
    "$75,000 to $99,999": 7,
    "$100,000 to $149,999": 3,
    "$150,000 to $199,999": 4,
    "$200,000 or more": 0,
  },
  {
    stop: 2,
    "Less than $10,000": 7,
    "$10,000 to $14,999": 2,
    "$15,000 to $24,999": 3,
    "$25,000 to $34,999": 4,
    "$35,000 to $49,999": 7,
    "$50,000 to $74,999": 7,
    "$75,000 to $99,999": 4,
    "$100,000 to $149,999": 4,
    "$150,000 to $199,999": 4,
    "$200,000 or more": 1,
  },
  {
    stop: 3,
    "Less than $10,000": 6,
    "$10,000 to $14,999": 3,
    "$15,000 to $24,999": 7,
    "$25,000 to $34,999": 3,
    "$35,000 to $49,999": 9,
    "$50,000 to $74,999": 8,
    "$75,000 to $99,999": 6,
    "$100,000 to $149,999": 4,
    "$150,000 to $199,999": 4,
    "$200,000 or more": 1,
  },
  {
    stop: 4,
    "Less than $10,000": 11,
    "$10,000 to $14,999": 5,
    "$15,000 to $24,999": 7,
    "$25,000 to $34,999": 2,
    "$35,000 to $49,999": 8,
    "$50,000 to $74,999": 11,
    "$75,000 to $99,999": 6,
    "$100,000 to $149,999": 4,
    "$150,000 to $199,999": 2,
    "$200,000 or more": 2,
  },
  {
    stop: 5,
    "Less than $10,000": 14,
    "$10,000 to $14,999": 4,
    "$15,000 to $24,999": 8,
    "$25,000 to $34,999": 2,
    "$35,000 to $49,999": 8,
    "$50,000 to $74,999": 10,
    "$75,000 to $99,999": 5,
    "$100,000 to $149,999": 3,
    "$150,000 to $199,999": 2,
    "$200,000 or more": 2,
  },
  {
    stop: 6,
    "Less than $10,000": 11,
    "$10,000 to $14,999": 6,
    "$15,000 to $24,999": 12,
    "$25,000 to $34,999": 1,
    "$35,000 to $49,999": 9,
    "$50,000 to $74,999": 9,
    "$75,000 to $99,999": 6,
    "$100,000 to $149,999": 5,
    "$150,000 to $199,999": 2,
    "$200,000 or more": 3,
  },
  {
    stop: 7,
    "Less than $10,000": 12,
    "$10,000 to $14,999": 8,
    "$15,000 to $24,999": 9,
    "$25,000 to $34,999": 5,
    "$35,000 to $49,999": 10,
    "$50,000 to $74,999": 9,
    "$75,000 to $99,999": 6,
    "$100,000 to $149,999": 6,
    "$150,000 to $199,999": 1,
    "$200,000 or more": 1,
  },
  {
    stop: 8,
    "Less than $10,000": 8,
    "$10,000 to $14,999": 8,
    "$15,000 to $24,999": 8,
    "$25,000 to $34,999": 6,
    "$35,000 to $49,999": 9,
    "$50,000 to $74,999": 12,
    "$75,000 to $99,999": 6,
    "$100,000 to $149,999": 9,
    "$150,000 to $199,999": 5,
    "$200,000 or more": 3,
  },
  {
    stop: 9,
    "Less than $10,000": 8,
    "$10,000 to $14,999": 8,
    "$15,000 to $24,999": 10,
    "$25,000 to $34,999": 7,
    "$35,000 to $49,999": 12,
    "$50,000 to $74,999": 9,
    "$75,000 to $99,999": 9,
    "$100,000 to $149,999": 7,
    "$150,000 to $199,999": 5,
    "$200,000 or more": 4,
  },
  {
    stop: 10,
    "Less than $10,000": 7,
    "$10,000 to $14,999": 5,
    "$15,000 to $24,999": 6,
    "$25,000 to $34,999": 4,
    "$35,000 to $49,999": 8,
    "$50,000 to $74,999": 7,
    "$75,000 to $99,999": 8,
    "$100,000 to $149,999": 9,
    "$150,000 to $199,999": 5,
    "$200,000 or more": 4,
  },
  {
    stop: 11,
    "Less than $10,000": 8,
    "$10,000 to $14,999": 7,
    "$15,000 to $24,999": 13,
    "$25,000 to $34,999": 13,
    "$35,000 to $49,999": 13,
    "$50,000 to $74,999": 18,
    "$75,000 to $99,999": 12,
    "$100,000 to $149,999": 15,
    "$150,000 to $199,999": 10,
    "$200,000 or more": 6,
  },
  {
    stop: 12,
    "Less than $10,000": 11,
    "$10,000 to $14,999": 6,
    "$15,000 to $24,999": 13,
    "$25,000 to $34,999": 14,
    "$35,000 to $49,999": 13,
    "$50,000 to $74,999": 24,
    "$75,000 to $99,999": 12,
    "$100,000 to $149,999": 16,
    "$150,000 to $199,999": 9,
    "$200,000 or more": 7,
  },
  {
    stop: 13,
    "Less than $10,000": 13,
    "$10,000 to $14,999": 7,
    "$15,000 to $24,999": 14,
    "$25,000 to $34,999": 14,
    "$35,000 to $49,999": 13,
    "$50,000 to $74,999": 22,
    "$75,000 to $99,999": 8,
    "$100,000 to $149,999": 16,
    "$150,000 to $199,999": 16,
    "$200,000 or more": 7,
  },
  {
    stop: 14,
    "Less than $10,000": 20,
    "$10,000 to $14,999": 7,
    "$15,000 to $24,999": 12,
    "$25,000 to $34,999": 17,
    "$35,000 to $49,999": 13,
    "$50,000 to $74,999": 21,
    "$75,000 to $99,999": 19,
    "$100,000 to $149,999": 13,
    "$150,000 to $199,999": 11,
    "$200,000 or more": 8,
  },
  {
    stop: 15,
    "Less than $10,000": 17,
    "$10,000 to $14,999": 8,
    "$15,000 to $24,999": 7,
    "$25,000 to $34,999": 15,
    "$35,000 to $49,999": 18,
    "$50,000 to $74,999": 17,
    "$75,000 to $99,999": 19,
    "$100,000 to $149,999": 15,
    "$150,000 to $199,999": 21,
    "$200,000 or more": 11,
  },
  {
    stop: 16,
    "Less than $10,000": 14,
    "$10,000 to $14,999": 7,
    "$15,000 to $24,999": 6,
    "$25,000 to $34,999": 15,
    "$35,000 to $49,999": 15,
    "$50,000 to $74,999": 17,
    "$75,000 to $99,999": 24,
    "$100,000 to $149,999": 18,
    "$150,000 to $199,999": 20,
    "$200,000 or more": 12,
  },
  {
    stop: 17,
    "Less than $10,000": 9,
    "$10,000 to $14,999": 7,
    "$15,000 to $24,999": 7,
    "$25,000 to $34,999": 12,
    "$35,000 to $49,999": 11,
    "$50,000 to $74,999": 18,
    "$75,000 to $99,999": 19,
    "$100,000 to $149,999": 23,
    "$150,000 to $199,999": 27,
    "$200,000 or more": 20,
  },
  {
    stop: 18,
    "Less than $10,000": 10,
    "$10,000 to $14,999": 8,
    "$15,000 to $24,999": 9,
    "$25,000 to $34,999": 8,
    "$35,000 to $49,999": 12,
    "$50,000 to $74,999": 26,
    "$75,000 to $99,999": 19,
    "$100,000 to $149,999": 30,
    "$150,000 to $199,999": 23,
    "$200,000 or more": 29,
  },
  {
    stop: 19,
    "Less than $10,000": 9,
    "$10,000 to $14,999": 8,
    "$15,000 to $24,999": 9,
    "$25,000 to $34,999": 6,
    "$35,000 to $49,999": 12,
    "$50,000 to $74,999": 30,
    "$75,000 to $99,999": 17,
    "$100,000 to $149,999": 24,
    "$150,000 to $199,999": 26,
    "$200,000 or more": 33,
  },
  {
    stop: 20,
    "Less than $10,000": 14,
    "$10,000 to $14,999": 6,
    "$15,000 to $24,999": 10,
    "$25,000 to $34,999": 5,
    "$35,000 to $49,999": 10,
    "$50,000 to $74,999": 29,
    "$75,000 to $99,999": 15,
    "$100,000 to $149,999": 19,
    "$150,000 to $199,999": 29,
    "$200,000 or more": 37,
  },
  {
    stop: 21,
    "Less than $10,000": 13,
    "$10,000 to $14,999": 3,
    "$15,000 to $24,999": 4,
    "$25,000 to $34,999": 4,
    "$35,000 to $49,999": 11,
    "$50,000 to $74,999": 15,
    "$75,000 to $99,999": 20,
    "$100,000 to $149,999": 18,
    "$150,000 to $199,999": 19,
    "$200,000 or more": 73,
  },
  {
    stop: 22,
    "Less than $10,000": 8,
    "$10,000 to $14,999": 2,
    "$15,000 to $24,999": 2,
    "$25,000 to $34,999": 1,
    "$35,000 to $49,999": 11,
    "$50,000 to $74,999": 11,
    "$75,000 to $99,999": 18,
    "$100,000 to $149,999": 23,
    "$150,000 to $199,999": 19,
    "$200,000 or more": 69,
  },
  {
    stop: 23,
    "Less than $10,000": 7,
    "$10,000 to $14,999": 8,
    "$15,000 to $24,999": 2,
    "$25,000 to $34,999": 6,
    "$35,000 to $49,999": 9,
    "$50,000 to $74,999": 13,
    "$75,000 to $99,999": 10,
    "$100,000 to $149,999": 25,
    "$150,000 to $199,999": 26,
    "$200,000 or more": 45,
  },
];

// set the dimensions and margins of the graph
var width = 450,
  height = 450,
  margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin;

const arcs = (slice) => {
  var pieData = Object.entries(omit(slice, "stop"));

  // console.log(pieData)

  var data = d3.pie().value((d) => d[1]);

  return data(pieData);
};

// var arc = d3.arc()
// 	.outerRadius(radius * 0.8)
// 	.innerRadius(radius * 0.4);

// var outerArc = d3.arc()
// 	.innerRadius(radius * 0.9)
// 	.outerRadius(radius * 0.9);

const Outro = ({ height, width, raceStack, incomeStack }) => {
  useEffect(() => {
    var svgWidth = 250,
      svgHeight = 250;

    var radius = Math.min(svgWidth, svgHeight) / 2;
    // console.log('hi', radius)

    var idxs = [3, 11, 21];

    for (var i = 0; i < idxs.length; i++) {
      var raceSelection = d3.select("#visualizations");
      var raceArcs = arcs(raceStack[idxs[i]]);
      // var raceArcs = arcs(dummyRaces[idxs[i]])
      let total = raceArcs.reduce((acc, next) => acc + next.value, 0);

      raceSelection
        .append("g")
        .attr("class", "race" + i)
        .attr(
          "transform",
          `translate(${svgWidth}, ${svgHeight * (i + 1) + 50 * i - 75})`
        );

      raceSelection
        .select("g.race" + i)
        .selectAll("path.slice")
        .data(raceArcs)
        .join((enter) =>
          enter
            .append("path")
            .attr("class", "slice")
            .attr("class", (d) =>
              d.data[0].replaceAll(" ", "").replaceAll(":", "")
            )
            .style("fill", (d) => {
              return chartTypeInfo["race"].colors(d.data[0]);
            })
            .attr("d", (d) => d3.arc().innerRadius(50).outerRadius(radius)(d))
        )
        .on("mouseover", (e, d) => {
          var tooltip = d3.select("#tooltip");
          // console.log('hi', e, tooltip, e.clientX)

          tooltip
            .style("top", e.clientY - 30 + "px")
            .style("left", e.clientX + 30 + "px")
            .html(
              `<div style="text-align: center; width: 120px;">
Proportion of ${chartTypeInfo["race"].shortKeys[d.data[0]]} riders at this stop:
<br>
<span style="font-weight: bold; color: #FF9C28">${
                ((d.value / total) * 100).toFixed(2) + "%"
              }</span>
              </div>`
            );

          tooltip.transition().style("opacity", 1);

          d3.selectAll(
            `path.${d.data[0].replaceAll(" ", "").replaceAll(":", "")}`
          )
            // .transition()
            .style(
              "filter",
              "brightness(1.3) drop-shadow(rgba(255, 170, 51, 0.5) 0px 0px 10.63545px)"
            );
        })
        .on("mouseout", (e, d) => {
          var tooltip = d3.select("#tooltip");

          tooltip.transition().style("opacity", 0);
          // .on('end', (a,b,c,d) => console.log('end', a,b,c,d))

          // console.log(d)
          d3.selectAll(
            `path.${d.data[0].replaceAll(" ", "").replaceAll(":", "")}`
          )
            // .transition()
            .style(
              "filter",
              "brightness(1) drop-shadow(rgba(255, 170, 51, 0.5) 0px 0px 0px)"
            );
        });
    }

    for (var i = 0; i < idxs.length; i++) {
      var incomeSelection = d3.select("#visualizations");
      var incomeArcs = arcs(incomeStack[idxs[i]]);
      // var incomeArcs = arcs(dummyIncomes[idxs[i]])

      let total = incomeArcs.reduce((acc, next) => acc + next.value, 0);

      incomeSelection
        .append("g")
        .attr("class", "income" + i)
        .attr(
          "transform",
          `translate(${svgWidth * 4}, ${svgHeight * (i + 1) + 50 * i - 75})`
        );

      incomeSelection
        .select("g.income" + i)
        .selectAll("path.slice")
        .data(incomeArcs)
        .join((enter) =>
          enter
            .append("path")
            .attr("class", "slice")
            .attr("class", (d) => chartTypeInfo["income"].selectors[d.data[0]])
            .style("fill", (d) => {
              return chartTypeInfo["income"].colors(d.data[0]);
            })
            .attr("d", (d) => d3.arc().innerRadius(50).outerRadius(radius)(d))
        )
        .on("mouseover", (e, d, a) => {
          var tooltip = d3.select("#tooltip");

          tooltip
            .style("top", e.clientY - 140 + "px")
            .style("left", e.clientX - 140 + "px")
            .html(
              `<div style="text-align: center; width: 175px;">
Proportion of ${
                chartTypeInfo["income"].shortKeys[d.data[0]]
              } riders at this stop:
<br>
<span style="font-weight: bold; color: #FF9C28">${
                ((d.value / total) * 100).toFixed(2) + "%"
              }</span>
              </div>`
            );

          tooltip.transition().style("opacity", 1);
          d3.selectAll(`path.${chartTypeInfo["income"].selectors[d.data[0]]}`)
            // .transition()
            .style(
              "filter",
              "brightness(1.3) drop-shadow(rgba(255, 170, 51, 0.5) 0px 0px 10.63545px)"
            );
        })
        .on("mouseout", (e, d) => {
          var tooltip = d3.select("#tooltip");

          tooltip.transition().style("opacity", 0);
          // .on('end', (a,b,c,d) => console.log('end', a,b,c,d))

          // console.log(d)
          d3.selectAll(`path.${chartTypeInfo["income"].selectors[d.data[0]]}`)
            // .transition()
            .style(
              "filter",
              "brightness(1) drop-shadow(rgba(255, 170, 51, 0.5) 0px 0px 0px)"
            );
        });
    }

    for (var i = 0; i < idxs.length; i++) {
      var incomeSelection = d3.select("#visualizations");

      incomeSelection
        .append("text")
        .attr(
          "transform",
          `translate(${svgWidth * 2.5}, ${svgHeight * (i + 1) + 50 * i - 75})`
        )
        .attr("width", 300)
        .attr("fill", "white")
        .attr("font-size", 30)
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .text(stops[idxs[i]][0]);
    }

    d3.select("#visualizations")
      .append("text")
      .attr("transform", `translate(${svgWidth * 0.61}, ${svgHeight / 10})`)
      .attr("fill", "white")
      .attr("font-size", "26px")
      .text("Racial Demographics");

    d3.select("#visualizations")
      .append("text")
      .attr("transform", `translate(${svgWidth * 3.53}, ${svgHeight / 10})`)
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
      {/* text */}
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
      {/* vizes */}
      <svg id="visualizations" height={height} width={width * 0.7}>
        {/* <div id="race-viz" style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}></div>
        <div id="income-viz" style={{ width: '50%'}}></div> */}
      </svg>
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
