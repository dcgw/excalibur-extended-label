import {Actor, BaseAlign, Body, Color, FontStyle, FontUnit, TextAlign, Vector} from "excalibur";

export interface LabelOptions {
    /**  The text to draw. */
    readonly text?: string;

    /** The CSS font family string (e.g. `sans-serif`, `Droid Sans Pro`). Web
     * fonts are supported, same as in CSS. */
    readonly fontFamily?: string;

    /** The font style for the label.
     *
     * @default FontStyle.Normal */
    readonly fontStyle?: FontStyle;

    /** True if the text is bold.
     *
     * @default false */
    readonly bold?: boolean;

    /** The font size in the selected units.
     *
     * @default 10 */
    readonly fontSize?: number;

    /** The font size units.
     *
     * @default FontUnit.Px */
    readonly fontUnit?: FontUnit;

    /** Horizontal text alignment.
     *
     * @default TextAlign.Left */
    readonly textAlign?: TextAlign;

    /** Basline alignment.
     *
     * @default BaseAlign.Alphabetic */
    readonly baseAlign?: BaseAlign;

    /** The position of the text in pixels. */
    readonly pos?: Vector;

    /** The velocity of the text in pixels per second. */
    readonly vel?: Vector;

    /** The acceleration of the text in pixels per second per second. */
    readonly acc?: Vector;

    /** The rotation of the text in radians. */
    readonly rotation?: number;

    /** The rotational velocity of the text in radians per second. */
    readonly rx?: number;

    /** True if the text is visible, false if it is invisible.
     *
     * @default true */
    readonly visible?: boolean;

    /** The color of the text. */
    readonly color?: Color;

    /** The color of the text outline. Set to Color.Transparent to hide the outline.
     *
     * @default Color.Transparent */
    readonly outlineColor?: Color;

    /** The width of the text outline, in pixels. Set to 0 to hide the outline.
     *
     * @default 0 */
    readonly outlineWidth?: number;

    /** The color of the shadow. Set to Color.Transparent to hide the shadow.
     *
     * @default Color.Transparent */
    readonly shadowColor?: Color;

    /** The offset of the shadow from the text, in pixels.
     *
     * @default Vector.Zero */
    readonly shadowOffset?: Vector;

    /** Radius of the shadow blur in pixels.
     *
     * @default 0 */
    readonly shadowBlurRadius?: number;

    /** The physics body the is associated with this actor. The body is the
     * container for all physical properties, like position, velocity,
     * acceleration, mass, inertia, etc. */
    readonly body?: Body;
}

const offscreenCanvas = (() => {
    let cache: HTMLCanvasElement | null = null;

    return (onscreenCanvas: HTMLCanvasElement): HTMLCanvasElement | null => {
        if (cache == null) {
            cache = onscreenCanvas.ownerDocument?.createElement("canvas") ?? null;
        }

        if (cache != null) {
            cache.width = onscreenCanvas.width;
            cache.height = onscreenCanvas.height;
        }

        return cache;
    };
})();

export default class Label extends Actor {
    /**  The text to draw. */
    public text: string;

    /** True if the text is bold.
     *
     * @default false */
    public bold: boolean;

    /** The CSS font family string (e.g. `sans-serif`, `Droid Sans Pro`). Web fonts
     * are supported, same as in CSS. */
    public fontFamily: string;

    /** Font size in the selected units (`fontUnit`).
     *
     * @default 10 */
    public fontSize: number;

    /** The font style for this label
     *
     * @default FontStyle.Normal */
    public fontStyle: FontStyle;

    /** The units for the font size.
     *
     * @default FontUnit.Px */
    public fontUnit: FontUnit;

    /** Horizontal text alignment.
     *
     * @default TextAlign.Left */
    public textAlign: TextAlign;

    /** Vertical baseline text alignment.
     *
     * @default BaseAlign.Bottom */
    public baseAlign: BaseAlign;

    /** The color of the text outline. Set to Color.Transparent to hide the outline. */
    public outlineColor: Color;

    /** The width of the text outline, in pixels. Set to 0 to hide the outline. */
    public outlineWidth: number;

    /** The color of the shadow. Set to Color.Transparent to hide the shadow. */
    public shadowColor: Color;

    /** The offset of the shadow from the text, in pixels. */
    public shadowOffset: Vector;

