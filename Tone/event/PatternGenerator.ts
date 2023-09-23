import { assert } from "../core/util/Debug";
import { clamp } from "../core/util/Math";

/**
 * The name of the patterns
 */
export type PatternName =
    "up"
    | "down"
    | "upDown"
    | "downUp"
    | "alternateUp"
    | "alternateDown"
    | "random"
    | "randomOnce"
    | "randomWalk";

/**
 * Start at the first value and go up to the last
 */
function* upPatternGen<T>(numValues: number): IterableIterator<number> {
	let index = 0;
	while (index < numValues) {
		index = clamp(index, 0, numValues - 1);
		yield index;
		index++;
	}
}

/**
 * Start at the last value and go down to 0
 */
function* downPatternGen<T>(numValues: number): IterableIterator<number> {
	let index = numValues - 1;
	while (index >= 0) {
		index = clamp(index, 0, numValues - 1);
		yield index;
		index--;
	}
}

/**
 * Infinitely yield the generator
 */
function* infiniteGen<T>(numValues: number, gen: typeof upPatternGen): IterableIterator<number> {
	while (true) {
		yield* gen(numValues);
	}
}

/**
 * Alternate between two generators
 */
function* alternatingGenerator<T>(numValues: number, directionUp: boolean): IterableIterator<number> {
	let index = directionUp ? 0 : numValues - 1;
	while (true) {
		index = clamp(index, 0, numValues - 1);
		yield index;
		if (directionUp) {
			index++;
			if (index >= numValues - 1) {
				directionUp = false;
			}
		} else {
			index--;
			if (index <= 0) {
				directionUp = true;
			}
		}
	}
}

/**
 * Starting from the bottom move up 2, down 1
 */
function* jumpUp<T>(numValues: number): IterableIterator<number> {
	let index = 0;
	let stepIndex = 0;
	while (index < numValues) {
		index = clamp(index, 0, numValues - 1);
		yield index;
		stepIndex++;
		index += (stepIndex % 2 ? 2 : -1);
	}
}

/**
 * Starting from the top move down 2, up 1
 */
function* jumpDown<T>(numValues: number): IterableIterator<number> {
	let index = numValues - 1;
	let stepIndex = 0;
	while (index >= 0) {
		index = clamp(index, 0, numValues - 1);
		yield index;
		stepIndex++;
		index += (stepIndex % 2 ? -2 : 1);
	}
}

/**
 * Choose a random index each time
 */
function* randomGen<T>(numValues: number): IterableIterator<number> {
	while (true) {
		const randomIndex = Math.floor(Math.random() * numValues);
		yield randomIndex;
	}
}

/**
 * Randomly go through all of the values once before choosing a new random order
 */
function* randomOnce<T>(numValues: number): IterableIterator<number> {
	// create an array of indices
	const copy: number[] = [];
	for (let i = 0; i < numValues; i++) {
		copy.push(i);
	}
	while (copy.length > 0) {
		// random choose an index, and then remove it so it's not chosen again
		const randVal = copy.splice(Math.floor(copy.length * Math.random()), 1);
		const index = clamp(randVal[0], 0, numValues - 1);
		yield index;
	}
}

/**
 * Randomly choose to walk up or down 1 index
 */
function* randomWalk<T>(numValues: number): IterableIterator<number> {
	// randomly choose a starting index
	let index = Math.floor(Math.random() * numValues);
	while (true) {
		if (index === 0) {
			index++; // at bottom, so force upward step
		} else if (index === numValues - 1) {
			index--; // at top, so force downward step
		} else if (Math.random() < 0.5) { // else choose random downward or upward step
			index--;
		} else {
			index++;
		}
		yield index;
	}
}

/**
 * PatternGenerator returns a generator which will yield numbers between 0 and numValues
 * according to the passed in pattern that can be used as indexes into an array of size numValues.
 * @param numValues The size of the array to emit indexes for
 * @param pattern The name of the pattern use when iterating over
 * @param index Where to start in the offset of the values array
 */
export function* PatternGenerator(numValues: number, pattern: PatternName = "up", index = 0): Iterator<number> {
	// safeguards
	assert(numValues >= 1, "The number of values must be at least one");
	switch (pattern) {
		case "up" :
			yield* infiniteGen(numValues, upPatternGen);
		case "down" :
			yield* infiniteGen(numValues, downPatternGen);
		case "upDown" :
			yield* alternatingGenerator(numValues, true);
		case "downUp" :
			yield* alternatingGenerator(numValues, false);
		case "alternateUp":
			yield* infiniteGen(numValues, jumpUp);
		case "alternateDown":
			yield* infiniteGen(numValues, jumpDown);
		case "random":
			yield* randomGen(numValues);
		case "randomOnce":
			yield* infiniteGen(numValues, randomOnce);
		case "randomWalk":
			yield* randomWalk(numValues);
	}
}
