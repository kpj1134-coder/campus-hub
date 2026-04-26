import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';

/**
 * Dashboard — smart router:
 * Admins → AdminDashboard (analytics + approvals)
 * Students → StudentDashboard (personal activity)
 */
const Dashboard = () => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />;
};

export default Dashboard;
