export {};

declare global {
	export interface Window {
		SpeechRecognition: SpeechRecognitionConstructor | undefined;
		webkitSpeechRecognition?: SpeechRecognitionConstructor | undefined;
	}

	export interface ISpeechRecognition extends EventTarget {
		start(): void;
		stop(): void;
		abort(): void;

		lang: string;
		continuous: boolean;
		interimResults: boolean;

		onresult: ((event: SpeechRecognitionEvent) => void) | null;
		onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
		onend: (() => void) | null;
		onstart: (() => void) | null;
	}

	export interface SpeechRecognitionEvent extends Event {
		readonly resultIndex: number;
		readonly results: SpeechRecognitionResultList;
	}

	export interface SpeechRecognitionErrorEvent extends Event {
		error:
			| 'no-speech'
			| 'aborted'
			| 'audio-capture'
			| 'network'
			| 'not-allowed'
			| 'service-not-allowed'
			| 'bad-grammar'
			| 'language-not-supported';
		message?: string;
	}

	export interface SpeechRecognitionConstructor {
		new (): ISpeechRecognition;
	}
}
