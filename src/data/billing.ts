
export const billingStats = {
    currentBalance: '$0.00',
    nextInvoice: '$79.00',
    nextInvoiceDate: 'Nov 15, 2025',
    paymentMethod: 'Visa ending in 4242'
};

export const invoices = [
    { id: 'INV-00124', date: 'Oct 15, 2025', amount: '$79.00', status: 'Paid', downloadUrl: '#' },
    { id: 'INV-00123', date: 'Sep 15, 2025', amount: '$79.00', status: 'Paid', downloadUrl: '#' },
    { id: 'INV-00122', date: 'Aug 15, 2025', amount: '$79.00', status: 'Paid', downloadUrl: '#' },
    { id: 'INV-00121', date: 'Jul 15, 2025', amount: '$29.00', status: 'Paid', downloadUrl: '#' },
    { id: 'INV-00120', date: 'Jun 15, 2025', amount: '$29.00', status: 'Refunded', downloadUrl: '#' }
];

export const paymentMethods = [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/28', default: true, icon: 'i-heroicons-credit-card' },
    { id: 2, type: 'Mastercard', last4: '8888', expiry: '09/26', default: false, icon: 'i-heroicons-credit-card' },
    { id: 3, type: 'PayPal', email: 'john@example.com', default: false, icon: 'i-logos-paypal' }
];

export const monthlySpend = [
    { month: 'Jun', amount: 29 },
    { month: 'Jul', amount: 29 },
    { month: 'Aug', amount: 79 },
    { month: 'Sep', amount: 79 },
    { month: 'Oct', amount: 79 }
];

export const spendBreakdown = [
    { category: 'Subscriptions', amount: 79 },
    { category: 'Usage', amount: 0 },
    { category: 'Refunds', amount: -29 }
];
