import { expect } from "chai";
import { BasicTests } from "test/helper/Basic";
import { CompareToFile } from "test/helper/CompareToFile";
import { EffectTests } from "test/helper/EffectTests";
import { Noise } from "Tone/source/Noise";
import { JCReverb } from "./JCReverb";

describe("JCReverb", () => {

	BasicTests(JCReverb);
	EffectTests(JCReverb);

	it("matches a file", () => {
		return CompareToFile(() => {
			const reverb = new JCReverb().toDestination();
			const noise = new Noise().connect(reverb);
			noise.start(0).stop(0.1);
		}, "jcReverb.wav", 0.2);
	});

	context("API", () => {

		it("can pass in options in the constructor", () => {
			const reverb = new JCReverb({
				roomSize: 0.2,
			});
			expect(reverb.roomSize.value).to.be.closeTo(0.2, 0.01);
			reverb.dispose();
		});

		it("can get/set the options", () => {
			const reverb = new JCReverb();
			reverb.set({
				roomSize: 0.23,
			});
			expect(reverb.get().roomSize).to.be.closeTo(0.23, 0.01);
			reverb.dispose();
		});
	});
});

