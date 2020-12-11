export const store = {
    canvas: null,
    context: null,
    scene: null,
    mouse: {
        x: 0,
        y: 0
    },
    screen: {
        height: null,
        width: null
    },
    bulletsPool: []
}
export const bulletsPool = {
    set: (_bullet) => {
        store.bulletsPool.push(_bullet);
    },
    get: () => store.bulletsPool
}
export const scene = {
    set: (_scene) => {
        store.scene = _scene;
    },
    get: () => store.scene
}
export const canvas = {
    set: (_canvas) => {
        store.canvas = _canvas;
    },
    get: () => store.canvas
}
export const context = {
    set: (_context) => {
        store.context = _context;
    },
    get: () => store.context
}
export const screen = {
    setWidth: (width) => {
        store.screen.width = width;
    },
    setHeight: (height) => {
        store.screen.height = height;
    },
    getHeight: () => store.screen.height,
    getWidth: () => store.screen.width
}
export const mouse = {
    setX: (x) => {
        store.mouse.x = x;
    },
    getX: () => store.mouse.x,
    setY: (y) => {
        store.mouse.y = y;
    },
    getY: () => store.mouse.y
}
