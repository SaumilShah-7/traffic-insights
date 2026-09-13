import { MONTHS } from '../constants';

interface DashboardFiltersProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 7 }, (_, index) => currentYear - index);

const DashboardFilters = ({
  month,
  year,
  onMonthChange,
  onYearChange,
}: DashboardFiltersProps) => (
  <section className="period-controls">
    <h2>Choose a reporting period:</h2>

    <div className="filters-form">
      <select
        value={month}
        onChange={(event) => {
          onMonthChange(Number(event.target.value));
          event.currentTarget.blur();
        }}
      >
        {MONTHS.map((name, index) => (
          <option key={name} value={index + 1}>
            {name}
          </option>
        ))}
      </select>

      <select
        value={year}
        onChange={(event) => {
          onYearChange(Number(event.target.value));
          event.currentTarget.blur();
        }}
      >
        {years.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  </section>
);

export default DashboardFilters;
