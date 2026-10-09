import { useNavigate } from 'react-router-dom';
import QuoteForm, { emptyForm } from '../components/QuoteForm.jsx';
import { api } from '../api.js';

export default function NewQuote() {
  const navigate = useNavigate();

  async function save(data) {
    const quote = await api.create(data);
    navigate('/quotes/' + quote.id);
  }

  return (
    <div className="narrow">
      <h1>New Quote</h1>
      <QuoteForm initial={emptyForm} buttonText="Calculate quote" onSubmit={save} onCancel={() => navigate('/')} />
    </div>
  );
}
