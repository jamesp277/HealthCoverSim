import { money } from '../format.js';

export default function Breakdown({ calc }) {
  const yearly = calc.frequency === 'Yearly';

  return (
    <div>
      {calc.warnings.length > 0 && (
        <div className="warning">
          {calc.warnings.map((w) => (
            <p key={w}>{w}</p>
          ))}
        </div>
      )}

      <div className="card">
        <h2>Premium breakdown</h2>
        <table>
          <tbody>
            {calc.applicants.map((a) => (
              <tr key={a.name}>
                <td>Hospital ({calc.hospitalTier}) - {a.name}</td>
                <td className="num">{money(a.hospitalPrice)}</td>
              </tr>
            ))}
            <tr className="bold">
              <td>Hospital premium</td>
              <td className="num">{money(calc.hospitalTotal)}</td>
            </tr>
            <tr className="bold">
              <td>Extras premium ({calc.extrasTier}, {calc.extrasAdults} {calc.extrasAdults === 1 ? 'adult' : 'adults'})</td>
              <td className="num">{money(calc.extrasTotal)}</td>
            </tr>
            {calc.coverType === 'Family' && (
              <tr className="bold">
                <td>Family upgrade fee</td>
                <td className="num">{money(calc.familyFee)}</td>
              </tr>
            )}
            <tr className="total">
              <td>Monthly premium</td>
              <td className="num">{money(calc.monthly)}</td>
            </tr>
            <tr>
              <td>Yearly premium before discount (monthly x 12)</td>
              <td className="num">{money(calc.yearlyBefore)}</td>
            </tr>
            {yearly && (
              <>
                <tr>
                  <td>Annual discount ({calc.discountPercent}%)</td>
                  <td className="num">-{money(calc.discountAmount)}</td>
                </tr>
                <tr className="total">
                  <td>Yearly premium after discount</td>
                  <td className="num">{money(calc.yearlyAfter)}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
        <p className="final">
          Final total: {money(calc.finalAmount)} {yearly ? 'per year' : 'per month'}
        </p>
      </div>

      <div className="card">
        <h2>Lifetime Health Cover loading</h2>
        <table>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Age</th>
              <th>Cover history</th>
              <th className="num">Loading</th>
            </tr>
          </thead>
          <tbody>
            {calc.applicants.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.age}</td>
                <td>{a.history}</td>
                <td className="num">{a.loading}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>{calc.statement}</p>
      </div>

      <div className="card">
        <h2>How this quote was calculated</h2>
        {calc.explanation.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}
