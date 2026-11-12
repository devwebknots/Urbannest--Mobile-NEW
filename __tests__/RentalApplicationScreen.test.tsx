import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { RentalApplicationScreen } from '../src/features/application';

test('rental application step 1 shows the form, household and continue', async () => {
  const navigation = { goBack: jest.fn() };
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <RentalApplicationScreen navigation={navigation} route={{ params: { propertyId: 'r1' } }} />,
    );
  });

  const json = JSON.stringify(tree.toJSON());
  for (const text of [
    'Rental Application',
    'Step ',
    'Applicant & Household',
    'History',
    'Documents',
    'Submission',
    'Primary Applicant Identity',
    'Legal First Name',
    'Residential Address',
    'Move-In Details',
    'Co-Applicants',
    'Anju',
    'Invite Sent',
    'Dependents',
    'Dinkan',
    'Add a Dependent',
    'Continue to Stage 2',
  ]) {
    expect(json).toContain(text);
  }

  // Clearing a required field shows its error after Continue
  const first = tree.root.findByProps({ accessibilityLabel: 'Legal first name' });
  await ReactTestRenderer.act(() => {
    first.props.onChangeText('');
  });
  const cont = tree.root.findByProps({ accessibilityLabel: 'Continue to Stage 2' });
  await ReactTestRenderer.act(() => {
    cont.props.onPress();
  });
  expect(JSON.stringify(tree.toJSON())).toContain('Required');

  // Dates are typed as DD/MM/YYYY
  const dob = tree.root.findByProps({ accessibilityLabel: 'Date of birth' });
  await ReactTestRenderer.act(() => {
    dob.props.onChangeText('15081990');
  });
  expect(tree.root.findByProps({ accessibilityLabel: 'Date of birth' }).props.value).toBe(
    '15/08/1990',
  );

  // Once step 1 is complete, Continue moves to History; back returns
  await ReactTestRenderer.act(() => {
    tree.root.findByProps({ accessibilityLabel: 'Legal first name' }).props.onChangeText('John');
  });
  await ReactTestRenderer.act(() => {
    tree.root.findByProps({ accessibilityLabel: 'Continue to Stage 2' }).props.onPress();
  });
  let now = JSON.stringify(tree.toJSON());
  expect(now).toContain('This step is coming soon');
  expect(now).toContain('Continue to Stage 3');

  // Tapping step 4 jumps there; the button becomes Submit
  await ReactTestRenderer.act(() => {
    tree.root.findByProps({ accessibilityLabel: 'Step 4, Submission' }).props.onPress();
  });
  expect(JSON.stringify(tree.toJSON())).toContain('Submit Application');

  await ReactTestRenderer.act(() => {
    tree.root.findByProps({ accessibilityLabel: 'Previous step' }).props.onPress();
  });
  now = JSON.stringify(tree.toJSON());
  expect(now).toContain('Continue to Stage 4');

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});
