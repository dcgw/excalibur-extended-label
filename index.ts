import {
    Actor,
    BaseAlign,
    Body,
    CollisionType,
    Color,
    FontStyle,
    FontUnit,
    TextAlign,
    Vector
} from "excalibur";

export interface LabelOptions extends Partial<Label> {
    x?: number;
    y?: number;
    text?: string;
    bold?: boolean;
    pos?: Vector;
    vel?: Vector;
    acc?: Vector;
    rotation?: number;
    rx?: number;
    z?: number;
    color?: Color;
    visible?: boolean;
    body?: Body;
    collisionType?: CollisionType;
    shadowWidth?: number;
    shadowColor?: Color;
    shadowOffset?: Vector;
}

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

    /** The maximum width in pixels that the label should occupy. */
    public maxWidth?: number;

    /** Width of the shadow blur in pixels. */
    public shadowWidth: number;

    /** The color of the shadow. Set to Color.Transparent to hide the shadow. */
    public shadowColor: Color;

    /** The offset of the shadow from the text, in pixels. */
    public shadowOffset: Vector;

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
        this.maxWidth = options?.maxWidth;
        this.shadowWidth = options?.shadowWidth ?? 0;
        this.shadowColor = options?.shadowColor ?? Color.Transparent;
        this.shadowOffset = options?.shadowOffset ?? Vector.Zero;
    }

    public draw(context: CanvasRenderingContext2D, delta: number): void {
        context.save();
        context.translate(this.pos.x, this.pos.y);
        context.scale(this.scale.x, this.scale.y);
        context.rotate(this.rotation);

        context.textAlign = lookupTextAlign(this.textAlign);
        context.textBaseline = lookupBaseAlign(this.baseAlign);
        context.fillStyle = this.color.toString();
        context.font = `${lookupFontStyle(this.fontStyle)} ${lookupFontWeight(this.bold)} ${
            this.fontSize
        }${lookupFontUnit(this.fontUnit)} ${this.fontFamily}`;
        context.shadowBlur = this.shadowWidth;
        context.shadowColor = this.shadowColor.toString();
        context.shadowOffsetX = this.shadowOffset.x;
        context.shadowOffsetY = this.shadowOffset.y;
        context.fillText(this.text, 0, 0, this.maxWidth);

        context.restore();
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
