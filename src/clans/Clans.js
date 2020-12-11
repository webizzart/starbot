
import {Marine} from '../marine/marine';
import {screen} from '../store/store';

export class Clan {

    constructor(props = {}) {
        this.player = props.player || "AI" //TODO: enum
         this.flag = "",
         this.name = props.name;
         this.units = [new Marine(screen.getWidth() >> 1, screen.getHeight() >> 1),new Marine(screen.getWidth() >> 1, screen.getHeight()+100 >> 1)];
         this.selectedUnits = [];
         this.buildings = [] // should be with units ? 
    }
}
export const TYPE = {
    AI:"AI",
    PLAYER:"PLAYER"
}