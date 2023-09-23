import { Param } from "../core";
import type { Frequency, NormalRange, Time } from "../core/type/Units";
import { readOnly } from "../core/util/Interface";
import { Signal } from "../signal";
import type { ToneOscillatorType } from "../source";
import { LFO } from "../source";
import { Effect, type EffectOptions } from "./Effect";

export interface LFOEffectOptions extends EffectOptions {
	frequency: Frequency;
	type: ToneOscillatorType;
	depth: NormalRange;
}

/**
 * Base class for LFO-based effects.
 */
export abstract class LFOEffect<Options extends LFOEffectOptions> extends Effect<Options> {

	readonly name: string = "LFOEffect";
	/**
     * The range of the filter modulating between the min and max frequency.
	 * 0 = no modulation. 1 = full modulation.
	 */
	readonly depth: Param<"normalRange">;
	/**
     * How fast the filter modulates between min and max.
	 */
	readonly frequency: Signal<"frequency">;
    /**
     * the lfo which drives the filter cutoff
     */
    protected _lfo: LFO;

	constructor(options: LFOEffectOptions) {

		super(options);

		this._lfo = new LFO({
			context: this.context,
			frequency: options.frequency,
			amplitude: options.depth,
		});
		this.depth = this._lfo.amplitude;
		this.frequency = this._lfo.frequency;

		this.type = options.type;
		readOnly(this, ["frequency", "depth"]);
	}

    /**
     * The type of the LFO's oscillator: See [[Oscillator.type]]
     * @example
     * const autoFilter = new Tone.AutoFilter().start().toDestination();
     * const noise = new Tone.Noise().start().connect(autoFilter);
     * autoFilter.type = "square";
     */
    get type() {
        return this._lfo.type;
    }

    set type(type) {
        this._lfo.type = type;
    }

	static getDefaults(): LFOEffectOptions {
		return Object.assign(Effect.getDefaults(), {
			frequency: 1,
			type: "sine" as ToneOscillatorType,
			depth: 1,
		});
	}

	/**
	 * Start the effect.
	 */
	start(time?: Time): this {
		this._lfo.start(time);
		return this;
	}

	/**
	 * Stop the lfo
	 */
	stop(time?: Time): this {
		this._lfo.stop(time);
		return this;
	}

	/**
	 * Sync the filter to the transport. See [[LFO.sync]]
	 */
	sync(): this {
		this._lfo.sync();
		return this;
	}

	/**
	 * Unsync the filter from the transport.
	 */
	unsync(): this {
		this._lfo.unsync();
		return this;
	}

	dispose(): this {
		super.dispose();
		this._lfo.dispose();
		this.frequency.dispose();
		this.depth.dispose();
		return this;
	}
}
