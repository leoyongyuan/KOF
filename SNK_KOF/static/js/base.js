import { Game_map } from '../js/game_map/base.js';
import { Kyo } from '../js/player/kyo.js';


class KOF {
    constructor(id) {
        this.$kof = $('.' + id);
        this.game_map = new Game_map(this);
        this.player = [
            new Kyo(this, {
                id: 0,
                x: 300,
                y: 0,
                width: 120,
                height: 180,
                color: 'blue',
            }),
            new Kyo(this, {
                id: 1,
                x: 900,
                y: 0,
                width: 120,
                height: 180,
                color: 'red',
            })
        ];
    }

}

export {
    KOF
}