import { BasicTests } from "test/helper/Basic";
import { connectFrom, connectTo } from "test/helper/Connect";
import { PassAudio } from "test/helper/PassAudio";
import { MidSideMerge } from "./MidSideMerge";

describe("MidSideMerge", () => {

	BasicTests(MidSideMerge);

	context("Merging", () => {

		it("handles inputs and outputs", () => {
			const merge = new MidSideMerge();
			merge.connect(connectTo());
			connectFrom().connect(merge.mid);
			connectFrom().connect(merge.side);
			merge.dispose();
		});

		it("passes the mid signal through", () => {
			return PassAudio((input) => {
				const merge = new MidSideMerge().toDestination();
				input.connect(merge.mid);
			});
		});
	});
});

