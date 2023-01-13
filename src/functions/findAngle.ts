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
  
  if(filtredImages.length < 2 || !filtredImages[0] || !filtredImages[1]){
      return
  }
  
  let coords: any;
  
  switch (sideNumber) {
      case 0:
          coords = filtredImages.map((i:Images) => !!(i && i.front && i.front.landmarks) && getCoords(i.front.landmarks, 0))
          break;
      case 1:
          coords = filtredImages.map((i:Images) => !!(i && i.right && i.right.landmarks) && getCoords(i.right.landmarks, 1))
          break;
      case 2:
          coords = filtredImages.map((i:Images) => !!(i && i.back && i.back.landmarks) && getCoords(i.back.landmarks, 2))
          break;
      case 3:
          coords = filtredImages.map((i:Images) => !!(i && i.left && i.left.landmarks) && getCoords(i.left.landmarks, 3))
          break;
      default:
          break;
  }



  if(coords && coords.length === 2){
      let a = coords[0]
      let b = coords[1]

      if(!a || !b) {
          return
      }

      const toGradus = (radian: number) => {
          return Math.floor((radian * (180/Math.PI)) * 100) / 100
      }
      
      let result = {
          ears: {
              before: toGradus(a.ears.angle),
              after: toGradus(b.ears.angle),
              comparison: Math.abs(toGradus(Math.abs(b.ears.angle) - Math.abs(a.ears.angle))),
              color: toGradus(Math.abs(b.ears.angle) - Math.abs(a.ears.angle)) > 0 ? "red" : "green"
          },
          shoulders: {
              before: toGradus(a.shoulders.angle),
              after: toGradus(b.shoulders.angle),
              comparison: Math.abs(toGradus(Math.abs(b.shoulders.angle) - Math.abs(a.shoulders.angle))),
              color: toGradus(Math.abs(b.shoulders.angle) - Math.abs(a.shoulders.angle)) > 0 ? "red" : "green"
          },
          hips: {
              before: toGradus(a.hips.angle),
              after: toGradus(b.hips.angle),
              comparison: Math.abs(toGradus(Math.abs(b.hips.angle) - Math.abs(a.hips.angle))),
              color: toGradus(Math.abs(b.hips.angle) - Math.abs(a.hips.angle)) > 0 ? "red" : "green"
          },
          ankles: {
              before: toGradus(a.ankles.angle),
              after: toGradus(b.ankles.angle),
              comparison: Math.abs(toGradus(Math.abs(b.ankles.angle) - Math.abs(a.ankles.angle))),
              color: toGradus(Math.abs(b.ankles.angle) - Math.abs(a.ankles.angle)) > 0 ? "red" : "green"
          }
      }

      return result
  }
  
}