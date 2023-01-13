import * as d3 from 'd3'

export const changePoint = (e, img) => {//user call this function on tap screen
    let lens = document.getElementById('lens')

    console.log('====================================');
    console.log(e.clientX);
    console.log(e.clientY);
    console.log('====================================');

    let mousePosition = {}

    if (e.type === 'mousedown' || e.type === 'mousemove') {
        mousePosition = {
            x: e.clientX,
            y: e.clientY,
        }
    } else {
        mousePosition = {
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY,
        }
    }


    d3.select("#" + e.target.id)
        .attr('cx', mousePosition.x)
        .attr('cy', mousePosition.y)

    let isLensUpperScreenY = !!(((mousePosition.y - 1.2 * lens.clientHeight) + 0.25 * lens.clientHeight) < 0)

    if (isLensUpperScreenY) {
        lens.style.top = mousePosition.y + lens.clientHeight / 4 + "px"
    } else {
        lens.style.top = mousePosition.y - 1.3 * lens.clientHeight + "px"
    }
    lens.style.left = mousePosition.x - 0.5 * lens.clientWidth + "px"



    lens.style.backgroundImage = "url('" + img.path + "')";
    lens.style.backgroundSize = (window.innerWidth * 2) + "px " + (window.innerHeight * 2) + "px";
    lens.style.backgroundPosition = "-" + (mousePosition.x * 2 - 0.5 * lens.clientWidth) + "px -" + (mousePosition.y * 2 - 0.5 * lens.clientHeight) + "px";

    return mousePosition

}
