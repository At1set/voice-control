import { ContentScriptCore } from '@/lib/components/ContentScriptCore/ContentScriptCore';
import { useIsActiveTab } from '@/lib/shared/hooks/useIsActiveTab';

function App() {
	const isActive = useIsActiveTab();
	// console.log(`Инъекция скрипта контента: ${isActive ? 'АКТИВНА' : 'НЕ АКТИВНА'}`);

	if (!isActive) return;
	return <ContentScriptCore />;
}

export default App;
