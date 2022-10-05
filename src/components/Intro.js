import { useState } from "react";
import * as d3 from "d3";

import firstMap from "../assets/images/first-map.png";
import secondMap from "../assets/images/second-map.png";
import thirdMap from "../assets/images/third-map.png";
import arrowCircle from "../assets/images/arrowCircle.png";

/**
 *
 * top - 8
 * bottom - 24
 */

const First = ({ click }) => {
  return (
    <div
      id="stop0"
      style={{
        opacity: 1,
        height: "calc(100vh - 60px)",
        position: "absolute",
        width: "33%",
        margin: "20px 30px 20px 0px",
        borderRadius: 20,
        // padding: 8,
        // textAlign: 'center',
        backgroundColor: "white",
        color: "black",
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
      }}
    >
      <div
        style={{ width: "100%", height: "12%", backgroundColor: "black" }}
      ></div>
      <div
        style={{
          height: "64%",
          padding: "5% 5%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <h1 style={{ fontSize: 120, display: "flex", margin: 0 }}>
          Is This Your Stop?
        </h1>
        <div style={{ borderTop: "2px solid black" }}></div>
        <h2 style={{ fontSize: 30 }}>How Data Drives The MTA</h2>
      </div>
      <div
        onClick={click}
        style={{
          width: "100%",
          height: "12%",
          backgroundColor: "#FF9C28",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img style={{ height: "50%" }} src={arrowCircle} />
        <div style={{ fontWeight: "bold", marginLeft: 12, fontSize: 45 }}>
          Next Stop
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "12%",
          backgroundColor: "#E5E6EB",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 14,
        }}
      >
        <div style={{ padding: "0px 5%" }}>
          <div>The New School</div>
          <div>Parsons School of Art & Design</div>
          <div>Masters of Science, Data Visualization</div>
        </div>
        <div style={{ padding: "0px 5%" }}>
          <div>Jeremy Odell</div>
          <div>MSDV Thesis</div>
          <div>Spring 2022</div>
        </div>
      </div>
    </div>
  );
};

const Second = ({ click }) => {
  return (
    <div
      id="stop1"
      style={{
        opacity: 0,
        position: "absolute",
        height: "calc(100vh - 60px)",
        width: "33%",
        margin: "20px 30px 20px 0px",
        borderRadius: 20,
        // padding: 8,
        // textAlign: 'center',
        backgroundColor: "white",
        color: "black",
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
      }}
    >
      <div
        style={{ width: "100%", height: "12%", backgroundColor: "black" }}
      ></div>
      <div
        style={{
          height: "64%",
          padding: "5% 5%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <h2 style={{ fontSize: 25 }}>
          New York City is by many measures the most culturally and
          socioeconomically diverse cities in America. Coupled with NYC’s
          massive population and intercity transit system, these factors put
          together have created the conditions for a diverse and interesting
          population of subway riders in NYC.
        </h2>
        <div style={{ borderTop: "2px solid black" }}></div>
        <h2 style={{ fontSize: 25 }}>
          The L Train, which serves commuters in Brooklyn, Manhattan, and
          Queens, is no exception to this, and spans a wide variety of
          neighborhoods within these boroughs. This project serves to highlight
          the diversity of the people living along this line, as well as the
          inequities between the neighborhoods this line services.
        </h2>
      </div>
      <div
        onClick={click}
        style={{
          width: "100%",
          height: "12%",
          backgroundColor: "#FF9C28",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <img style={{ height: "50%" }} src={arrowCircle} />
        <div style={{ fontWeight: "bold", marginLeft: 12, fontSize: 45 }}>
          Next Stop
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "12%",
          backgroundColor: "#E5E6EB",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 14,
        }}
      >
        <div style={{ padding: "0px 5%" }}>
          <div>The New School</div>
          <div>Parsons School of Art & Design</div>
          <div>Masters of Science, Data Visualization</div>
        </div>
        <div style={{ padding: "0px 5%" }}>
          <div>Jeremy Odell</div>
          <div>MSDV Thesis</div>
          <div>Spring 2022</div>
        </div>
      </div>
    </div>
  );
};

const Third = ({ click }) => {
  return (
    <div
      id="stop2"
      style={{
        opacity: 0,
        position: "absolute",
        height: "calc(100vh - 60px)",
        width: "33%",
        margin: "20px 30px 20px 0px",
        borderRadius: 20,
        // padding: 8,
        // textAlign: 'center',
        backgroundColor: "white",
        color: "black",
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
      }}
    >
      <div
        style={{ width: "100%", height: "12%", backgroundColor: "black" }}
      ></div>
      <div
        style={{
          height: "64%",
          padding: "5% 5%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
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
      </div>
      <div
        onClick={click}
        style={{
          width: "100%",
          height: "12%",
          backgroundColor: "#FF9C28",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <img style={{ height: "50%" }} src={arrowCircle} />
        <div style={{ fontWeight: "bold", marginLeft: 12, fontSize: 45 }}>
          Next Stop
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "12%",
          backgroundColor: "#E5E6EB",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 14,
        }}
      >
        <div style={{ padding: "0px 5%" }}>
          <div>The New School</div>
          <div>Parsons School of Art & Design</div>
          <div>Masters of Science, Data Visualization</div>
        </div>
        <div style={{ padding: "0px 5%" }}>
          <div>Jeremy Odell</div>
          <div>MSDV Thesis</div>
          <div>Spring 2022</div>
        </div>
      </div>
    </div>
  );
};

const Intro = () => {
  const [current, setCurrent] = useState(0);

  const handleChange = () => {
    const curr = d3
      .select(`#stop${current}`)
      .transition()
      .duration(1000)
      .delay(200)
      .style("opacity", 0)
      .remove();

    const currImg = d3
      .select(`#map-img${current}`)
      .transition()
      .duration(1000)
      .delay(500)
      .style("opacity", 0)
      .remove();

    const next = d3
      .select(`#stop${current + 1}`)
      .transition()
      .duration(1000)
      .style("opacity", 1);

    const nextImg = d3
      .select(`#map-img${current + 1}`)
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
        <img style={{ height: "100%", width: "100%" }} src={firstMap} />
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
        <img style={{ height: "100%", width: "100%" }} src={secondMap} />
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
        <img style={{ height: "100%", width: "100%" }} src={thirdMap} />
      </div>
      <First click={handleChange} />
      <Second click={handleChange} />
      <Third click={handleChange} />
    </div>
  );
};

export default Intro;
