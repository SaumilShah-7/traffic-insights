import { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import DataPage from './pages/DataPage';
import DashboardPage from './pages/DashboardPage';
import { DashboardSection } from './constants';

const App = () => {
  const [activeSection, setActiveSection] =
    useState<DashboardSection>('metrics');

  return (
    <MainLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {activeSection === 'metrics' ? <DashboardPage /> : <DataPage />}
    </MainLayout>
  );
};

export default App;
