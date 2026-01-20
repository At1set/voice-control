import clsx from 'clsx';
import { type FC, useEffect, useState } from 'react';

import { EventTypes } from '@/background/model/EventTypes';
import { useRecordingState } from '@/lib/shared/hooks/useRecordingState';
import { speechRecognition } from '@/lib/shared/utils/SpeechRecognition';

import styles from './ContentScriptCore.module.scss';

export const ContentScriptCore: FC = () => {
	const [isRecording, setRecording] = useRecordingState();
	const [recognizedText, setRecognisedText] = useState('');

	useEffect(() => {
		if (isRecording) speechRecognition?.start();
		else speechRecognition?.stop();
	}, [isRecording]);

	useEffect(() => {
		if (!speechRecognition) return;

		const onstart = () => {
			console.log('Распознавание голоса включено');
		};

		const onend = () => {
			async function restart() {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const { isRecording } = (await chrome.storage.local.get(['isRecording'])) as any;
				if (isRecording) speechRecognition?.start();
			}
			restart();
		};

		const onerror = (event: SpeechRecognitionErrorEvent) => {
			console.log('Распознавание остановлено');
		};

		const onresult = (event: SpeechRecognitionEvent) => {
			setRecognisedText('');
			let transcript = '';

			for (let i = event.resultIndex; i < event.results.length; i++) {
				transcript += event.results[i][0].transcript;
			}

			chrome.runtime.sendMessage({
				type: EventTypes.RECOGNIZED_TEXT,
				payload: { text: transcript },
			});

			setRecognisedText(transcript);
		};

		speechRecognition.onresult = onresult;
		speechRecognition.onstart = onstart;
		speechRecognition.onend = onend;
		speechRecognition.onerror = onerror;

		return () => {
			if (!speechRecognition) return;
			setRecording(false, { withoutStorageSave: true });
			speechRecognition.onresult = null;
			speechRecognition.onstart = null;
			speechRecognition.onend = null;
			speechRecognition.onerror = null;
		};
	}, [setRecording]);

	useEffect(() => {
		const words = recognizedText
			.toLowerCase()
			.replaceAll(/[^\p{L}\p{N}\s]/gu, '')
			.split(/\s+/);

		type Command = {
			name: string;
			words: string[];
			action: () => void;
		};

		const commands: Command[] = [
			{
				name: 'prev-tab',
				words: ['предыдущая', 'вкладка'],
				action: () => {
					chrome.runtime.sendMessage({ action: 'GO_PREV_TAB' });
				},
			},
			{
				name: 'next-tab',
				words: ['следующая', 'вкладка'],
				action: () => {
					chrome.runtime.sendMessage({ action: 'GO_NEXT_TAB' });
				},
			},
			{
				name: 'reload',
				words: ['обновить'],
				action: () => {
					window.location.reload();
				},
			},
			{
				name: 'stop',
				words: ['стоп'],
				action: () => {
					setRecording(false);
				},
			},
		];

		const matches: Record<string, number> = {};

		words.forEach((word) => {
			matches[word] = (matches[word] ?? 0) + 1;
		});

		const matchedCommands = commands.filter((command) =>
			command.words.every((word) => (matches[word] ?? 0) >= 1),
		);

		matchedCommands.forEach((command) => {
			command.action();
		});
	}, [setRecording, recognizedText]);

	return <div className={clsx(styles.root, { _active: isRecording })}></div>;
};
