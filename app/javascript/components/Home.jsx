import React, { useEffect, useState } from "react";

export default () => {
  // List of fetched companies
  const [companies, setCompanies] = useState([]);
  const [pagy, setPagy] = useState({});
  const [page, setPage] = useState(1);

  // Table filters
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [minEmployee, setMinEmployee] = useState("");
  const [minimumDealAmount, setMinimumDealAmount] = useState("");

  // Fetch companies from API
  useEffect(() => {
    const url = new URL("http://localhost:3000/api/v1/companies");

    const params = { page, companyName, industry, minEmployee, minimumDealAmount };
    Object.keys(params).forEach(key => {
      if (params[key]) {
        url.searchParams.append(key, params[key]);
      }
    });
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
          setCompanies(res.data)
          setPagy(res.pagy)
        }
      )
  }, [page, companyName, industry, minEmployee, minimumDealAmount])

  return (
    <div className="vw-100 primary-color d-flex align-items-center justify-content-center">
      <div className="jumbotron jumbotron-fluid bg-transparent">
        <div className="container secondary-color">
          <h1 className="display-4">Companies</h1>

          <label htmlFor="company-name">Company Name</label>
          <div className="input-group mb-3">
            <input type="text" className="form-control" id="company-name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
          </div>

          <label htmlFor="industry">Industry</label>
          <div className="input-group mb-3">
            <input type="text" className="form-control" id="industry" value={industry} onChange={e => setIndustry(e.target.value)} />
          </div>

          <label htmlFor="min-employee">Minimum Employee Count</label>
          <div className="input-group mb-3">
            <input type="text" className="form-control" id="min-employee" value={minEmployee} onChange={e => setMinEmployee(e.target.value)} />
          </div>

          <label htmlFor="min-amount">Minimum Deal Amount</label>
          <div className="input-group mb-3">
            <input type="text" className="form-control" id="min-amount" value={minimumDealAmount} onChange={e => setMinimumDealAmount(e.target.value)} />
          </div>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Industry</th>
                <th scope="col">Employee Count</th>
                <th scope="col">Total Deal Amount</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td>{company.name}</td>
                  <td>{company.industry}</td>
                  <td>{company.employee_count}</td>
                  <td>{company.deals.reduce((sum, deal) => sum + deal.amount, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="input-group mb-4">
            {Array.from({ length: pagy.pages }, (_, i) => i + 1).map(num => (
              <button key={num} onClick={() => setPage(num)}>{num}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
};
