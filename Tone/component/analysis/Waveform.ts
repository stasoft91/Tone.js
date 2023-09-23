import { optionsFromArguments } from "../../core";
import type { PowerOfTwo } from "../../core/type/Units";
import { MeterBase, type MeterBaseOptions } from "./MeterBase";

export interface WaveformOptions extends MeterBaseOptions {
	/**
	 * The size of the Waveform. Value must be a power of two in the range 16 to 16384.
	 */
	size: PowerOfTwo;
}

/**
 * Get the current waveform data of the connected audio source.
 * @category Component
 */
export class Waveform extends MeterBase<WaveformOptions> {

	readonly name: string = "Waveform";

	/**
	 * @param size The size of the Waveform. Value must be a power of two in the range 16 to 16384.
	 */
	constructor(size?: PowerOfTwo);
	constructor(options?: Partial<WaveformOptions>);
	constructor() {
		super(optionsFromArguments(Waveform.getDefaults(), arguments, ["size"]));
		const options = optionsFromArguments(Waveform.getDefaults(), arguments, ["size"]);

		this._analyser.type = "waveform";
		this.size = options.size;
	}

    /**
     * The size of analysis. This must be a power of two in the range 16 to 16384.
     * Determines the size of the array returned by [[getValue]].
     */
    get size(): PowerOfTwo {
        return this._analyser.size;
    }

    set size(size) {
        this._analyser.size = size;
    }

	static getDefaults(): WaveformOptions {
		return Object.assign(MeterBase.getDefaults(), {
			size: 1024,
		});
	}

	/**
	 * Return the waveform for the current time as a Float32Array where each value in the array
	 * represents a sample in the waveform.
	 */
	getValue(): Float32Array {
		return this._analyser.getValue() as Float32Array;
	}
}
