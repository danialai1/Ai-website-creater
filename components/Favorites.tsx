import React from 'react';
import type { Favorite, WebsiteConfig } from '../types';
import { Icon } from './Icons';

interface FavoritesProps {
  favorites: Favorite[];
  onLoad: (config: WebsiteConfig) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const Favorites: React.FC<FavoritesProps> = ({ favorites, onLoad, onDelete, onClearAll }) => {
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all favorites? This action cannot be undone.')) {
      onClearAll();
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-card-border rounded-3xl p-8 shadow-2xl">
      <div className="flex justify-between items-center pb-4 mb-6 border-b-2 border-accent/20 relative">
        <h2 className="text-3xl font-bold text-accent flex items-center gap-4">
            <Icon name="Star" className="w-8 h-8 fill-current text-warning"/>
            Favorite Configurations
        </h2>
        {favorites.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="flex items-center gap-2 bg-danger/10 text-danger/80 hover:bg-danger/20 hover:text-danger px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium"
            aria-label="Clear all favorites"
          >
            <Icon name="Trash" className="w-4 h-4" />
            Clear All
          </button>
        )}
        <div className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-accent to-transparent rounded-full"></div>
      </div>
      {favorites.length === 0 ? (
        <p className="text-center text-gray-400 py-16 text-lg">You haven't saved any favorites yet. Generate a website and click the "Favorite" button to save its configuration here.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(fav => (
            <div key={fav.id} className="bg-black/25 border border-white/15 rounded-2xl p-6 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-2 relative group">
                <h3 className="text-xl font-semibold text-accent-light mb-2 pr-8">{fav.businessName}</h3>
                <p className="text-sm text-gray-400 mb-1"><span className="font-medium text-gray-300">Type:</span> {fav.websiteType}</p>
                <p className="text-sm text-gray-400 mb-4"><span className="font-medium text-gray-300">Tone:</span> {fav.tone}</p>
                <div className="flex items-center gap-4 mt-4">
                    <button onClick={() => onLoad(fav)} className="flex-1 bg-primary/80 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary">
                        Load
                    </button>
                    <button onClick={() => onDelete(fav.id)} className="p-2 text-danger/70 hover:text-danger hover:bg-danger/10 rounded-full transition-colors duration-300">
                      <Icon name="Trash" className="w-5 h-5"/>
                    </button>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
