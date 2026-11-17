import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { PmsHomeScreen } from '../src/features/pms';

test('PMS dashboard shows every section and switches the period', async () => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<PmsHomeScreen />);
  });

  const json = () => JSON.stringify(tree.toJSON());
  for (const text of [
    'Dashboard',
    'All Cities • All Properties • 24 units',
    'Total Units',
    '87.5%',
    '$18,420',
    'Leasing Activity',
    'Lease Cycle Efficiency',
    'Property Snapshot',
    'Student Housing',
    'Financial Pulse',
    '($5,840)',
    '12 Maple Street',
    'Recent Activity',
    'New tenant signed lease',
    'Recent Transactions',
    'Rent Overdue',
  ]) {
    expect(json()).toContain(text);
  }

  const week = tree.root.findAll(
    n => n.props.accessibilityRole === 'tab' && n.props.accessibilityState?.selected === false,
  )[0];
  await ReactTestRenderer.act(() => {
    week.props.onPress();
  });
  const selected = tree.root.findAll(
    n => n.props.accessibilityRole === 'tab' && n.props.accessibilityState?.selected === true,
  );
  expect(selected.length).toBeGreaterThan(0);

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});
