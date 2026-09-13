import {
  TrafficDataRecord,
  TrafficMetrics,
} from '../api/traffic-service/interface';
import TrafficDataRow from './TrafficDataRow';

interface TrafficDataTableProps {
  records: TrafficDataRecord[];
  draft: TrafficDataRecord | null;
  editingDate: string | null;
  isUpdating: boolean;
  isLoading: boolean;
  fetchError: string | null;
  updateError: string | null;
  onEdit: (record: TrafficDataRecord) => void;
  onCancel: () => void;
  onMetricChange: (metric: keyof TrafficMetrics, value: number) => void;
  onUpdate: () => void;
}

const TrafficDataTable = ({
  records,
  draft,
  editingDate,
  isUpdating,
  isLoading,
  fetchError,
  updateError,
  onEdit,
  onCancel,
  onMetricChange,
  onUpdate,
}: TrafficDataTableProps) => (
  <section className="chart-card data-table-card">
    <div className="data-table-heading">
      <h2>Traffic data</h2>
      {updateError && <p role="alert">{updateError}</p>}
    </div>

    {isLoading ? (
      <div className="data-state" role="status">
        Loading records…
      </div>
    ) : fetchError ? (
      <div className="data-table-state chart-state--error" role="alert">
        <div className="chart-state-icon">!</div>
        <h3>Unexpected error</h3>
      </div>
    ) : records.length === 0 ? (
      <div className="data-table-state" role="status">
        <div className="chart-state-icon">—</div>
        <h3>No data available</h3>
        <p>Try choosing different filters</p>
      </div>
    ) : (
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Vehicle count</th>
              <th>Travel distance (km)</th>
              <th>Travel time (hours)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <TrafficDataRow
                key={record.date}
                record={record}
                draft={editingDate === record.date ? draft : null}
                isUpdating={isUpdating && editingDate === record.date}
                onEdit={onEdit}
                onCancel={onCancel}
                onMetricChange={onMetricChange}
                onUpdate={onUpdate}
              />
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

export default TrafficDataTable;
