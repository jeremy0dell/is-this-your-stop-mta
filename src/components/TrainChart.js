import { useEffect, useRef } from "react"
import * as d3 from 'd3'

import { enterFn, updateFn, exitFn, transitionColors, stops } from "../logic/data"
import * as C from '../logic/constants'
import train from '../assets/images/grid-2.svg'
import { bind_trailing_args } from "../logic/helpers"

const TrainChart = ({ height, width, people, currentMapChart }) => {
  const peopleRef = useRef(null)

  useEffect(() => {
    if (peopleRef.current) {
      const peopleSelection = d3.select(peopleRef.current)
        .selectAll('circle')
        .data(people, d => d.id)

      peopleSelection.join(
        bind_trailing_args(enterFn, currentMapChart),
        updateFn,
        exitFn
      )
    }
  }, [people])

  useEffect(() => {
    if (peopleRef.current) {
      const peopleSelection = d3.select(peopleRef.current)
        .selectAll('circle')
        .data(people, d => d.id)

        transitionColors(peopleSelection, currentMapChart)
    }
  }, [currentMapChart])

  // Tooltip effect/
  useEffect(() => {
    if (peopleRef.current) {
      const peopleSelection = d3.select(peopleRef.current)
        .selectAll('circle')

      const tooltip = d3.select('foreignObject#tooltip')

      peopleSelection.on('mouseover', (e, d) => {

        console.log('hiii', d)
        tooltip
          .transition()
          .style('opacity', 1)

          tooltip
          .html(`
            <div style="height: 100%; width: 100%; background-color: #4d4d4d; border-radius: 10px;">
              <div style="height: 288px; font-size: 20px; padding: 16px; display: flex; flex-direction: column; justify-content: space-around; text-align: center;">
<div style="margin-bottom: 12px">Race: <br /><span style="font-weight: bold;">${d.race}</div>
<div style="margin-bottom: 12px">Income Bracket: <br /><span style="font-weight: bold;">${d.income}</div>
<div style="margin-bottom: 12px">Entered at Stop: <br /><span style="font-weight: bold;">${stops[d.enter][0]}</div>
              </div>
            </div>
          `)
          
      })

      peopleSelection.on('mouseleave', (e, d) => {
        // // console.log('hiii', e.pageX, e.pageY, d, d3.select('svg#train-rect'))
        tooltip
          .transition()
          .style('opacity', 0)
        // tooltip
        //   .html(`<div style="padding: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        //     <div>Race: ${d.race}</div>
        //     <div>Income Bracket: ${d.income}</div>
        //     <div>Entered at Stop: ${stops[d.enter][0]}</div>
        //   </div>`)
        //   .transition()
        //   .style('opacity', 0)

        // tooltip
        //   .transition()
        //   .html(`<div style="position: absolute; padding: 10px; background-color: #4d4d4d; border-radius: 5px; left: 0px; top: 0px; "></div>`)
      })

      console.log('my circles are', peopleSelection, 'my tooltip is', tooltip)
    }
  }, [people, currentMapChart])

  const margin = {
    top: 100,
    left:( width / 2) - ((C.width * C.squareSize) / 2) - (C.squareSize * 1.5)
  }

  return (
    <svg id="train-rect" height={height} width={width}>
      <image
        href={train}
        // height={200}
        width={C.width * C.squareSize}
        height={C.height * C.squareSize}
        transform={`translate(${margin.left} ${margin.top})`}    
      ></image>
      <g
        id="circs"
        ref={peopleRef}
        transform={`translate(${margin.left} ${margin.top})`}
      />
      <foreignObject
        id="tooltip"
        width={4 * C.squareSize}
        height={6 * C.squareSize}
        opacity={0}
        transform={`translate(${margin.left * 16.5} ${margin.top})`}
      >
        <div style={{ height: '100%', width: '100%', backgroundColor: '#4d4d4d', borderRadius: 10 }}></div>
      </foreignObject>
    </svg>
  )
}

export default TrainChart