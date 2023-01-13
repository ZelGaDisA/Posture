import { useRef} from "react"
import * as d3 from "d3";

export const PoseInterface = (points) => {
    const svgRef = useRef(null)
    const svg = d3.select(svgRef.current)

    let lands = points.lands

    const coof = 1

    if(!lands || Object.entries(lands) < 1){return <svg  width={window.innerWidth} height={ window.innerHeight} className="svg" />}

    svg.html(null)

    let lineColor = "white" //Object of colors for each part of body

    const lines = [{coord: [5,6], color: lineColor},
        {coord: [7,9], color: lineColor},
        {coord: [8,10], color: lineColor},
        {coord: [5,7], color: lineColor},
        {coord: [6,8], color: lineColor},
        {coord: [5,11], color: lineColor},
        {coord: [6,12], color: lineColor},
        {coord: [11,12], color: lineColor},
        {coord: [11,13], color: lineColor},
        {coord: [12,14], color: lineColor},
        {coord: [13,15], color: lineColor},
        {coord: [14,16], color: lineColor}
    ]

    lines.forEach((line) => {
        let a = line.coord[0];
        let b = line.coord[1]

        svg.append('line')
            .style("stroke", line.color)
            .style('filter',"opacity(1)")
            .style("stroke-width", "2px")
            .attr('x1', lands[a].position.x / coof)
            .attr('y1',lands[a].position.y * coof)
            .attr('x2',lands[b].position.x / coof)
            .attr('y2',lands[b].position.y * coof)
    })

    lands.forEach((dot, index) => {
        svg.append('circle')
        .style("stroke", "rgba(255,255,255,.6)")
        .style("stroke-width", "5px")
        .style("fill", 'rgba(255,255,255,1)')
        .attr("r", "2px")
        .attr("cx", (dot.position.x / coof) )
        .attr("cy", (dot.position.y * coof) )
    }); 

    return (
        <svg 
            className="svg" 
            width={window.innerWidth} 
            height={ window.innerHeight} 
            ref={svgRef}
        ></svg>
    )
}
