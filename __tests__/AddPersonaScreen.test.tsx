import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { AddPersonaScreen } from '../src/features/persona';

test('add persona page lists every role and opens an added one', async () => {
  const replace = jest.fn();
  const goBack = jest.fn();
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <AddPersonaScreen navigation={{ replace, goBack }} />,
    );
  });

  const json = () => JSON.stringify(tree.toJSON());
  for (const name of [
    'Landlord',
    'Property Manager',
    'Tenant',
    'PMS Company',
    'Real Estate Agent',
    'UN Admin',
  ]) {
    expect(json()).toContain(name);
  }

  // First role not on the account starts selected
  expect(tree.root.findByProps({ accessibilityLabel: 'Add PMS Company' })).toBeTruthy();

  const landlord = tree.root.findByProps({ accessibilityLabel: 'Landlord, added' });
  await ReactTestRenderer.act(() => {
    landlord.props.onPress();
  });
  const cta = tree.root.findByProps({ accessibilityLabel: 'Continue as Landlord' });
  await ReactTestRenderer.act(() => {
    cta.props.onPress();
  });
  expect(replace).toHaveBeenCalledWith('LandlordHome');

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});
