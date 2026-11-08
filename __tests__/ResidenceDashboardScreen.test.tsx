import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {
  CheckInScreen,
  InspectionAreaScreen,
  InspectionScreen,
  RenterHomeScreen,
  ResidenceDashboardScreen,
  UtilitiesScreen,
  UtilityProvidersScreen,
} from '../src/features/renter';
import { inspectionAreaStore } from '../src/features/renter/store/inspectionAreaStore';

beforeEach(() => {
  inspectionAreaStore.reset();
});

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

test('check-in submits only after every item is confirmed; inspection ticks only after its screen is submitted', async () => {
  const goBack = jest.fn();
  const navigate = jest.fn();
  const render = (inspectionSubmitted?: boolean, utilitiesConfirmed?: boolean) => (
    <CheckInScreen
      navigation={{ goBack, navigate }}
      route={{ params: { residenceId: 'obsidian', inspectionSubmitted, utilitiesConfirmed } }}
    />
  );
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(render());
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

  const submit = () => tree.root.findAllByProps({ accessibilityLabel: 'Submit Check-In' })[0];
  const tap = async (label: string) => {
    const tile = tree.root.findAllByProps({ accessibilityLabel: label })[0];
    await ReactTestRenderer.act(() => {
      tile.props.onPress();
    });
  };
  expect(submit().props.disabled).toBe(true);

  // Inspection opens its own screen instead of ticking
  await tap('Inspection');
  expect(navigate).toHaveBeenCalledWith('InspectionArea', { residenceId: 'obsidian' });

  // Utilities opens its own page too
  await tap('Utilities');
  expect(navigate).toHaveBeenCalledWith('Utilities', { residenceId: 'obsidian' });

  for (const label of ['Internet', 'Home Security']) {
    await tap(label);
  }
  expect(submit().props.disabled).toBe(true);

  // Coming back from a submitted inspection ticks it; utilities still open
  await ReactTestRenderer.act(() => {
    tree.update(render(true));
  });
  expect(submit().props.disabled).toBe(true);

  // Coming back from "Confirm Utilities" ticks the last item
  await ReactTestRenderer.act(() => {
    tree.update(render(true, true));
  });
  expect(submit().props.disabled).toBe(false);

  await ReactTestRenderer.act(() => {
    submit().props.onPress();
  });
  expect(tree.root.findAllByProps({ accessibilityLabel: 'Check-in submitted' }).length).toBeGreaterThan(0);

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});

test('utilities list opens each provider page and confirms back to check-in', async () => {
  const goBack = jest.fn();
  const navigate = jest.fn();
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <UtilitiesScreen navigation={{ goBack, navigate }} route={{ params: { residenceId: 'obsidian' } }} />,
    );
  });

  const json = JSON.stringify(tree.toJSON());
  for (const text of ['Essential Services', 'Electricity', 'Water Supply', 'Gas Connection', 'Sewer']) {
    expect(json).toContain(text);
  }

  const press = async (label: string) => {
    const node = tree.root.findAllByProps({ accessibilityLabel: label })[0];
    await ReactTestRenderer.act(() => {
      node.props.onPress();
    });
  };
  await press('Electricity');
  expect(navigate).toHaveBeenCalledWith({
    name: 'UtilityProviders',
    params: { residenceId: 'obsidian', utilityId: 'electricity' },
  });

  await press('Confirm Utilities');
  expect(navigate).toHaveBeenCalledWith({
    name: 'CheckIn',
    params: { residenceId: 'obsidian', utilitiesConfirmed: true },
    merge: true,
  });

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });

  // Providers page shows the chosen utility's providers and contacts
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <UtilityProvidersScreen
        navigation={{ goBack }}
        route={{ params: { residenceId: 'obsidian', utilityId: 'gas' } }}
      />,
    );
  });
  const providers = JSON.stringify(tree.toJSON());
  for (const text of ['Gas Connection', 'Heartland Natural Gas', 'Customer care', '24/7 emergency', 'Which provider is mine?']) {
    expect(providers).toContain(text);
  }
  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});

