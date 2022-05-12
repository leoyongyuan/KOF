import { Game_Object } from '../game_object/base.js';
import { Control } from '../control/base.js';

class Game_map extends Game_Object {      //构建地图
    constructor(root) {
        super();

        this.root = root;
        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        this.$canvas.focus();

        this.root.$kof.append(
            $(`<div class="kof-head">
                <div class="kof-head-hp-0"><div><div></div></div></div>
                <div class="kof-head-timer">60</div>
                <div class="kof-head-hp-1"><div><div></div></div></div>
                </div>`
            )
        );
        this.control = new Control(this.$canvas);

        this.$timer = this.root.$kof.find(".kof-head-timer");
        this.time_left = 60000;
    }

    start() {

    }

    update() {
        this.time_left -= this.timedelta;
        if (this.time_left < 0) {
            this.time_left = 0;

            let [a, b] = this.root.player;
            if (a.state !== 6 && b.state !== 6) {
                a.vx = b.vx = 0;
                a.state = b.state = 6;
                a.frame_current_cnt = b.frame_current_cnt = 0;
                a.hp = 0, b.hp = 0;
                let $a = this.root.$kof.find(`.kof-head-hp-${0}>div`);
                let $b = this.root.$kof.find(`.kof-head-hp-${1}>div`);
                $a.animate({              //血条减少动画
                    width: $a.parent().width() * a.hp / 100,
                }, 500);
                $b.animate({              //血条减少动画
                    width: $b.parent().width() * b.hp / 100,
                }, 500);
            }
        }
        this.$timer.text(parseInt(this.time_left / 1000));

        this.render();     //避免成为屎山
    }

    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // this.ctx.fillStyle = 'black';
        // this.ctx.fillRect(0, 0, this.$canvas.width(), this.$canvas.height());
    }
}

export {
    Game_map
}