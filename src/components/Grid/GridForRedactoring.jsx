import { useEffect, useState, useRef } from "react";
import * as d3 from 'd3';

import "./Grid.scss";
import finger from 'images/Finger.svg'

import { useDispatch, useSelector } from "react-redux";
import { changePoint } from "functions/changePoint"
import { getCoords } from "functions/getCoords"
import { rerenderResults } from "store/slices/app";
import { useHistory } from "react-router";
import { getBackend } from '@tensorflow/tfjs-core'
import sessions, { addImagesLandmarks, addImage } from "store/slices/sessions";

export const GridForRedactoring = ({ resultSideNumber, image }) => {
    const boxRef = useRef()
    const dispatch = useDispatch()
    const history = useHistory()
    const [rotator, setRotator] = useState(0)

    const rerenderCounter = useSelector((state) => state.app.rerenderCounter)
    const images = useSelector((state) => state.sessions.images)
    const [db, setDb] = useState(image.landmarks)//db for drawing
    const [isFingerVisible, setIsFingerVisible] = useState(true)//db for drawing
    const [selectedCircleId, setSelectedCircleId] = useState(null)
    const size = {//my svg-image is fullsize of device screen
        width: window.innerWidth,
        height: window.innerHeight
    }

    useEffect(() => {
        drawSoloPatientGrid(image.landmarks, size)
    }, [image, boxRef, resultSideNumber, rotator])

    useEffect(() => {
        let t = setTimeout(() => {
            return clearTimeout(t)
        }, 100)
    })

    useEffect(() => {
        drawSoloPatientGrid(db, size)
    }, [db, selectedCircleId])

    useEffect(() => {
        if (rerenderCounter > 0) {
            saveLandsToStore()
            dispatch(rerenderResults(false))
        }
    }, [rerenderCounter])



    const saveLandsToStore = () => {
        switch (resultSideNumber) {
            case 0:
                let newFront = {
                    angle: images.front.angle,
                    path: images.front.path,
                    status: images.front.status,
                    landmarks: db,
                }
                dispatch(addImage({ front: newFront }))
                break;
            case 1:
                let newRight = {
                    angle: images.right.angle,
                    path: images.right.path,
                    status: images.right.status,
                    landmarks: db,
                }
                dispatch(addImage({ right: newRight }))
                break;
            case 2:
                let newBack = {
                    angle: images.back.angle,
                    path: images.back.path,
                    status: images.back.status,
                    landmarks: db,
                }
                dispatch(addImage({ back: newBack }))
                break;
            case 3:
                let newLeft = {
                    angle: images.left.angle,
                    path: images.left.path,
                    status: images.left.status,
                    landmarks: db,
                }
                dispatch(addImage({ left: newLeft }))
                break;
            default:
                break;
        }

        let t = setTimeout(() => {
            history.goBack()
            return () => clearTimeout(t);
        }, [50])
    }

    const drawSoloPatientGrid = (db, size) => {
        // console.log(db)
        if (size && size.width !== 0 && size.height !== 0) {
            if (db && (typeof db === 'object') && Object.keys(db).length > 0) {
                drawGrid(size)
            }
        }

        function drawGrid(size) {

            let lineColor;
            const centerPointScale = 4
            const selectedPointScale = 20

            const hideLens = () => {
                const lens = document.getElementById('lens')
                lens.style.left = -10000 + "px"
                lens.style.top = -10000 + "px"
            }

            const multiplePointByPrecent = (p1, p2, precent) => {
                return {
                    left: {
                        x: ((1 - precent) * p1.x) + p2.x * precent,
                        y: ((1 - precent) * p1.y) + p2.y * precent
                    },
                    right: {
                        x: ((1 - precent) * p2.x) + p1.x * precent,
                        y: ((1 - precent) * p2.y) + p1.y * precent
                    }
                }
            }

            let coords = getCoords(db, resultSideNumber)

            const svgBox = d3.select(boxRef.current).html(null)


            const svg = svgBox.append('svg')
                .attr('class', 'svg')
                .attr('width', size.width)
                .attr('height', size.height)
                .on('touchstart', () => setIsFingerVisible(false))

            const filterBox = svg.append('defs')
            const filter = filterBox.append('filter')

            {//ШАДОВ ФИЛЬТЕР
                filter.attr("id", "shadow")
                    .attr("x", "0")
                    .attr("y", "-0.000976562")
                    .attr("width", "80")
                    .attr("height", "50")
                    .attr("color-interpolation-filters", "sRGB")

                filter.append("feFlood")
                    .attr("flood-opacity", "0")
                    .attr('result', 'BackgroundImageFix')
                filter.append('feColorMatrix')
                    .attr('in', "SourceAlpha")
                    .attr('type', "matrix")
                    .attr('values', "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0")
                    .attr('result', "hardAlpha")
                filter.append('feOffset')
                    .attr("dy", "4")
                filter.append('feGaussianBlur')
                    .attr("stdDeviation", "5")
                filter.append('feComposite')
                    .attr('in2', "hardAlpha")
                    .attr("operator", "out")
                filter.append('feColorMatrix')
                    .attr("type", "matrix")
                    .attr("values", "0 0 0 0 0.4625 0 0 0 0 0.4625 0 0 0 0 0.4625 0 0 0 0.2 0")
                filter.append('feBlend')
                    .attr("mode", "normal")
                    .attr("in2", "BackgroundImageFix")
                    .attr("result", "effect1_dropShadow_1652_12261")
                filter.append('feBlend')
                    .attr("mode", "normal")
                    .attr("in", "SourceGraphic")
                    .attr("in2", "effect1_dropShadow_1652_12261")
                    .attr("result", "shape")
            }

            {//Рисует клетки
                let row = svg.append('g')
                    .style('transform-origin', `center center`)
                    .style('transform', `rotate(${image.angle}turn)`)
                let step = size.width / (size.width / 23)
                let boxSize = (size.height > size.width) ? size.height : size.width

                row.append('path').attr('class', 'subLine-black')
                    .style('fill', "none")
                    .attr('d', () => d3.line()([
                        [coords.ears.center.x, 0], [coords.ears.center.x, size.height]
                    ]))

                for (let i = step; i < boxSize; i += step) {

                    row.append('path').attr('class', 'subLine-culumn')
                        .style('fill', "none")
                        .attr('d', () => d3.line()([
                            [i, 0], [i, size.height]
                        ]))

                    row.append('path').attr('class', 'subLine-row')
                        .style('fill', "none")
                        .attr('d', () => d3.line()([
                            [0, i], [size.width, i]
                        ]))

                }

            }

            //black line on the center
            svg.append('path').attr('class', 'line')
                .attr('d', () => d3.line()([
                    [coords.ears.center.x, -size.height], [coords.ears.center.x, size.height]
                ])).style('stroke-width', 2)
                .style('stroke', 'rgba(0,0,0,0.5)')

            {//img elements
                svgBox
                    .append('img')
                    .attr('src', image.path)
                    .attr('class', 'poseGridSVG')
                    .style('width', size.width)
                    .style('height', size.height)

                svgBox
                    .append("img")
                    .attr("src", finger)
                    .attr("id", "finger")
                    .style("width", 100)
                    .style("height", 100)
                    .style("position", "absolute")
                    .style("top", `${coords.ears.right.y - 14}px`)
                    .style("left", `${coords.ears.right.x - 15}px`)
                    .style('z-index', isFingerVisible ? -1 : -999)
            }

            svg.append('path')
                .attr('d', () => d3.line()([
                    [coords.ears.center.x, coords.ears.center.y], [coords.ankles.center.x, coords.ankles.center.y]]))
                .style('stroke', '#267578')
                .style('stroke-width', 2)
                .style('fill', "none")

            for (const [name, value] of Object.entries(coords)) {//Angles
                let angle = Math.abs(Math.floor((value.angle * (180 / Math.PI)) * 100) / 100)
                let backAngle = Math.abs(Math.floor((90 - Math.abs(value.angle * (180 / Math.PI))) * 100) / 100)

                let rectNameRus = ''
                let lineColor;
                let textColor = "rgba(46, 84, 130, 1)"

                switch (name) {
                    case 'ears':
                        lineColor = angle > 5 ? "#EC0000" : "rgba(37, 179, 145, 1)";
                        textColor = angle > 5 ? "#EC0000" : "rgba(46, 84, 130, 1)";
                        rectNameRus = "Голова"
                        break;
                    case 'shoulders':
                        lineColor = angle > 5 ? "#EC0000" : "rgba(37, 179, 145, 1)";
                        textColor = angle > 5 ? "#EC0000" : "rgba(46, 84, 130, 1)";
                        rectNameRus = "Плечи"
                        break;
                    case 'hips':
                        lineColor = angle > 5 ? "#EC0000" : "rgba(37, 179, 145, 1)";
                        textColor = angle > 5 ? "#EC0000" : "rgba(46, 84, 130, 1)";
                        rectNameRus = "Бедра"
                        break;
                    case 'ankles':
                        lineColor = backAngle > 5 ? "#EC0000" : "rgba(37, 179, 145, 1)";
                        textColor = backAngle > 5 ? "#EC0000" : "rgba(46, 84, 130, 1)";
                        rectNameRus = "Ноги"
                        break;
                    default:
                        lineColor = angle > 5 ? "#EC0000" : "rgba(37, 179, 145, 1)";
                        textColor = angle > 5 ? "#EC0000" : "rgba(46, 84, 130, 1)";
                        rectNameRus = "Центр"
                        break;
                }



                const textBox = svg.append("g")



                if (!(name === 'ears' && name === 'shoulders')) {
                    if (resultSideNumber === 0 || resultSideNumber === 2) {
                        textBox.append("rect")
                            .attr("x", name === 'ankles' ? size.width / 2 - 40 : 14)
                            .attr("y", name === 'ankles' ? value.center.y + 10 : value.center.y - 15)
                            .attr('width', 80)
                            .attr('height', 48)
                            .attr('rx', 10)
                            .attr('rx', 10)
                            .style('fill', 'white')
                            .attr("filter", "url(#shadow)")

                        if (name !== 'ankles') {
                            textBox.append("text")
                                .attr('class', 'textBox')
                                .attr("x", 55)
                                .attr("y", value.center.y + 17)
                                .text(`${Math.floor((value.angle * (180 / Math.PI)) * 100) / 100}°`)
                                .attr('text-anchor', 'middle')
                                .style('fill', textColor)
                                .style('font-size', '24')
                                .style('font-weight', '600')
                        } else {
                            textBox.append("rect")
                                .attr("x", name === 'ankles' ? size.width / 2 - 40 : 14)
                                .attr("y", name === 'ankles' ? value.center.y + 10 : value.center.y - 15)
                                .attr('width', 80)
                                .attr('height', 48)
                                .attr('rx', 10)
                                .attr('rx', 10)
                                .style('fill', 'white')
                                .attr("filter", "url(#shadow)")

                            textBox.append("text")
                                .attr('class', 'textBox')
                                .attr("x", size.width / 2)
                                .attr("y", value.center.y + 42)
                                .text(`${Math.abs(Math.floor((90 - Math.abs(value.angle * (180 / Math.PI))) * 100) / 100)}°`)
                                .attr('text-anchor', 'middle')
                                .style('fill', textColor)
                                .style('font-size', '24')
                                .style('font-weight', '600')
                        }
                    } else if (name === 'ankles') {
                        textBox.append("rect")
                            .attr("x", name === 'ankles' ? size.width / 2 - 40 : 14)
                            .attr("y", name === 'ankles' ? value.center.y + 10 : value.center.y - 15)
                            .attr('width', 80)
                            .attr('height', 48)
                            .attr('rx', 10)
                            .attr('rx', 10)
                            .style('fill', 'white')
                            .attr("filter", "url(#shadow)")

                        textBox.append("text")
                            .attr('class', 'textBox')
                            .attr("x", size.width / 2)
                            .attr("y", value.center.y + 42)
                            .text(`${Math.abs(Math.floor((90 - Math.abs(value.angle * (180 / Math.PI))) * 100) / 100)}°`)
                            .attr('text-anchor', 'middle')
                            .style('fill', textColor)
                            .style('font-size', '24')
                            .style('font-weight', '600')
                    }
                }
            }

            for (const [name, value] of Object.entries(coords)) {//Dots
                let angle = Math.abs(Math.floor((value.angle * (180 / Math.PI)) * 100) / 100)
                let backAngle = Math.abs(Math.floor((90 - Math.abs(value.angle * (180 / Math.PI))) * 100) / 100)
                switch (name) {
                    case 'ears':
                        lineColor = angle > 5 ? "#EC0000" : "#25B391";
                        break;
                    case 'shoulders':
                        lineColor = angle > 5 ? "#EC0000" : "#25B391";
                        break;
                    case 'hips':
                        lineColor = angle > 5 ? "#EC0000" : "#25B391";
                        break;
                    case 'ankles':
                        lineColor = backAngle > 5 ? "#EC0000" : "#25B391";
                        break;
                    default:
                        lineColor = angle > 5 ? "#EC0000" : "#25B391";
                        break;
                }

                //Линии отклонений
                function linePoint() {
                    let
                        xA = value.center.x,
                        yA = value.center.y,
                        k = Math.tan(value.angle / (180 / Math.PI)),
                        b = yA - k * xA,
                        start = 0,
                        end = size.width,
                        // yLeft = k * start + b,
                        // yRight = k * end + b

                        yLeft = value.left.y,
                        yRight = value.right.y

                    return {
                        start: start,
                        left: yLeft,
                        right: yRight,
                        end: end
                    }
                }


                {//Drawing deviation lines
                    let line = linePoint()

                    if (resultSideNumber === 0 || resultSideNumber === 2) {
                        svg.append('path').attr('class', 'subLine')
                            .attr('d', () => d3.line()([
                                [value.left.x, line.left], [value.right.x, line.right]
                            ]))
                            .style('stroke', lineColor)
                            .style('fill', "none")

                    } else if (name === 'ears' || name === 'ankles') {
                        svg.append('path').attr('class', 'subLine')
                            .attr('d', () => d3.line()([
                                [value.left.x, line.left], [value.right.x, line.right]
                            ]))
                            .style('stroke', lineColor)
                            .style('fill', "none")
                    }


                    //ANGLES POLYGON
                    if (resultSideNumber === 0 || resultSideNumber === 2) {
                        let newPoint = multiplePointByPrecent(value.center, value.left, 1000)

                        name !== 'ankles' && svg.append('polygon')

                            .attr('points', `${value.center.x},${value.center.y} ${newPoint.right.x},${value.center.y} ${newPoint.right.x},${newPoint.right.y}`)
                            .style('fill', lineColor)
                            .style('filter', 'opacity(0.4)')
                    }


                    //BACK POLYGON
                    name === 'ankles' && svg.append('polygon')
                        .attr('points', `${coords.ears.center.x},${coords.ears.center.y} ${coords.ears.center.x},${coords.ankles.center.y} ${coords.ankles.center.x},${coords.ankles.center.y}`)
                        .style('fill', lineColor)
                        .style('filter', 'opacity(0.4)')

                }

                //Линия центра
                if (resultSideNumber === 0 || resultSideNumber === 2) {
                    svg.append('path').attr('class', 'middleLine')
                        .attr('d', () => d3.line()([[0, value.center.y], [size.width, value.center.y]]))
                        .style('stroke', "rgba(0,0,0,0.5)")
                        .style("stroke-dasharray", "10,6")
                        .style('stroke-width', 1.4)
                        .style('fill', "none")
                }

                {// Точки

                    let circleName = () => {
                        let newMessage = name.split('')
                        newMessage.splice(0, 1, newMessage[0].toUpperCase())
                        newMessage.pop()
                        return newMessage.join('')
                    }

                    if (name === "ankles" || (name === 'ears' && (resultSideNumber === 1 || resultSideNumber === 3))) {
                        let centerName = "center" + circleName() + 's'
                        let leftCircleName = `left${circleName()}`
                        let rightCircleName = `right${circleName()}`

                        value.center && svg.append("circle")
                            .attr("r", selectedCircleId === centerName ? selectedPointScale : centerPointScale)
                            .style('fill', selectedCircleId === centerName ? 'orange' : lineColor)
                            .attr("id", `P${resultSideNumber}-` + centerName)
                            .attr("cx", value.center.x)
                            .attr("cy", value.center.y)
                            .style('stroke-width', '100px')
                            .style('stroke', 'rgba(0,0,0,0)')

                        value.right && svg.append("circle")
                            .attr("r", selectedCircleId === rightCircleName ? selectedPointScale : centerPointScale)
                            .attr("id", `P${resultSideNumber}-` + rightCircleName)
                            .style('fill', selectedCircleId === rightCircleName ? 'orange' : lineColor)
                            .attr("cx", value.right.x)
                            .attr("cy", value.right.y)
                            .style('z-index', 999)
                            .style('stroke-width', '100px')
                            .style('stroke', 'rgba(0,0,0,0)')
                            .on('touchstart touchmove mousemove', (e) => {
                                if (selectedCircleId !== rightCircleName) {
                                    setSelectedCircleId(rightCircleName)
                                }
                                let newData = { ...db }
                                let newLandCoord = changePoint(e, image)
                                if (newLandCoord && Object.entries(newLandCoord).length > 0) {
                                    newData[rightCircleName] = newLandCoord
                                    setDb(newData)
                                }
                            })
                            .on('touchend mouseleave', () => {
                                setSelectedCircleId(null)
                                hideLens()
                            })

                        value.left && svg.append("circle")
                            .attr("r", selectedCircleId === leftCircleName ? selectedPointScale : centerPointScale)
                            .attr("id", `P${resultSideNumber}-` + leftCircleName)
                            .style('fill', selectedCircleId === leftCircleName ? 'orange' : lineColor)
                            .attr("cx", value.left.x)
                            .attr("cy", value.left.y)
                            .style('stroke-width', '100px')
                            .style('stroke', 'rgba(0,0,0,0)')
                            .on('touchstart touchmove mousemove', (e) => {
                                if (selectedCircleId !== leftCircleName) {
                                    setSelectedCircleId(leftCircleName)
                                }

                                let newData = { ...db }

                                let newLandCoord = changePoint(e, image)
                                if (newLandCoord && Object.entries(newLandCoord).length > 0) {
                                    newData[leftCircleName] = newLandCoord
                                    setDb(newData)
                                }
                            })
                            .on('touchend mouseleave', () => {
                                setSelectedCircleId(null)
                                hideLens()
                            })


                    } else if (resultSideNumber === 0 || resultSideNumber === 2) {
                        let leftCircleName = `left${circleName()}`
                        let rightCircleName = `right${circleName()}`

                        value.right && svg.append("circle")
                            .attr("r", selectedCircleId === rightCircleName ? selectedPointScale : centerPointScale)
                            .attr("id", `P${resultSideNumber}-` + rightCircleName)
                            .style('fill', selectedCircleId === rightCircleName ? 'orange' : lineColor)
                            .attr("cx", value.right.x)
                            .attr("cy", value.right.y)
                            .style('stroke-width', '100px')
                            .style('stroke', 'rgba(0,0,0,0)')
                            .on('touchstart touchmove mousemove', (e) => {
                                console.log('====================================');
                                console.log(e);
                                console.log('====================================');
                                if (selectedCircleId !== rightCircleName) {
                                    setSelectedCircleId(rightCircleName)
                                }
                                let newData = { ...db }
                                let newLandCoord = changePoint(e, image)
                                if (newLandCoord && Object.entries(newLandCoord).length > 0) {
                                    newData[rightCircleName] = newLandCoord
                                    setDb(newData)
                                }
                            })
                            .on('touchend ', () => {
                                setSelectedCircleId(null)
                                hideLens()
                            })

                        value.left && svg.append("circle")
                            .attr("r", selectedCircleId === leftCircleName ? selectedPointScale : centerPointScale)
                            .attr("id", `P${resultSideNumber}-` + leftCircleName)
                            .style('fill', selectedCircleId === leftCircleName ? 'orange' : lineColor)
                            .attr("cx", value.left.x)
                            .attr("cy", value.left.y)
                            .style('stroke-width', '100px')
                            .style('stroke', 'rgba(0,0,0,0)')
                            .on('mousedown mousemove', (e) => {
                                console.log('====================================');
                                console.log(1);
                                console.log('====================================');
                            })
                            .on('touchstart touchmove', (e) => {
                                if (selectedCircleId !== leftCircleName) {
                                    setSelectedCircleId(leftCircleName)
                                }

                                let newData = { ...db }

                                let newLandCoord = changePoint(e, image)
                                if (newLandCoord && Object.entries(newLandCoord).length > 0) {
                                    newData[leftCircleName] = newLandCoord
                                    setDb(newData)
                                }
                            })
                            .on('touchend', () => {
                                setSelectedCircleId(null)
                                hideLens()
                            })
                    }
                }
            }
        }
    }

    return <div ref={boxRef} id="svgBox" />
}