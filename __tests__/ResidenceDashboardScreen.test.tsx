import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { RenterHomeScreen, ResidenceDashboardScreen } from '../src/features/renter';

test('residence dashboard shows every section for the chosen residence', async () => {
  const goBack = jest.fn();
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <ResidenceDashboardScreen
        navigation={{ goBack }}
        route={{ params: { residenceId: 'sterling' } }}
      />,
    );
  });

  const json = JSON.stringify(tree.toJSON());
  for (const text of [
    'Welcome home, ',
    'Monthly Rent',
    '$5,400',
    'The Sterling Collection',
    'Unit 1805',
    'Concierge Services',
    'Renew & terms',
    'All Services',
    'Financial Overview',
    '$3,200.00',
    'Pending HOA Fee',
    'Recent Requests',
    'Leak in kitchen',
    'In Progress',
    'Community Buzz',
    'Sky Lounge Wine Tasting',
  ]) {
    expect(json).toContain(text);
  }

  const back = tree.root.findByProps({ accessibilityLabel: 'Back to my residences' });
  await ReactTestRenderer.act(() => {
    back.props.onPress();
  });
  expect(goBack).toHaveBeenCalled();

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});

test('tapping a current residence card opens its dashboard', async () => {
  const navigate = jest.fn();
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<RenterHomeScreen navigation={{ navigate }} />);
  });

  const card = tree.root.findByProps({ accessibilityLabel: 'The Obsidian Heights' });
  await ReactTestRenderer.act(() => {
    card.props.onPress();
  });
  expect(navigate).toHaveBeenCalledWith('ResidenceDashboard', { residenceId: 'obsidian' });

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});
