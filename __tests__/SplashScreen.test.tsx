import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SplashScreen } from '../src/features/splash';

jest.useFakeTimers();

test('splash replaces itself with GuestHome exactly once', async () => {
  const replace = jest.fn();
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<SplashScreen navigation={{ replace }} />);
  });
  await ReactTestRenderer.act(async () => {
    jest.runAllTimers();
  });
  expect(replace).toHaveBeenCalledTimes(1);
  expect(replace).toHaveBeenCalledWith('GuestHome');
  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});
