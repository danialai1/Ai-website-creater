
import React, { useState, useEffect, useCallback } from 'react';
import { AIPromptBuilder } from './components/AIPromptBuilder';
import { CodePreview } from './components/CodePreview';
import { Favorites } from './components/Favorites';
import { Icon } from './components/Icons';
import { generateWebsiteCode } from './services/geminiService';
import type { WebsiteConfig, Favorite } from './types';
import { WEBSITE_TYPES, TONES, FEATURES, STYLES } from './constants';
import { useToast } from './hooks/useToast';

type Tab = 'prompt' | 'builder' | 'favorites';

const Header = () => (
    <header className="text-center w-full max-w-7xl mx-auto my-8 p-8 sm:p-12 bg-dark/60 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl animate-float relative">
        <div className="absolute top-6 right-6">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-2 px-4 rounded-full border border-white/10">
            <img src={`https://picsum.photos/seed/avatar/40/40`} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-accent"/>
            <span className="font-medium">Welcome, Builder!</span>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold mb-4 bg-gradient-to-r from-accent to-accent-light text-transparent bg-clip-text inline-flex items-center gap-4">
            <Icon name="WandSparkles" className="w-10 h-10 sm:w-14 sm:w-14" />
            AI Website Builder PRO
        </h1>
        <p className="text-lg sm:text-xl max-w-4xl mx-auto text-gray-300">
            Turn your ideas into stunning websites. Describe your vision, and let our AI bring it to life in seconds.
        </p>
    </header>
);

const Tabs: React.FC<{ activeTab: Tab; onTabChange: (tab: Tab) => void; hasCode: boolean }> = ({ activeTab, onTabChange, hasCode }) => {
    const tabs: { id: Tab; label: string; icon: 'WandSparkles' | 'Code' | 'Star' }[] = [
        { id: 'prompt', label: 'Generator', icon: 'WandSparkles' },
        { id: 'builder', label: 'Builder', icon: 'Code' },
        { id: 'favorites', label: 'Favorites', icon: 'Star' },
    ];

    return (
        <div className="flex justify-center mb-8 bg-dark/70 backdrop-blur-md p-3 rounded-full border border-white/10 shadow-lg gap-2">
            {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                const isDisabled = tab.id === 'builder' && !hasCode;
                return (
                    <button
                        key={tab.id}
                        onClick={() => !isDisabled && onTabChange(tab.id)}
                        disabled={isDisabled}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-base font-semibold transition-all duration-300 ${
                            isActive
                                ? 'bg-gradient-to-r from-primary to-primary-dark shadow-lg shadow-primary/30 text-white'
                                : 'text-gray-300 hover:bg-white/10'
                        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Icon name={tab.icon} className="w-5 h-5"/>
                        {tab.label}
                    </button>
                )
            })}
        </div>
    );
};


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('prompt');
  const [currentConfig, setCurrentConfig] = useState<WebsiteConfig>({
      websiteType: WEBSITE_TYPES[0],
      businessName: '',
      description: '',
      tone: TONES[0],
      features: FEATURES.slice(0,3),
      style: STYLES[0],
      customCss: '',
  });
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    // Restore auto-saved code
    try {
        const autoSavedCode = localStorage.getItem('ai-website-autosave');
        if (autoSavedCode && autoSavedCode.trim() !== '') {
            if (window.confirm("You have unsaved work from a previous session. Would you like to restore it?")) {
                setGeneratedCode(autoSavedCode);
                setActiveTab('builder');
                addToast('Your previous session has been restored.', 'info');
            } else {
                // User chose not to restore, so clear the saved data.
                localStorage.removeItem('ai-website-autosave');
            }
        }
    } catch (e) {
        console.error("Failed to process auto-saved code", e);
    }
      
    // Load favorites
    try {
        const savedFavorites = localStorage.getItem('ai-website-favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    } catch (e) {
        console.error("Failed to parse favorites from localStorage", e);
    }
  }, [addToast]);

  useEffect(() => {
    try {
        localStorage.setItem('ai-website-favorites', JSON.stringify(favorites));
    } catch (e) {
        console.error("Failed to save favorites to localStorage", e);
    }
  }, [favorites]);

  const handleGenerate = useCallback(async (config: WebsiteConfig) => {
    setIsLoading(true);
    setError(null);
    setCurrentConfig(config);
    try {
      const code = await generateWebsiteCode(config);
      setGeneratedCode(code);
      setActiveTab('builder');
      localStorage.removeItem('ai-website-autosave');
    } catch (err: any) {
      const errorMessage = err.message || 'An unknown error occurred.';
      setError(errorMessage);
      addToast(errorMessage, 'error');
      setActiveTab('prompt');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  const handleRegenerate = useCallback(() => {
    if(currentConfig){
        handleGenerate(currentConfig);
    }
  }, [currentConfig, handleGenerate]);
  
  const handleSaveFavorite = useCallback(() => {
    if(currentConfig?.businessName){
        const isAlreadyFavorite = favorites.some(fav => fav.businessName === currentConfig.businessName && fav.description === currentConfig.description);
        if(!isAlreadyFavorite) {
            const newFavorite: Favorite = {
                id: crypto.randomUUID(),
                ...currentConfig,
            };
            setFavorites(prev => [newFavorite, ...prev]);
            addToast('Configuration saved to favorites!', 'success');
        } else {
            addToast('This configuration is already in your favorites.', 'info');
        }
    }
  }, [currentConfig, favorites, addToast]);

  const handleDeleteFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
    addToast('Favorite removed.', 'success');
  }, [addToast]);

  const handleClearAllFavorites = useCallback(() => {
    setFavorites([]);
    addToast('All favorites have been cleared.', 'success');
  }, [addToast]);

  const handleLoadFavorite = useCallback((config: WebsiteConfig) => {
    setCurrentConfig(config);
    setActiveTab('prompt'); // Switch to prompt tab to show the loaded config
    addToast(`Loaded favorite: "${config.businessName}"`, 'info');
  }, [addToast]);

  return (
    <div className="bg-darker text-light min-h-screen p-4 sm:p-6 font-sans">
      <div className="container mx-auto max-w-7xl">
        <Header />
        {error && (
            <div className="bg-danger/20 border border-danger text-danger p-4 rounded-lg text-center mb-6">
                <strong>Error:</strong> {error}
            </div>
        )}
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} hasCode={!!generatedCode} />
        
        <main>
          {activeTab === 'prompt' && <AIPromptBuilder config={currentConfig} onConfigChange={setCurrentConfig} onGenerate={handleGenerate} isLoading={isLoading} />}
          {activeTab === 'builder' && <CodePreview code={generatedCode} onCodeChange={setGeneratedCode} onRegenerate={handleRegenerate} onSaveFavorite={handleSaveFavorite} isLoading={isLoading} />}
          {activeTab === 'favorites' && <Favorites favorites={favorites} onLoad={handleLoadFavorite} onDelete={handleDeleteFavorite} onClearAll={handleClearAllFavorites} />}
        </main>
      </div>
      <footer className="text-center p-8 mt-12 text-gray-500">
        <p>&copy; {new Date().getFullYear()} AI Website Builder PRO. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
