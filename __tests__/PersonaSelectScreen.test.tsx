import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { PersonaSelectScreen } from '../src/features/persona';

test('persona screen shows every persona and continues to Home', async () => {
  const replace = jest.fn();
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <PersonaSelectScreen navigation={{ replace }} />,
    );
  });

  const json = JSON.stringify(tree.toJSON());
  for (const name of [
    'Renter',
    'Landlord',
    'Property Manager',
    'Add Persona',
  ]) {
    expect(json).toContain(name);
  }
  expect(json).not.toContain('Sign out');

  const cta = tree.root.findByProps({
    accessibilityLabel: 'Continue as Renter',
  });
  await ReactTestRenderer.act(() => {
    cta.props.onPress();
  });
  expect(replace).toHaveBeenCalledWith('Home');

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});
