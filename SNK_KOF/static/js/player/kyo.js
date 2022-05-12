import { Player } from "../player/base.js";
import { GIF } from '../utils/gif.js';

export class Kyo extends Player {
    constructor(root, info) {
        super(root, info);

        this.init_animations();
    }

    init_animations() {

        let offset_Y = [-10, -35, -35, -10, 0, 0, 0, -200, 0];
        let outer = this;
        for (let i = 0; i < 8; i++) {
            let gif = GIF();
            gif.load(`/static/images/player/kyo/${i}.gif`);

            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,   // 总图片数
                frame_rate: 12,  // 每12帧加载一次
                offset_y: offset_Y[i],   //y轴偏移量
                loaded: false,  // 判断加载是否完成
                scale: 2,      //缩放角色大小
            });

            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;
                if (i === 7) {
                    obj.frame_rate = 8;
                }
                if (i === 3) {
                    obj.frame_rate = 4;
                }
            }
        }
    }
}