test('inspection areas open their own page and complete only when that page is finalized', async () => {
  const goBack = jest.fn();
  const navigate = jest.fn();
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <InspectionScreen navigation={{ goBack, navigate }} route={{ params: { residenceId: 'obsidian' } }} />,
    );
  });

  const json = JSON.stringify(tree.toJSON());
  for (const text of ['Move-In Inspection', 'Property Readiness', 'Living Room', 'Outside Areas']) {
    expect(json).toContain(text);
  }

  const finalize = () => tree.root.findAllByProps({ accessibilityLabel: 'Finalize Inspection' })[0];
  const completedBadges = () => JSON.stringify(tree.toJSON()).split('"Completed"').length - 1;
  expect(finalize().props.disabled).toBe(true);

  // Tapping an area opens its page and does not complete it
  const living = tree.root.findAllByProps({ accessibilityLabel: 'Living Room' })[0];
  await ReactTestRenderer.act(() => {
    living.props.onPress();
  });
  expect(navigate).toHaveBeenCalledWith({
    name: 'InspectionArea',
    params: { residenceId: 'obsidian', areaId: 'living' },
  });
  expect(completedBadges()).toBe(0);

  // Each area page saves its result; the list reads it
  for (const id of ['living', 'dining', 'kitchen', 'bedrooms', 'washrooms', 'common', 'outside']) {
    await ReactTestRenderer.act(() => {
      inspectionAreaStore.save('obsidian', id, { status: 'allGood', issues: [] });
    });
  }
  expect(completedBadges()).toBe(7);
  expect(finalize().props.disabled).toBe(false);

  await ReactTestRenderer.act(() => {
    finalize().props.onPress();
  });
  expect(navigate).toHaveBeenCalledWith({
    name: 'CheckIn',
    params: { residenceId: 'obsidian', inspectionSubmitted: true },
    merge: true,
  });

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});

test('inspection area page saves as all good, or with at least one issue', async () => {
  const goBack = jest.fn();
  const navigate = jest.fn();
  const render = (areaId: string) => (
    <InspectionAreaScreen
      navigation={{ goBack, navigate }}
      route={{ params: { residenceId: 'obsidian', areaId } }}
    />
  );
  let tree!: ReactTestRenderer.ReactTestRenderer;
  const byLabel = (label: string) => tree.root.findAllByProps({ accessibilityLabel: label })[0];
  const press = async (label: string) => {
    await ReactTestRenderer.act(() => {
      byLabel(label).props.onPress();
    });
  };

  // All good: Save enabled straight away
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(render('kitchen'));
  });
  expect(JSON.stringify(tree.toJSON())).toContain('How is the Kitchen?');
  expect(byLabel('Save Kitchen').props.disabled).toBe(true);
  await press('All good');
  expect(byLabel('Save Kitchen').props.disabled).toBe(false);
  await press('Save Kitchen');
  expect(inspectionAreaStore.isDone('obsidian', 'kitchen')).toBe(true);
  // Saving moves on to the next area that isn't done
  expect(navigate).toHaveBeenCalledWith({
    name: 'InspectionArea',
    params: { residenceId: 'obsidian', areaId: 'bedrooms' },
  });
  await ReactTestRenderer.act(() => {
    tree.unmount();
  });

  // Report issues: needs a category + description, then Save is enabled
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(render('living'));
  });
  await press('Report issues');
  expect(byLabel('Add Issue').props.disabled).toBe(true);
  await press('Choose a category');
  await press('Walls & Paint');
  await ReactTestRenderer.act(() => {
    byLabel('Description').props.onChangeText('Crack above the window');
  });
  expect(byLabel('Add Issue').props.disabled).toBe(false);
  expect(byLabel('Save Living Room').props.disabled).toBe(true);
  await press('Add Issue');

  const json = JSON.stringify(tree.toJSON());
  expect(json).toContain('Issues (');
  expect(json).toContain('Crack above the window');
  expect(json).toContain('Add another issue');
  expect(byLabel('Save Living Room').props.disabled).toBe(false);

  // Switching to All good asks first (app dialog), and keeps the issue until confirmed
  await press('All good');
  expect(JSON.stringify(tree.toJSON())).toContain('Mark as all good?');
  await press('Keep My Issues');
  expect(JSON.stringify(tree.toJSON())).toContain('Crack above the window');

  // Room stepper: jumping away with unsaved changes asks first
  const calls = navigate.mock.calls.length;
  await press('Kitchen, done');
  expect(JSON.stringify(tree.toJSON())).toContain('Leave without saving?');
  await press('Stay');
  expect(navigate.mock.calls.length).toBe(calls);

  await press('Save Living Room');
  expect(navigate).toHaveBeenLastCalledWith({
    name: 'InspectionArea',
    params: { residenceId: 'obsidian', areaId: 'dining' },
  });

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});

