import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import { deepClone, TCloneable } from '@/deepClone';
import { calculateObjectSize, formatBytes, generateDeepNestedObject } from './utils';
import chalk from 'chalk';
export const rocketEmoji = '\uD83D\uDE80';

let sampleObject: TCloneable;

beforeAll(() => {
  sampleObject = generateDeepNestedObject(10) as TCloneable;
});

describe('Performance of deep clone functions', () => {
  let lodashTime = 0;
  let customTime = 0;

  it(chalk.green('Measuring lodash.cloneDeep'), () => {
    let totalTime = 0;
    for (let i = 0; i < 10; i++) {
      const start = performance.now();
      const cloned = cloneDeep(sampleObject);
      const end = performance.now();
      totalTime += end - start;
      expect(isEqual(sampleObject, cloned)).toBe(true);
    }
    lodashTime = totalTime / 10;
  });

  it(chalk.green('Measuring custom.deepClone'), () => {
    let totalTime = 0;
    for (let i = 0; i < 10; i++) {
      const start = performance.now();
      const cloned = deepClone(sampleObject);
      const end = performance.now();
      totalTime += end - start;
      expect(isEqual(sampleObject, cloned)).toBe(true);
    }
    customTime = totalTime / 10;
  });

  afterAll(() => {
    if (lodashTime && customTime) {
      const percentFaster = ((lodashTime - customTime) / lodashTime) * 100;
      console.log(chalk.green(`Measuring lodash.cloneDeep: ${lodashTime.toFixed(2)}ms`));
      console.log(chalk.green(`Measuring custom.deepClone: ${customTime.toFixed(2)}ms`));

      const size = calculateObjectSize(sampleObject);
      const { value, unit } = formatBytes(size);
      console.log(chalk.yellow(`Sample object size: ${value} ${unit}`));

      console.log(chalk.bgGreen.black(`${rocketEmoji} custom.deepClone is ${percentFaster.toFixed(2)}% faster`));
    }
  });
});
