import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { CheckInScreen, RenterHomeScreen, ResidenceDashboardScreen } from '../src/features/renter';

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

test('cards open check-in when move-in ready, else the dashboard', async () => {
  const navigate = jest.fn();
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<RenterHomeScreen navigation={{ navigate }} />);
  });

  for (const [name, route, id] of [
    ['The Obsidian Heights', 'CheckIn', 'obsidian'],
    ['The Sterling Collection', 'ResidenceDashboard', 'sterling'],
  ]) {
    const card = tree.root.findByProps({ accessibilityLabel: name });
    await ReactTestRenderer.act(() => {
      card.props.onPress();
    });
    expect(navigate).toHaveBeenCalledWith(route, { residenceId: id });
  }

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});

test('check-in submits only after every checklist item is confirmed', async () => {
  const goBack = jest.fn();
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <CheckInScreen navigation={{ goBack }} route={{ params: { residenceId: 'obsidian' } }} />,
    );
  });

  const json = JSON.stringify(tree.toJSON());
  for (const text of [
    'The Obsidian Heights',
    'Move-In Ready',
    'ABC123456',
    'Access Digital Key',
    'Move-In Checklist',
    'Home Security',
    'Around Your Home',
    'Miracle International School',
    'Curated Living Experience',
  ]) {
    expect(json).toContain(text);
  }

  const submit = () => tree.root.findByProps({ accessibilityLabel: 'Submit check-in' });
  expect(submit().props.disabled).toBe(true);

  for (const label of ['Inspection', 'Utilities', 'Internet', 'Home Security']) {
    const tile = tree.root.findByProps({ accessibilityLabel: label });
    await ReactTestRenderer.act(() => {
      tile.props.onPress();
    });
  }
  expect(submit().props.disabled).toBe(false);

  await ReactTestRenderer.act(() => {
    submit().props.onPress();
  });
  expect(tree.root.findAllByProps({ accessibilityLabel: 'Check-in submitted' }).length).toBeGreaterThan(0);

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});
