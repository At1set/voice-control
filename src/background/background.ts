import { EventTypes } from './model/EventTypes';

let lastActiveTabId: number | null = null;
let lastWindowId: number | null = null;

// this runs when the extension is installed or updated
chrome.runtime.onInstalled.addListener((details) => {
	console.log('Welcome to chrome ext voice control. Have a nice day!');
	if (details.reason === 'install') {
		// chrome.tabs.create({ url: 'CUSTOM GREETING PAGE URL' });
	}
});

chrome.runtime.onMessage.addListener((message) => {
	if (message?.type === 'isPopupOpen') {
		chrome.tabs.update({}, async (tab) => {
			if (!tab?.id) return;
			chrome.tabs.sendMessage(tab.id, message);
		});
	}
});

initBadge();

chrome.tabs.onActivated.addListener(({ tabId, windowId }) => updateTabs({ tabId, windowId }));

// ==== ПРИ ОБНОВЛЕНИИ ВКЛАДКИ ==== //
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete' && tab.active) {
		updateTabs({ tabId, windowId: tab.windowId });
		chrome.storage.local.get('isRecording', ({ isRecording }) => {
			if (isRecording) tryOpenSidePanel({ tabId: lastActiveTabId, windowId: lastWindowId });
		});
	}
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg.type === EventTypes.GET_ACTIVE_TAB) {
		console.log(`Получен запрос на получение активной вкладки: ${sender.tab?.id}`);

		sendResponse({
			isActive: sender.tab?.id === lastActiveTabId,
		});
	} else if (msg.action === 'OPEN_SIDE_PANEL')
		tryOpenSidePanel({ tabId: lastActiveTabId, windowId: lastWindowId });
});

chrome.storage.local.onChanged.addListener((changes) => {
	console.log('[storage change]', 'changes:', changes, 'stack:', new Error().stack);
	if (changes.isRecording) {
		const isRecording = changes.isRecording.newValue as boolean;
		chrome.action.setBadgeText({ text: isRecording ? 'ON' : '' });
		allowMicrophoneOnSite();
	}
});

chrome.runtime.onMessage.addListener((msg) => {
	switch (msg.action) {
		case EventTypes.GO_PREV_TAB:
			goPrevTab();
			return;

		case EventTypes.GO_NEXT_TAB:
			goNextTab();
			return;
	}
});

function initBadge() {
	chrome.storage.local.get('isRecording', ({ isRecording }) => {
		// если значение уже есть, не трогаем
		if (typeof isRecording === 'undefined') {
			chrome.storage.local.set({ isRecording: false });
		}
	});

	chrome.action.setBadgeText({ text: '' });
	chrome.action.setBadgeBackgroundColor({ color: '#2bd1ff' });
}

/**
 * Обновить активную вкладку
 */
function updateTabs({ tabId, windowId }: { tabId: number; windowId?: number }) {
	// уведомляем старую вкладку
	if (lastActiveTabId !== null) {
		console.log('Отправлен запрос на СТАРУЮ вкладку');

		chrome.tabs.sendMessage(lastActiveTabId, {
			type: EventTypes.ACTIVE_TAB_CHANGED,
			data: {
				isActive: false,
			},
		});
	}

	console.log('Отправлен запрос на НОВУЮ вкладку');
	// уведомляем новую вкладку
	chrome.tabs.sendMessage(tabId, {
		type: EventTypes.ACTIVE_TAB_CHANGED,
		data: {
			isActive: true,
		},
	});

	lastActiveTabId = tabId;
	if (typeof windowId !== 'undefined') lastWindowId = windowId;
}

async function tryOpenSidePanel(
	{
		windowId,
		tabId,
	}: {
		windowId: number | null;
		tabId: number | null;
	},
	onerror?: (error: unknown) => void,
) {
	if (windowId === null || tabId === null) return;
	try {
		await chrome.sidePanel.open({ windowId });
	} catch (e) {
		console.warn('Не удалось открыть боковую панель: ', e);
		onerror?.(e);
	}
}

function allowMicrophoneOnSite() {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tab = tabs[0];
		if (!tab || !tab.url) return;
		if (tab.url.startsWith('chrome://')) return;

		const url = tab.url;
		const incognito = tab.incognito;

		// Формируем pattern
		const pattern = tab.url.startsWith('file:') ? tab.url : new URL(tab.url).origin + '/*';

		chrome.contentSettings.microphone.get(
			{
				primaryUrl: url,
				incognito: incognito,
			},
			(details) => {
				console.log(`[microphone allow] for url ${url}, pattern ${pattern}`);
				if (details.setting !== 'allow') {
					chrome.contentSettings.microphone.set({
						primaryPattern: pattern,
						setting: 'allow',
						scope: incognito ? 'incognito_session_only' : 'regular',
					});
				}
			},
		);
	});
}

function goPrevTab() {
	if (lastActiveTabId == null || lastWindowId == null) return;

	chrome.tabs.query({ windowId: lastWindowId }, (tabs) => {
		const index = tabs.findIndex((t) => t.id === lastActiveTabId);
		if (index === -1) return;

		const prevTab = tabs[index - 1] ?? tabs[tabs.length - 1]; // зацикливание
		if (!prevTab.id) return;

		chrome.tabs.update(prevTab.id, { active: true });
	});
}

function goNextTab() {
	if (lastActiveTabId == null || lastWindowId == null) return;

	chrome.tabs.query({ windowId: lastWindowId }, (tabs) => {
		const index = tabs.findIndex((t) => t.id === lastActiveTabId);
		if (index === -1) return;

		const nextTab = tabs[index + 1] ?? tabs[0]; // зацикливание
		if (nextTab.id) {
			chrome.tabs.update(nextTab.id, { active: true });
		}
	});
}
