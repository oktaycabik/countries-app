import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Country } from './Country';
import { GET_COUNTRIES } from './queries';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import './App.css';


const COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

const App: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');

  const [loadCountries, { loading, data, error }] = useLazyQuery(GET_COUNTRIES);

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  useEffect(() => {
    if (data && data.countries) {
      setCountries(data.countries);
      if (data.countries.length >= 10) {
        setSelectedCountry(data.countries[9].name);
      } else if (data.countries.length > 0) {
        setSelectedCountry(data.countries[data.countries.length - 1].name);
      }
    }
  }, [data]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilter(value);
  };

  const handleCountryClick = (name: string) => {
    setSelectedCountry(name === selectedCountry ? null : name);
  };

  const filteredCountries = countries.filter(country =>
    country.code?.toLowerCase().includes(filter.toLowerCase()) ||
    country.name?.toLowerCase().includes(filter.toLowerCase()) ||
    country.native?.toLowerCase().includes(filter.toLowerCase()) ||
    country.phone?.toLowerCase().includes(filter.toLowerCase()) ||
    country.currency?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container">
      <div className="input-container">
        <input
          type="text"
          placeholder="Search..."
          value={filter}
          onChange={handleFilterChange}
        />
      </div>
      {loading ? ( 
        <p className='loading'> <FontAwesomeIcon icon={faSpinner} spin />  Loading...</p> 
      ) : error ? (
        <p className='error'> <FontAwesomeIcon icon={faExclamationCircle} />  There was an error while loading the data. Please try again later.</p>
      ) : (
        <ul>
          {filteredCountries.map((country, index) => (
            <li
              key={country.name}
              className={selectedCountry === country.name ? 'selected' : ''}
              onClick={() => handleCountryClick(country.name ?? '')}
              style={{
                backgroundColor:
                  selectedCountry === country.name
                    ? COLORS[index % COLORS.length]
                    : ''
              }}
            >
              <div>
                <span className="code">{country.code}</span>
                <span className="name">{country.name}</span>
                <span className="phone">{country.phone}</span>
              </div>
              <span className="currency">{country.currency}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
