
export const users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, name: 'David Lee', email: 'david@example.com', role: 'Editor', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: 5, name: 'Eva Green', email: 'eva@example.com', role: 'Viewer', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=5' }
];

export const roles = [
    { id: 1, name: 'Admin', users: 3, permissions: ['All Access'] },
    { id: 2, name: 'Editor', users: 12, permissions: ['Create Content', 'Edit Content', 'Publish Content'] },
    { id: 3, name: 'Viewer', users: 45, permissions: ['View Content'] },
    { id: 4, name: 'Billing', users: 2, permissions: ['Manage Billing', 'View Invoices'] }
];

export const activityLog = [
    { id: 1, user: 'Alice Johnson', action: 'Created new project', time: '2 hours ago', icon: 'i-heroicons-plus-circle' },
    { id: 2, user: 'Bob Smith', action: 'Edited homepage', time: '3 hours ago', icon: 'i-heroicons-pencil-square' },
    { id: 3, user: 'Charlie Brown', action: 'Log in', time: '5 hours ago', icon: 'i-heroicons-arrow-right-on-rectangle' },
    { id: 4, user: 'David Lee', action: 'Deleted post', time: '1 day ago', icon: 'i-heroicons-trash' },
    { id: 5, user: 'Alice Johnson', action: 'Updated settings', time: '2 days ago', icon: 'i-heroicons-cog-6-tooth' }
];

export const growthData = [
    { month: 'Jun', newUsers: 320, totalUsers: 1280 },
    { month: 'Jul', newUsers: 410, totalUsers: 1690 },
    { month: 'Aug', newUsers: 520, totalUsers: 2210 },
    { month: 'Sep', newUsers: 480, totalUsers: 2690 },
    { month: 'Oct', newUsers: 560, totalUsers: 3250 }
];

export const geoDistribution = [
    { region: 'US', users: 980 },
    { region: 'EU', users: 620 },
    { region: 'APAC', users: 420 },
    { region: 'Other', users: 230 }
];

export const activityOverTime = [
    { date: '2025-10-01', actions: 120 },
    { date: '2025-10-02', actions: 150 },
    { date: '2025-10-03', actions: 98 },
    { date: '2025-10-04', actions: 176 },
    { date: '2025-10-05', actions: 189 }
];
