import * as V from "easy-vector2d"
import * as D from "easy-draw/lib/namedAPI"
import {makeRender} from "easy-draw/lib/canvasRenderer"
import {createGame} from "easy-game"

const CANVAS_HEIGHT = 500
const CANVAS_WIDTH = 500

const mousePosition_px : V.Vector2D = {
    x: 0,
    y: 0
}

interface Coordinates {
    position_px : V.Vector2D,
    velocity_pxPerS : V.Vector2D
}

function initialState() : Coordinates {
    return {
        position_px: {
            x: 150,
            y: 150
        },
        velocity_pxPerS: {
            x: 0,
            y: 0
        }
    }
}

// utility function
function accelerate(deltaTime_s : number, prev : Coordinates, acceleration_pxPerS2 : V.Vector2D) : Coordinates {
    // using Euler integration (very inaccurate!)
    return {
        position_px: V.add(prev.position_px, V.scale(deltaTime_s, prev.velocity_pxPerS)),
        velocity_pxPerS: V.add(prev.velocity_pxPerS, V.scale(deltaTime_s, acceleration_pxPerS2))
    };
}

// The greek symbol Δ (delta) is often used to mean "change"
function nextState(deltaTime_s : number, prev : Coordinates) : Coordinates {
    // We want UserInput to be passed in here, e.g. e.g. UserInput.mouse.x/y
    // (relative to canvas!?)
    // We also really want Output dimensions
    // perhaps nextState({deltaTime_s, UserInput, OutputCharacteristics, GameState})
    const unitDirection = V.unitDirection(prev.position_px, mousePosition_px);
    const acceleration_pxPerS2 = V.scale(500, unitDirection);

    return accelerate(deltaTime_s, prev, acceleration_pxPerS2);
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

// track mouse position
function trackMouseMove(e : MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    mousePosition_px.x = e.clientX - rect.left;
    mousePosition_px.y = e.clientY - rect.top
}
canvas.addEventListener('mousemove', trackMouseMove, false);

const renderToScreen = makeRender(canvas.getContext("2d"), true);
const gameLogic = {
    initialState,
    nextState,
    graphicsForState,
    renderToScreen
};
const game = createGame(gameLogic);

game.start()