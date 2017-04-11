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
            x: 150,
            y: -200
        }
    }
}

function bounce(coords : Coordinates, bounds : V.Vector2D) : Coordinates {
    // There are *so* many ways to do this, but this is simple
    const {position_px, velocity_pxPerS} = coords;
    const shouldBounceX = position_px.x < 0 || position_px.x > bounds.x;
    const shouldBounceY = position_px.y < 0 || position_px.y > bounds.y;
    return {
        position_px: position_px, // TODO: constrain to bounds?
        velocity_pxPerS: {
            x: (shouldBounceX)
                ? -1.0 * velocity_pxPerS.x
                : velocity_pxPerS.x,
            y: (shouldBounceY)
                ? -1.0 * velocity_pxPerS.y
                : velocity_pxPerS.y
        }
    };
}

// The greek symbol Δ (delta) is often used to mean "change"
function nextState(deltaTime_s : number, prev : Coordinates) : Coordinates {
    const deltaPosition = V.scale(deltaTime_s, prev.velocity_pxPerS);
    const newPositionBeforeBounce = V.add(prev.position_px, deltaPosition);

    const bouncedCoordinates = bounce({
        position_px: newPositionBeforeBounce,
        velocity_pxPerS: prev.velocity_pxPerS
    }, {
        x: CANVAS_WIDTH,
        y: CANVAS_HEIGHT
    });
    return bouncedCoordinates;
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
const gameLogic = {initialState, nextState, graphicsForState, renderToScreen};
const game = createGame(gameLogic);

game.start()