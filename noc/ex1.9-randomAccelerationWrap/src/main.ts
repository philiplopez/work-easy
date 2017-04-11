import * as V from "easy-vector2d"
import * as D from "easy-draw/lib/namedAPI"
import {makeRender} from "easy-draw/lib/canvasRenderer"
import {createGame} from "easy-game"

const CANVAS_HEIGHT = 500
const CANVAS_WIDTH = 500

interface Coordinates {
    position_px : V.Vector2D,
    velocity_pxPerS : V.Vector2D
}

function initialState() : Coordinates {
    return {
        position_px: {
            x: 200,
            y: 200
        },
        velocity_pxPerS: {
            x: 0,
            y: 0
        }
    }
}

function wrapToAxis(value_px : number, max_px : number) : number {
    return(value_px < 0
        ? max_px
        : (value_px > max_px)
            ? 0
            : value_px);
}

function wrap({position_px, velocity_pxPerS} : Coordinates, bounds : V.Vector2D) : Coordinates {
    return {
        position_px: {
            x: wrapToAxis(position_px.x, bounds.x),
            y: wrapToAxis(position_px.y, bounds.y),
        },
        velocity_pxPerS: velocity_pxPerS
    }; 
}

// The greek symbol Δ (delta) is often used to mean "change"
function nextState(deltaTime_s : number, prev : Coordinates) : Coordinates {
    const accleration_pxPerS2: V.Vector2D = {
        x: Math.random() * 500 - 250,
        y: Math.random() * 500 - 250
    }

    const deltaPosition = V.scale(deltaTime_s, prev.velocity_pxPerS);
    const newPositionBeforeWrap = V.add(prev.position_px, deltaPosition);

    const deltaVelocity = V.scale(deltaTime_s, accleration_pxPerS2);
    const newVelocity = V.add(prev.velocity_pxPerS, deltaVelocity);

    const wrappedCoords = wrap({
        position_px: newPositionBeforeWrap,
        velocity_pxPerS: newVelocity
    }, {
        x: CANVAS_WIDTH,
        y: CANVAS_HEIGHT
    });
    return wrappedCoords;
}

function graphicsForState(state : Coordinates) : [D.Drawable]{
    return [D.circle({centre_px: state.position_px, radius_px: 10})];
}

/*
** GAME INITIALISED HERE
*/
const canvas = document.getElementById("canvas")as HTMLCanvasElement
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const renderToScreen = makeRender(canvas.getContext("2d"), true);
const gameLogic = {
    initialState,
    nextState,
    graphicsForState,
    renderToScreen
};
const game = createGame(gameLogic);

game.start()