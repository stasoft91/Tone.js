import { CrossFade } from "../component";
import { Gain, ToneAudioNode, type ToneAudioNodeOptions } from "../core";
import type { NormalRange } from "../core/type/Units";
import { readOnly } from "../core/util/Interface";
import { Signal } from "../signal";

export interface EffectOptions extends ToneAudioNodeOptions {
	wet: NormalRange;
}

/**
 * Effect is the base class for effects. Connect the effect between
 * the effectSend and effectReturn GainNodes, then control the amount of
 * effect which goes to the output using the wet control.
 */
export abstract class Effect<Options extends EffectOptions>
	extends ToneAudioNode<Options> {

	readonly name: string = "Effect";
    /**
     * The effect input node
     */
    input: Gain = new Gain({ context: this.context });
    /**
     * connect the effectSend to the input of hte effect
     */
    protected effectSend: Gain = new Gain({ context: this.context });
    /**
     * connect the output of the effect to the effectReturn
     */
    protected effectReturn: Gain = new Gain({ context: this.context });
	/**
	 * the drywet knob to control the amount of effect
	 */
	private _dryWet: CrossFade = new CrossFade({ context: this.context });
	/**
	 * The wet control is how much of the effected
	 * will pass through to the output. 1 = 100% effected
	 * signal, 0 = 100% dry signal.
	 */
	wet: Signal<"normalRange"> = this._dryWet.fade;
	/**
	 * The effect output
	 */
	output = this._dryWet;

	constructor(options: EffectOptions) {
		super(options);

		// connections
		this.input.fan(this._dryWet.a, this.effectSend);
		this.effectReturn.connect(this._dryWet.b);
		this.wet.setValueAtTime(options.wet, 0);
		this._internalChannels = [this.effectReturn, this.effectSend];
		readOnly(this, "wet");
	}

	static getDefaults(): EffectOptions {
		return Object.assign(ToneAudioNode.getDefaults(), {
			wet: 1,
		});
	}

	dispose(): this {
		super.dispose();
		this._dryWet.dispose();
		this.effectSend.dispose();
		this.effectReturn.dispose();
		this.wet.dispose();
		return this;
	}

    /**
     * chains the effect in between the effectSend and effectReturn
     */
    protected connectEffect(effect: ToneAudioNode | AudioNode): this {
        // add it to the internal channels
        this._internalChannels.push(effect);
        this.effectSend.chain(effect, this.effectReturn);
        return this;
    }
}
