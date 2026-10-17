import { Texture, TextureLoader, NearestFilter, Sprite, SpriteMaterial } from "three"
type FramePosition = {
  x?: number,
  y?: number,
  w: number,
  h: number
}

type UVFrame = {
  uv_x: number,
  uv_y: number,
  uv_w: number,
  uv_h: number,
  uv_cx: number,
  uv_cy: number
  duration: number
}

type AnimationSpec = {
  name: string,
  from: number,
  to: number,
  direction: "forward" | "reverse" | "pingpong"
}

export default class SpriteSheet {
  raw: {
    frames: { [key: string]: any }
    meta: {
      app: "http://www.aseprite.org/",
      version: string,
      image: string,
      format: string,
      size: FramePosition,
      scale: string,
      // TODO: How to link frameTag to sets?
      frameTags: [AnimationSpec]
    }
  }
  sets: { [key: string]: UVFrame[] }
  animations: [AnimationSpec]
  texture: Texture
  imageFile: string

  constructor(sprite_data: any) {
    this.raw = sprite_data;
    let frames: { [key: string]: UVFrame[] } = {};

    let regex = /(.*)-\d+\.aseprite/
    for (const [key, value] of Object.entries(this.raw.frames)) {
      let [_, name] = key.match(regex)
      if (typeof frames[name] == "undefined") {
        frames[name] = [];
      }
      let cx = -value.frame.w * 0.05;
      let cy = -value.frame.y * 0.05;

      if (value.trimmed) {
        cx = value.spriteSourceSize.x - (value.sourceSize.w * 0.05)
        cy = value.spriteSourceSize.y - (value.sourceSize.h * 0.05)
      }

      frames[name].push({
        uv_x: value.frame.x / this.raw.meta.size.w,
        uv_y: value.frame.y / this.raw.meta.size.h,
        uv_w: value.frame.w / this.raw.meta.size.w,
        uv_h: value.frame.h / this.raw.meta.size.h,
        uv_cx: cx / this.raw.meta.size.w,
        uv_cy: cy / this.raw.meta.size.h,
        duration: value.duration
      });
    }
    this.sets = frames;
    this.animations = this.raw.meta.frameTags;
    this.imageFile = "src/assets/sprites/blob/" + this.raw.meta.image;
  }

  getSprite(name: string, animationName?: string) {
    const frames = this.sets[name]
    const animation = this.animations.find(a => a.name === animationName) ?? this.animations[0];

    // Each sprite gets its own texture so its offset can be animated independently.
    const texture = new TextureLoader().load(this.imageFile);
    texture.magFilter = NearestFilter;

    const spriteMaterial = new SpriteMaterial({ map: texture })

    return new AnimatedSprite(new Sprite(spriteMaterial), frames, animation);
  }
}

// Wraps a Sprite rather than extending it: with an ES5 target, TypeScript can't subclass three's native ES classes.
export class AnimatedSprite {
  sprite: Sprite
  frames: UVFrame[]
  animation: AnimationSpec
  currentFrame: number
  elapsed = 0
  // +1 or -1; only flips for pingpong animations.
  step: number

  constructor(sprite: Sprite, frames: UVFrame[], animation?: AnimationSpec) {
    this.sprite = sprite;
    this.frames = frames;
    this.animation = animation ?? { name: "default", from: 0, to: frames.length - 1, direction: "forward" };
    this.step = this.animation.direction === "reverse" ? -1 : 1;
    this.currentFrame = this.step === 1 ? this.animation.from : this.animation.to;
    this.showFrame();
  }

  // Advance the animation by deltaMs milliseconds.
  update(deltaMs: number) {
    this.elapsed += deltaMs;
    while (this.elapsed >= this.frames[this.currentFrame].duration) {
      this.elapsed -= this.frames[this.currentFrame].duration;
      this.advance();
    }
    this.showFrame();
  }

  private advance() {
    const { from, to, direction } = this.animation;
    if (from === to) {
      return;
    }

    let next = this.currentFrame + this.step;
    if (next > to || next < from) {
      if (direction === "pingpong") {
        this.step = -this.step;
        next = this.currentFrame + this.step;
      } else {
        next = this.step === 1 ? from : to;
      }
    }
    this.currentFrame = next;
  }

  private showFrame() {
    const frame = this.frames[this.currentFrame];
    const texture = this.sprite.material.map;
    texture.repeat.set(frame.uv_w, frame.uv_h);
    // Aseprite measures y from the top of the sheet, three.js UVs from the bottom.
    texture.offset.set(frame.uv_x, 1 - frame.uv_y - frame.uv_h);
  }
}
