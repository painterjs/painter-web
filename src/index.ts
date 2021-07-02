import * as Painter from 'painter-kernel';
import { IPalette, IView } from 'painter-kernel/dist/pen';

interface Injection {
  loadImage: (url: string) => Promise<{
    img: any;
    width: number;
    height: number;
  }>;
  getRatio: () => number;
  customActions: {
    [type: string]: {
      layout: (
        view: IView,
        viewRects: {
          [id: string]: {
            width: number;
            height: number;
            left: number;
            top: number;
            right: number;
            bottom: number;
          };
        },
      ) => {
        left: number;
        top: number;
        right: number;
        bottom: number;
      };
      draw: (view: IView, ctx: CanvasRenderingContext2D) => Promise<void>;
    };
  };
}

class PainterWeb {
  constructor(
    private ctx: CanvasRenderingContext2D,
    options: Partial<{
      injection: Partial<Injection>;
      screenK: number;
      scale: number;
    }> = {
      injection: {},
      screenK: 1,
      scale: 1,
    },
  ) {
    Painter.initInjection({
      loadImage: async url => {
        return new Promise(resolve => {
          const img = new Image();
          img.onload = function () {
            resolve({
              img,
              height: img.height,
              width: img.width,
            });
          };
          img.src = url;
        });
      },
      ...options.injection,
    });
    Painter.setStringPrototype(options.screenK, options.scale);
  }

  clearPenCache() {
    Painter.clearPenCache();
  }

  getPenCache() {
    return Painter.penCache;
  }

  static toPx(str: number | string, baseSize?: number) {
    return Painter.toPx(str, baseSize);
  }

  paint(palette: IPalette, callback: () => void) {
    const pen = new Painter.Pen(this.ctx, palette);
    pen.paint(callback);
  }
}
export default PainterWeb