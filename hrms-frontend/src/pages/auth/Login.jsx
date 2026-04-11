import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/auth';
import { saveAuth, decodeToken } from '../../utils/auth';

const DEMO_ACCOUNTS = [
    { label: 'Admin', username: 'demo_admin', password: 'password', color: '#4f46e5' },
    { label: 'Manager', username: 'demo_manager', password: 'password', color: '#7c3aed' },
    { label: 'Employee', username: 'demo_employee', password: 'password', color: '#0ea5e9' },
];

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (username, password) => {
        console.log('Logging in with:', username, password);
        setError('');
        setLoading(true);
        try {
            const res = await login({ username, password });
            const token = res.data.token;
            const decoded = decodeToken(token);
            const role = decoded?.role;
            saveAuth(token, role);
            if (role === 'ROLE_ADMIN') navigate('/admin');
            else if (role === 'ROLE_MANAGER') navigate('/manager');
            else if (role === 'ROLE_EMPLOYEE') navigate('/employee');
            else setError('Unknown role');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin(form.username, form.password);
    };

    const handleDemo = (username, password) => {
        handleLogin(username, password);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>HRMS</h1>
                <p style={styles.subtitle}>Human Resource Management System</p>

                {/* Demo accounts */}
                <div style={styles.demoSection}>
                    <p style={styles.demoLabel}>Try a demo account</p>
                    <div style={styles.demoButtons}>
                        {DEMO_ACCOUNTS.map((acc) => (
                            <button
                                key={acc.username}
                                style={{ ...styles.demoBtn, background: acc.color }}
                                onClick={() => handleDemo(acc.username, acc.password)}
                                disabled={loading}
                            >
                                {acc.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={styles.divider}>
                    <span style={styles.dividerText}>or sign in manually</span>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Username</label>
                        <input
                            style={styles.input}
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={styles.link}>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: '#0f1117',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        background: '#1e2433',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        border: '1px solid #2d3748',
    },
    title: {
        color: '#fff',
        fontSize: '1.8rem',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: '4px',
    },
    subtitle: {
        color: '#64748b',
        textAlign: 'center',
        fontSize: '0.82rem',
        marginBottom: '28px',
    },
    demoSection: {
        marginBottom: '20px',
    },
    demoLabel: {
        color: '#94a3b8',
        fontSize: '0.8rem',
        marginBottom: '10px',
        textAlign: 'center',
    },
    demoButtons: {
        display: 'flex',
        gap: '8px',
    },
    demoBtn: {
        flex: 1,
        padding: '10px 6px',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.82rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
    divider: {
        textAlign: 'center',
        margin: '20px 0',
        borderTop: '1px solid #2d3748',
        paddingTop: '20px',
    },
    dividerText: {
        color: '#475569',
        fontSize: '0.78rem',
    },
    field: { marginBottom: '16px' },
    label: {
        display: 'block',
        color: '#94a3b8',
        fontSize: '0.85rem',
        marginBottom: '6px',
    },
    input: {
        width: '100%',
        padding: '10px 14px',
        background: '#0f1117',
        border: '1px solid #2d3748',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '0.9rem',
        outline: 'none',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '12px',
        background: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
    },
    error: {
        background: '#3b1a1a',
        border: '1px solid #ef4444',
        color: '#fca5a5',
        padding: '10px 14px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '0.85rem',
    },
    link: {
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '0.85rem',
    },
};