import {
  TrafficDataRecord,
  TrafficMetrics,
} from '../api/traffic-service/interface';

interface TrafficDataRowProps {
  record: TrafficDataRecord;
  draft: TrafficDataRecord | null;
  isUpdating: boolean;
  onEdit: (record: TrafficDataRecord) => void;
  onCancel: () => void;
  onMetricChange: (metric: keyof TrafficMetrics, value: number) => void;
  onUpdate: () => void;
}

const metricKeys: Array<keyof TrafficMetrics> = [
  'vehicleCount',
  'totalTravelDistanceKms',
  'totalTravelTimeHours',
];

const isMetricValid = (value: number) => Number.isInteger(value) && value >= 1;

const TrafficDataRow = ({
  record,
  draft,
  isUpdating,
  onEdit,
  onCancel,
  onMetricChange,
  onUpdate,
}: TrafficDataRowProps) => {
  const hasValidDraft =
    draft !== null && metricKeys.every((key) => isMetricValid(draft[key]));

  return (
    <tr>
      <td>{record.date}</td>
      {metricKeys.map((key) => (
        <td key={key}>
          {draft ? (
            <input
              className="metric-input"
              type="number"
              min="1"
              step="1"
              required={true}
              value={Number.isNaN(draft[key]) ? '' : draft[key]}
              onChange={(event) => {
                onMetricChange(key, event.target.valueAsNumber);
              }}
            />
          ) : (
            record[key].toLocaleString()
          )}
        </td>
      ))}
      <td>
        <div className="row-actions">
          {draft ? (
            <>
              <button
                className="action-button action-button--primary"
                type="button"
                disabled={isUpdating || !hasValidDraft}
                onClick={onUpdate}
              >
                {isUpdating ? 'Updating…' : 'Update'}
              </button>
              <button
                className="action-button"
                type="button"
                disabled={isUpdating}
                onClick={onCancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="action-button"
              type="button"
              onClick={() => onEdit(record)}
            >
              Edit
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TrafficDataRow;
