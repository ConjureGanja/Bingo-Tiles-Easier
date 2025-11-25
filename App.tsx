import React, { useState, useEffect } from 'react';
import { BINGO_DATA } from './constants';
import Tile from './components/Tile';
import TileModal from './components/TileModal';
import { BingoTile } from './types';

function App() {
  const [tiles, setTiles] = useState<BingoTile[]>([]);
  const [selectedTile, setSelectedTile] = useState<BingoTile | null>(null);

  // Initialize data
  useEffect(() => {
    // Check local storage for saved state
    const savedState = localStorage.getItem('bingo-state');
    if (savedState) {
      setTiles(JSON.parse(savedState));
    } else {
      setTiles(BINGO_DATA);
    }
  }, []);

  // Save on change
  useEffect(() => {
    if (tiles.length > 0) {
      localStorage.setItem('bingo-state', JSON.stringify(tiles));
    }
  }, [tiles]);

  const handleTileClick = (tile: BingoTile) => {
    setSelectedTile(tile);
  };

  const handleToggleComplete = (id: number, isCompleted: boolean) => {
    setTiles(prev => prev.map(t => t.id === id ? { ...t, isCompleted } : t));
    // Update the selected tile as well so the modal reflects the change immediately
    setSelectedTile(prev => prev && prev.id === id ? { ...prev, isCompleted } : prev);
  };

  const completedCount = tiles.filter(t => t.isCompleted).length;

  return (
    <div className="min-h-screen bg-stone-900 pb-20 bg-[url('https://oldschool.runescape.wiki/images/thumb/Background.png/800px-Background.png')] bg-repeat">
      
      {/* Header */}
      <header className="bg-stone-900/95 border-b-4 border-amber-600 py-6 shadow-2xl sticky top-0 z-40">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-amber-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] osrs-font">
            Roasted <span className="text-red-500">Holiday</span> Bingo
          </h1>
          <p className="text-stone-400 mt-2 font-bold tracking-widest text-sm md:text-base">
            CLAN TRACKER & COMPANION
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <main className="container mx-auto px-2 md:px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-5 gap-2 md:gap-4 p-4 bg-stone-800/80 backdrop-blur rounded-xl border-4 border-stone-600 shadow-2xl">
          {tiles.map(tile => (
            <Tile 
              key={tile.id} 
              tile={tile} 
              onClick={handleTileClick} 
            />
          ))}
        </div>
      </main>

      {/* Stats Footer */}
      <footer className="fixed bottom-0 w-full bg-stone-900 border-t-2 border-amber-600 p-4 shadow-lg z-40">
         <div className="container mx-auto max-w-4xl flex justify-between items-center">
             <div>
                <span className="text-stone-400 text-sm uppercase">Progress</span>
                <div className="text-2xl font-bold text-amber-500 osrs-font">
                    {completedCount} <span className="text-stone-500 text-lg">/ {tiles.length}</span>
                </div>
             </div>
             
             <div className="flex gap-2">
                <div className="h-8 w-48 bg-stone-800 rounded-full overflow-hidden border border-stone-600">
                    <div 
                        className="h-full bg-gradient-to-r from-amber-700 to-amber-500 transition-all duration-500"
                        style={{ width: `${(completedCount / tiles.length) * 100}%` }}
                    />
                </div>
             </div>
         </div>
      </footer>

      {/* Modal */}
      {selectedTile && (
        <TileModal 
          tile={selectedTile} 
          onClose={() => setSelectedTile(null)}
          onToggleComplete={handleToggleComplete}
        />
      )}

    </div>
  );
}

export default App;