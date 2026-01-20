chrome.runtime.onMessage.addListener(({ type, data }) => {
	if (type === 'isPopupOpen') {
		if (data) onPopupOpen();
		else onPopupClose();
	}
});

function onPopupOpen() {
	console.log('Открылось!');
}

function onPopupClose() {
	console.log('Окошко закрылось');
}
