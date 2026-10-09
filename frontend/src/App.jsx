import { Link, Route, Routes } from 'react-router-dom';
import QuoteList from './pages/QuoteList.jsx';
import NewQuote from './pages/NewQuote.jsx';
import QuoteDetail from './pages/QuoteDetail.jsx';
import EditQuote from './pages/EditQuote.jsx';

export default function App() {
  return (
    <>
      <header>
        <Link to="/" className="brand">HealthCoverSim</Link>
        <Link to="/">Quotes</Link>
        <Link to="/quotes/new">New Quote</Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<QuoteList />} />
          <Route path="/quotes/new" element={<NewQuote />} />
          <Route path="/quotes/:id" element={<QuoteDetail />} />
          <Route path="/quotes/:id/edit" element={<EditQuote />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
