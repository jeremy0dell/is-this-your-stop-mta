import { useState, useEffect, useRef } from "react";
import cloneDeep from "lodash/cloneDeep";
import * as d3 from "d3";
import { Scrollama, Step } from "react-scrollama";
import InfoIcon from "@mui/icons-material/Info";
import useWindowSize from "./hooks/useWindowSize";

import TrainChart from "./components/TrainChart";
import MapChart from "./components/MapChart";
import Intro from "./components/Intro";
import Outro from "./components/Outro";
import Map from "./components/Map";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import {
  createGridTrain,
  scanTrain,
  handleEgress,
  handleMoveSeats,
  handleBoard,
} from "./logic/trainHandlers";
import * as C from "./logic/constants";
import { stops } from "./logic/data";

import firstMap from "./assets/images/first-map.png";
import arrowBtn from "./assets/images/arrow-btn2.png";

import "./App.css";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "black",
  color: "white",
  border: "2px solid grey",
  boxShadow: 24,
  p: 4,
};

function App() {
  // sizing
  const windowSize = useWindowSize();
  // train state
  const [gridTrain, setGridTrain] = useState(
    createGridTrain(C.height, C.width, C.seatIdxs, C.doorIdxs)
  );
  const [peopleBoarded, setPeopleBoarded] = useState([]);
  const [peopleTotal, setPeopleTotal] = useState([]);
  // map state
  const [currentMapChart, setCurrentMapChart] = useState(C.race);
  const [currentMapType, setCurrentMapType] = useState(C.standard);
  // orchestration
  const [isMoving, setIsMoving] = useState(false);
  // scrolly
  const [currentStepIndex, setCurrentStepIndex] = useState(null);
  const imgRef = useRef(null);
  // specific charts
  const [genderStack, setGenderStack] = useState([]);
  const [raceStack, setRaceStack] = useState([]);
  const [incomeStack, setIncomeStack] = useState([]);
  const [currentStop, setCurrentStop] = useState(0);
  const [action, setAction] = useState("");
  const [isOutro, setIsOutro] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const {
      newGridTrain,
      occupiedSpaces,
      occupiedAreas,
      availableSeats,
      availableSpaces,
    } = scanTrain(gridTrain, C.height, C.width);

    let boardedCopy = cloneDeep(peopleBoarded);
    let totalCopy = cloneDeep(peopleTotal);

    switch (action) {
      case C.egress: {
        const { boarded, total, train } = handleEgress(
          newGridTrain,
          boardedCopy,
          totalCopy,
          occupiedAreas,
          stops,
          currentStop
        );

        updateState(boarded, total, train);
        break;
      }
      case C.moveSeats: {
        const { boarded, total, train } = handleMoveSeats(
          newGridTrain,
          totalCopy,
          boardedCopy,
          availableSeats,
          occupiedSpaces
        );

        updateState(boarded, total, train);
        break;
      }
      case C.board: {
        const { boarded, total, train } = handleBoard(
          newGridTrain,
          totalCopy,
          boardedCopy,
          availableSeats,
          availableSpaces,
          stops,
          currentStop
        );

        updateState(boarded, total, train);

        // gender
        setGenderStack(
          genderStack.concat({
            stop: currentStop,
            male: boardedCopy.reduce(
              (a, n) => (n.gender === "male" ? a + 1 : a),
              0
            ),
            female: boardedCopy.reduce(
              (a, n) => (n.gender === "female" ? a + 1 : a),
              0
            ),
          })
        );

        // race
        setRaceStack(
          raceStack.concat({
            stop: currentStop,
            ...boardedCopy.reduce((acc, next) => {
              acc[next.race] += 1;
              return acc;
            }, cloneDeep(C.emptyRaces)),
          })
        );

        // income
        setIncomeStack(
          incomeStack.concat({
            stop: currentStop,
            ...boardedCopy.reduce((acc, next) => {
              acc[next.income] += 1;
              return acc;
            }, cloneDeep(C.emptyIncomes)),
          })
        );

        break;
      }
      default:
        return;
    }
  }, [action]);

  const updateState = (boardedCopy, totalCopy, newGridTrain) => {
    setPeopleBoarded(boardedCopy);
    setPeopleTotal(totalCopy);
    setGridTrain(newGridTrain);
  };

  const introduceTrain = () => {
    const map = d3.select("#map");
    const train = d3.select("#train");

    map.transition().duration(1500).style("height", "55vh");

    train.transition().duration(1500).style("height", "45vh");

    map.style("overflow-y", "hidden");
  };

  const showOutro = () => {
    setIsOutro(true);
    const map = d3.select("#map");
    const train = d3.select("#train");
    // const outro = d3.select('#outro')

    setTimeout(() => {
      map.transition().duration(1500).style("height", "0vh");

      train.transition().duration(1500).style("height", "0vh");

      d3.select("#outro")
        .transition()
        .duration(1500)
        .style("height", "100vh")
        .on("end", () => {
          map.remove();
          train.remove();
        });
    }, 200);
  };

  const moveFirstStep = () => {
    setIsMoving(true);
    setAction(C.board);

    setTimeout(() => {
      setCurrentStop(currentStop + 1);
      setIsMoving(false);
    }, 2000);
  };

  const noMoveMiddleSteps = () => {
    setIsMoving(true);
    setAction(C.egress);
    setTimeout(() => setAction(C.board), 2850);
    setTimeout(() => {
      setCurrentStop(currentStop + 1);
      setIsMoving(false);
    }, 5100);
  };

  const moveMiddleSteps = () => {
    setIsMoving(true);
    setAction(C.egress);
    setTimeout(() => setAction(C.moveSeats), 2850);
    setTimeout(() => setAction(C.board), 4100);
    setTimeout(() => {
      setCurrentStop(currentStop + 1);
      setIsMoving(false);
    }, 6500);
  };

  const stepHandlers = {
    introduceTrain,
    moveFirstStep,
    moveMiddleSteps,
    noMoveMiddleSteps,
    showOutro,
  };

  // scrolly
  const onStepEnter = ({ data }) => {
    setCurrentStepIndex(data);
  };

  if (windowSize.height < 920 || windowSize.width < 1436)
    return (
      <div
        style={{
          height: "100vh",
          width: "100wv",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#2b2b2b",
          color: "white",
          textAlign: "center",
          padding: "0px 20px",
        }}
      >
        <h1>Thank you for visiting Is This Your Stop?</h1>

        <h2>
          Please visit this interactive web-based data visualization on a BIG
          screen
        </h2>
        <p>(At least 1436 x 920)</p>
        <p>(You may need to make your window full screen, and hide your toolbar temporarily)</p>
        <h3>-Jeremy Odell ❤️</h3>
      </div>
    );

  return (
    <div id="app">
      <InfoIcon
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          height: 40,
          width: 40,
          cursor: "pointer",
        }}
        onClick={handleOpen}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2>Thank you for visiting Is This Your Stop!</h2>
          <h3>
            Subway crowdedness data comes from data clinic's tool:{" "}
            <a
              href="https://subwaycrowds.tsdataclinic.com/"
              target="_blank"
              rel="noreferrer"
            >
              Subway Crowds
            </a>
          </h3>
          <h3>
            Population demographic data comes from the{" "}
            <a
              href="https://data.census.gov/cedsci/"
              target="_blank"
              rel="noreferrer"
            >
              United States Census Bureau
            </a>
          </h3>
          <h4>
            Made with ❤️ by{" "}
            <a
              href="https://twitter.com/VizByJeremy"
              target="_blank"
              rel="noreferrer"
            >
              Jeremy Odell
            </a>
          </h4>
        </Box>
      </Modal>

      <div id="map" style={{ height: "100vh" }} className={"flex-column"}>
        <Intro />
        {windowSize.height && (
          <MapChart
            height={"100%"}
            opacity={1}
            width={windowSize.width}
            currentStop={currentStop}
            action={action}
            people={peopleBoarded}
            genderStack={genderStack}
            raceStack={raceStack}
            incomeStack={incomeStack}
            stepHandlers={stepHandlers}
            isMoving={isMoving}
            currentMapChart={currentMapChart}
            setCurrentMapChart={setCurrentMapChart}
            currentMapType={currentMapType}
            setCurrentMapType={setCurrentMapType}
            showOutro={showOutro}
          />
        )}
      </div>
      <div id="train" style={{ height: "0vh" }}>
        {windowSize.height && (
          <TrainChart
            height={"100%"}
            width={windowSize.width}
            people={peopleBoarded}
            currentMapChart={currentMapChart}
          />
        )}
      </div>
      {isOutro ? (
        <div id="outro" style={{ height: "0vh", overflow: "hidden" }}>
          <Outro
            height={"100%"}
            width={windowSize.width}
            people={peopleBoarded}
            raceStack={raceStack}
            incomeStack={incomeStack}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
