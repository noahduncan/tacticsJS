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

  getSprite(name: string) {
    const sprite = this.sets[name]

    const texture = new TextureLoader().load(this.imageFile);
    texture.magFilter = NearestFilter;
    texture.repeat.set(sprite[0].uv_w, sprite[0].uv_h);
    texture.offset.set(sprite[0].uv_x, sprite[0].uv_y);

    const spriteMaterial = new SpriteMaterial({ map: texture })

    return new Sprite(spriteMaterial)
  }
}
