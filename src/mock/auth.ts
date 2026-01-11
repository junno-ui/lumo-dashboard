
export const loginDashboardStats = {
    mrr: { value: '$18,930', change: '+8%' },
    activeUsers: { value: '2,184', label: 'Live' },
    tickets: { value: 37, label: 'Open' },
    conversion: { rate: '4.8%' },
    nps: { value: 54, change: '+3' },
    revenue: { value: '$42.1k', forecast: '+6%' }
}

export const recentActivity = [
    { action: 'Invoice paid', detail: 'Acme Inc.', amount: '+$320', type: 'invoice' },
    { action: 'New signup', detail: 'Pro plan', amount: 'User', type: 'signup' }
]

export const transactions = [
    { label: 'Stripe • INV-1201', time: '2 min ago', amount: '$129', status: 'Paid' },
    { label: 'PayPal • INV-1200', time: '8 min ago', amount: '$59', status: 'Pending' }
]

export const registerDashboardStats = {
    step: 'Step 2/4',
    progress: 50,
    storage: '2GB',
    price: '$0',
    planName: 'Starter Plan',
    setupScore: 78
}

export const features = [
    'Team workspace & roles',
    'Realtime activity feed',
    'Secure authentication'
]

export const recentSignups = [
    { email: 'jane@acme.com', plan: 'Pro trial', status: 'Verified' },
    { email: 'mike@studio.io', plan: 'Starter', status: 'Pending' },
    { email: 'sara@labs.co', plan: 'Team', status: 'Invited' }
]
