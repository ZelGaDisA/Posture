import { Session} from 'store/slices/sessions';
import { Images } from 'store/types';
import { getCoords } from './getCoords';

export const findAngle = (selectedSessions: Session[], sessions:Session[], sideNumber:number)=>{
    //sorting by date
        let localstoreImages:Images[] = sessions.map((s:Session)=>{
        let image = localStorage.getItem(String(s.id))
        return image && JSON.parse(image)
    })

    if(!localstoreImages || localstoreImages?.length === 0){
        return
    }
    //@ts-ignore
    const images = localstoreImages

    const filtredImages:any = selectedSessions.slice().sort((a,b) => a.id - b.id).map(s => {
        return images.slice().map((i:Images, k:number)=>{
            return (i?.sessionId === +s.id) ? i : null
        }).filter((i) => !!i && i)[0]
        
    })

    if(filtredImages.length < 1){
        return
    }

    const returnCoords = (sideNumber:number) => {
        switch (sideNumber) {
            case 0:
                return filtredImages.map((i:Images) => !!(i && i?.front && i?.front?.landmarks) && getCoords(i.front.landmarks, 0))
            case 1:
                return filtredImages.map((i:Images) => !!(i && i?.right && i?.right?.landmarks) && getCoords(i.right.landmarks, 1))
            case 2:
                return filtredImages.map((i:Images) => !!(i && i?.back && i?.back?.landmarks) && getCoords(i.back.landmarks, 2))
            case 3:
                return filtredImages.map((i:Images) => !!(i && i?.left && i?.left?.landmarks) && getCoords(i.left.landmarks, 3))
            default:
                break;
        }
    }

    const coords = returnCoords(sideNumber)
    let a = coords[0]
    let b = coords[1]

    const toGradus = (radian: number) => {
        return Math.floor((radian * (180/Math.PI)) * 100) / 100
    }

    const comparison = (b:number|null, a:number|null) => {
        if(a && b) {
            return {
                value: Math.floor(Math.abs(Math.abs(toGradus(b)) -  Math.abs(toGradus(a))) * 100) / 100,
                color: toGradus(Math.abs(b)) > toGradus(Math.abs(a)) ? "red" : "green"
            }
        }else {
            return {
                value: 0,
                color: "black"
            }
        }
    }

    return {
        ears: {
            before: a ? toGradus(a?.ears?.angle) : 0,
            after: b ? toGradus(b?.ears?.angle) : 0,
            comparison: comparison(b?.ears?.angle, a?.ears?.angle).value,
            color: comparison(b?.ears?.angle, a?.ears?.angle).color
        },
        shoulders: {
            before: a ? toGradus(a?.shoulders.angle) : 0,
            after: b ? toGradus(b?.shoulders.angle) : 0,
            comparison: comparison(b?.shoulders?.angle, a?.shoulders?.angle).value,
            color: comparison(b?.shoulders?.angle, a?.shoulders?.angle).color
        },
        hips: {
            before: a ? toGradus(a?.hips?.angle) : 0,
            after: b ? toGradus(b?.hips?.angle) : 0,
            comparison: comparison(b?.hips?.angle, a?.hips?.angle).value,
            color: comparison(b?.hips?.angle, a?.hips?.angle).color
        },
        ankles: {
            before: a ? Math.round(toGradus(Math.PI/2 - a?.ankles?.angle) * 100) / 100 : 0,
            after: b ? Math.round(toGradus(Math.PI/2 - b?.ankles?.angle) * 100) / 100 : 0,
            comparison: comparison((Math.PI/2 - b?.ankles?.angle), (Math.PI/2 - a?.ankles?.angle)).value,
            color: comparison((Math.PI/2 - b?.ankles?.angle), (Math.PI/2 - a?.ankles?.angle)).color
        }
    }

}