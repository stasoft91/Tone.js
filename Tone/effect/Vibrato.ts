import { Delay, optionsFromArguments, Param } from "../core";
import type { Frequency, NormalRange, Seconds } from "../core/type/Units";
import { readOnly } from "../core/util/Interface";
import { Signal } from "../signal";
import type { ToneOscillatorType } from "../source";
import { LFO } from "../source";
import { Effect, type EffectOptions } from "./Effect";

export interface VibratoOptions extends EffectOptions {
	maxDelay: Seconds;
	frequency: Frequency;
	depth: NormalRange;
	type: ToneOscillatorType;
}

/**
 * A Vibrato effect composed of a Tone.Delay and a Tone.LFO. The LFO
 * modulates the delayTime of the delay, causing the pitch to rise and fall.
 * @category Effect
 */
export class Vibrato extends Effect<VibratoOptions> {

	readonly name: string = "Vibrato";
	/**
     * The frequency of the vibrato
     */
    readonly frequency: Signal<"frequency">;
    /**
     * The depth of the vibrato.
     */
    readonly depth: Param<"normalRange">;
    /**
	 * The delay node used for the vibrato effect
	 */
	private _delayNode: Delay;
	/**
	 * The LFO used to control the vibrato
	 */
	private _lfo: LFO;

	/**
	 * @param frequency The frequency of the vibrato.
	 * @param depth The amount the pitch is modulated.
	 */
	constructor(frequency?: Frequency, depth?: NormalRange);
	constructor(options?: Partial<VibratoOptions>);
	constructor() {

		super(optionsFromArguments(Vibrato.getDefaults(), arguments, ["frequency", "depth"]));
		const options = optionsFromArguments(Vibrato.getDefaults(), arguments, ["frequency", "depth"]);

		this._delayNode = new Delay({
			context: this.context,
			delayTime: 0,
			maxDelay: options.maxDelay,
		});
		this._lfo = new LFO({
			context: this.context,
			type: options.type,
			min: 0,
            max: options.maxDelay,
			frequency: options.frequency,
			phase: -90 // offse the phase so the resting position is in the center
		}).start().connect(this._delayNode.delayTime);
		this.frequency = this._lfo.frequency;
		this.depth = this._lfo.amplitude;

		this.depth.value = options.depth;
		readOnly(this, ["frequency", "depth"]);
		this.effectSend.chain(this._delayNode, this.effectReturn);
	}

    /**
     * Type of oscillator attached to the Vibrato.
     */
    get type(): ToneOscillatorType {
        return this._lfo.type;
    }

    set type(type) {
        this._lfo.type = type;
    }

	static getDefaults(): VibratoOptions {
		return Object.assign(Effect.getDefaults(), {
			maxDelay: 0.005,
			frequency: 5,
			depth: 0.1,
			type: "sine" as const
		});
	}

	dispose(): this {
		super.dispose();
		this._delayNode.dispose();
		this._lfo.dispose();
		this.frequency.dispose();
		this.depth.dispose();
		return this;
	}
}
