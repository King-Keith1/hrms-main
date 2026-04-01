import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/auth';
import { saveAuth, decodeToken } from '../../utils/auth';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await login(form);
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

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>HRMS</h1>
                <p style={styles.subtitle}>Sign in to your account</p>

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
        maxWidth: '400px',
        border: '1px solid #2d3748',
    },
    title: {
        color: '#fff',
        fontSize: '1.8rem',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: '6px',
    },
    subtitle: {
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: '28px',
        fontSize: '0.9rem',
    },
    field: {
        marginBottom: '16px',
    },
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