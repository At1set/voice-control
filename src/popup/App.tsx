import { useRecordingState } from '@/lib/shared/hooks/useRecordingState';

import styles from './App.module.scss';

function App() {
	const [isRecording, setRecording] = useRecordingState();

	function changeRecording() {
		const newVal = !isRecording;
		setRecording(newVal);
		chrome.runtime.sendMessage({ action: newVal ? 'OPEN_SIDE_PANEL' : 'CLOSE_SIDE_PANEL' });
	}

	return (
		<div className={styles.wrapper}>
			<h1>VOICE _CONTROL_</h1>
			<span className={styles.version}>version 0.0.1 beta</span>
			<button onClick={changeRecording} className={styles.recordButton}>
				{!isRecording ? 'Запустить' : 'Остановить'} распознавание речи
			</button>
		</div>
	);
}

export default App;
