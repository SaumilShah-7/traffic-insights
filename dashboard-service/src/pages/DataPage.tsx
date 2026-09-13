import { useEffect, useState } from 'react';
import {
  getTrafficData,
  getTrafficDataFilterOptions,
  updateTrafficData,
} from '../api/traffic-service';
import {
  TrafficDataFilterOptions,
  TrafficDataFilters,
  TrafficDataRecord,
  TrafficMetrics,
} from '../api/traffic-service/interface';
import TrafficDataFiltersComponent from '../components/TrafficDataFilters';
import TrafficDataTable from '../components/TrafficDataTable';

const today = new Date();
const initialFilters: TrafficDataFilters = {
  countryCode: 'US',
  vehicleType: 'car',
  year: today.getFullYear(),
  month: today.getMonth() + 1,
};
const initialOptions: TrafficDataFilterOptions = {
  countries: [],
  vehicleTypes: [],
};

const DataPage = () => {
  const [options, setOptions] = useState(initialOptions);
  const [filters, setFilters] = useState(initialFilters);
  const [records, setRecords] = useState<TrafficDataRecord[]>([]);
  const [draft, setDraft] = useState<TrafficDataRecord | null>(null);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadOptions = async () => {
      try {
        setOptions(await getTrafficDataFilterOptions(controller.signal));
      } catch {
        if (!controller.signal.aborted) {
          setFetchError('Unable to load filter options.');
        }
      } finally {
        if (!controller.signal.aborted) setIsLoadingFilters(false);
      }
    };

    void loadOptions();
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadRecords = async () => {
      setIsLoadingRecords(true);
      setFetchError(null);
      setUpdateError(null);
      setDraft(null);
      setEditingDate(null);

      try {
        setRecords(await getTrafficData(filters, controller.signal));
      } catch {
        if (controller.signal.aborted) return;
        setRecords([]);
        setFetchError('Unable to fetch traffic records.');
      } finally {
        if (!controller.signal.aborted) setIsLoadingRecords(false);
      }
    };

    void loadRecords();
    return () => {
      controller.abort();
    };
  }, [filters]);

  const handleEdit = (record: TrafficDataRecord) => {
    setDraft({ ...record });
    setEditingDate(record.date);
    setUpdateError(null);
  };

  const handleMetricChange = (metric: keyof TrafficMetrics, value: number) => {
    setDraft((current) =>
      current ? { ...current, [metric]: value } : current,
    );
  };

  const handleUpdate = async () => {
    if (!draft) return;

    setIsUpdating(true);
    setUpdateError(null);
    try {
      await updateTrafficData(draft);
      setRecords((current) =>
        current.map((record) => (record.date === draft.date ? draft : record)),
      );
      setDraft(null);
      setEditingDate(null);
    } catch {
      setUpdateError(`Unable to update the record for ${draft.date}.`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main>
      <TrafficDataFiltersComponent
        filters={filters}
        options={options}
        isLoading={isLoadingFilters}
        onChange={setFilters}
      />
      <TrafficDataTable
        records={records}
        draft={draft}
        editingDate={editingDate}
        isUpdating={isUpdating}
        isLoading={isLoadingRecords}
        fetchError={fetchError}
        updateError={updateError}
        onEdit={handleEdit}
        onCancel={() => {
          setDraft(null);
          setEditingDate(null);
          setUpdateError(null);
        }}
        onMetricChange={handleMetricChange}
        onUpdate={() => void handleUpdate()}
      />
    </main>
  );
};

export default DataPage;
