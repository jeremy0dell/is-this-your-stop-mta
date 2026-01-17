import { useState, useEffect } from "react";
import cloneDeep from "lodash/cloneDeep";
import * as d3 from "d3";
import InfoIcon from "@mui/icons-material/Info";
import useWindowSize from "./hooks/useWindowSize";
import { useTrainSimulation } from "./hooks/useTrainSimulation";
import { useVisualizationData } from "./hooks/useVisualizationData";

import TrainChart from "./components/TrainChart";
import MapChart from "./components/MapChart";
import Intro from "./components/Intro";
import Outro from "./components/Outro";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import {
  scanTrain,
  handleEgress,
  handleMoveSeats,
  handleBoard,
} from "./logic/trainHandlers";
import * as C from "./logic/constants";
import { stops } from "./logic/data";

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
  // Window sizing
  const windowSize = useWindowSize();

  // Train simulation state (grouped with useReducer)
  const {
    gridTrain,
    peopleBoarded,
    peopleTotal,
    currentStop,
    action,
    isMoving,
    updateTrain,
    setCurrentStop,
    setAction,
    setIsMoving,
  } = useTrainSimulation();

  // Visualization data state (grouped with useReducer)
  const { genderStack, raceStack, incomeStack, addDataPoint } =
    useVisualizationData();

  // UI state (simple toggles remain as useState)
  const [currentMapChart, setCurrentMapChart] = useState(C.race);
  const [currentMapType, setCurrentMapType] = useState(C.standard);
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

        updateTrain(train, boarded, total);
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

        updateTrain(train, boarded, total);
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

        updateTrain(train, boarded, total);

        // Add visualization data point for this stop
        const genderData = {
          stop: currentStop,
          male: boarded.reduce((a, n) => (n.gender === "male" ? a + 1 : a), 0),
          female: boarded.reduce(
            (a, n) => (n.gender === "female" ? a + 1 : a),
            0
          ),
        };

        const raceData = {
          stop: currentStop,
          ...boarded.reduce((acc, next) => {
            acc[next.race] += 1;
            return acc;
          }, cloneDeep(C.emptyRaces)),
        };

        const incomeData = {
          stop: currentStop,
          ...boarded.reduce((acc, next) => {
            acc[next.income] += 1;
            return acc;
          }, cloneDeep(C.emptyIncomes)),
        };

        addDataPoint(genderData, raceData, incomeData);

        break;
      }
      default:
        return;
    }
  }, [action]);

  const introduceTrain = () => {
    const map = d3.select("#map");
    const train = d3.select("#train");

    map.transition().duration(C.TRANSITION_DURATION).style("height", "55vh");

    train.transition().duration(C.TRANSITION_DURATION).style("height", "45vh");

    map.style("overflow-y", "hidden");
  };

  const showOutro = () => {
    setIsOutro(true);
    const map = d3.select("#map");
    const train = d3.select("#train");
    // const outro = d3.select('#outro')

    setTimeout(() => {
      map.transition().duration(C.TRANSITION_DURATION).style("height", "0vh");

      train.transition().duration(C.TRANSITION_DURATION).style("height", "0vh");

      d3.select("#outro")
        .transition()
        .duration(C.TRANSITION_DURATION)
        .style("height", "100vh")
        .on("end", () => {
          map.remove();
          train.remove();
        });
    }, C.OUTRO_DELAY);
  };

  const moveFirstStep = () => {
    setIsMoving(true);
    setAction(C.board);

    setTimeout(() => {
      setCurrentStop(currentStop + 1);
      setIsMoving(false);
    }, C.FIRST_STOP_DURATION);
  };

  const noMoveMiddleSteps = () => {
    setIsMoving(true);
    setAction(C.egress);
    setTimeout(() => setAction(C.board), C.EGRESS_TO_BOARD_DELAY);
    setTimeout(() => {
      setCurrentStop(currentStop + 1);
      setIsMoving(false);
    }, C.NO_MOVE_TOTAL_DURATION);
  };

  const moveMiddleSteps = () => {
    setIsMoving(true);
    setAction(C.egress);
    setTimeout(() => setAction(C.moveSeats), C.EGRESS_TO_MOVE_DELAY);
    setTimeout(() => setAction(C.board), C.MOVE_TO_BOARD_DELAY);
    setTimeout(() => {
      setCurrentStop(currentStop + 1);
      setIsMoving(false);
    }, C.WITH_MOVE_TOTAL_DURATION);
  };

  const stepHandlers = {
    introduceTrain,
    moveFirstStep,
    moveMiddleSteps,
    noMoveMiddleSteps,
    showOutro,
  };

  if (windowSize.height < C.MIN_SCREEN_HEIGHT || windowSize.width < C.MIN_SCREEN_WIDTH)
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
        <p>(At least {C.MIN_SCREEN_WIDTH} x {C.MIN_SCREEN_HEIGHT})</p>
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
