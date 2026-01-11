
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

export const churnData = [
    { month: 'Jun', churnRate: 2.1 },
    { month: 'Jul', churnRate: 1.8 },
    { month: 'Aug', churnRate: 2.3 },
    { month: 'Sep', churnRate: 2.0 },
    { month: 'Oct', churnRate: 1.6 }
];

export const mrrData = [
    { month: 'Jun', mrr: 18200 },
    { month: 'Jul', mrr: 20500 },
    { month: 'Aug', mrr: 22800 },
    { month: 'Sep', mrr: 24100 },
    { month: 'Oct', mrr: 25900 }
];

export const arpuData = [
    { month: 'Jun', arpu: 24.8 },
    { month: 'Jul', arpu: 25.3 },
    { month: 'Aug', arpu: 26.1 },
    { month: 'Sep', arpu: 26.9 },
    { month: 'Oct', arpu: 27.2 }
];

// For UsageLimitsPage.vue
export const workspace = { name: 'Lumo', plan: 'Pro', seatsUsed: 12 };

export const workspaceLimits = {
    mode: 'hard',
    allowOverage: false,
    notifyAtPct: 85,
    resetDayOfMonth: 1,
    requests: 1_200_000,
    bandwidthGB: 800,
    storageGB: 250,
    seats: 20
};

export const usageMembers = [
    { id: 1, name: 'James Anderson', email: 'james.anderson@example.com', role: 'Owner', status: 'Active', lastActiveISO: new Date(Date.now() - 1000 * 60 * 10).toISOString(), daily: { requests: 12000, bandwidthGB: 2.1, storageGB: 0.2 }, override: null },
    { id: 2, name: 'Mia White', email: 'mia.white@example.com', role: 'Admin', status: 'Active', lastActiveISO: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), daily: { requests: 9000, bandwidthGB: 1.4, storageGB: 0.15 }, override: { enabled: true, mode: 'soft', notifyAtPct: 80, requests: 220_000, bandwidthGB: 70, storageGB: 18 } },
    { id: 3, name: 'William Brown', email: 'william.brown@example.com', role: 'Member', status: 'Active', lastActiveISO: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), daily: { requests: 4500, bandwidthGB: 0.9, storageGB: 0.08 }, override: null },
    { id: 4, name: 'Emma Davis', email: 'emma.davis@example.com', role: 'Viewer', status: 'Invited', lastActiveISO: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), daily: { requests: 0, bandwidthGB: 0, storageGB: 0 }, override: null },
    { id: 5, name: 'Ethan Harris', email: 'ethan.harris@example.com', role: 'Member', status: 'Suspended', lastActiveISO: new Date(Date.now() - 1000 * 60 * 60 * 200).toISOString(), daily: { requests: 1500, bandwidthGB: 0.35, storageGB: 0.03 }, override: null }
];

// For UserSubscriptionsPage.vue (Transactions)
export const subscriptionPayments = [
    { id: '4600', date: '2024-03-11T15:30:00', status: 'paid', email: 'james.anderson@example.com', amount: 594 },
    { id: '4599', date: '2024-03-11T10:10:00', status: 'failed', email: 'mia.white@example.com', amount: 276 },
    { id: '4598', date: '2024-03-11T08:50:00', status: 'refunded', email: 'william.brown@example.com', amount: 315 },
    { id: '4597', date: '2024-03-10T19:45:00', status: 'paid', email: 'emma.davis@example.com', amount: 529 },
    { id: '4596', date: '2024-03-10T15:55:00', status: 'paid', email: 'ethan.harris@example.com', amount: 639 },
    { id: '4595', date: '2024-03-10T13:40:00', status: 'refunded', email: 'ava.thomas@example.com', amount: 428 },
    { id: '4594', date: '2024-03-10T09:15:00', status: 'paid', email: 'michael.wilson@example.com', amount: 683 },
    { id: '4593', date: '2024-03-09T20:25:00', status: 'failed', email: 'olivia.taylor@example.com', amount: 947 },
    { id: '4592', date: '2024-03-09T18:45:00', status: 'paid', email: 'benjamin.jackson@example.com', amount: 851 },
    { id: '4591', date: '2024-03-09T16:05:00', status: 'paid', email: 'sophia.miller@example.com', amount: 762 },
    { id: '4590', date: '2024-03-09T14:20:00', status: 'paid', email: 'noah.clark@example.com', amount: 573 },
    { id: '4589', date: '2024-03-09T11:35:00', status: 'failed', email: 'isabella.lee@example.com', amount: 389 }
];
