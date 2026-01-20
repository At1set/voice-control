import { useCallback, useEffect, useState } from 'react';

export function useRecordingState(initialState: boolean | (() => boolean) = false) {
	const [isRecording, setRecording] = useState(initialState);

	useEffect(() => {
		chrome.storage.local.get('isRecording', ({ isRecording }: { isRecording: boolean }) => {
			setRecording(isRecording);
		});
		chrome.storage.local.onChanged.addListener((changes) => {
			const { isRecording } = changes;
			if (isRecording) {
				setRecording(isRecording.newValue as boolean);
			}
		});
	}, []);

	const changeRecorgingState = useCallback(
		(
			value: boolean,
			options?: {
				withoutStorageSave?: boolean;
			},
		) => {
			setRecording(value);
			if (!options?.withoutStorageSave) chrome.storage.local.set({ isRecording: value });
		},
		[],
	);

	return [isRecording, changeRecorgingState] as const;
}
