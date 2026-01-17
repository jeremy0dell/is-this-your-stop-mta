import { useReducer } from 'react';

// Action types
const ACTIONS = {
  ADD_DATA_POINT: 'ADD_DATA_POINT',
  RESET: 'RESET',
};

// Initial state
const initialState = {
  genderStack: [],
  raceStack: [],
  incomeStack: [],
};

// Reducer function
function visualizationDataReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_DATA_POINT:
      return {
        ...state,
        genderStack: action.payload.gender
          ? [...state.genderStack, action.payload.gender]
          : state.genderStack,
        raceStack: action.payload.race
          ? [...state.raceStack, action.payload.race]
          : state.raceStack,
        incomeStack: action.payload.income
          ? [...state.incomeStack, action.payload.income]
          : state.incomeStack,
      };

    case ACTIONS.RESET:
      return initialState;

    default:
      return state;
  }
}

// Custom hook
export function useVisualizationData() {
  const [state, dispatch] = useReducer(visualizationDataReducer, initialState);

  // Action creator - adds a data point for all three stacks at once
  const addDataPoint = (genderData, raceData, incomeData) => {
    dispatch({
      type: ACTIONS.ADD_DATA_POINT,
      payload: {
        gender: genderData,
        race: raceData,
        income: incomeData,
      },
    });
  };

  const reset = () => {
    dispatch({ type: ACTIONS.RESET });
  };

  return {
    // State
    genderStack: state.genderStack,
    raceStack: state.raceStack,
    incomeStack: state.incomeStack,
    // Actions
    addDataPoint,
    reset,
  };
}
