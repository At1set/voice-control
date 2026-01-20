export const SpeechRecognition =
	(
		window as unknown as {
			SpeechRecognition?: SpeechRecognitionConstructor;
			webkitSpeechRecognition?: SpeechRecognitionConstructor;
		}
	).SpeechRecognition ||
	(
		window as unknown as {
			webkitSpeechRecognition?: SpeechRecognitionConstructor;
		}
	).webkitSpeechRecognition;

export let speechRecognition: ISpeechRecognition | undefined;

if (SpeechRecognition) {
	speechRecognition = new SpeechRecognition();

	speechRecognition.lang = 'ru-RU';
	speechRecognition.continuous = true;
	speechRecognition.interimResults = true;

	speechRecognition.onstart = () => {
		console.log('Распознавание голоса включено');
	};

	speechRecognition.onresult = (event) => {
		let transcript = '';

		for (let i = event.resultIndex; i < event.results.length; i++) {
			transcript += event.results[i][0].transcript;
		}

		console.log('Распознано:', transcript);
	};

	speechRecognition.onerror = (event) => {
		console.error('Speech error:', event.error);
	};

	speechRecognition.onend = () => {
		console.log('Распознавание остановлено');
	};
}
