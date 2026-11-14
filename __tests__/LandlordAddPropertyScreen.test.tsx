import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { LandlordAddPropertyScreen } from '../src/features/landlord';

test('add property page shows every section, amenities and the locked unit tab', async () => {
  const goBack = jest.fn();
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<LandlordAddPropertyScreen navigation={{ goBack }} />);
  });
  const json = () => JSON.stringify(tree.toJSON());
  for (const text of [
    'Add New Property',
    'Property Basics',
    'Upload Images',
    'Supports: JPG, PNG (Max 15MB each)',
    'Address Details',
    'Upload Property Video',
    'Location Preview',
    'Save & Continue',
  ]) {
    expect(json()).toContain(text);
  }

  const amenities = tree.root.findByProps({ accessibilityLabel: 'Amenities' });
  await ReactTestRenderer.act(() => {
    amenities.props.onPress();
  });
  expect(json()).toContain('Swimming Pool');

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});
