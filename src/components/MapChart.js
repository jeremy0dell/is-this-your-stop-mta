import React, { useState, useEffect, useRef } from 'react'

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import * as d3 from 'd3'
import * as C from '../logic/constants'

import { stops, chartSeries, chartTypeInfo } from '../logic/data'


const stripMapColor = (curr, i) => {
  if (curr === i) {
    return "#ffa812"
  } else if (curr > i) {
    return "#a75c00"
  } else {
    return "#231f20"
  }
}

const whiteStyle = {
  color: 'white',
  '&.Mui-checked': {
    color: 'white',
  },
}

const ArrowPath = ({ transform, isGlowing }) =>
  <path
    transform={transform}
    style={{
      // background: isGlowing ? '#FF9C28' : '',
      filter: !isGlowing ? 'drop-shadow(0px 0px 4.63545px #FFAA33) drop-shadow(0px 0px 2.64883px #FFAA33) drop-shadow(0px 0px 1.54515px #FFAA33) drop-shadow(0px 0px 0.772575px #FFAA33) drop-shadow(0px 0px 0.220736px #FFAA33) drop-shadow(0px 0px 0.110368px #FFAA33)' : ''
    }}
    d="M39.4853 12.0238C38.9208 11.5325 38.0805 11.5325 37.516 12.0237L35.2762 13.9727C34.5895 14.5702 34.589 15.6368 35.2752 16.235L48.8614 28.0779C49.9066 28.989 49.2622 30.7087 47.8758 30.7087H14.334C13.5056 30.7087 12.834 31.3802 12.834 32.2087V34.792C12.834 35.6204 13.5056 36.292 14.334 36.292H47.8758C49.2622 36.292 49.9066 38.0117 48.8614 38.9227L35.2752 50.7657C34.589 51.3638 34.5895 52.4304 35.2762 53.028L37.516 54.9769C38.0805 55.4681 38.9208 55.4681 39.4853 54.9769L62.8668 34.6319C63.554 34.034 63.554 32.9666 62.8668 32.3687L39.4853 12.0238Z"
    fill="#FF9C28"
  />

const ArrowText = ({ step }) =>
  <text
    fill="white"
    fontSize="20px"
    fontFamily="Helvetica"
    transform="translate(-25 -10)"
  >
    { step === 0 ? 'Begin Simulation' : 'Travel to Next Station' }
  </text>



