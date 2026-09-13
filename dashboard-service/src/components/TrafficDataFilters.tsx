import {
  TrafficDataFilterOptions,
  TrafficDataFilters,
} from '../api/traffic-service/interface';
import { MONTHS } from '../constants';
import { capitalize } from '../utils';

interface TrafficDataFiltersProps {
  filters: TrafficDataFilters;
  options: TrafficDataFilterOptions;
  isLoading: boolean;
  onChange: (filters: TrafficDataFilters) => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 7 }, (_, index) => currentYear - index);

const TrafficDataFiltersComponent = ({
  filters,
  options,
  isLoading,
  onChange,
}: TrafficDataFiltersProps) => (
  <section className="period-controls">
    <h2>Find traffic records:</h2>

    <div className="filters-form">
      <select
        className="filter-wide"
        value={filters.countryCode}
        disabled={isLoading}
        onChange={(event) => {
          onChange({ ...filters, countryCode: event.target.value });
          event.currentTarget.blur();
        }}
      >
        {options.countries.map(({ countryCode, countryName }) => (
          <option key={countryCode} value={countryCode}>
            {countryName}
          </option>
        ))}
      </select>

      <select
        value={filters.vehicleType}
        disabled={isLoading}
        onChange={(event) => {
          onChange({ ...filters, vehicleType: event.target.value });
          event.currentTarget.blur();
        }}
      >
        {options.vehicleTypes.map((vehicleType) => (
          <option key={vehicleType} value={vehicleType}>
            {capitalize(vehicleType)}
          </option>
        ))}
      </select>

      <select
        value={filters.month}
        onChange={(event) => {
          onChange({ ...filters, month: Number(event.target.value) });
          event.currentTarget.blur();
        }}
      >
        {MONTHS.map((month, index) => (
          <option key={month} value={index + 1}>
            {month}
          </option>
        ))}
      </select>

      <select
        value={filters.year}
        onChange={(event) => {
          onChange({ ...filters, year: Number(event.target.value) });
          event.currentTarget.blur();
        }}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  </section>
);

export default TrafficDataFiltersComponent;
