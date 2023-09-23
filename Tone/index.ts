export { getContext, setContext } from "./core/Global";
export * from "./classes";
export * from "./version";
// this fills in name changes from 13.x to 14.x
import { ToneAudioBuffer, ToneAudioBuffers } from "./core";
import { getContext } from "./core/Global";
import type { Seconds } from "./core/type/Units";
import { ToneBufferSource } from "./source";

export { start } from "./core/Global";

export { supported } from "./core/context/AudioContext";

/**
 * The current audio context time of the global [[Context]].
 * See [[Context.now]]
 * @category Core
 */
export function now(): Seconds {
	return getContext().now();
}

/**
 * The current audio context time of the global [[Context]] without the [[Context.lookAhead]]
 * See [[Context.immediate]]
 * @category Core
 */
export function immediate(): Seconds {
	return getContext().immediate();
}

/**
 * The Transport object belonging to the global Tone.js Context.
 * See [[Transport]]
 * @category Core
 */
export const Transport = getContext().transport;

/**
 * The Transport object belonging to the global Tone.js Context.
 * See [[Transport]]
 * @category Core
 */
export function getTransport(): import("./core/clock/Transport").Transport {
	return getContext().transport;
}

/**
 * The Destination (output) belonging to the global Tone.js Context.
 * See [[Destination]]
 * @category Core
 */
export const Destination = getContext().destination;

/**
 * @deprecated Use [[Destination]]
 */
export const Master = getContext().destination;

/**
 * The Destination (output) belonging to the global Tone.js Context.
 * See [[Destination]]
 * @category Core
 */
export function getDestination(): import("./core/context/Destination").Destination {
	return getContext().destination;
}

/**
 * The [[Listener]] belonging to the global Tone.js Context.
 * @category Core
 */
export const Listener = getContext().listener;

/**
 * The [[Listener]] belonging to the global Tone.js Context.
 * @category Core
 */
export function getListener(): import("./core/context/Listener").Listener {
	return getContext().listener;
}

/**
 * Draw is used to synchronize the draw frame with the Transport's callbacks.
 * See [[Draw]]
 * @category Core
 */
export const Draw = getContext().draw;

/**
 * Get the singleton attached to the global context.
 * Draw is used to synchronize the draw frame with the Transport's callbacks.
 * See [[Draw]]
 * @category Core
 */
export function getDraw(): import("./core/util/Draw").Draw {
	return getContext().draw;
}

/**
 * A reference to the global context
 * See [[Context]]
 */
export const context = getContext();

/**
 * Promise which resolves when all of the loading promises are resolved.
 * Alias for static [[ToneAudioBuffer.loaded]] method.
 * @category Core
 */
export function loaded() {
	return ToneAudioBuffer.loaded();
}

export const Buffer: typeof ToneAudioBuffer = ToneAudioBuffer;
export const Buffers: typeof ToneAudioBuffers = ToneAudioBuffers;
export const BufferSource: typeof ToneBufferSource = ToneBufferSource;
