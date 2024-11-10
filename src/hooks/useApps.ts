import { useState } from 'react';
import { 
  Calendar,
  ClipboardList,
  Wrench,
  LineChart,
  PackageSearch,
  Lightbulb,
  Users,
  BarChart3,
  type LucideIcon
} from 'lucide-react';
import { ProductionSchedule } from '../apps/ProductionSchedule';
import { HolidayPlanner } from '../apps/HolidayPlanner';
import { EngineeringRepairs } from '../apps/EngineeringRepairs';
import { ProfitLoss } from '../apps/ProfitLoss';
import { InventoryCount } from '../apps/InventoryCount';
import { IdeaImprovement } from '../apps/IdeaImprovement';
import { UserManagement } from '../apps/UserManagement';
import { KPIDashboard } from '../apps/KPIDashboard';

export interface App {
  id: string;
  title: string;
  icon: LucideIcon;
  component: React.FC;
  isOpen: boolean;
  isMinimized: boolean;
}

export const defaultApps: App[] = [
  {
    id: 'production-schedule',
    title: 'Production Schedule',
    icon: ClipboardList,
    component: ProductionSchedule,
    isOpen: false,
    isMinimized: false
  },
  {
    id: 'holiday-planner',
    title: 'Holiday Planner',
    icon: Calendar,
    component: HolidayPlanner,
    isOpen: false,
    isMinimized: false
  },
  {
    id: 'engineering-repairs',
    title: 'Engineering Repairs',
    icon: Wrench,
    component: EngineeringRepairs,
    isOpen: false,
    isMinimized: false
  },
  {
    id: 'profit-loss',
    title: 'Profit & Loss',
    icon: LineChart,
    component: ProfitLoss,
    isOpen: false,
    isMinimized: false
  },
  {
    id: 'inventory',
    title: 'Inventory Count',
    icon: PackageSearch,
    component: InventoryCount,
    isOpen: false,
    isMinimized: false
  },
  {
    id: 'improvements',
    title: 'Improvements',
    icon: Lightbulb,
    component: IdeaImprovement,
    isOpen: false,
    isMinimized: false
  },
  {
    id: 'users',
    title: 'User Management',
    icon: Users,
    component: UserManagement,
    isOpen: false,
    isMinimized: false
  },
  {
    id: 'kpi',
    title: 'KPI Dashboard',
    icon: BarChart3,
    component: KPIDashboard,
    isOpen: false,
    isMinimized: false
  }
];

export const useApps = () => {
  const [apps, setApps] = useState<App[]>(defaultApps);

  const openApp = (id: string) => {
    setApps(apps.map(app => 
      app.id === id ? { ...app, isOpen: true, isMinimized: false } : app
    ));
  };

  const closeApp = (id: string) => {
    setApps(apps.map(app => 
      app.id === id ? { ...app, isOpen: false } : app
    ));
  };

  const minimizeApp = (id: string) => {
    setApps(apps.map(app => 
      app.id === id ? { ...app, isMinimized: !app.isMinimized } : app
    ));
  };

  return {
    apps,
    openApp,
    closeApp,
    minimizeApp
  };
};