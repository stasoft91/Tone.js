import { optionsFromArguments, ToneAudioNode, type ToneAudioNodeOptions } from "../../core";
import type { Positive } from "../../core/type/Units";

interface MergeOptions extends ToneAudioNodeOptions {
	channels: Positive;
}

/**
 * Merge brings multiple mono input channels into a single multichannel output channel.
 *
 * @example
 * const merge = new Tone.Merge().toDestination();
 * // routing a sine tone in the left channel
 * const osc = new Tone.Oscillator().connect(merge, 0, 0).start();
 * // and noise in the right channel
 * const noise = new Tone.Noise().connect(merge, 0, 1).start();;
 * @category Component
 */
export class Merge extends ToneAudioNode<MergeOptions> {

	readonly name: string = "Merge";
	/**
	 * The output is the input channels combined into a single (multichannel) output
	 */
	readonly output: ChannelMergerNode;
	/**
	 * Multiple input connections combine into a single output.
	 */
	readonly input: ChannelMergerNode;
    /**
     * The merger node for the channels.
     */
    private _merger: ChannelMergerNode;

	/**
	 * @param channels The number of channels to merge.
	 */
	constructor(channels?: Positive);
	constructor(options?: Partial<MergeOptions>);
	constructor() {
		super(optionsFromArguments(Merge.getDefaults(), arguments, ["channels"]));
		const options = optionsFromArguments(Merge.getDefaults(), arguments, ["channels"]);

		this._merger = this.output = this.input = this.context.createChannelMerger(options.channels);
	}

	static getDefaults(): MergeOptions {
		return Object.assign(ToneAudioNode.getDefaults(), {
			channels: 2,
		});
	}

	dispose(): this {
		super.dispose();
		this._merger.disconnect();
		return this;
	}
}
