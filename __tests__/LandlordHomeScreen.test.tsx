import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { LandlordHomeScreen } from '../src/features/landlord';

test('landlord dashboard shows every section and selects a chart month', async () => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<LandlordHomeScreen />);
  });

  const json = () => JSON.stringify(tree.toJSON());
  for (const text of [
    'Nan Webknots',
    'Rent Collection',
    'Occupancy Rate',
    'Monthly Rent Collection',
    'Prime Assets',
    'The Regent Plaza',
    'Open Operations',
    'Vendor Performance',
    'Recent Documents',
    'Communication Hub',
    'UrbanNest Intelligence',
  ]) {
    expect(json()).toContain(text);
  }
  // Current month (Nov) starts selected
  expect(json()).toContain('₹4,30,000');

  const october = tree.root.findByProps({ accessibilityLabel: 'Oct: ₹4,05,000' });
  await ReactTestRenderer.act(() => {
    october.props.onPress();
  });
  expect(json()).toContain('₹4,05,000');

  // Burger opens the side menu (reused guest drawer) with Properties
  const burger = tree.root.findByProps({ accessibilityLabel: 'Open menu' });
  await ReactTestRenderer.act(() => {
    burger.props.onPress();
  });
  expect(json()).toContain('Verified Property Owner');
  expect(json()).toContain('Portfolio');

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});
