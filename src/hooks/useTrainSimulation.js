import { useReducer } from 'react';
import { createGridTrain } from '../logic/trainHandlers';
import * as C from '../logic/constants';

// Action types
const ACTIONS = {
  UPDATE_TRAIN: 'UPDATE_TRAIN',
  SET_STOP: 'SET_STOP',
  SET_ACTION: 'SET_ACTION',
  SET_MOVING: 'SET_MOVING',
  RESET: 'RESET',
};

// Initial state factory
const createInitialState = () => ({
  gridTrain: createGridTrain(C.height, C.width, C.seatIdxs, C.doorIdxs),
  peopleBoarded: [],
  peopleTotal: [],
  currentStop: 0,
  action: '',
  isMoving: false,
});

// Reducer function
function trainSimulationReducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_TRAIN:
      return {
        ...state,
        gridTrain: action.payload.train,
        peopleBoarded: action.payload.boarded,
        peopleTotal: action.payload.total,
      };

    case ACTIONS.SET_STOP:
      return {
        ...state,
        currentStop: action.payload,
      };

    case ACTIONS.SET_ACTION:
      return {
        ...state,
        action: action.payload,
      };

    case ACTIONS.SET_MOVING:
      return {
        ...state,
        isMoving: action.payload,
      };

    case ACTIONS.RESET:
      return createInitialState();

    default:
      return state;
  }
}

// Custom hook
export function useTrainSimulation() {
  const [state, dispatch] = useReducer(
    trainSimulationReducer,
    null,
    createInitialState
  );

  // Action creators
  const updateTrain = (train, boarded, total) => {
    dispatch({
      type: ACTIONS.UPDATE_TRAIN,
      payload: { train, boarded, total },
    });
  };

  const setCurrentStop = (stop) => {
    dispatch({
      type: ACTIONS.SET_STOP,
      payload: stop,
    });
  };

  const setAction = (action) => {
    dispatch({
      type: ACTIONS.SET_ACTION,
      payload: action,
    });
  };

  const setIsMoving = (isMoving) => {
    dispatch({
      type: ACTIONS.SET_MOVING,
      payload: isMoving,
    });
  };

  const reset = () => {
    dispatch({ type: ACTIONS.RESET });
  };

  return {
    // State
    gridTrain: state.gridTrain,
    peopleBoarded: state.peopleBoarded,
    peopleTotal: state.peopleTotal,
    currentStop: state.currentStop,
    action: state.action,
    isMoving: state.isMoving,
    // Actions
    updateTrain,
    setCurrentStop,
    setAction,
    setIsMoving,
    reset,
  };
}
