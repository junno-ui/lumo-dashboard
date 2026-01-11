
export const dashboardStats = {
    mrr: 124500,
    mrrGrowth: 5.3,
    arr: 1494000,
    arrGrowth: 12.5,
    activeCustomers: 3420,
    newCustomersThisMonth: 127,
    churnRate: 2.3,
    churnRateChange: -0.5,
    ltv: 12500,
    cac: 850,
    nrr: 108,
    arpu: 156.25,
    trialConversionRate: 24.5
};

export const mrrData = [
    { month: 'Jan', mrr: 82000 },
    { month: 'Feb', mrr: 89000 },
    { month: 'Mar', mrr: 92000 },
    { month: 'Apr', mrr: 101000 },
    { month: 'May', mrr: 112000 },
    { month: 'Jun', mrr: 124500 }
];

export const revenueExpenseData = [
    { month: 'Jan', revenue: 125000, expenses: 95000 },
    { month: 'Feb', revenue: 142000, expenses: 102000 },
    { month: 'Mar', revenue: 138000, expenses: 98000 },
    { month: 'Apr', revenue: 169000, expenses: 115000 },
    { month: 'May', revenue: 182000, expenses: 125000 },
    { month: 'Jun', revenue: 195000, expenses: 132000 }
];

export const customerGrowthData = [
    { month: 'Jan', new: 85, churned: 12 },
    { month: 'Feb', new: 92, churned: 15 },
    { month: 'Mar', new: 105, churned: 18 },
    { month: 'Apr', new: 118, churned: 20 },
    { month: 'May', new: 127, churned: 22 },
    { month: 'Jun', new: 135, churned: 25 }
];

export const planDistributionData = [
    { plan: 'Starter', customers: 1205, revenue: 24100 },
    { plan: 'Professional', customers: 198, revenue: 29700 },
    { plan: 'Enterprise', customers: 342, revenue: 51300 }
];

export const revenueSourceData = [
    { source: 'Organic', revenue: 45000 },
    { source: 'Paid Ads', revenue: 38000 },
    { source: 'Referrals', revenue: 28000 },
    { source: 'Partnerships', revenue: 13500 }
];

export const topCustomers = [
    { id: 1, name: 'Acme Corporation', plan: 'Enterprise', users: 250, mrr: 12500, status: 'Active' },
    { id: 2, name: 'Tech Solutions Inc', plan: 'Enterprise', users: 180, mrr: 9000, status: 'Active' },
    { id: 3, name: 'Global Industries', plan: 'Professional', users: 95, mrr: 4750, status: 'Active' },
    { id: 4, name: 'Innovation Labs', plan: 'Enterprise', users: 120, mrr: 6000, status: 'Active' },
    { id: 5, name: 'Digital Ventures', plan: 'Professional', users: 75, mrr: 3750, status: 'Active' }
];

export const recentTransactions = [
    { id: 'TXN-001', customer: 'Acme Corp', amount: 12500, status: 'Completed', date: '2 hours ago' },
    { id: 'TXN-002', customer: 'Tech Solutions', amount: 9000, status: 'Completed', date: '5 hours ago' },
    { id: 'TXN-003', customer: 'Global Industries', amount: 4750, status: 'Pending', date: '1 day ago' },
    { id: 'TXN-004', customer: 'Innovation Labs', amount: 6000, status: 'Completed', date: '1 day ago' },
    { id: 'TXN-005', customer: 'Digital Ventures', amount: 3750, status: 'Failed', date: '2 days ago' }
];

export const recentActivities = [
    { id: 1, user: 'John Doe', action: 'upgraded to Enterprise plan', type: 'upgrade', time: '5 minutes ago' },
    { id: 2, user: 'Jane Smith', action: 'completed payment', type: 'payment', time: '15 minutes ago' },
    { id: 3, user: 'Bob Johnson', action: 'started free trial', type: 'trial', time: '1 hour ago' },
    { id: 4, user: 'Alice Williams', action: 'cancelled subscription', type: 'cancel', time: '2 hours ago' },
    { id: 5, user: 'Charlie Brown', action: 'added 10 team members', type: 'team', time: '3 hours ago' }
];
