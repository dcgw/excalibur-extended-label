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

    /** The color of the text. */
    readonly color?: Color;

    /** True if the text is visible, false if it is invisible.
     *
     * @default true */
    readonly visible?: boolean;

    /** Width of the shadow blur in pixels. */
    readonly shadowWidth?: number;

    /** The color of the shadow. Set to Color.Transparent to hide the shadow. */
    readonly shadowColor?: Color;

    /** The offset of the shadow from the text, in pixels. */
    readonly shadowOffset?: Vector;

    /** The physics body the is associated with this actor. The body is the
     * container for all physical properties, like position, velocity,
     * acceleration, mass, inertia, etc. */
    readonly body?: Body;
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
        context.fillText(this.text, 0, 0);

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
