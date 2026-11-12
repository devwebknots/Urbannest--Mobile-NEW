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
  for (const text of [
    'Rental & Financial History',
    'Rental History',
    'How did you hold this residence?',
    'Add Residence',
    'Employment & Income',
    'Save & Continue',
  ]) {
    expect(now).toContain(text);
  }

  // Step 2: an empty page can't move on
  const press = async (label: string) =>
    ReactTestRenderer.act(() => {
      tree.root.findByProps({ accessibilityLabel: label }).props.onPress();
    });
  const type = async (label: string, text: string) =>
    ReactTestRenderer.act(() => {
      tree.root.findByProps({ accessibilityLabel: label }).props.onChangeText(text);
    });
  await press('Save & Continue');
  expect(JSON.stringify(tree.toJSON())).toContain('Required');

  // Fill a residence (pickers via their sheets) and add it
  await press('How did you hold this residence');
  await press('Rented');
  await type('Residence street address 1', '12 Oak Street');
  await type('Residence city', 'Austin');
  await press('Residence state');
  await press('TX');
  await type('Residence ZIP code', '73301');
  await type('Residence start date', '01022021');
  await type('Monthly rent', '1850');
  await press('Add Residence');
  now = JSON.stringify(tree.toJSON());
  expect(now).toContain('12 Oak Street');
  expect(now).toContain('$1,850/mo');
  expect(now).toContain('Add Another Residence');

  // Employment: a student only needs status + income
  await press('Employment status');
  await press('Student');
  await type('Annual income', '12000');
  await press('Save & Continue');
  now = JSON.stringify(tree.toJSON());
  for (const text of [
    'Property Requirements & Documents',
    'Verification & Documents',
    'Government-Issued Identification',
    'ID_Proof.pdf',
    '2 of 4 uploaded',
    'Lifestyle & Logistics',
    'Dog – Labrador',
    'Toyota Camry',
    'Storage Allocation',
    'Continue to Review',
  ]) {
    expect(now).toContain(text);
  }

  // Answering No to pets hides the pet list
  await press('Pets: No');
  expect(JSON.stringify(tree.toJSON())).not.toContain('Dog – Labrador');

  // Required documents are uploaded, so step 3 moves on to step 4
  await press('Continue to Review');
  now = JSON.stringify(tree.toJSON());
  for (const text of [
    'Review, Consent & Submit',
    'Full Legal Name',
    'John Adam Doe',
    'Background Screening',
    'Net Due Today',
    'Truth & Accuracy Attestation',
    'Submit Official Application',
  ]) {
    expect(now).toContain(text);
  }

  // Submitting needs the required consents + a matching signature
  await press('Submit Official Application');
  expect(JSON.stringify(tree.toJSON())).toContain('Almost there');

  await press('Previous step');
  expect(JSON.stringify(tree.toJSON())).toContain('Continue to Review');

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});
