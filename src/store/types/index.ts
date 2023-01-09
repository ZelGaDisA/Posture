export interface CGPoint {
    //class like in SWIFT 
    x: number;
    y: number;
}

export interface Image {
    path: string;
    status: null | boolean;
    angle: null | number;
    landmarks: null | CGPoint[];
}



export interface Images {
    front: Image,
    left: Image,
    back: Image,
    right: Image,
}

export interface Accel {
    x:number,
    y:number,
    z:number,
}
