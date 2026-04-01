/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { CADElement, CADDesign } from '../shared/types';
import { Plus, Trash2, Play, FileText } from 'lucide-react';

interface Props {
  design: CADDesign;
  onAdd: (type: CADElement['type']) => void;
  onRemove: (id: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function ControlPanel({ design, onAdd, onRemove, onAnalyze, isAnalyzing }: Props) {
  return (
    <div className="absolute top-4 left-4 w-80 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-6 text-white shadow-2xl overflow-y-auto max-h-[calc(100vh-2rem)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold tracking-tight italic font-serif">CAD Generator</h1>
        <div className="text-[10px] uppercase tracking-widest opacity-50 font-mono">v1.0.4</div>
      </div>

      <div className="space-y-6">
        <section>
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-mono block mb-3">Add Elements</label>
          <div className="grid grid-cols-3 gap-2">
            {(['box', 'sphere', 'cylinder'] as const).map((type) => (
              <button
                key={type}
                onClick={() => onAdd(type)}
                className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all group"
              >
                <Plus className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] capitalize">{type}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-mono block mb-3">Scene Elements ({design.elements.length})</label>
          <div className="space-y-2">
            {design.elements.map((el) => (
              <div key={el.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg group">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: el.color }} />
                  <span className="text-xs capitalize opacity-80">{el.type}</span>
                </div>
                <button
                  onClick={() => onRemove(el.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            {design.elements.length === 0 && (
              <div className="text-center py-4 text-xs opacity-30 italic">No elements in scene</div>
            )}
          </div>
        </section>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || design.elements.length === 0}
          className="w-full py-4 bg-white text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {isAnalyzing ? (
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
          <span className="uppercase tracking-widest text-xs">Run AI Analysis</span>
        </button>
      </div>
    </div>
  );
}
