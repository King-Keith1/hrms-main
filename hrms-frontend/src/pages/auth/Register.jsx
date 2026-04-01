import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/auth';

const DEPARTMENTS = [
    { id: 1, name: 'Human Resources' },
    { id: 2, name: 'Information Technology' },
    { id: 3, name: 'Finance' },
    { id: 4, name: 'Operations' },
    { id: 5, name: 'Marketing' },
    { id: 6, name: 'Legal' },
];

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        password: '',
        role: 'EMPLOYEE',
        departmentId: 1,
    });
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
            await register({ ...form, departmentId: Number(form.departmentId) });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>HRMS</h1>
                <p style={styles.subtitle}>Create a new account</p>

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

                    <div style={styles.field}>
                        <label style={styles.label}>Role</label>
                        <select
                            style={styles.input}
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="EMPLOYEE">Employee</option>
                            <option value="MANAGER">Manager</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Department</label>
                        <select
                            style={styles.input}
                            name="departmentId"
                            value={form.departmentId}
                            onChange={handleChange}
                        >
                            {DEPARTMENTS.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p style={styles.link}>
                    Already have an account? <Link to="/login">Sign in</Link>
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