import {
  TrafficDataRecord,
  TrafficMetrics,
} from '../api/traffic-service/interface';
import { useState } from 'react';

interface TrafficDataRowProps {
  record: TrafficDataRecord;
  isEditing: boolean;
  isUpdating: boolean;
  onEdit: (record: TrafficDataRecord) => void;
  onCancel: () => void;
  onUpdate: (record: TrafficDataRecord) => void;
}

const metricKeys: Array<keyof TrafficMetrics> = [
  'vehicleCount',
  'totalTravelDistanceKms',
  'totalTravelTimeHours',
];

const isMetricValid = (value: number) => Number.isInteger(value) && value >= 1;

const TrafficDataRow = ({
  record,
  isEditing,
  isUpdating,
  onEdit,
  onCancel,
  onUpdate,
}: TrafficDataRowProps) => {
  const [draft, setDraft] = useState<TrafficDataRecord | null>(null);

  const currentRecord = draft ?? record;
  const hasValidDraft = metricKeys.every((key) =>
    isMetricValid(currentRecord[key]),
  );

  return (
    <tr>
      <td>{record.date}</td>
      {metricKeys.map((key) => (
        <td key={key}>
          {isEditing ? (
            <input
              className="metric-input"
              type="number"
              min={1}
              step={1}
              required={true}
              value={
                Number.isNaN(currentRecord[key]) ? '' : currentRecord[key]
              }
              onChange={(event) =>
                setDraft({
                  ...currentRecord,
                  [key]: event.target.valueAsNumber,
                })
              }
            />
          ) : (
            record[key].toLocaleString()
          )}
        </td>
      ))}
      <td>
        <div className="row-actions">
          {isEditing ? (
            <>
              <button
                className="action-button action-button--primary"
                type="button"
                disabled={isUpdating || !hasValidDraft}
                onClick={() => onUpdate(currentRecord)}
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
              disabled={isUpdating}
              onClick={() => {
                setDraft(record);
                onEdit(record);
              }}
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
