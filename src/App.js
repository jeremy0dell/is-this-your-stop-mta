import { useState, useEffect, useRef } from 'react'
import cloneDeep from "lodash/cloneDeep"
import * as d3 from 'd3'
import { Scrollama, Step } from 'react-scrollama'

import useWindowSize from './hooks/useWindowSize';

import TrainChart from './components/TrainChart';
import MapChart from './components/MapChart';
import Map from './components/Map';

import {
  createGridTrain,
  scanTrain,
  handleEgress,
  handleMoveSeats,
  handleBoard
} from './logic/trainHandlers';
import * as C from './logic/constants'
import { stops } from './logic/data'

import curve from './assets/images/curve.png'

import './App.css';

function App() {
  // sizing
  const windowSize = useWindowSize()
  // train state
  const [gridTrain, setGridTrain] = useState(createGridTrain(C.height, C.width, C.seatIdxs, C.doorIdxs))
  const [peopleBoarded, setPeopleBoarded] = useState([])
  const [peopleTotal, setPeopleTotal] = useState([])
  // map state
  const [currentMapChart, setCurrentMapChart] = useState(C.race)
  const [currentMapType, setCurrentMapType] = useState(C.standard)
  // orchestration
  const [isMoving, setIsMoving] = useState(false)
  // scrolly
  const [currentStepIndex, setCurrentStepIndex] = useState(null);
  const imgRef = useRef(null);
  // specific charts
  const [genderStack, setGenderStack] = useState([])
  const [raceStack, setRaceStack] = useState([])
  const [incomeStack, setIncomeStack] = useState([])
  const [currentStop, setCurrentStop] = useState(0)
  const [action, setAction] = useState('')

  useEffect(() => {
    const {
      newGridTrain,
      occupiedSpaces,
      occupiedAreas,
      availableSeats,
      availableSpaces
    } = scanTrain(gridTrain, C.height, C.width)

    let boardedCopy = cloneDeep(peopleBoarded)
    let totalCopy = cloneDeep(peopleTotal)

    switch (action) {
      case C.egress:
        var { boarded, total, train } = handleEgress(
          newGridTrain,
          boardedCopy,
          totalCopy,
          occupiedAreas,
          stops,
          currentStop
        )

        updateState(boarded, total, train)
        break
      case C.moveSeats:
        var { boarded, total, train } = handleMoveSeats(
          newGridTrain,
          totalCopy,
          boardedCopy,
          availableSeats,
          occupiedSpaces
        )

        updateState(boarded, total, train)
        break
      case C.board:
        var { boarded, total, train } = handleBoard(
          newGridTrain,
          totalCopy,
          boardedCopy,
          availableSeats,
          availableSpaces,
          stops,
          currentStop
        )

        updateState(boarded, total, train)

        // gender
        setGenderStack(genderStack.concat(
          {
            stop: currentStop,
            male: boardedCopy.reduce((a, n) => n.gender === 'male' ? a + 1 : a, 0),
            female: boardedCopy.reduce((a, n) => n.gender === 'female' ? a + 1 : a, 0)
          }
        ))

        // race
        setRaceStack(raceStack.concat({
          stop: currentStop,
          ...boardedCopy.reduce((acc, next) => {
            acc[next.race] += 1
            return acc
          }, cloneDeep(C.emptyRaces))
        }))

        // income
        setIncomeStack(incomeStack.concat({
          stop: currentStop,
          ...boardedCopy.reduce((acc, next) => {
            acc[next.income] += 1
            return acc
          }, cloneDeep(C.emptyIncomes))
        }))

        break
      default:
        return
    }
  }, [action])

  const updateState = (boardedCopy, totalCopy, newGridTrain) => {
    setPeopleBoarded(boardedCopy)
    setPeopleTotal(totalCopy)
    setGridTrain(newGridTrain)
  }

  const introduceTrain = () => {
    const map = d3.select('#map')
    const train = d3.select('#train')

    map.transition().duration(1500)
      .style('height', '55vh')

    train.transition().duration(1500)
      .style('height', '45vh')

    map.style('overflow-y', 'hidden')
  }

  const moveFirstStep = () => {
    setIsMoving(true)
    setAction(C.board)

    setTimeout(() => {
      setCurrentStop(currentStop + 1)
      setIsMoving(false)
    }, 2000)
  }

  const noMoveMiddleSteps = () => {
    setIsMoving(true)
    setAction(C.egress)
    setTimeout(() => setAction(C.board), 2850)
    setTimeout(() => {
      setCurrentStop(currentStop + 1)
      setIsMoving(false)
    }, 5100)
  }

  const moveMiddleSteps = () => {
    setIsMoving(true)
    setAction(C.egress)
    setTimeout(() => setAction(C.moveSeats), 2850)
    setTimeout(() => setAction(C.board), 4100)
    setTimeout(() => {
      setCurrentStop(currentStop + 1)
      setIsMoving(false)
    }, 6500)
  }

  const stepHandlers = {
    introduceTrain,
    moveFirstStep,
    moveMiddleSteps,
    noMoveMiddleSteps
  }

  // scrolly
  const onStepEnter = ({ data }) => {
    console.log('entered step', data)
    setCurrentStepIndex(data);
  };

  return (
    <div id="app">
      <div
        id="map"
        style={{ height: '100vh' }}
      // className={'flex-column'}
      >
        {/* <div style={{ fontFamily: "'Helvetica'", height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: 100 }}>
            Is This Your Stop?
          </h1>
          <h2 style={{ fontSize: 60 }}>
            How Data Drives The MTA
          </h2>
        </div> */}
        {/* <div style={{ fontFamily: "'Helvetica'", height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <img style={{ height: '100%' }} src={transit} />
        </div> */}
        {/* <div style={{ fontFamily: "'Helvetica'", backgroundColor: 'darkgrey', display: 'flex', flexDirection: 'column'}}>
          <div style={{ position: 'absolute', top: 0 }}>hello</div>
          <div style={{ position: 'absolute', height: '100vh', width: '100vw', top: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img ref={imgRef} id="map-img" style={{ height: '100%', width: '100%' }} src={curve} />
            <div style={{ padding: 30, textAlign: 'center' }}>
              <h1 style={{ fontSize: 100 }}>
                Is This Your Stop?
              </h1>
              <h2 style={{ fontSize: 60 }}>
                How Data Drives The MTA
              </h2>
            </div>
          </div>
          <Scrollama offset={0} onStepEnter={onStepEnter}>
            {[1, 2, 3, 4, 5].map((_, stepIndex) => (
              <Step data={stepIndex} key={stepIndex}>
                <div
                  style={{
                    height: 'calc(100vh - 40px)',
                    width: '33%',
                    margin: '20px 0px',
                    opacity: '90%',
                    borderRadius: 20,
                    padding: 8,
                    textAlign: 'center',
                    backgroundColor: 'grey',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    zIndex: 10
                  }}
                >
                  <h1 style={{ fontSize: 100 }}>
                    Is This Your Stop?
                  </h1>
                  <h2 style={{ fontSize: 60 }}>
                    How Data Drives The MTA
                  </h2>
                </div>
              </Step>
            ))}
          </Scrollama>
        </div> */}
        {windowSize.height && <MapChart
          height={'100%'}
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
        />}
      </div>
      <div id="train" style={{ height: '0vh' }}>
        {windowSize.height && <TrainChart
          height={'100%'}
          width={windowSize.width}
          people={peopleBoarded}
          currentMapChart={currentMapChart}
        />}
      </div>
    </div>
  );
}

export default App;
