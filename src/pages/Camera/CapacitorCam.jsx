//import
import './CapacitorCam.scss';

import { useEffect, useState } from "react";
import { IonContent, IonPage, IonButton, useIonAlert } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { RootState } from 'store/store';
import { tryGetPose } from "functions/tryGetPose";
import { AccelInterface } from "components/Interfaces/AccelInterface";
import { CGPoint, Images } from 'store/types';

//REDUX
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading, setIsReading, setIsRetakeOnePhoto, setResultSideNumber } from "store/slices/app";
import { addImage } from "store/slices/sessions";

//IMAGES
import circleButton from "images/roundGreenButton.svg";
import alertTriangle from '../../images/alert-triangle.svg';
import checkCircle from '../../images/check-circle.svg';

import greenFrontMan from 'images/greenFrontMan.svg';
import greenLeftMan from 'images/greenLeftMan.svg';
import greenRightMan from 'images/greenRightMan.svg';

import blackFrontMan from 'images/frontSVG.svg';
import blackLeftMan from 'images/leftSVG.svg';
import blackRightMan from 'images/rightSVG.svg';
import { CameraPreview } from '@capacitor-community/camera-preview';

export default function CapacitorCam() {

    const dispatch = useDispatch()
    const history = useHistory()
    const [presentAlert] = useIonAlert();

    const images: Images = useSelector((state: RootState) => state.sessions.images)
    const session = useSelector((state: RootState) => state.sessions.session)
    const accel = useSelector((state: RootState) => state.app.accel)

    const isRetakeOnePhoto = useSelector((state: RootState) => state.app.isRetakeOnePhoto);
    const resultSideNumber = useSelector((state: RootState) => state.app.resultSideNumber);

    const [selectedMenuItemIndex, setSelectedMenuItemIndex] = useState(0)

    const [lastImage, setLastImage] = useState<string | null>(null)
    const [lastIndex, setLastIndex] = useState(-1)
    const sides = ['front', 'right', 'back', 'left']
    const blackMan = [blackFrontMan, blackRightMan, blackFrontMan, blackLeftMan]
    const greenMan = [greenFrontMan, greenRightMan, greenFrontMan, greenLeftMan]

    useEffect(() => {
        if (lastImage && lastIndex >= 0 && lastImage?.length > 0) {
            checkImage(lastImage)
        }
    }, [lastImage, lastIndex])


    const addBlure = () => {
        let filter = document.getElementById('filter')
        filter?.classList.add("blur")

        let timer:any = setTimeout(() => {
            if(filter && filter.className) filter.className = ''
            return clearTimeout(timer)
        }, 100)
    }

    const capture = async () => {

        const result = await CameraPreview.capture({
            quality: 90,
        })

        if (!result || result.value.length < 7) return

        const base64PictureData = result.value;
        const imageSrcPath = 'data:image/jpeg;base64,' + base64PictureData;
        setLastImage(imageSrcPath)
        setLastIndex(selectedMenuItemIndex)
        setSelectedMenuItemIndex(selectedMenuItemIndex + 1)
    }

    const checkImage = async (imageSrcPath:string) => {
        var img = new Image(window.innerWidth, window.innerHeight)
        img.src = imageSrcPath

        let turnAngle = accel.x * -0.025

        let res: CGPoint[] | null = await tryGetPose(img) || null
        let status = () => (res && Object.entries(res).length > 0) ? true : false

        const backToResults = () => {
            dispatch(setIsRetakeOnePhoto(false))
            setSelectedMenuItemIndex(0)
            isAnyResults() && history.goBack()
        }

        const switcher = isRetakeOnePhoto ? resultSideNumber + 1 : selectedMenuItemIndex

        switch (switcher) {
            case 1:
                dispatch(addImage({
                    sessionId: session.id,
                    front: { path: imageSrcPath, status: status(), angle: turnAngle, landmarks: res},
                },))
                isRetakeOnePhoto && backToResults()
                break;
            case 2:
                dispatch(addImage({
                    sessionId: session.id,
                    right: { path: imageSrcPath, status: status(), angle: turnAngle, landmarks: res},
                },))
                isRetakeOnePhoto && backToResults()
                break;
            case 3:
                dispatch(addImage({
                    sessionId: session.id,
                    back: { path: imageSrcPath, status: status(), angle: turnAngle, landmarks: res},
                },))
                isRetakeOnePhoto && backToResults()
                break;
            case 4:
                dispatch(addImage({
                    sessionId: session.id,
                    left: { path: imageSrcPath, status: status(), angle: turnAngle, landmarks: res},
                },))
                isRetakeOnePhoto && backToResults()
                setSelectedMenuItemIndex(0)

                if (isRetakeOnePhoto) dispatch(setIsRetakeOnePhoto(false))

                dispatch(setIsLoading(true))
                dispatch(setIsReading(false))

                history.push('/results')

                break;

            default:
                break;
        }
    }

    const isGoodAccel = () => (Math.abs(accel.x) > 0.5 || Math.abs(accel.z) > 0.5) ? false : true

    const isAnyResults = () => {
        for (const [key, value] of Object.entries(images)) {
            if (value?.path?.length > 0) return true
        }
        return false
    }


    return (
        <>
            <IonPage>

                <IonContent fullscreen id="content">
                    <AccelInterface accel={accel} />

                    <ul className="menuList">
                        {isRetakeOnePhoto &&
                            <li
                                className="menuList-el selected"
                            >
                                {/* @ts-ignore */}
                                {images[sides[resultSideNumber]]?.status && <img className="menuList-el-statusIcon" src={checkCircle}></img>}
                                {/* @ts-ignore */}
                                {images[sides[resultSideNumber]]?.status === false && <img className="menuList-el-statusIcon" src={alertTriangle}></img>}

                                <img className="menuList-el-manIcon" src={blackMan[resultSideNumber]} alt="" />
                                <p>{sides[resultSideNumber][0].toUpperCase() + sides[resultSideNumber].slice(1)}</p>
                            </li>
                        }
                        {!isRetakeOnePhoto && blackMan.map((svg, index) => (
                            <li
                                key={index}
                                className={"menuList-el" + (selectedMenuItemIndex === index ? " selected" : "")}
                                onClick={() => setSelectedMenuItemIndex(index)}
                            >
                                {/* @ts-ignore */}
                                {images[sides[index]].status //if pose is found - change card style and image
                                    ? <>
                                        <img className="menuList-el-statusIcon" src={checkCircle}></img>
                                        <img className="menuList-el-manIcon" src={greenMan[index]} alt="" />
                                        <p className='greenText'>{sides[index][0].toUpperCase() + sides[index].slice(1)}</p>
                                    </>
                                    : <>
                                        {/* @ts-ignore */}
                                        {images[sides[index]].status === false && <img className="menuList-el-statusIcon" src={alertTriangle}></img>}
                                        <img className="menuList-el-manIcon" src={svg} alt="" />
                                        <p className='blackText'>{sides[index][0].toUpperCase() + sides[index].slice(1)}</p>
                                    </>
                                }

                            </li>
                        ))}
                    </ul>

                    <div id="filter"></div>
                </IonContent>

                <div className='btn-box'>

                    <div className={`btn-capture ${isGoodAccel()}`} onClick={() => {
                        if (isGoodAccel()) {
                            addBlure()
                            capture()
                        }
                    }}>
                        <img src={circleButton} alt="" />
                    </div>

                    <button className='btn-toHome'
                            onClick={() =>
                                presentAlert({
                                    header: 'Clear photo',
                                    message: "This will clear all photo. Are you sure?",
                                    buttons: [
                                        {
                                            text: 'CANCEL',
                                            role: 'cancel',
                                            handler: () => {
                                            },
                                        },
                                        {
                                            text: 'CLEAR',
                                            role: 'confirm',
                                            handler: () => {
                                                dispatch(setIsLoading(true))
                                                dispatch(setIsRetakeOnePhoto(false))
                                                dispatch(setResultSideNumber(0))
                                                setSelectedMenuItemIndex(0)
                                                history.push("/home")
                                            },
                                        },
                                    ]
                                })
                            }
                    >
                        <p>Cancel</p>
                    </button>

                    <div className={`btn-toResults ${isAnyResults()}`} onClick={() => {
                        if (isAnyResults()) {
                            setSelectedMenuItemIndex(0)
                            history.push('/results')
                        }
                    }}>
                        <p>Results</p>
                    </div>
                </div>

            </IonPage>
        </>
    )
}


