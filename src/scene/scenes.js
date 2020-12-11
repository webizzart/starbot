import { Clan, TYPE } from '../clans/Clans';
class Scene {

    constructor(props) {

        const { players = 1 } = props;

        this.clans = [];

        this.clans.push(new Clan({ player: TYPE.PLAYER }))

        //A.I
        
        // for (let i = 0; i < players; i++) {
        //     this.clans.push(new Clan({ player: TYPE.AI }))
        // }
    }
}
export function skirmish(props = {}) {
    return new Scene(props);
} 