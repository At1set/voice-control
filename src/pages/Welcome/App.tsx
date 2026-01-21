import { useState } from 'react';

import { version } from '@/../package.json';

import styles from './App.module.scss';

function App() {
	const [micStatus, setMicStatus] = useState<'idle' | 'granted' | 'denied'>('idle');
	const isMicPremission = micStatus === 'granted';

	const requestMicrophone = async () => {
		try {
			// Запрашиваем микрофон
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			if (stream.active) {
				setMicStatus('granted');
				stream.getAudioTracks().forEach((track) => track.stop());
			} else throw new Error('Микрофон не разрешен');
		} catch (error) {
			console.warn('Микрофон не разрешён', error);
			setMicStatus('denied');
		}
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.logo}>
				<h1>
					VOICE <br />
					_CONTROL_
				</h1>
				<span className={styles.version}>version {version} beta</span>
			</div>
			<div className={styles.premissions}>
				<p>
					Спасибо, что установили <b>VOICE _CONTROL_</b> !
				</p>
				<p>
					Для того, чтобы расширение корректно работало, ему необходимо предоставить разрешение на
					использование микрофона для распознавания голосовых команд.
				</p>
				<div className={styles.premissions__buttonBox}>
					<button onClick={requestMicrophone}>Запросить разрешение</button>

					<label
						htmlFor="MicrophonePremission"
						title={
							isMicPremission ? 'Разрешение предоставлено' : 'Разрешение не было предоставлено'
						}
					>
						Статус
						<input
							type="checkbox"
							checked={isMicPremission}
							readOnly
							name=""
							id="MicrophonePremission"
						/>
					</label>
				</div>
				{isMicPremission && (
					<div className={styles.results}>
						<p>Отлично! Разрешение было получено. Теперь страницу можно закрывать.</p>
						<button onClick={() => window.close()}>Закрыть страницу</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
