import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuoteForm, { quoteToForm } from '../components/QuoteForm.jsx';
import { api } from '../api.js';

export default function EditQuote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(id).then(setQuote).catch((err) => setError(err.message));
  }, [id]);

  async function save(data) {
    await api.update(id, data);
    navigate('/quotes/' + id);
  }

  if (error) return <p className="message">{error}</p>;
  if (!quote) return <p>Loading...</p>;

  return (
    <div className="narrow">
      <h1>Edit Quote</h1>
      <QuoteForm initial={quoteToForm(quote)} buttonText="Save changes" onSubmit={save} onCancel={() => navigate('/quotes/' + id)} />
    </div>
  );
}
