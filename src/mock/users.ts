
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
  {
    id: 1,
    user: 'John Doe',
    action: 'Updated role permissions: Editor',
    time: '2026-01-07 10:12',
    icon: 'i-lucide-shield',
    type: 'access',
    status: 'success',
    ip: '103.10.10.21',
    target: 'Role: Editor',
    meta: { added: ['Edit Users'], removed: ['Delete Users'] }
  },
  {
    id: 2,
    user: 'Jane Smith',
    action: 'Failed login attempt',
    time: '2026-01-07 09:50',
    icon: 'i-lucide-lock',
    type: 'security',
    status: 'error',
    ip: '36.77.12.90',
    target: 'Auth',
    meta: { reason: 'Invalid password' }
  },
  {
    id: 3,
    user: 'Robert Johnson',
    action: 'Created new user: emily@example.com',
    time: '2026-01-06 18:20',
    icon: 'i-lucide-user-plus',
    type: 'users',
    status: 'success',
    ip: '180.250.1.3',
    target: 'User: emily@example.com',
    meta: { role: 'viewer' }
  }
]


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
