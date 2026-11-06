import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { RenterHomeScreen } from '../src/features/renter';

test('renter home lists residences and filters past homes', async () => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<RenterHomeScreen />);
  });

  let json = JSON.stringify(tree.toJSON());
  for (const name of [
    'My Residences',
    'The Obsidian Heights',
    'The Sterling Collection',
    'Azure Estate',
    'The Marble Pavilion',
    'Premium Home',
    'All Rentals',
    'Check-In Now',
  ]) {
    expect(json).toContain(name);
  }

  const past = tree.root.findByProps({ accessibilityLabel: 'Past homes' });
  await ReactTestRenderer.act(() => {
    past.props.onPress();
  });
  json = JSON.stringify(tree.toJSON());
  expect(json).toContain('The Marble Pavilion');
  expect(json).not.toContain('Azure Estate');

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});
