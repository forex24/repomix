import { TiktokenEncoding } from 'tiktoken';
import type { RepomixConfigMerged } from '../../config/configSchema.js';
import type { RepomixProgressCallback } from '../../shared/types.js';
import type { ProcessedFile } from '../file/fileTypes.js';
import { TokenCounter } from '../tokenCount/tokenCount.js';
import { aggregateMetrics } from './aggregateMetrics.js';
import { calculateAllFileMetrics } from './calculateAllFileMetrics.js';

export interface CalculateMetricsResult {
  totalFiles: number;
  totalCharacters: number;
  totalTokens: number;
  fileCharCounts: Record<string, number>;
  fileTokenCounts: Record<string, number>;
}

export const calculateMetrics = async (
  processedFiles: ProcessedFile[],
  output: string,
  progressCallback: RepomixProgressCallback,
  config: RepomixConfigMerged,
): Promise<CalculateMetricsResult> => {
  const tokenCounter = new TokenCounter(config.tokenCount.encoding);

  progressCallback('Calculating metrics...');
  const fileMetrics = await calculateAllFileMetrics(processedFiles, tokenCounter, progressCallback);

  const result = aggregateMetrics(fileMetrics, processedFiles, output, tokenCounter);

  tokenCounter.free();

  return result;
};
