import { logout, getRole } from '../utils/auth';
import { advanceDay, getCurrentDate } from '../api/system';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const role = getRole();
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        fetchCurrentDate();
    }, []);

    const fetchCurrentDate = async () => {
        try {
            const res = await getCurrentDate();
            setCurrentDate(res.data);
        } catch {
            // silently fail
        }
    };

    const handleAdvanceDay = async () => {
        try {
            await advanceDay();
            fetchCurrentDate();
        } catch {
            // silently fail
        }
    };

    const roleLabel = {
        ROLE_ADMIN: 'Admin',
        ROLE_MANAGER: 'Manager',
        ROLE_EMPLOYEE: 'Employee',
    }[role] || role;

    return (
        <nav style={styles.nav}>
            <div style={styles.left}>
                <span style={styles.logo}>HRMS</span>
                <span style={styles.roleTag}>{roleLabel}</span>
            </div>
            <div style={styles.right}>
                {currentDate && (
                    <div style={styles.dateBox}>
                        <span style={styles.dateLabel}>System Date</span>
                        <span style={styles.dateValue}>{currentDate}</span>
                    </div>
                )}
                <button style={styles.dayBtn} onClick={handleAdvanceDay}>
                    Next Day
                </button>
                <button style={styles.logoutBtn} onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        background: '#1e2433',
        borderBottom: '1px solid #2d3748',
        padding: '14px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    left: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
    },
    logo: {
        color: '#fff',
        fontSize: '1.3rem',
        fontWeight: '700',
    },
    roleTag: {
        background: '#4f46e5',
        color: '#e0e7ff',
        fontSize: '0.72rem',
        fontWeight: '700',
        padding: '3px 10px',
        borderRadius: '20px',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    dateBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    dateLabel: {
        color: '#64748b',
        fontSize: '0.68rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
    },
    dateValue: {
        color: '#f1f5f9',
        fontSize: '0.88rem',
        fontWeight: '600',
    },
    dayBtn: {
        background: '#d97706',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
    logoutBtn: {
        background: '#ef4444',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
};