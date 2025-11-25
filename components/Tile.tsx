import React from 'react';
import { BingoTile } from '../types';

interface TileProps {
  tile: BingoTile;
  onClick: (tile: BingoTile) => void;
}

const Tile: React.FC<TileProps> = ({ tile, onClick }) => {
  return (
    <div 
      onClick={() => onClick(tile)}
      className={`
        relative aspect-square flex flex-col items-center justify-center text-center p-2 cursor-pointer
        border-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg group
        ${tile.isCompleted 
          ? 'bg-green-800 border-green-400 text-green-100 shadow-green-900/50' 
          : 'bg-stone-800 border-stone-600 text-stone-400 hover:border-amber-500 hover:text-amber-200'
        }
      `}
    >
      <div className="absolute top-1 right-1 text-xs opacity-50 font-mono z-20">{tile.id}</div>
      
      {/* Visual Indicator of Completion */}
      {tile.isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none z-10">
             <svg className="w-20 h-20 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
             </svg>
        </div>
      )}

      <div className="z-10 flex flex-col items-center gap-1 w-full h-full justify-between py-1">
        <div 
          className="flex-1 w-full flex items-center justify-center relative p-1"
        >
          <img 
            src={tile.imageUrl} 
            alt={tile.title}
            className={`
              max-w-full max-h-full object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]
              transition-transform duration-300 group-hover:scale-110
              ${tile.isCompleted ? 'grayscale-0' : 'grayscale-[0.3] group-hover:grayscale-0'}
            `}
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).style.display = 'none';
              ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'flex';
            }}
          />
          {/* Fallback Placeholder */}
          <div className="hidden absolute inset-0 bg-stone-900/50 items-center justify-center rounded border border-stone-700">
             <span className="text-2xl opacity-50">?</span>
          </div>
        </div>
        
        <h3 className="text-[10px] md:text-xs font-bold leading-tight line-clamp-2 px-1 w-full">
          {tile.title}
        </h3>
      </div>
    </div>
  );
};

export default Tile;