// src/pages/AdminDashboard.tsx
const AdminDashboard: React.FC = () => {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center text-accent mb-6">
          Admin Dashboard
        </h1>
        <p className="text-center text-gray-500">
          Welcome, admin! This route is only visible to users with admin access.
        </p>
      </div>
    );
  };
  
  export default AdminDashboard;  