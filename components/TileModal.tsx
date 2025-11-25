import React, { useState } from 'react';
import { BingoTile } from '../types';
import { getStrategyTips } from '../services/geminiService';

interface TileModalProps {
  tile: BingoTile;
  onClose: () => void;
  onToggleComplete: (id: number, isCompleted: boolean) => void;
}

const TileModal: React.FC<TileModalProps> = ({ tile, onClose, onToggleComplete }) => {
  const [isThinking, setIsThinking] = useState(false);
  const [strategy, setStrategy] = useState<string | null>(null);
  const [isDetailed, setIsDetailed] = useState(false);

  const handleStrategyRequest = async (detailed: boolean) => {
    setIsThinking(true);
    // If requesting quick tip (not detailed), clear previous strategy to show loading state cleanly.
    // If upgrading to detailed, we keep the old text briefly or clear it? Let's clear it to show work is being done.
    setStrategy(null);
    
    try {
      const tips = await getStrategyTips(tile.title, tile.description, detailed);
      setStrategy(tips);
      setIsDetailed(detailed);
    } catch (e) {
      setStrategy("Failed to get strategy.");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-stone-800 border-2 border-amber-600 rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-stone-900 p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-amber-500 osrs-font">{tile.title}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div className="bg-stone-900/50 p-4 rounded-lg border border-stone-700">
            <h3 className="text-stone-300 font-semibold mb-2 text-sm uppercase tracking-wide">Task Description</h3>
            <p className="text-lg text-white leading-relaxed">{tile.description}</p>
          </div>

          {/* Status Control */}
          <div className="flex items-center justify-between bg-stone-900/30 p-4 rounded-lg">
             <span className="text-stone-300">Status:</span>
             <button
                onClick={() => onToggleComplete(tile.id, !tile.isCompleted)}
                className={`px-4 py-2 rounded font-bold transition-all ${
                    tile.isCompleted 
                    ? 'bg-red-900/50 text-red-200 border border-red-500 hover:bg-red-900' 
                    : 'bg-green-700 text-green-100 hover:bg-green-600 border border-green-500'
                }`}
             >
                {tile.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
             </button>
          </div>

          {/* AI Strategy Section */}
          <div className="space-y-3 pt-4 border-t border-stone-700">
             <div className="flex items-center justify-between">
                <h3 className="text-amber-500 font-bold flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    Oracle's Guidance
                </h3>
             </div>

             {/* Initial Call to Action */}
             {!strategy && !isThinking && (
                 <button 
                    onClick={() => handleStrategyRequest(false)}
                    className="w-full bg-amber-900/40 hover:bg-amber-800/60 text-amber-200 py-3 rounded border border-amber-700/50 flex justify-center items-center gap-2 transition-colors group"
                 >
                    <span>Consult the Oracle</span>
                    <span className="text-xs text-amber-200/50 group-hover:text-amber-200">(Quick Tip)</span>
                 </button>
             )}

             {/* Thinking State */}
             {isThinking && (
                 <div className="animate-pulse flex flex-col items-center justify-center p-6 text-amber-200/70 text-sm border border-amber-900/30 rounded bg-black/20">
                     <div className="mb-2">
                        <svg className="animate-spin h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     </div>
                     {isDetailed ? "Consulting ancient texts for detailed wisdom..." : "The Oracle is whispering..."}
                 </div>
             )}

             {/* Result State */}
             {strategy && !isThinking && (
                 <div className="bg-black/40 p-4 rounded text-sm text-stone-300 border-l-2 border-amber-600 shadow-inner">
                     <p className="whitespace-pre-line leading-relaxed">{strategy}</p>
                     
                     {!isDetailed && (
                         <div className="mt-4 pt-3 border-t border-stone-800 flex justify-end">
                             <button 
                                onClick={() => handleStrategyRequest(true)}
                                className="text-xs bg-stone-700 hover:bg-stone-600 text-amber-100 px-3 py-1.5 rounded flex items-center gap-2 transition-colors border border-stone-600"
                             >
                                <span>I need more help</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             </button>
                         </div>
                     )}
                 </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TileModal;