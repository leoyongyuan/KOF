import { Game_Object } from "../game_object/base.js";
import { Kyo } from "./kyo.js"

let skill = new Set();

class Player extends Game_Object {
    constructor(root, info)     //info传入player对象信息
    {
        super();
        this.root = root;
        this.ctx = this.root.game_map.ctx;  //获取canvas
        this.press_key = this.root.game_map.control.press_key;  // 获取按键集合

        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.direction = 1;  //角色朝向

        this.vx = 0;
        this.vy = 0;

        this.speedx = 400;   //水平速度
        this.speedy = -2500;   // 跳起的初始速度
        this.g = 50;         // 重力加速度

        this.state = 3 // 状态机：0.原地不动 1.向前 2.向后 3.跳跃 4.攻击 5.被攻击 6.死亡 7.技能 8.被技能攻击 
        this.animations = new Map();      //存储动作    
        this.frame_current_cnt = 0;

        this.hp = 100;           //定义血量
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);
    }

    start() {

    }

    update_move() {            //人物移动
        this.vy += this.g;

        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        if (this.y > 500) {
            this.y = 500;
            this.vy = 0;
            if (this.state === 3) this.state = 0;
        }
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
        }

    }

    update_control()      //按键控制
    {
        let w, a, d, j;
        if (this.id === 0) {
            w = this.press_key.has('w');
            d = this.press_key.has('d');
            a = this.press_key.has('a');
            j = this.press_key.has('j');
        } else {
            w = this.press_key.has('ArrowUp');
            d = this.press_key.has('ArrowRight');
            a = this.press_key.has('ArrowLeft');
            j = this.press_key.has('1');
        }


        if (this.state >= 0 && this.state <= 2) {
            if (j) {
                this.state = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
                skill.add(4);
                let t = 0;
                for (let key of skill) t = t * 10 + key;
                if (t === 214) {
                    console.log("skill");
                    this.state = 7;
                    this.frame_current_cnt = 0;
                    this.vx = 0;
                }
                skill.clear();
            }
            else if (w) {
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.state = 3;
                this.frame_current_cnt = 0;
            }
            else if (d) {
                this.vx = this.speedx;
                this.state = 1;
                skill.add(2);
            } else if (a) {
                this.vx = -this.speedx;
                this.state = 1;
                skill.add(1);
            }
            else {
                this.vx = 0;
                this.stats = 0;
            }
        }
    }



    update_direction() {
        if (this.state === 6) return;
        let players = this.root.player;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) me.direction = 1;
            else me.direction = -1;
        }
    }

    attacked() {     //被攻击到
        if (this.state === 6) return;
        if (this.state === 8) {        //受到技能伤害
            this.hp = Math.max(this.hp - 20, 0);
        }
        else this.hp = Math.max(this.hp - 10, 0);
        this.$hp.animate({              //血条减少动画
            width: this.$hp.parent().width() * this.hp / 100,
        }, 500);

        this.state = 5;
        this.frame_current_cnt = 0;
        if (this.hp <= 0) {
            this.state = 6;
            this.frame_current_cnt = 0;
            this.vx = 0;
        }
    }

    is_collision(r1, r2) {     // 判断碰撞检测
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
            return false;
        return true;
    }

    update_attack() {             //更新攻击
        if ((this.state === 4 || this.state === 7) && this.frame_current_cnt === 18) {               //攻击只有一帧的瞬间，如果不添加则每一帧攻击动作都会被判断伤害
            let me = this, you = this.root.player[1 - this.id];
            let r1;
            if (this.direction > 0) {
                r1 = {
                    x1: me.x + 120,
                    y1: me.y + 40,
                    x2: me.x + 120 + 100,
                    y2: me.y + 40 + 20,
                };

            } else {
                r1 = {
                    x1: me.x + me.width - 220,
                    y1: me.y + 40,
                    x2: me.x + me.width - 120,
                    y2: me.y + 40 + 20,
                };
            }

            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            };
            if (this.is_collision(r1, r2)) {
                if (this.state === 7) you.state = 8;
                you.attacked();
            }
        }
    }


    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.update_attack();

        this.render();
    }

    render() {

        let state = this.state;

        if (this.direction * this.vx < 0 && this.vy === 0 && state === 1) state = 2;            //判断角色朝向与移动方向是否一致，不一致则做出防御后退，一致则为前进状态
        if (this.direction * this.vx > 0 && this.vy === 0 && state === 2) state = 1;


        let obj = this.animations.get(state);   //从哈希表中获取对应状态的图片


        if (obj && obj.loaded) {
            if (this.direction < 0) {
                this.ctx.save();

                this.ctx.scale(-1, 1);          // 通过变换坐标系翻转
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

                this.ctx.restore();

            }
            else {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            }
        }
        if (state === 1) {
            this.state = 0;
        }
        if (state === 5 || state === 4 || state === 6 || state === 7) {            //特定动作渲染完后，在根据状态机转换为其他状态
            if (this.frame_current_cnt === obj.frame_rate * (obj.frame_cnt - 1)) {
                if (state === 6) {
                    this.frame_current_cnt--;
                }
                else this.state = 0;
            }
        }

        this.frame_current_cnt++;
    }
}

export {
    Player
}