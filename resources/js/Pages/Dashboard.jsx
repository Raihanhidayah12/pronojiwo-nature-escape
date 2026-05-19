import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import AdminDashboard from '@/Pages/Admin/AdminDashboard';
import SuperAdminDashboard from '@/Pages/Admin/SuperAdminDashboard';
import UserDashboard from '@/Pages/UserDashboard';

export default function Dashboard({ auth, destinasis, bookings, reviews, pesans, users, logs, discounts = [] }) {
    // 🔹 Render Super Admin Dashboard
    if (auth.user.role === 'super_admin') {
        return (
            <SuperAdminDashboard 
                auth={auth} 
                initialUsers={users}
                initialLogs={logs}
                initialDestinations={destinasis}
                initialBookings={bookings}
                initialDiscounts={discounts}
            />
        );
    }

    // 🔹 Render Admin Dashboard if user has admin role
    if (auth.user.role === 'admin') {
        return (
            <AdminDashboard 
                auth={auth} 
                initialDestinations={destinasis} 
                initialBookings={bookings} 
                initialReviews={reviews} 
                initialMessages={pesans}
                discounts={discounts}
            />
        );
    }

    // Otherwise render standard visitor dashboard
    return (
        <UserDashboard
            auth={auth}
            initialDestinations={destinasis}
            initialBookings={bookings}
            initialReviews={reviews}
            pesans={pesans}
            discounts={discounts}
        />
    );
}
