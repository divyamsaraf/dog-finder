import React from 'react';
import Select from 'react-select';
import './Filters.css';

interface OptionType {
  value: string;
  label: string;
}

export interface FiltersProps {
  breeds: string[];
  selectedBreeds: string[];
  onSelectedBreedsChange: React.Dispatch<React.SetStateAction<string[]>>;
  zipCodes: string[];
  onZipChange: React.Dispatch<React.SetStateAction<string[]>>;
  ageRange: [number, number];
  onAgeChange: React.Dispatch<React.SetStateAction<[number, number]>>;
}

const Filters: React.FC<FiltersProps> = ({
  breeds,
  selectedBreeds,
  onSelectedBreedsChange,
  zipCodes,
  onZipChange,
  ageRange,
  onAgeChange,
}) => {
  const handleBreedChange = (selectedOptions: readonly OptionType[]) => {
    onSelectedBreedsChange(selectedOptions.map(option => option.value));
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const codes = e.target.value.split(',').map(code => code.trim());
    onZipChange(codes);
  };

  const handleAgeMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value) || 0;
    onAgeChange([newMin, ageRange[1]]);
  };

  const handleAgeMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value) || 0;
    onAgeChange([ageRange[0], newMax]);
  };

  return (
    <div className="filters-container">
      <div className="filter-group" style={{ marginBottom: 20 }}>
        <label htmlFor="breeds" style={{ fontWeight: 'bold', marginBottom: 8, display: 'block' }}>Breeds</label>
        <div style={{ width: '100%', minWidth: 250 }}>
          <Select
            inputId="breeds"
            isMulti
            options={breeds.map(breed => ({ value: breed, label: breed }))}
            value={selectedBreeds.map(breed => ({ value: breed, label: breed }))}
            onChange={(options) => handleBreedChange(options as readonly OptionType[])}
            placeholder="Search and select breeds..."
            classNamePrefix="react-select"
            styles={{
              menu: (provided) => ({ ...provided, zIndex: 1000 }),
              control: (provided) => ({ ...provided, width: '100%' }),
            }}
          />
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor="zip">Zip Codes (comma-separated)</label>
        <input
          id="zip"
          type="text"
          value={zipCodes.join(', ')}
          onChange={handleZipChange}
          placeholder="e.g., 12345, 90210"
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label>Age Range</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            min="0"
            value={ageRange[0]}
            onChange={handleAgeMinChange}
            placeholder="Min Age"
            className="filter-input"
          />
          <input
            type="number"
            min="0"
            value={ageRange[1]}
            onChange={handleAgeMaxChange}
            placeholder="Max Age"
            className="filter-input"
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
