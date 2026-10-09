const coverTypes = ['Single', 'Couple', 'Family'];
const histories = ['Yes', 'No', 'Not sure'];
const hospitalLevels = ['None', 'Basic', 'Bronze', 'Silver', 'Gold'];
const extrasLevels = ['None', 'Basic', 'Standard', 'Premium'];
const frequencies = ['Monthly', 'Yearly'];

function isBlank(value) {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

function toAge(value) {
  const n = typeof value === 'string' ? Number(value) : value;
  if (Number.isInteger(n) && n >= 18 && n <= 100) return n;
  return null;
}

export function validateQuote(body) {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { errors: { body: 'Request body must be a JSON object' }, data: null };
  }

  const errors = {};

  const name = typeof body.customer_name === 'string' ? body.customer_name.trim() : '';
  if (name === '') errors.customer_name = 'Customer name is required';
  else if (name.length > 100) errors.customer_name = 'Customer name must be 100 characters or less';

  if (!coverTypes.includes(body.cover_type)) errors.cover_type = 'Cover type must be Single, Couple or Family';
  if (!hospitalLevels.includes(body.hospital_cover)) errors.hospital_cover = 'Choose a hospital cover level';
  if (!extrasLevels.includes(body.extras_cover)) errors.extras_cover = 'Choose an extras cover level';
  if (!frequencies.includes(body.payment_frequency)) errors.payment_frequency = 'Payment must be Monthly or Yearly';

  const age1 = toAge(body.applicant1_age);
  if (age1 === null) errors.applicant1_age = 'Applicant 1 age must be a whole number from 18 to 100';
  if (!histories.includes(body.applicant1_cover_history)) {
    errors.applicant1_cover_history = 'Choose Applicant 1 cover history';
  }

  let age2 = null;
  let history2 = null;
  if (body.cover_type === 'Couple' || body.cover_type === 'Family') {
    age2 = toAge(body.applicant2_age);
    if (age2 === null) errors.applicant2_age = 'Applicant 2 age must be a whole number from 18 to 100';
    if (histories.includes(body.applicant2_cover_history)) history2 = body.applicant2_cover_history;
    else errors.applicant2_cover_history = 'Choose Applicant 2 cover history';
  }

  let discount = 0;
  if (!isBlank(body.annual_discount)) {
    const d = typeof body.annual_discount === 'boolean' ? NaN : Number(body.annual_discount);
    if (Number.isNaN(d) || d < 0 || d > 10) errors.annual_discount = 'Annual discount must be between 0 and 10';
    else discount = d;
  }

  let notes = null;
  if (!isBlank(body.notes)) {
    if (typeof body.notes !== 'string' || body.notes.length > 1000) {
      errors.notes = 'Notes must be text of 1000 characters or less';
    } else {
      notes = body.notes.trim();
    }
  }

  if (Object.keys(errors).length > 0) return { errors, data: null };

  return {
    errors,
    data: {
      customer_name: name,
      cover_type: body.cover_type,
      applicant1_age: age1,
      applicant1_cover_history: body.applicant1_cover_history,
      applicant2_age: age2,
      applicant2_cover_history: history2,
      hospital_cover: body.hospital_cover,
      extras_cover: body.extras_cover,
      payment_frequency: body.payment_frequency,
      annual_discount: discount,
      notes,
    },
  };
}
