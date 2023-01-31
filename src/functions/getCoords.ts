import { CGPoint } from "store/types"

export const getCoords = (db:any, resultSideNumber: number) => {
    const getCenter = (p1:CGPoint,p2:CGPoint) => {
        return {
            x: (p1.x + p2.x)/2,
            y: (p1.y + p2.y)/2
        }
    }

    //Recalculates coordinate position for point name
    function coords(name:string) {
        return {
            x: db[name].x,
            y: db[name].y
        }
    }

    //POINT COORDS AND ANGLES
    let leftEar = coords("leftEar")
    let rightEar = coords("rightEar")
    let centerBetweenEars = getCenter(leftEar, rightEar)

    let earsAngle;

    let leftShoulder = coords("leftShoulder")
    let rightShoulder = coords("rightShoulder")
    let centerBetweenShoulders = getCenter(leftShoulder, rightShoulder)
    let shouldersAngle;


    let leftHip = coords("leftHip")
    let rightHip = coords("rightHip")
    let centerBetweenHips = getCenter(leftHip, rightHip)
    let hipsAngle;


    let leftAnkle = coords("leftAnkle")
    let rightAnkle = coords("rightAnkle")
    let centerBetweenAnkles = getCenter(leftAnkle, rightAnkle)
    let backAngle;

    switch (resultSideNumber) {
        case 0://front
            earsAngle = Math.atan2(rightEar.y - centerBetweenEars.y, centerBetweenEars.x - rightEar.x )
            shouldersAngle = Math.atan2(rightShoulder.y - centerBetweenShoulders.y, centerBetweenShoulders.x - rightShoulder.x )
            hipsAngle = Math.atan2(rightHip.y - centerBetweenHips.y, centerBetweenHips.x - rightHip.x )
            backAngle = Math.abs(Math.atan2(Math.abs(centerBetweenAnkles.y - centerBetweenEars.y), Math.abs(centerBetweenAnkles.x - centerBetweenEars.x)))
            break;
            
        case 1://right
            earsAngle = Math.atan2(rightEar.y - centerBetweenEars.y, centerBetweenEars.x - rightEar.x )
            shouldersAngle = Math.atan2(rightShoulder.y - centerBetweenShoulders.y, centerBetweenShoulders.x - rightShoulder.x )
            hipsAngle = Math.atan2(rightHip.y - centerBetweenHips.y, centerBetweenHips.x - rightHip.x )
            backAngle = Math.abs(Math.atan2(centerBetweenAnkles.y - centerBetweenEars.y, centerBetweenAnkles.x - centerBetweenEars.x))
            break;
            
        case 2://back
            earsAngle = Math.atan2(leftEar.y - centerBetweenEars.y, centerBetweenEars.x - leftEar.x )
            shouldersAngle = Math.atan2(leftShoulder.y - centerBetweenShoulders.y, centerBetweenShoulders.x - leftShoulder.x )
            hipsAngle = Math.atan2(leftHip.y - centerBetweenHips.y, centerBetweenHips.x - leftHip.x )
            backAngle = Math.abs(Math.atan2(Math.abs(centerBetweenAnkles.y - centerBetweenEars.y), Math.abs(centerBetweenAnkles.x - centerBetweenEars.x)))
            break;

        
        case 3://left
            earsAngle = Math.atan2(rightEar.y - centerBetweenEars.y, centerBetweenEars.x - rightEar.x )
            shouldersAngle = Math.atan2(rightShoulder.y - centerBetweenShoulders.y, centerBetweenShoulders.x - rightShoulder.x )
            hipsAngle = Math.atan2(rightHip.y - centerBetweenHips.y, centerBetweenHips.x - rightHip.x )
            backAngle = Math.abs(Math.atan2(centerBetweenAnkles.y - centerBetweenEars.y, centerBetweenAnkles.x - centerBetweenEars.x))
            break;
    
        default:
            break;
    }




    let earsAngleOffset = 0
    let shouldersAngleOffset = 0
    let hipsAngleOffset = 0
    let anklesAngleOffset = 0
    let backAngleOffset = 0



    return {
        ears: {
            center: centerBetweenEars,
            left: leftEar,
            right: rightEar,
            offset: earsAngleOffset,
            angle: earsAngle
        },
        shoulders: {
            center: centerBetweenShoulders,
            left: leftShoulder,
            right: rightShoulder,
            offset: shouldersAngleOffset,
            angle: shouldersAngle
        },
        hips: {
            center: centerBetweenHips,
            left: leftHip,
            right: rightHip,
            offset: hipsAngleOffset,
            angle: hipsAngle
        },
        ankles: {
            center: centerBetweenAnkles,
            left: leftAnkle,
            right: rightAnkle,
            offset: anklesAngleOffset,
            angle: backAngle
        }
    }
}