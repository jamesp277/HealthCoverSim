import { useState } from 'react';
import { options, validateForm } from '../validate.js';

export const emptyForm = {
  customer_name: '',
  cover_type: '',
  applicant1_age: '',
  applicant1_cover_history: '',
  applicant2_age: '',
  applicant2_cover_history: '',
  hospital_cover: '',
  extras_cover: '',
  payment_frequency: 'Monthly',
  annual_discount: '0',
  notes: '',
};

export function quoteToForm(q) {
  return {
    customer_name: q.customer_name,
    cover_type: q.cover_type,
    applicant1_age: String(q.applicant1_age),
    applicant1_cover_history: q.applicant1_cover_history,
    applicant2_age: q.applicant2_age === null ? '' : String(q.applicant2_age),
    applicant2_cover_history: q.applicant2_cover_history || '',
    hospital_cover: q.hospital_cover,
    extras_cover: q.extras_cover,
    payment_frequency: q.payment_frequency,
    annual_discount: String(q.annual_discount),
    notes: q.notes || '',
  };
}

function Field({ label, id, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

function Select({ id, value, onChange, list }) {
  return (
    <select id={id} value={value} onChange={onChange}>
      <option value="">Select</option>
      {list.map((item) => (
        <option key={item} value={item}>{item}</option>
      ))}
    </select>
  );
}

export default function QuoteForm({ initial, buttonText, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const change = (name) => (e) => setForm({ ...form, [name]: e.target.value });
  const hasTwo = form.cover_type === 'Couple' || form.cover_type === 'Family';
  const yearly = form.payment_frequency === 'Yearly';

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validateForm(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setMessage('Please fix the errors below.');
      return;
    }
    setMessage('');

    const data = {
      customer_name: form.customer_name.trim(),
      cover_type: form.cover_type,
      applicant1_age: Number(form.applicant1_age),
      applicant1_cover_history: form.applicant1_cover_history,
      applicant2_age: hasTwo ? Number(form.applicant2_age) : null,
      applicant2_cover_history: hasTwo ? form.applicant2_cover_history : null,
      hospital_cover: form.hospital_cover,
      extras_cover: form.extras_cover,
      payment_frequency: form.payment_frequency,
      annual_discount: yearly && form.annual_discount.trim() !== '' ? Number(form.annual_discount) : 0,
      notes: form.notes.trim() || null,
    };

    try {
      await onSubmit(data);
    } catch (err) {
      setErrors(err.errors || {});
      setMessage(err.message);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      {message && <p className="message">{message}</p>}

      <Field label="Customer name" id="customer_name" error={errors.customer_name}>
        <input id="customer_name" value={form.customer_name} onChange={change('customer_name')} />
      </Field>

      <Field label="Cover type" id="cover_type" error={errors.cover_type}>
        <Select id="cover_type" value={form.cover_type} onChange={change('cover_type')} list={options.coverTypes} />
      </Field>

      <Field label="Hospital cover" id="hospital_cover" error={errors.hospital_cover}>
        <Select id="hospital_cover" value={form.hospital_cover} onChange={change('hospital_cover')} list={options.hospital} />
      </Field>

      <Field label="Extras cover" id="extras_cover" error={errors.extras_cover}>
        <Select id="extras_cover" value={form.extras_cover} onChange={change('extras_cover')} list={options.extras} />
      </Field>

      <h3>Applicant 1</h3>
      <Field label="Age" id="applicant1_age" error={errors.applicant1_age}>
        <input id="applicant1_age" type="number" min="18" max="100" value={form.applicant1_age} onChange={change('applicant1_age')} />
      </Field>
      <Field label="Hospital cover history" id="applicant1_cover_history" error={errors.applicant1_cover_history}>
        <Select id="applicant1_cover_history" value={form.applicant1_cover_history} onChange={change('applicant1_cover_history')} list={options.histories} />
      </Field>

      {hasTwo && (
        <>
          <h3>Applicant 2</h3>
          <Field label="Age" id="applicant2_age" error={errors.applicant2_age}>
            <input id="applicant2_age" type="number" min="18" max="100" value={form.applicant2_age} onChange={change('applicant2_age')} />
          </Field>
          <Field label="Hospital cover history" id="applicant2_cover_history" error={errors.applicant2_cover_history}>
            <Select id="applicant2_cover_history" value={form.applicant2_cover_history} onChange={change('applicant2_cover_history')} list={options.histories} />
          </Field>
        </>
      )}

      <h3>Payment</h3>
      <Field label="Payment frequency" id="payment_frequency">
        <Select id="payment_frequency" value={form.payment_frequency} onChange={change('payment_frequency')} list={options.frequencies} />
      </Field>
      {yearly && (
        <Field label="Annual discount (0 to 10%)" id="annual_discount" error={errors.annual_discount}>
          <input id="annual_discount" type="number" min="0" max="10" step="0.5" value={form.annual_discount} onChange={change('annual_discount')} />
        </Field>
      )}

      <Field label="Notes (optional)" id="notes" error={errors.notes}>
        <textarea id="notes" rows="3" value={form.notes} onChange={change('notes')} />
      </Field>

      <div className="buttons">
        <button type="submit" className="primary">{buttonText}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
