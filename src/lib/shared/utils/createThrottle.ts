// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createThrottle<T extends (...args: any[]) => void>(fn: T, delayMs: number) {
	let lastTime = 0;

	return (...args: Parameters<T>) => {
		const now = Date.now();

		if (now - lastTime < delayMs) {
			return;
		}

		lastTime = now;
		fn(...args);
	};
}
