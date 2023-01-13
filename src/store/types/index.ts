export interface CGPoint {
    //class like in SWIFT 
    x: number;
    y: number;
}

export interface Image {
    path: string;
    status: boolean | null;
    angle: number | null;
    landmarks: CGPoint[] | null;
}

export interface Images {
    sessionId: number | null,
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
