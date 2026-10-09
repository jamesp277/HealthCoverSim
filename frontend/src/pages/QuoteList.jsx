import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { money } from '../format.js';

export default function QuoteList() {
  const [quotes, setQuotes] = useState(null);
  const [error, setError] = useState('');

  function load() {
    api.list().then(setQuotes).catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this quote?')) return;
    try {
      await api.remove(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="top">
        <h1>Quotes</h1>
        <Link className="button primary" to="/quotes/new">New Quote</Link>
      </div>

      {error && <p className="message">{error}</p>}
      {!quotes && !error && <p>Loading...</p>}
      {quotes && quotes.length === 0 && <p>No quotes yet. Create one to get started.</p>}

      {quotes && quotes.length > 0 && (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Cover</th>
                <th>Hospital</th>
                <th>Extras</th>
                <th>Payment</th>
                <th className="num">Monthly</th>
                <th className="num">Yearly</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id}>
                  <td><Link to={'/quotes/' + q.id}>{q.customer_name}</Link></td>
                  <td>{q.cover_type}</td>
                  <td>{q.hospital_cover}</td>
                  <td>{q.extras_cover}</td>
                  <td>{q.payment_frequency}</td>
                  {q.calculation ? (
                    <>
                      <td className="num">{money(q.calculation.monthly)}</td>
                      <td className="num">{money(q.calculation.yearlyAfter ?? q.calculation.yearlyBefore)}</td>
                    </>
                  ) : (
                    <td className="num" colSpan="2">Cannot calculate</td>
                  )}
                  <td className="links">
                    <Link to={'/quotes/' + q.id}>View</Link>
                    <Link to={'/quotes/' + q.id + '/edit'}>Edit</Link>
                    <button className="linkbutton" onClick={() => handleDelete(q.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
