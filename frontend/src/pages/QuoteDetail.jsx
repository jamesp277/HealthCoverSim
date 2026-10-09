import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Breakdown from '../components/Breakdown.jsx';
import { api } from '../api.js';

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(id).then(setQuote).catch((err) => setError(err.message));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Delete this quote?')) return;
    try {
      await api.remove(id);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  if (!quote) return error ? <p className="message">{error}</p> : <p>Loading...</p>;

  return (
    <div>
      <div className="top">
        <h1>{quote.customer_name}</h1>
        <div className="buttons">
          <Link className="button" to={'/quotes/' + id + '/edit'}>Edit</Link>
          <button className="danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>
      {error && <p className="message">{error}</p>}
      <p>
        {quote.cover_type} cover, hospital {quote.hospital_cover}, extras {quote.extras_cover}, paying{' '}
        {quote.payment_frequency.toLowerCase()}.
      </p>
      {quote.notes && <p>Notes: {quote.notes}</p>}
      {quote.calculation ? (
        <Breakdown calc={quote.calculation} />
      ) : (
        <p className="message">Cannot calculate this quote: {quote.calculationError}</p>
      )}
    </div>
  );
}
