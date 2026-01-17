// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventHadler<Data = any> = (data: Data) => void;
type isNever<T> = [T] extends [never] ? true : false;
type IsAny<T> = 0 extends 1 & T ? true : false;

export class EventEmitter<Events extends Record<string, unknown>> {
	handlers: Map<keyof Events, Set<EventHadler>>;
	constructor() {
		this.handlers = new Map();
	}

	on<Event extends keyof Events>(event: Event, handler: EventHadler<Events[Event]>) {
		const storedHandlers = this.handlers.get(event) ?? new Set();
		storedHandlers.add(handler);
		this.handlers.set(event, storedHandlers);
		return () => this.off(event, handler);
	}

	off<Event extends keyof Events>(event: Event, handler: EventHadler<Events[Event]>) {
		const storedHandlers = this.handlers.get(event);
		if (!storedHandlers) return false;
		return storedHandlers.delete(handler);
	}

	emit<Event extends keyof Events>(
		event: Event,
		...data: 
			IsAny<Events[Event]> extends true
				? // eslint-disable-next-line @typescript-eslint/no-explicit-any
				  [any]
				: isNever<Events[Event]> extends true
				? []
				: Events[Event] extends void
				? []
				: [Events[Event]]
	) {
		const storedHandlers = this.handlers.get(event);
		if (storedHandlers) {
			storedHandlers.forEach((handler) => handler(data[0]));
		}
	}
}