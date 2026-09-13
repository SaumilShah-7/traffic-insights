import { ReactNode } from 'react';
import { DashboardSection } from '../constants';

interface MainLayoutProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
  children: ReactNode;
}

const MainLayout = ({
  activeSection,
  onSectionChange,
  children,
}: MainLayoutProps) => (
  <div className="app-shell">
    <header className="top-bar">
      <p className="top-bar-title">Traffic Insights</p>
      <nav className="top-nav">
        <button
          type="button"
          className={activeSection === 'metrics' ? 'active' : undefined}
          onClick={() => {
            onSectionChange('metrics');
          }}
        >
          Metrics
        </button>
        <button
          type="button"
          className={activeSection === 'data' ? 'active' : undefined}
          onClick={() => {
            onSectionChange('data');
          }}
        >
          Data
        </button>
      </nav>
    </header>
    <div className="content-pane">{children}</div>
  </div>
);

export default MainLayout;
