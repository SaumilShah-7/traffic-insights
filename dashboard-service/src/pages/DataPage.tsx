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
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [hasFetchError, setHasFetchError] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadOptions = async () => {
      try {
        setOptions(await getTrafficDataFilterOptions(controller.signal));
      } catch {
        if (!controller.signal.aborted) {
          setHasFetchError(true);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoadingOptions(false);
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
      setHasFetchError(false);
      setUpdateError(null);
      setEditingDate(null);

      try {
        setRecords(await getTrafficData(filters, controller.signal));
      } catch {
        if (controller.signal.aborted) return;
        setRecords([]);
        setHasFetchError(true);
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
    setEditingDate(record.date);
    setUpdateError(null);
  };

  const handleUpdate = async (updatedRecord: TrafficDataRecord) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      await updateTrafficData(updatedRecord);
      setRecords((current) =>
        current.map((record) =>
          record.date === updatedRecord.date ? updatedRecord : record,
        ),
      );
      setEditingDate(null);
    } catch {
      setUpdateError(`Unable to update the record for ${updatedRecord.date}.`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main>
      <TrafficDataFiltersComponent
        filters={filters}
        options={options}
        isLoading={isLoadingOptions}
        onChange={setFilters}
      />
      <TrafficDataTable
        records={records}
        editingDate={editingDate}
        isUpdating={isUpdating}
        isLoading={isLoadingRecords}
        hasFetchError={hasFetchError}
        updateError={updateError}
        onEdit={handleEdit}
        onCancel={() => {
          setEditingDate(null);
          setUpdateError(null);
        }}
        onUpdate={handleUpdate}
      />
    </main>
  );
};

export default DataPage;
