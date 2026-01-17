import { useState } from "react";
import * as d3 from "d3";

import firstMap from "../assets/images/first-map.png";
import secondMap from "../assets/images/second-map.png";
import thirdMap from "../assets/images/third-map.png";
import IntroScreen from "./IntroScreen";

const Intro = () => {
  const [current, setCurrent] = useState(0);

  const handleChange = () => {
    d3.select(`#stop${current}`)
      .transition()
      .duration(1000)
      .delay(200)
      .style("opacity", 0)
      .remove();

    d3.select(`#map-img${current}`)
      .transition()
      .duration(1000)
      .delay(500)
      .style("opacity", 0)
      .remove();

    d3.select(`#stop${current + 1}`)
      .transition()
      .duration(1000)
      .style("opacity", 1);

    d3.select(`#map-img${current + 1}`)
      .transition()
      .duration(1000)
      .style("opacity", 1);

    setCurrent(current + 1);
  };
  return (
    <div
      style={{
        fontFamily: "'Helvetica'",
        backgroundColor: "darkgrey",
        display: "flex",
        flexDirection: "column",
        alignItems: "end",
      }}
    >
      <div
        id="map-img0"
        style={{
          position: "absolute",
          height: "100vh",
          width: "100vw",
          top: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: 1,
        }}
      >
        <img style={{ height: "100%", width: "100%" }} src={firstMap} alt="L train route map - eastern section" />
      </div>
      <div
        id="map-img1"
        style={{
          position: "absolute",
          height: "100vh",
          width: "100vw",
          top: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0,
        }}
      >
        <img style={{ height: "100%", width: "100%" }} src={secondMap} alt="L train route map - central section" />
      </div>
      <div
        id="map-img2"
        style={{
          position: "absolute",
          height: "100vh",
          width: "100vw",
          top: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0,
        }}
      >
        <img style={{ height: "100%", width: "100%" }} src={thirdMap} alt="L train route map - western section" />
      </div>
      <IntroScreen id="stop0" opacity={1} onClick={handleChange}>
        <h1 style={{ fontSize: 120, display: "flex", margin: 0 }}>
          Is This Your Stop?
        </h1>
        <div style={{ borderTop: "2px solid black" }}></div>
        <h2 style={{ fontSize: 30 }}>How Data Drives The MTA</h2>
      </IntroScreen>

      <IntroScreen id="stop1" opacity={0} onClick={handleChange}>
        <h2 style={{ fontSize: 25 }}>
          New York City is by many measures the most culturally and
          socioeconomically diverse city in America. Coupled with NYC's massive
          population and intercity transit system, these factors put together
          have created the conditions for a diverse and interesting population
          of subway riders in NYC.
        </h2>
        <div style={{ borderTop: "2px solid black" }}></div>
        <h2 style={{ fontSize: 25 }}>
          The L Train, which serves commuters in Brooklyn, Manhattan, and
          Queens, is no exception to this, and spans a wide variety of
          neighborhoods within these boroughs. This project serves to highlight
          the diversity of the people living along this line, as well as the
          inequities between the neighborhoods this line services.
        </h2>
      </IntroScreen>

      <IntroScreen id="stop2" opacity={0} onClick={handleChange}>
        <h2 style={{ fontSize: 26 }}>
          In this visualization, we will simulate a trip from one end of the L
          Train in Brooklyn, all the way to the other end in Manhattan. This
          simulation will incorporate subway ridership data, as well as 2020
          Census data to provide a cohesive demonstration of this ride.
        </h2>
        <div style={{ borderTop: "2px solid black" }}></div>
        <h2 style={{ fontSize: 26 }}>
          Along the way we will be able to see how historical forces such as
          racial segregation and gentrification have shaped the demographics of
          the people in the neighborhoods that this train serves.
        </h2>
      </IntroScreen>
    </div>
  );
};

export default Intro;
