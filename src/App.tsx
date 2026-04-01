/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { CADViewport } from './components/CADViewport';
import { ControlPanel } from './components/ControlPanel';
import { ReportView } from './components/ReportView';
import { CADDesign, CADElement, AnalysisResult } from './shared/types';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_DESIGN: CADDesign = {
  name: "New Design",
  elements: []
};

const COLORS = ['#ff7eb3', '#ffb86c', '#f1fa8c', '#50fa7b', '#8be9fd', '#bd93f9'];

export default function App() {
  const [design, setDesign] = useState<CADDesign>(INITIAL_DESIGN);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addElement = useCallback((type: CADElement['type']) => {
    const newElement: CADElement = {
      id: uuidv4(),
      type,
      position: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
    setDesign(prev => ({ ...prev, elements: [...prev.elements, newElement] }));
  }, []);

  const removeElement = useCallback((id: string) => {
    setDesign(prev => ({ ...prev, elements: prev.elements.filter(el => el.id !== id) }));
  }, []);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(design)
      });
      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#050505] overflow-hidden relative font-sans text-white">
      <Canvas
        shadows
        camera={{ position: [20, 20, 20], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#050505']} />
        <CADViewport elements={design.elements} />
        <EffectComposer>
          <Bloom luminanceThreshold={1} intensity={0.5} />
        </EffectComposer>
      </Canvas>

      <ControlPanel
        design={design}
        onAdd={addElement}
        onRemove={removeElement}
        onAnalyze={runAnalysis}
        isAnalyzing={isAnalyzing}
      />

      {analysis && (
        <ReportView
          analysis={analysis}
          design={design}
          onClose={() => setAnalysis(null)}
        />
      )}

      <div className="absolute bottom-4 right-4 text-[10px] uppercase tracking-[0.3em] opacity-30 font-mono pointer-events-none">
        AI-Powered CAD Analysis Engine
      </div>
    </div>
  );
}
