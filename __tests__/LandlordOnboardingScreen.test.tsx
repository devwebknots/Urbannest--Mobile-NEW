import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { LandlordOnboardingScreen } from '../src/features/landlord';

// Validation is bypassed for now (screens-only phase): Continue always moves on
test('landlord onboarding walks through all three steps', async () => {
  const replace = jest.fn();
  const goBack = jest.fn();
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <LandlordOnboardingScreen navigation={{ replace, goBack }} />,
    );
  });
  const json = () => JSON.stringify(tree.toJSON());
  expect(json()).toContain('Independent Landlord');

  const press = async (label: string) => {
    const button = tree.root.findByProps({ accessibilityLabel: label });
    await ReactTestRenderer.act(() => {
      button.props.onPress();
    });
  };
  await press('Continue');
  expect(json()).toContain('Where you currently live.');
  await press('Continue');
  expect(json()).toContain('Upload document(s)');
  expect(tree.root.findAllByProps({ accessibilityLabel: 'Activate' }).length).toBeGreaterThan(0);

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});
