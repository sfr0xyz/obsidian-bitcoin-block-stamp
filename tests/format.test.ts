import test from 'node:test';
import { equal } from './helpers';
import { formatBlockHeight, formatMoscowTime } from '../src/utils/format';

test('formatBlockHeight applies the configured thousands separator', () => {
  equal(formatBlockHeight(840000, 'plain'), '840000');
  equal(formatBlockHeight(840000, 'comma'), '840,000');
  equal(formatBlockHeight(840000, 'period'), '840.000');
  equal(formatBlockHeight(840000, 'space'), '840 000');
  equal(formatBlockHeight(840000, 'apostrophe'), "840'000");
  equal(formatBlockHeight(840000, 'underscore'), '840_000');
});

test('formatMoscowTime applies the configured two-digit separator grouping', () => {
  equal(formatMoscowTime(1566, 'plain'), '1566');
  equal(formatMoscowTime(1566, 'colon'), '15:66');
  equal(formatMoscowTime(1566, 'period'), '15.66');
});

test('formatMoscowTime pads separated values to four digits', () => {
  equal(formatMoscowTime(123, 'colon'), '01:23');
  equal(formatMoscowTime(123, 'plain'), '123');
});
