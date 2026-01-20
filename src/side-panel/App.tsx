import { useEffect, useState } from 'react';

import { EventTypes } from '@/background/model/EventTypes';
import { useRecordingState } from '@/lib/shared/hooks/useRecordingState';

import styles from './App.module.scss';

function App() {
	const [isActive] = useRecordingState(true);
	const [recognizedText, setRecognizedText] = useState<string[]>([]);

	useEffect(() => {
		if (!isActive) window.close();
	}, [isActive]);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		function handleMessage(message: any) {
			console.log(message);

			if (message.type === EventTypes.RECOGNIZED_TEXT) {
				const newText = message.payload.text as string;
				setRecognizedText((v) => [...v, newText]);
			}
		}

		chrome.runtime.onMessage.addListener(handleMessage);

		return () => {
			chrome.runtime.onMessage.removeListener(handleMessage);
		};
	}, []);

	return (
		<div className={styles.root}>
			<h1>Голосовой ввод</h1>
			{recognizedText.map((command, i) => {
				return (
					<div className={styles.commandLine}>
						<span>{i + 1}</span>
						<span>{command}</span>
					</div>
				);
			})}
		</div>
	);
}

export default App;
