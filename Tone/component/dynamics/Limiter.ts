import {
	type InputNode,
	optionsFromArguments,
	type OutputNode,
	Param,
	ToneAudioNode,
	type ToneAudioNodeOptions
} from "../../core";
import type { Decibels } from "../../core/type/Units";
import { readOnly } from "../../core/util/Interface";
import { Compressor } from "./Compressor";

export interface LimiterOptions extends ToneAudioNodeOptions {
	threshold: Decibels;
}

/**
 * Limiter will limit the loudness of an incoming signal.
 * Under the hood it's composed of a [[Compressor]] with a fast attack
 * and release and max compression ratio.
 *
 * @example
 * const limiter = new Tone.Limiter(-20).toDestination();
 * const oscillator = new Tone.Oscillator().connect(limiter);
 * oscillator.start();
 * @category Component
 */
export class Limiter extends ToneAudioNode<LimiterOptions> {

	readonly name: string = "Limiter";

	readonly input: InputNode;
	readonly output: OutputNode;
    readonly threshold: Param<"decibels">;
	/**
	 * The compressor which does the limiting
	 */
	private _compressor: Compressor;

	/**
	 * @param threshold The threshold above which the gain reduction is applied.
	 */
	constructor(threshold?: Decibels);
	constructor(options?: Partial<LimiterOptions>);
	constructor() {
		super(Object.assign(optionsFromArguments(Limiter.getDefaults(), arguments, ["threshold"])));
		const options = optionsFromArguments(Limiter.getDefaults(), arguments, ["threshold"]);

		this._compressor = this.input = this.output = new Compressor({
			context: this.context,
			ratio: 20,
			attack: 0.003,
			release: 0.01,
			threshold: options.threshold
		});

		this.threshold = this._compressor.threshold;
		readOnly(this, "threshold");
	}

	/**
	 * A read-only decibel value for metering purposes, representing the current amount of gain
     * reduction that the compressor is applying to the signal.
	 */
	get reduction(): Decibels {
		return this._compressor.reduction;
	}

    static getDefaults(): LimiterOptions {
        return Object.assign(ToneAudioNode.getDefaults(), {
            threshold: -12
        });
    }

	dispose(): this {
		super.dispose();
		this._compressor.dispose();
		this.threshold.dispose();
		return this;
	}
}
