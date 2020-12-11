
import { canvas, mouse } from '../store/store';


const events = {
    click: [],
    mousedown:[]
}
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log("x: " + x + " y: " + y);
    mouse.setX(x);
    mouse.setY(y);
  
   
}

export function startMouseEvent() {
 
    document.addEventListener('contextmenu', event => event.preventDefault());

    document.addEventListener("click", (e) => {
                const innerEvent = events["click"];
                Array.from(innerEvent).forEach(ev => ev(e));    
    });
}    document.addEventListener("mousedown", (e) => {
            const _can = canvas.get();
            getCursorPosition(_can,e)
            const innerEvent = events["mousedown"];
            Array.from(innerEvent).forEach(ev => ev(e));    
});
export function setEvent(key, callback) {
    if (events[key]) {
        events[key].push(callback);
    }
}