export async function sendMessageToActiveTab(message: unknown) {
	const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
	if (!tab?.id) return false;
	return await chrome.tabs.sendMessage(tab.id, message);
}
