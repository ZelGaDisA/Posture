import { useRef, useEffect } from "react"
import * as d3 from "d3";


export const AccelInterface = ({ accel }) => {
    const svgRef = useRef(null)

    useEffect(() => {
        if (svgRef.current) {
            const svg = d3.select(svgRef.current)

            const aY = accel.z
            const aX = accel.x

            const accelY = aY * 5
            const accelX = aX * 5

            const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
            const crosshair = { x: center.x + accelX, y: center.y + accelY }

            svg.html(null).style('transform-origin', 'center center')

            const crossColorVertical = Math.abs(accelX) > 2 ? '#EB5757' : '#04E75F'
            const crossColorHorisontal = Math.abs(accelY) > 2 ? '#EB5757' : '#04E75F'

            const bigCrossColorVertical = `rgba(${Math.abs(accelX) * 10}, ${232 + Math.abs(accelX) * 5}, ${95 + Math.abs(accelX) * 6}, 0.5)`
            const bigCrossColorHorisontal = `rgba(${Math.abs(accelY) * 10}, ${232 + Math.abs(accelY) * 5}, ${95 + Math.abs(accelY) * 6}, 0.5)`

            const bigCrossWidthVertical = Math.abs(accelX) > 2 ? "2px" : "2px"
            const bigCrossWidthHorisontal = Math.abs(accelY) > 2 ? "2px" : "2px"

            //CROSSHAIR WHITE-GREEN
            svg.append('line')
                .style("stroke", bigCrossColorHorisontal)
                .style('filter', "opacity(1)")
                .style("stroke-width", bigCrossWidthHorisontal)
                .attr('x1', center.x - window.innerWidth)
                .attr('y1', center.y)
                .attr('x2', center.x + window.innerWidth)
                .attr('y2', center.y)


            svg.append('line')
                .style("stroke", bigCrossColorVertical)
                .style('filter', "opacity(1)")
                .style("stroke-width", bigCrossWidthVertical)
                .attr('x1', center.x)
                .attr('y1', center.y + window.innerHeight)
                .attr('x2', center.x)
                .attr('y2', center.y - window.innerHeight)


            //CROSSHAIR RED-GREEN
            svg.append('line')
                .style("stroke", crossColorHorisontal)
                .style('filter', "opacity(1)")
                .style("stroke-width", "4px")
                .style("stroke-linecap", "round")
                .attr('x1', crosshair.x - 25)
                .attr('y1', crosshair.y)
                .attr('x2', crosshair.x + 25)
                .attr('y2', crosshair.y)

            svg.append('line')
                .style("stroke", crossColorVertical)
                .style('filter', "opacity(1)")
                .style("stroke-width", "4px")
                .style("stroke-linecap", "round")
                .attr('x1', crosshair.x)
                .attr('y1', crosshair.y + 25)
                .attr('x2', crosshair.x)
                .attr('y2', crosshair.y - 25)
        }
    }, [svgRef.current, accel]);



    return (
        <svg className="svg" width={window.innerWidth} height={window.innerHeight} ref={svgRef}></svg>
    )
}