const MapChart = ({
  height,
  width,
  currentStop,
  action,
  people,
  raceStack,
  incomeStack,
  stepHandlers,
  isMoving,
  currentMapChart,
  setCurrentMapChart,
  currentMapType,
  setCurrentMapType
}) => {
  const [step, setStep] = useState(0)
  const [value, setValue] = useState(currentMapChart)
  const [type, setType] = useState(currentMapType)

  // const [isGlowing, setIsGlowing] = useState(true)
  const circlesRef = useRef(null)

  // add axis
  useEffect(() => {
    var y = d3.scaleLinear()
      .domain([0, C.maxOccupancy])
      .range([dimensions.barHeight, 0]);

    var axis = d3.axisLeft(y)

    if (circlesRef.current) {
      // add axis
      d3.select(circlesRef.current)
        .append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, -${dimensions.barHeight})`)
        .attr('opacity', 0)
        .call(axis)

        // add label
      d3.select(circlesRef.current)
        .append('text')
        .attr('class', 'label')
        .attr('transform', `translate(-50, -${dimensions.barHeight - 225}) rotate(-90)`)
        .attr('fill', 'white')
        .attr('opacity', 0)
        .text(chartTypeInfo[currentMapChart].axisTitle(currentMapType))
      
      // add legend
      d3.select(circlesRef.current)
        .append('g')
        .attr('class', 'legend')
        .selectAll('g')
        .data(chartTypeInfo[currentMapChart].keys)
        .join(
          enter => {
            const selection = enter
              .append('g')
                .attr('class', 'legend-marker')
              
            selection
              .append('rect')
                .attr('width', 15)
                .attr('height', 15)
                .attr('x', (_, i) => i % 2 === 0 ? (i + 1) * dimensions.legendSpacing : (i) * dimensions.legendSpacing)
                .attr('y', (_, i) => i % 2 === 0 ? dimensions.barHeight * -1 - 25 : dimensions.barHeight * -1 - 50)
                .attr('fill', d => chartTypeInfo[currentMapChart].colors(d))

            selection
              .append('text')
                .attr('x', (_, i) => i % 2 === 0 ? (i + 1) * dimensions.legendSpacing + 20 : (i) * dimensions.legendSpacing+ 20)
                .attr('y', (_, i) => i % 2 === 0 ? dimensions.barHeight * -1 - 10 : dimensions.barHeight * -1 - 35)
                .attr('fill', 'white')
                .text(d => chartTypeInfo[currentMapChart].shortKeys[d])

            return selection
          }
        )
        
        d3.select('g.legend')
          .attr('opacity', 0)

        
        d3.select('foreignObject#controls')
          .attr('opacity', 0)

    }

  }, [])

  useEffect(() => {

    var axis = d3.axisLeft(y)

    if (action === C.board) {

      /*******ON FIRST BOARD*******/
      if (step === 2) {
        // bring in g.axis, text.label
        showElement('g.axis')
        showElement('text.label')
        showElement('g.legend')
        showElement('foreignObject#controls')
      }
      /*******END ON FIRST BOARD*******/
      var series = chartSeries(chartTypeInfo[currentMapChart].keys, stacks[currentMapChart], currentMapType === C.proportional)

      var y = d3.scaleLinear()
        .domain([0, C.maxOccupancy])
        .range([dimensions.barHeight, 0]);

      if (circlesRef.current) {
        // eslint-disable-next-line
        const selection = d3.select(circlesRef.current)
          .selectAll('g.bar')
          .data(series)
          .join(
            enter => enter.append('g')
              .attr('class', 'bar')
              .attr('opacity', 1)
              .transition()
              .duration(1000)
              .attr('fill', (d, i) => chartTypeInfo[currentMapChart].colors(d.key)),
            update => update
              .transition()
              .duration(1000)
              .attr('fill', (d, i) => chartTypeInfo[currentMapChart].colors(d.key)),
            exit => exit
              .transition()
              .duration(1000)
              .attr('opacity', 0)
              .remove()
          )
          .selectAll('rect.bar-rect').data(d => d)
          .join(
            enter => enter.append('rect')
              .attr('class', 'bar-rect')
              .attr('x', (d, i, a) => (dimensions.width / stops.length) * (i + 1) - 40 + dimensions.paddingSides * 1.5)
              .attr('width', 30)
              .attr('height', 0)
              .attr('y', 0)
              // transition stuff
              .transition()
              .duration(1000)
              .delay(2200)
              .attr('height', d =>{ return y(d[0]) - y(d[1])})
              .attr('y', (d, i) => y(d[1]) - dimensions.barHeight),
            update => update
              .transition()
              .duration(1000)
              // .delay(2000)
              .attr('height', d => y(d[0]) - y(d[1]))
              .attr('y', (d, i) => y(d[1]) - dimensions.barHeight),
            exit => exit
              .transition()
              .duration(1000)
              // .delay(2000)
              .attr('height', 0)
              .attr('y', 0)
              .remove()
          )
      }
    }
  }, [people])

  useEffect(() => {
    var series = chartSeries(chartTypeInfo[currentMapChart].keys, stacks[currentMapChart], currentMapType === C.proportional)

    var y = d3.scaleLinear()
      .domain([0, C.maxOccupancy])
      .range([dimensions.barHeight, 0]);

    if (circlesRef.current) {
      const selection = d3.select(circlesRef.current)
        .selectAll('g.bar')
        .data(series)
        .join(
          enter => enter.append('g')
            .attr('class', 'bar')
            .attr('opacity', 0)
            .transition()
            .duration(1000)
            .attr('fill', (d, i) => chartTypeInfo[currentMapChart].colors(d.key))
            .attr('opacity', 1),
          update => update
            .transition()
            .duration(1000)
            .attr('fill', (d, i) => chartTypeInfo[currentMapChart].colors(d.key)),
          exit => exit
            .transition()
            .duration(1000)
            .attr('opacity', 0)
            .remove()
        )

      selection
        .selectAll('rect.bar-rect').data(d => d)
        .join(
          enter => enter.append('rect')
            .attr('class', 'bar-rect')
            .attr('x', (d, i, a) => (dimensions.width / stops.length) * (i + 1) - 40 + dimensions.paddingSides * 1.5)
            .attr('width', 30)
            .attr('height', 0)
            .attr('y', 0)
            // transition stuff
            .transition()
            .duration(1000)
            // .delay(2000)
            .attr('height', d => y(d[0]) - y(d[1]))
            .attr('y', (d, i) => y(d[1]) - dimensions.barHeight),

          update => update
            .transition()
            .duration(1000)
            // .delay(2000)
            .attr('height', d => y(d[0]) - y(d[1]))
            .attr('y', (d, i) => y(d[1]) - dimensions.barHeight),
          exit => exit
            .transition()
            .duration(1000)
            // .delay(2000)
            .attr('height', 0)
            .attr('y', 0)
            .remove()
        )

      if (step >= 2) {
        d3.select('g.legend')
          .remove()

        d3.select(circlesRef.current)
          .append('g')
          .attr('class', 'legend')
          .selectAll('g')
          .data(chartTypeInfo[currentMapChart].keys)
          .join(
            enter => {
              const selection = enter
                .append('g')
                  .attr('class', 'legend-marker')
                
              selection
                .append('rect')
                  .attr('width', 15)
                  .attr('height', 15)
                  .attr('x', (_, i) => i % 2 === 0 ? (i + 1) * dimensions.legendSpacing : (i) * dimensions.legendSpacing)
                  .attr('y', (_, i) => i % 2 === 0 ? dimensions.barHeight * -1 - 25 : dimensions.barHeight * -1 - 50)
                  .attr('fill', d => chartTypeInfo[currentMapChart].colors(d))

              selection
                .append('text')
                  .attr('x', (_, i) => i % 2 === 0 ? (i + 1) * dimensions.legendSpacing + 20 : (i) * dimensions.legendSpacing+ 20)
                  .attr('y', (_, i) => i % 2 === 0 ? dimensions.barHeight * -1 - 10 : dimensions.barHeight * -1 - 35)
                  .attr('fill', 'white')
                  .text(d => chartTypeInfo[currentMapChart].shortKeys[d])

              return selection
            }
          )

        d3.selectAll('text.label')
          .remove()

        var a = d3.select(circlesRef.current)
          .append('text')
          .attr('class', 'label')
          .attr('transform', `translate(-50, -${dimensions.barHeight - 225}) rotate(-90)`)
          .attr('fill', 'white')
          .text(chartTypeInfo[currentMapChart].axisTitle(currentMapType))

        console.log('do we have a', a)
      }

    }
  }, [currentMapChart, currentMapType])

  useEffect(() => {

  }, [currentMapType])

  const dimensions = {
    height: 40,
    width: width * 0.8,
    paddingSides: 15,
    barHeight: 40 * 6,
    legendSpacing: 120
  }

  const margins = {
    top: dimensions.height * 8,
    left: width * 0.175
  }

  const stacks = {
    [C.race]: raceStack,
    [C.income]: incomeStack
  }

  const stepper = (i) => {
    console.log(stepHandlers)
    if (step === 0) {
      stepHandlers['introduceTrain']()
    } else if (step === 1) {
      stepHandlers['moveFirstStep']()
    } else if (step > 1 && step < 5) {
      stepHandlers['noMoveMiddleSteps']()
    } else {
      stepHandlers['moveMiddleSteps']()
    }
    setStep(step + 1)
  }

  const showElement = selection => d3.select(selection)
    .transition()
    .duration(1000)
    .delay(2000)
    .attr('opacity', 1)

  const stopCircs = stops.map((stop, i) =>
    <React.Fragment key={stop[0]}>
      <circle
        r={10}
        cx={(dimensions.width / stops.length) * (i + 1) - 30 + dimensions.paddingSides * 2}
        cy={dimensions.height / 2}
        fill={stripMapColor(currentStop, i)}
      />
      <text
        fill="white"
        fontSize="20px"
        fontFamily="Helvetica"
        transform={`translate(${((dimensions.width / stops.length) * (i + 1) - 30) + dimensions.paddingSides * 1.5},${dimensions.height + 15}) rotate(45)`}
      >
        {stop[0]}
      </text>
    </React.Fragment>
  )

  const handleMapChange = (event) => {
    setValue(event.target.value)
    setCurrentMapChart(event.target.value)
  }

  const handleTypeChange = (event) => {
    setType(event.target.value)
    setCurrentMapType(event.target.value)
  }
  return (
    <>
      <svg height={height} width={width}>
        <foreignObject id="controls" x={width - 250} y="50" width="700" height="200">
          <FormControl sx={{ }}>
            <RadioGroup value={value} onChange={handleMapChange}>
              <FormControlLabel value={C.race} control={<Radio sx={whiteStyle} />} label="Race" />
              <FormControlLabel value={C.income} control={<Radio sx={whiteStyle} />} label="Income" />
            </RadioGroup>
          </FormControl>
          <FormControl sx={{ }}>
            <RadioGroup value={type} onChange={handleTypeChange}>
              <FormControlLabel value={C.standard} control={<Radio sx={whiteStyle} />} label="Standard" />
              <FormControlLabel value={C.proportional} control={<Radio sx={whiteStyle} />} label="Proportional" />
            </RadioGroup>
          </FormControl>
        </foreignObject>
        <g transform={`translate(${margins.left * 0.25},${margins.top})`} ref={circlesRef}>
          <rect
            width={dimensions.width + dimensions.paddingSides * 4}
            height={dimensions.height}
            rx={20}
            ry={20}
            fill="#a8a9ac"
          />
          {stopCircs}
        </g>
        <g
          transform={`translate(${width / 1.125} ${margins.top / 1.1})`}
          style={{ cursor: 'pointer' }}
          // onClick={step > 2 ? stepper(2) : stepper(step)}
          onClick={() => {
            if (isMoving) return

            stepper(step)
          }}
        >
          {!isMoving ? <ArrowText step={step} /> : ''}
          <ArrowPath
            isGlowing={isMoving}
            transform={`scale(1.25 1.25)`}
          />
        </g>
      </svg>
    </>
  )
}

export default MapChart