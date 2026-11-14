import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { LandlordPropertiesScreen } from '../src/features/landlord';

test('portfolio overview shows empty stats, filters and the add property card', async () => {
  const goBack = jest.fn();
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<LandlordPropertiesScreen navigation={{ goBack }} />);
  });
  const json = () => JSON.stringify(tree.toJSON());
  for (const text of [
    'Portfolio Overview',
    'OWNER MODE: ACTIVE',
    'Total Properties',
    'Rent This Month',
    'Managed Assets',
    'Needs Attention',
    'No properties found',
    'Add Property',
    'Recent Unit Activities',
    'No unit activity yet.',
  ]) {
    expect(json()).toContain(text);
  }

  const search = tree.root.findByProps({ accessibilityLabel: 'Search properties' });
  await ReactTestRenderer.act(() => {
    search.props.onPress();
  });
  expect(json()).toContain('Search by property name or city');

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});
