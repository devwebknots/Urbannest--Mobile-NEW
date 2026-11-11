import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { PropertyDetailsScreen } from '../src/features/guest';

test('property details shows the listing, costs, features and similar deals', async () => {
  const navigation = { goBack: jest.fn(), push: jest.fn(), navigate: jest.fn() };
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <PropertyDetailsScreen navigation={navigation} route={{ params: { propertyId: 'r1' } }} />,
    );
  });

  const json = JSON.stringify(tree.toJSON());
  for (const text of [
    'Brother Homes',
    '1,850 USD',
    '3 Bed',
    'Details',
    'View Floor Plan',
    'Costs & Fees',
    'Base rent',
    'Special features',
    'EV Charging',
    'Similar Deals',
    'Glass Villa Retreat',
    'Apply Now',
    'Book a Tour',
  ]) {
    expect(json).toContain(text);
  }

  // Costs & Fees: adding an extra raises the monthly estimate
  expect(json).toContain('$2,725 – $4,850');
  const parking = tree.root.findByProps({ accessibilityLabel: 'Parking Fee' });
  await ReactTestRenderer.act(() => {
    parking.props.onPress();
  });
  expect(JSON.stringify(tree.toJSON())).toContain('$2,920 – $5,045');

  // A Similar Deals card opens that listing on top
  const deal = tree.root.findByProps({ accessibilityLabel: 'Glass Villa Retreat' });
  await ReactTestRenderer.act(() => {
    deal.props.onPress();
  });
  expect(navigation.push).toHaveBeenCalledWith('PropertyDetails', { propertyId: 'r2' });

  const back = tree.root.findByProps({ accessibilityLabel: 'Back' });
  await ReactTestRenderer.act(() => {
    back.props.onPress();
  });
  expect(navigation.goBack).toHaveBeenCalled();

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});
