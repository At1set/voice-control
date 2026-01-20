import { useEffect, useState } from 'react';

import { EventTypes } from '@/background/model/EventTypes';

export function useIsActiveTab() {
	const [isActiveTab, setActiveTab] = useState(false);

	useEffect(() => {
		chrome.runtime.sendMessage({ type: EventTypes.GET_ACTIVE_TAB }, ({ isActive }) => {
			setActiveTab(isActive);
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		function handleActiveTabChange(message: any) {
			if (message.type === EventTypes.ACTIVE_TAB_CHANGED) {
				const isActive = message.data.isActive;
				setActiveTab(isActive);
			}
		}

		chrome.runtime.onMessage.addListener(handleActiveTabChange);

		return () => {
			chrome.runtime.onMessage.removeListener(handleActiveTabChange);
		};
	}, []);

	return isActiveTab;
}
