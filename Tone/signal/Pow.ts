import type { ToneAudioNodeOptions } from "../core";
import { optionsFromArguments } from "../core";
import { SignalOperator } from "./SignalOperator";
import { WaveShaper, type WaveShaperMappingFn } from "./WaveShaper";

export interface PowOptions extends ToneAudioNodeOptions {
	value: number;
}

/**
 * Pow applies an exponent to the incoming signal. The incoming signal must be AudioRange [-1, 1]
 *
 * @example
 * const pow = new Tone.Pow(2);
 * const sig = new Tone.Signal(0.5).connect(pow);
 * // output of pow is 0.25.
 * @category Signal
 */
export class Pow extends SignalOperator<PowOptions> {

	readonly name: string = "Pow";
    input: WaveShaper;
    output: WaveShaper;
	private _exponent: number;
	private _exponentScaler: WaveShaper;

	/**
	 * @param value Constant exponent value to use
	 */
	constructor(value?: number);
	constructor(options?: Partial<PowOptions>);
	constructor() {
		super(Object.assign(optionsFromArguments(Pow.getDefaults(), arguments, ["value"])));
		const options = optionsFromArguments(Pow.getDefaults(), arguments, ["value"]);

		this._exponentScaler = this.input = this.output = new WaveShaper({
			context: this.context,
			mapping: this._expFunc(options.value),
			length: 8192,
		});

		this._exponent = options.value;
	}

	/**
	 * The value of the exponent.
	 */
	get value(): number {
		return this._exponent;
	}

	set value(exponent: number) {
		this._exponent = exponent;
		this._exponentScaler.setMap(this._expFunc(this._exponent));
	}

    static getDefaults(): PowOptions {
        return Object.assign(SignalOperator.getDefaults(), {
            value: 1,
        });
    }

	/**
	 * Clean up.
	 */
	dispose(): this {
		super.dispose();
		this._exponentScaler.dispose();
		return this;
	}

    /**
     * the function which maps the waveshaper
     * @param exponent exponent value
     */
    private _expFunc(exponent: number): WaveShaperMappingFn {
        return (val: number) => {
            return Math.pow(Math.abs(val), exponent);
        };
    }
}
