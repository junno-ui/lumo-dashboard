
export const plans = [
    {
        id: 1,
        name: 'Starter',
        price: '$29',
        interval: 'month',
        features: ['5 Projects', '10GB Storage', 'Basic Support', 'Community Access'],
        popular: false,
        color: 'gray'
    },
    {
        id: 2,
        name: 'Pro',
        price: '$79',
        interval: 'month',
        features: ['Unlimited Projects', '100GB Storage', 'Priority Support', 'API Access', 'Custom Domain'],
        popular: true,
        color: 'blue'
    },
    {
        id: 3,
        name: 'Enterprise',
        price: '$299',
        interval: 'month',
        features: ['Unlimited Everything', '1TB Storage', '24/7 Dedicated Support', 'SLA', 'SSO', 'Audit Logs'],
        popular: false,
        color: 'gray'
    }
];

export const userSubscriptions = [
    { id: 1, user: 'John Doe', email: 'john@example.com', plan: 'Pro', status: 'Active', nextBilling: '2025-11-15' },
    { id: 2, user: 'Jane Smith', email: 'jane@example.com', plan: 'Starter', status: 'Active', nextBilling: '2025-11-18' },
    { id: 3, user: 'Robert Johnson', email: 'robert@example.com', plan: 'Enterprise', status: 'Active', nextBilling: '2025-11-20' },
    { id: 4, user: 'Emily Davis', email: 'emily@example.com', plan: 'Pro', status: 'Canceled', nextBilling: '-' },
    { id: 5, user: 'Michael Wilson', email: 'michael@example.com', plan: 'Starter', status: 'Past Due', nextBilling: '2025-11-12' }
];

export const usageLimits = [
    { resource: 'Storage', used: 450, total: 1000, unit: 'GB', percentage: 45, color: 'blue' },
    { resource: 'API Calls', used: 850000, total: 1000000, unit: 'reqs', percentage: 85, color: 'yellow' },
    { resource: 'Projects', used: 12, total: 50, unit: 'projects', percentage: 24, color: 'green' },
    { resource: 'Members', used: 8, total: 10, unit: 'users', percentage: 80, color: 'orange' }
];
