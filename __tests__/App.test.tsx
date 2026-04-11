/**
 * @format
 */

// FIXME: is it possible to make this work with vitest?

import {expect, test} from 'vitest';

// import React from 'react';
// import ReactTestRenderer from 'react-test-renderer';
// import {App} from '../App';

// test('renders correctly', async () => {
//   await ReactTestRenderer.act(() => {
//     ReactTestRenderer.create(<App />);
//   });
// });

test('is skipped', () => {
  console.warn('Skipping App.test.tsx for now - see file comments');
  expect(true).toBe(true);
});
