import 'App.scss'
import { useEffect,useState } from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Home from 'pages/Home';
import Client from 'pages/Client'
import Result from 'pages/Result';
import Camera from 'pages/Camera'
import Results from 'pages/Results';
import Redactor from 'pages/Redactor';
import Onboarding from 'pages/Onboarding';
import Discriptions from 'pages/Discriptions';
import SessionsPage from 'pages/Sessions';

import { updateClients } from 'store/slices/clients';
import Sessions, { createSessions } from "store/slices/sessions";

import {
    BrowserRouter,
    Redirect,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useHistory,
  } from "react-router-dom";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import { tryGetPose } from "functions/tryGetPose";
import {Device} from '@capacitor/device'
import {useDispatch, useSelector} from "react-redux";
import { RootState } from 'store/store';
import {setAccel,setIsLoading, disableOnboarding} from "store/slices/app";
import { CameraPreview } from '@capacitor-community/camera-preview';

import { SplashScreen } from '@capacitor/splash-screen';


setupIonicReact(
    { 
        swipeBackEnabled: false,
        animated: false
    },
);

const App: React.FC = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [isLoadingPage, setIsLoadingPage] = useState(true)
    const [operatingSystem, setOperatingSystem] = useState<String>('none')


    useEffect(()=>{
        //@ts-ingnore
        const checkDeviceInfoAndStart = async () => {
            const info = await Device.getInfo();
            setOperatingSystem(info.operatingSystem)
            // Если операционная система определена - начинаем просмотр данных акселерометра
            if((operatingSystem === 'ios' || operatingSystem === 'android')){
                //@ts-ignore
                if (typeof DeviceMotionEvent.requestPermission === 'function') {
                    //@ts-ignore
                    DeviceMotionEvent.requestPermission()
                }
            }
        };

        checkDeviceInfoAndStart()
    },[operatingSystem])

    useEffect(() => {     

        if((operatingSystem === 'ios' || operatingSystem === 'android' || operatingSystem === 'mac')){
            dispatch(createSessions())
            dispatch(updateClients())
    
            {(async () =>{
                await tryGetPose(new Image(window.innerWidth,  window.innerHeight)) //enable tensorflow
                SplashScreen.hide()
                console.log('Tensorflow is started!');
            })()}
            
            CameraPreview.start({
                toBack: true,
                disableAudio: true,
                height: window.innerHeight,
                width: window.innerWidth,
                position: 'rear',
                parent: "root"
            })
    
            //@ts-ignore
            const deviceMotionEvent = (event: any) =>  dispatch(setAccel({accel:event.accelerationIncludingGravity, operatingSystem: operatingSystem}))

            window.addEventListener('devicemotion', deviceMotionEvent, true) //add accel listener

            setIsLoadingPage(false)    

            return () =>  window.removeEventListener('devicemotion', deviceMotionEvent, true) //remove accel listener
        }else {
            console.log('device is false');
            
        }
    }, [operatingSystem]);

    return (
        <>
            <IonApp>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/home">
                            <Home />
                        </Route>

                        <Route exact path="/camera">
                            <Camera />
                        </Route>

                        <Route path="/result">
                            <Result />
                        </Route>

                        <Route path="/results">
                            <Results />
                        </Route>

                        <Route path="/redactor">
                            <Redactor />
                        </Route>

                        <Route path="/client">
                            <Client />
                        </Route>

                        <Route path="/sessions">
                            <SessionsPage />
                        </Route>

                        <Route path="/discriptions">
                            <Discriptions />
                        </Route>

                        <Route path="/onboarding">
                            <Onboarding />
                        </Route>

                        <Route path="/">
                            <Redirect to="/onboarding" />
                        </Route>

                    </Switch>
                </BrowserRouter>
            </IonApp>
        </>
    )
    };

export default App;
