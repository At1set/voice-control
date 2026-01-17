// this runs when the extension is installed or updated
chrome.runtime.onInstalled.addListener((details) => {
	console.log('Welcome to chrome ext voice control. Have a nice day!');
	if (details.reason === 'install') {
		// chrome.tabs.create({ url: 'CUSTOM GREETING PAGE URL' });
	}
});
