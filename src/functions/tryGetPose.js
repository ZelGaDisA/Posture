import * as bodyPix from '@tensorflow-models/body-pix';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';



export const tryGetPose = async (img) =>{
    tf.enableProdMode()//set tf to production mode
    await tf.setBackend('webgl'); 
    await tf.ready()
    
    const net = await bodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2
    })
    const person = await net.segmentPerson(img)

    //check photo
    let personLand;
    try {
        personLand = person.allPoses[0].keypoints
    } catch (error) {
        console.log("dots is not found:".toUpperCase())
        console.log(error)
        return
    }

    const result = {}
    const namesKeys = []
    const coordsValues = []

    personLand.forEach(el => {
        namesKeys.push(el.part)
        coordsValues.push(el.position)
    });

    namesKeys.forEach((el, idx) => {
        result[el] = coordsValues[idx]
    })

    //i don't meow what need to be disposed :(
    tf.dispose()
    net.dispose()

    console.log('tensordlow backend: ',tf.getBackend());

    if(Object.entries(result) < 1) {
        console.log('bad result');
    } else {
        // setLands(result)
        return result
    }
}