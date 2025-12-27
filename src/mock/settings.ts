
export const profileSettings = {
    name: 'Jun Z',
    email: 'junz@example.com',
    bio: 'Full Stack Developer',
    avatar: 'https://i.pravatar.cc/150?u=junz'
};

export const organizationSettings = {
    name: 'Acme Corp',
    domain: 'acme.com',
    members: 15,
    logo: 'https://via.placeholder.com/150'
};

export const preferences = {
    theme: 'System',
    language: 'English',
    notifications: {
        email: true,
        push: false,
        desktop: true
    }
};

export const securitySettings = {
    mfaEnabled: true,
    lastLogin: '2025-10-27 12:30:00',
    activeSessions: 2
};

export const auditEvents = [
    { date: '2025-10-01', actor: 'System', action: 'Password policy updated' },
    { date: '2025-10-07', actor: 'Admin', action: 'Enabled SSO' },
    { date: '2025-10-12', actor: 'Admin', action: 'Revoked API key' }
];

export const loginAttempts = [
    { date: '2025-10-01', success: 88, fail: 6 },
    { date: '2025-10-02', success: 92, fail: 4 },
    { date: '2025-10-03', success: 79, fail: 11 },
    { date: '2025-10-04', success: 94, fail: 3 }
];