    /** Radius of the shadow blur in pixels. */
    public shadowBlurRadius: number;

    public constructor(options?: LabelOptions) {
        super(options);
        this.text = options?.text ?? "";
        this.bold = options?.bold ?? false;
        this.fontFamily = options?.fontFamily ?? "sans-serif";
        this.fontSize = options?.fontSize ?? 10;
        this.fontStyle = options?.fontStyle ?? FontStyle.Normal;
        this.fontUnit = options?.fontUnit ?? FontUnit.Px;
        this.textAlign = options?.textAlign ?? TextAlign.Left;
        this.baseAlign = options?.baseAlign ?? BaseAlign.Bottom;
        this.outlineColor = options?.outlineColor ?? Color.Transparent;
        this.outlineWidth = options?.outlineWidth ?? 0;
        this.shadowColor = options?.shadowColor ?? Color.Transparent;
        this.shadowOffset = options?.shadowOffset ?? Vector.Zero;
        this.shadowBlurRadius = options?.shadowBlurRadius ?? 0;
    }

    public draw(context: CanvasRenderingContext2D, delta: number): void {
        const shadowVisible =
            this.shadowColor.a !== 0 &&
            (this.shadowBlurRadius !== 0 || this.shadowOffset.x !== 0 || this.shadowOffset.y !== 0);
        const canvas2 = shadowVisible ? offscreenCanvas(context.canvas) : null;
        const context2 = canvas2?.getContext("2d") ?? context;

        context2.save();
        context2.translate(this.pos.x, this.pos.y);
        context2.scale(this.scale.x, this.scale.y);
        context2.rotate(this.rotation);
        context2.textAlign = lookupTextAlign(this.textAlign);
        context2.textBaseline = lookupBaseAlign(this.baseAlign);
        context2.font = `${lookupFontStyle(this.fontStyle)} ${lookupFontWeight(this.bold)} ${
            this.fontSize
        }${lookupFontUnit(this.fontUnit)} ${this.fontFamily}`;
        context2.lineWidth = this.outlineWidth * 2;
        context2.strokeStyle =
            this.outlineWidth === 0 ? "transparent" : this.outlineColor.toString();
        context2.fillStyle = this.color.toString();
        context2.strokeText(this.text, 0, 0);
        context2.fillText(this.text, 0, 0);
        context2.restore();

        if (canvas2 != null) {
            context.save();
            context.shadowBlur = this.shadowBlurRadius;
            context.shadowColor = this.shadowColor.toString();
            context.shadowOffsetX = this.shadowOffset.x;
            context.shadowOffsetY = this.shadowOffset.y;
            context.drawImage(canvas2, 0, 0);
            context.restore();
        }
    }
}

function lookupFontUnit(fontUnit: FontUnit): string {
    switch (fontUnit) {
        case FontUnit.Em:
            return "em";
        case FontUnit.Rem:
            return "rem";
        case FontUnit.Pt:
            return "pt";
        case FontUnit.Px:
            return "px";
        case FontUnit.Percent:
            return "%";
    }
}

function lookupTextAlign(textAlign: TextAlign): CanvasTextAlign {
    switch (textAlign) {
        case TextAlign.Left:
            return "left";
        case TextAlign.Right:
            return "right";
        case TextAlign.Center:
            return "center";
        case TextAlign.End:
            return "end";
        case TextAlign.Start:
            return "start";
    }
}

function lookupBaseAlign(baseAlign: BaseAlign): CanvasTextBaseline {
    switch (baseAlign) {
        case BaseAlign.Alphabetic:
            return "alphabetic";
        case BaseAlign.Bottom:
            return "bottom";
        case BaseAlign.Hanging:
            return "hanging";
        case BaseAlign.Ideographic:
            return "ideographic";
        case BaseAlign.Middle:
            return "middle";
        case BaseAlign.Top:
            return "top";
    }
}

function lookupFontStyle(fontStyle: FontStyle): string {
    switch (fontStyle) {
        case FontStyle.Italic:
            return "italic";
        case FontStyle.Normal:
            return "normal";
        case FontStyle.Oblique:
            return "oblique";
    }
}

function lookupFontWeight(bold: boolean): string {
    return bold ? "bold" : "normal";
}
