import { type FC, useEffect } from 'react';

import { useRecordingState } from '@/lib/shared/hooks/useRecordingState';

import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface Props {
	onStart?: () => void;
	onEnd?: () => void;
	onError?: (e: SpeechRecognitionErrorEvent) => void;
	onResult?: (e: SpeechRecognitionEvent) => void;
}

export const SpeechRecognizer: FC<Props> = ({ onStart, onEnd, onError, onResult }) => {
	const [isRecording] = useRecordingState();
	const speechRecognition = useSpeechRecognition({
		onStart() {
			console.log('Распознавание голоса включено');
			onStart?.();
		},
		onEnd() {
			console.log('OnEnd');

			if (isRecording) {
				try {
					console.log('Перезапуск распознавания голоса...');
					this.start();
				} catch (e) {
					console.warn('Ошибка перезапуска [SpeechRecognition]: ', e);
				}
			} else onEnd?.();
		},
		onError(e) {
			console.warn('SpeechRecognition error:', e);
			onError?.(e);
		},
		onResult,
	});

	useEffect(() => {
		if (!speechRecognition.current) return;

		if (isRecording) {
			try {
				speechRecognition.current.start();
			} catch (e) {
				console.warn(e);
			}
		} else {
			speechRecognition.current.stop();
		}
	}, [isRecording, speechRecognition]);

	return <></>;
};
