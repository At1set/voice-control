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
