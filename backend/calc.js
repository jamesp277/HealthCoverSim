const hospitalPrices = { None: 0, Basic: 90, Bronze: 120, Silver: 160, Gold: 220 };
const extrasPrices = { None: 0, Basic: 25, Standard: 45, Premium: 70 };
const familyFee = 30;

const statement =
  'Lifetime Health Cover loading applies only to hospital cover. It does not apply to extras cover.';

function round(n) {
  return Math.round(n * 100) / 100;
}

function money(n) {
  return '$' + n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getLoading(age, history, hospital) {
  if (hospital === 'None' || history !== 'No' || age <= 30) return 0;
  return (age - 30) * 2;
}

export function calculateQuote(q) {
  const hospitalBase = hospitalPrices[q.hospital_cover];
  const extrasBase = extrasPrices[q.extras_cover];
  if (hospitalBase === undefined || extrasBase === undefined) {
    throw new Error('Unknown hospital or extras cover level');
  }

  const people = [{ name: 'Applicant 1', age: q.applicant1_age, history: q.applicant1_cover_history }];
  if (q.cover_type !== 'Single') {
    if (q.applicant2_age == null || q.applicant2_cover_history == null) {
      throw new Error('Applicant 2 age and cover history are required for ' + q.cover_type + ' cover');
    }
    people.push({ name: 'Applicant 2', age: q.applicant2_age, history: q.applicant2_cover_history });
  }
  const adults = people.length;

  const warnings = [];
  const applicants = people.map((p) => {
    const loading = getLoading(p.age, p.history, q.hospital_cover);
    if (p.history === 'Not sure') {
      warnings.push(
        `${p.name}: Cover history is unknown — LHC loading has not been applied. This quote may be inaccurate.`
      );
    }
    return {
      name: p.name,
      age: p.age,
      history: p.history,
      loading,
      hospitalPrice: round(hospitalBase * (1 + loading / 100)),
    };
  });

  const hospitalTotal = round(applicants.reduce((sum, a) => sum + a.hospitalPrice, 0));
  const extrasTotal = round(extrasBase * adults);
  const fee = q.cover_type === 'Family' ? familyFee : 0;
  const monthly = round(hospitalTotal + extrasTotal + fee);
  const yearlyBefore = round(monthly * 12);

  const yearly = q.payment_frequency === 'Yearly';
  const discountPercent = yearly ? q.annual_discount : 0;
  const discountAmount = round((yearlyBefore * discountPercent) / 100);
  const yearlyAfter = yearly ? round(yearlyBefore - discountAmount) : null;

  const explanation = [];
  explanation.push(
    `This is a ${q.cover_type} quote for ${adults} ${adults === 1 ? 'adult' : 'adults'}. ` +
      'Hospital and extras are worked out separately and then added together.'
  );
  if (q.hospital_cover === 'None') {
    explanation.push('No hospital cover was chosen, so the hospital premium is $0.00.');
  } else {
    explanation.push(
      `Hospital ${q.hospital_cover} costs ${money(hospitalBase)} per adult each month. ` +
        `Each applicant's own loading is added to their price, which gives a hospital total of ${money(hospitalTotal)}.`
    );
  }
  if (q.extras_cover === 'None') {
    explanation.push('No extras cover was chosen, so the extras premium is $0.00.');
  } else {
    explanation.push(
      `Extras ${q.extras_cover} costs ${money(extrasBase)} per adult each month, so ` +
        `${money(extrasBase)} x ${adults} = ${money(extrasTotal)}. No loading is applied to extras.`
    );
  }
  if (fee > 0) {
    explanation.push(`Family cover adds a flat ${money(fee)} per month to cover children.`);
  }
  explanation.push(
    `The monthly premium is ${money(monthly)}. Multiplied by 12, the yearly premium before any discount is ${money(yearlyBefore)}.`
  );
  if (yearly) {
    explanation.push(
      `You chose to pay yearly, so a ${discountPercent}% discount is taken off. The yearly premium after the discount is ${money(yearlyAfter)}.`
    );
  } else {
    explanation.push('You chose to pay monthly, so the annual discount does not apply.');
  }

  return {
    coverType: q.cover_type,
    frequency: q.payment_frequency,
    applicants,
    hospitalTier: q.hospital_cover,
    hospitalTotal,
    extrasTier: q.extras_cover,
    extrasBase,
    extrasAdults: adults,
    extrasTotal,
    familyFee: fee,
    monthly,
    yearlyBefore,
    discountPercent,
    discountAmount,
    yearlyAfter,
    finalAmount: yearly ? yearlyAfter : monthly,
    warnings,
    statement,
    explanation,
  };
}
