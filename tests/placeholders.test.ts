import test from 'node:test';
import { equal } from './helpers';
import { replacePlaceholderText } from '../src/utils/placeholders';

test('replacePlaceholderText replaces all configured placeholders', () => {
  const text = '{{blockheight}} / {{moscowtime}} / {{blockheight}}';

  equal(
    replacePlaceholderText(text, {
      '{{blockheight}}': '840_000',
      '{{moscowtime}}': '15:66'
    }),
    '840_000 / 15:66 / 840_000'
  );
});

test('replacePlaceholderText treats placeholder strings literally, not as regex patterns', () => {
  const text = '{{mt-at-bh}} [price.usd] (price.usd)';

  equal(
    replacePlaceholderText(text, {
      '{{mt-at-bh}}': '15:66 @ 840_000',
      '[price.usd]': 'literal bracket placeholder',
      '(price.usd)': 'literal paren placeholder'
    }),
    '15:66 @ 840_000 literal bracket placeholder literal paren placeholder'
  );
});