test('inspection room page opens the first area not done and finalizes once all are done', async () => {
  const goBack = jest.fn();
  const navigate = jest.fn();
  for (const id of ['living', 'dining', 'kitchen', 'bedrooms', 'washrooms', 'common']) {
    inspectionAreaStore.save('obsidian', id, { status: 'allGood', issues: [] });
  }
  let tree!: ReactTestRenderer.ReactTestRenderer;
  // Opened from Check-In without an area: lands on the first one not done
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <InspectionAreaScreen navigation={{ goBack, navigate }} route={{ params: { residenceId: 'obsidian' } }} />,
    );
  });
  const byLabel = (label: string) => tree.root.findAllByProps({ accessibilityLabel: label })[0];
  const json = () => JSON.stringify(tree.toJSON());
  expect(json()).toContain('How is the Outside Areas?');
  expect(json()).not.toContain('Finalize Inspection');

  await ReactTestRenderer.act(() => {
    byLabel('All good').props.onPress();
  });
  await ReactTestRenderer.act(() => {
    byLabel('Save Outside Areas').props.onPress();
  });
  expect(json()).toContain('All areas checked');

  await ReactTestRenderer.act(() => {
    byLabel('Finalize Inspection').props.onPress();
  });
  expect(navigate).toHaveBeenCalledWith({
    name: 'CheckIn',
    params: { residenceId: 'obsidian', inspectionSubmitted: true },
    merge: true,
  });

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});

test('inspection room page: switching tabs on a new area leaves quietly, a changed saved area asks', async () => {
  const goBack = jest.fn();
  const navigate = jest.fn();
  const render = (areaId: string) => (
    <InspectionAreaScreen
      navigation={{ goBack, navigate }}
      route={{ params: { residenceId: 'obsidian', areaId } }}
    />
  );
  let tree!: ReactTestRenderer.ReactTestRenderer;
  const byLabel = (label: string) => tree.root.findAllByProps({ accessibilityLabel: label })[0];
  const press = async (label: string) => {
    await ReactTestRenderer.act(() => {
      byLabel(label).props.onPress();
    });
  };
  const json = () => JSON.stringify(tree.toJSON());

  // New area: switch tabs, add nothing, leave -> no pop-up
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(render('dining'));
  });
  await press('All good');
  await press('Report issues');
  await press('Back to inspection');
  expect(goBack).toHaveBeenCalledTimes(1);
  expect(json()).not.toContain('Leave without saving?');
  await ReactTestRenderer.act(() => {
    tree.unmount();
  });

  // Saved area (All good) switched to Report issues with nothing added -> asks
  inspectionAreaStore.save('obsidian', 'living', { status: 'allGood', issues: [] });
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(render('living'));
  });
  await press('Report issues');
  await press('Back to inspection');
  expect(goBack).toHaveBeenCalledTimes(1);
  expect(json()).toContain("Living Room isn't finished");

  // Asks again every time
  await press('Stay');
  await press('Back to inspection');
  expect(json()).toContain("Living Room isn't finished");

  // Leaving and marking it not done clears the tick
  jest.useFakeTimers();
  await press('Leave & Mark Not Done');
  await ReactTestRenderer.act(() => {
    jest.runAllTimers();
  });
  jest.useRealTimers();
  expect(goBack).toHaveBeenCalledTimes(2);
  expect(inspectionAreaStore.isDone('obsidian', 'living')).toBe(false);

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});
