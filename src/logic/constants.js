// train shape
export const height = 6
export const width = 30
export const maxOccupancy = height * width
export const squareSize = window.innerWidth < 1800 ? 42 : 52

// train seats/doors
export const seatIdxs = [0, 1, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 28, 29]
export const doorIdxs = [2, 3, 10, 11, 18, 19, 26, 27]
export const amountDoors = 4

// movement cases
export const egress = 'egress'
export const moveSeats = 'moveSeats'
export const board = 'board'

// map chart types
export const race = 'race'
export const income = 'income'

export const standard = 'standard'
export const proportional = 'proportional'

// MapChart
// too verbose
export const raceKeys = [
  'Hispanic or Latino',
  'White alone',
  'Black or African American alone',
  'American Indian and Alaska Native alone',
  'Asian alone',
  'Native Hawaiian and Other Pacific Islander alone',
  'Some Other Race alone',
  'Population of two or more races:',
]
export const shortRaceKeys = {
  'Hispanic or Latino': 'Hispanic',
  'White alone': 'White',
  'Black or African American alone': 'Black',
  'American Indian and Alaska Native alone': 'American Indian',
  'Asian alone': 'Asian',
  'Native Hawaiian and Other Pacific Islander alone': 'Pacific Islander',
  'Some Other Race alone':  'Other Race',
  'Population of two or more races:': '2+ Races',
}

export const emptyRaces = {
  'Hispanic or Latino': 0,
  'White alone': 0,
  'Black or African American alone': 0,
  'American Indian and Alaska Native alone': 0,
  'Asian alone': 0,
  'Native Hawaiian and Other Pacific Islander alone': 0,
  'Some Other Race alone': 0,
  'Population of two or more races:': 0
}

export const incomeKeys = [
  'Less than $10,000',
  '$10,000 to $14,999',
  '$15,000 to $24,999',
  '$25,000 to $34,999',
  '$35,000 to $49,999',
  '$50,000 to $74,999',
  '$75,000 to $99,999',
  '$100,000 to $149,999',
  '$150,000 to $199,999',
  '$200,000 or more'
]

export const shortIncomeKeys = {
  'Less than $10,000': '<$10,000',
  '$10,000 to $14,999': '$10,000 - $14,999',
  '$15,000 to $24,999': '$15,000 - $24,999',
  '$25,000 to $34,999': '$25,000 - $34,999',
  '$35,000 to $49,999': '$35,000 - $49,999',
  '$50,000 to $74,999': '$50,000 - $74,999',
  '$75,000 to $99,999': '$75,000 - $99,999',
  '$100,000 to $149,999': '$100,000 - $149,999',
  '$150,000 to $199,999': '$150,000 - $199,999',
  '$200,000 or more': '>$200,000',
}

export const incomeSelectors = {
  'Less than $10,000': 'ten',
  '$10,000 to $14,999': 'fourteen',
  '$15,000 to $24,999': 'twentyfour',
  '$25,000 to $34,999': 'thirtyfour',
  '$35,000 to $49,999': 'fourtyfour',
  '$50,000 to $74,999': 'seventyfour',
  '$75,000 to $99,999': 'ninetynine',
  '$100,000 to $149,999': 'onefournine',
  '$150,000 to $199,999': 'oneninenine',
  '$200,000 or more': 'twohundred',
}

export const emptyIncomes = {
  'Less than $10,000': 0,
  '$10,000 to $14,999':  0,
  '$15,000 to $24,999':  0,
  '$25,000 to $34,999':  0,
  '$35,000 to $49,999':  0,
  '$50,000 to $74,999':  0,
  '$75,000 to $99,999':  0,
  '$100,000 to $149,999':  0,
  '$150,000 to $199,999':  0,
  '$200,000 or more':  0
}