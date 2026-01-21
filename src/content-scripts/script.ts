chrome.runtime.onMessage.addListener(({ type, action, data }) => {
	if (type === 'isPopupOpen') {
		if (data) onPopupOpen();
		else onPopupClose();
	}

	console.log(action, type, data);

	if (action == 'WINDOW_RELOAD') window.location.reload();
});


function onPopupOpen() {
	console.log('Открылось!');
}

function onPopupClose() {
	console.log('Окошко закрылось');
}

document.addEventListener('DOMContentLoaded', () => {});
