import { TrafficDataRecord } from '../api/traffic-service/interface';
import TrafficDataRow from './TrafficDataRow';

interface TrafficDataTableProps {
  records: TrafficDataRecord[];
  editingDate: string | null;
  isUpdating: boolean;
  isLoading: boolean;
  hasFetchError: boolean;
  updateError: string | null;
  onEdit: (record: TrafficDataRecord) => void;
  onCancel: () => void;
  onUpdate: (record: TrafficDataRecord) => void;
}

const TrafficDataTable = ({
  records,
  editingDate,
  isUpdating,
  isLoading,
  hasFetchError,
  updateError,
  onEdit,
  onCancel,
  onUpdate,
}: TrafficDataTableProps) => (
  <section className="chart-card data-table-card">
    <div className="data-table-heading">
      <h2>Traffic data</h2>
      {updateError && <p>{updateError}</p>}
    </div>

    {isLoading ? (
      <div className="data-state">
        Loading records…
      </div>
    ) : hasFetchError ? (
      <div className="data-table-state chart-state--error">
        <div className="chart-state-icon">!</div>
        <h3>Unexpected error</h3>
      </div>
    ) : records.length === 0 ? (
      <div className="data-table-state">
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
                isEditing={editingDate === record.date}
                isUpdating={isUpdating}
                onEdit={onEdit}
                onCancel={onCancel}
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
