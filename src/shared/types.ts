/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface CADElement {
  id: string;
  type: 'box' | 'sphere' | 'cylinder';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
}

export interface CADDesign {
  name: string;
  elements: CADElement[];
}

export interface AnalysisResult {
  score: number;
  summary: string;
  suggestions: string[];
  structuralIntegrity: 'Low' | 'Medium' | 'High';
  aestheticRating: number;
}

export interface ReportData {
  design: CADDesign;
  analysis: AnalysisResult;
  timestamp: string;
}
