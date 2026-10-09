export const options = {
  coverTypes: ['Single', 'Couple', 'Family'],
  histories: ['Yes', 'No', 'Not sure'],
  hospital: ['None', 'Basic', 'Bronze', 'Silver', 'Gold'],
  extras: ['None', 'Basic', 'Standard', 'Premium'],
  frequencies: ['Monthly', 'Yearly'],
};

function ageError(value, label) {
  const v = String(value).trim();
  if (v === '') return label + ' age is required';
  if (!/^\d+$/.test(v) || Number(v) < 18 || Number(v) > 100) {
    return label + ' age must be a whole number from 18 to 100';
  }
  return '';
}

export function validateForm(form) {
  const errors = {};

  if (form.customer_name.trim() === '') errors.customer_name = 'Customer name is required';
  if (form.cover_type === '') errors.cover_type = 'Choose a cover type';
  if (form.hospital_cover === '') errors.hospital_cover = 'Choose a hospital cover level';
  if (form.extras_cover === '') errors.extras_cover = 'Choose an extras cover level';

  const age1 = ageError(form.applicant1_age, 'Applicant 1');
  if (age1) errors.applicant1_age = age1;
  if (form.applicant1_cover_history === '') errors.applicant1_cover_history = 'Choose a cover history';

  if (form.cover_type === 'Couple' || form.cover_type === 'Family') {
    const age2 = ageError(form.applicant2_age, 'Applicant 2');
    if (age2) errors.applicant2_age = age2;
    if (form.applicant2_cover_history === '') errors.applicant2_cover_history = 'Choose a cover history';
  }

  if (form.payment_frequency === 'Yearly' && form.annual_discount.trim() !== '') {
    const d = Number(form.annual_discount);
    if (Number.isNaN(d) || d < 0 || d > 10) errors.annual_discount = 'Discount must be between 0 and 10';
  }

  return errors;
}
