
import { createVec2D } from '../engine/createVec2D';

export class Bullet {
    
    constructor(){
        const vec2D = createVec2D();
        this.radius = 4;
        this.color = "#FFF";
        this.pos = vec2D.create();
        this.vel = vec2D.create(),
        this.blacklisted = false;

        this.update = () => {
            this.pos.add(this.vel);
        }
        this.reset = () =>{
            this.blacklisted = false;
        }
    }
}