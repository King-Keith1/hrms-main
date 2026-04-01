import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import { markAttendance } from '../../api/attendance';
import { requestLeave, getMyLeaves } from '../../api/leaves';

export default function EmployeeDashboard() {
    const [hoursWorked, setHoursWorked] = useState('');
    const [attendanceMsg, setAttendanceMsg] = useState('');
    const [attendanceError, setAttendanceError] = useState('');

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [leaveType, setLeaveType] = useState('PAID');
    const [leaveMsg, setLeaveMsg] = useState('');
    const [leaveError, setLeaveError] = useState('');

    const [myLeaves, setMyLeaves] = useState([]);
    const [leavesLoading, setLeavesLoading] = useState(true);

    // Load my leaves on mount
    useEffect(() => {
        fetchMyLeaves();
    }, []);

    const fetchMyLeaves = async () => {
        try {
            const res = await getMyLeaves();
            setMyLeaves(res.data);
        } catch {
            // silently fail
        } finally {
            setLeavesLoading(false);
        }
    };

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        setAttendanceMsg('');
        setAttendanceError('');
        try {
            await markAttendance(hoursWorked);
            setAttendanceMsg('Attendance marked successfully!');
            setHoursWorked('');
        } catch (err) {
            setAttendanceError(err.response?.data?.message || 'Failed to mark attendance');
        }
    };

    const handleRequestLeave = async (e) => {
        e.preventDefault();
        setLeaveMsg('');
        setLeaveError('');
        try {
            await requestLeave(startDate, endDate, leaveType);
            setLeaveMsg('Leave request submitted successfully!');
            setStartDate('');
            setEndDate('');
            fetchMyLeaves();
        } catch (err) {
            setLeaveError(err.response?.data?.message || 'Failed to submit leave request');
        }
    };

    const statusColor = {
        PENDING: '#fbbf24',
        APPROVED: '#86efac',
        REJECTED: '#f87171',
    };

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.content}>
                <h1 style={styles.heading}>Employee Dashboard</h1>

                {/* Mark Attendance */}
                <Card title="Mark Attendance">
                    <form onSubmit={handleMarkAttendance} style={styles.form}>
                        <input
                            style={styles.input}
                            type="number"
                            min="1"
                            max="24"
                            placeholder="Hours worked today"
                            value={hoursWorked}
                            onChange={(e) => setHoursWorked(e.target.value)}
                            required
                        />
                        <button style={styles.btnPrimary} type="submit">
                            Mark Attendance
                        </button>
                    </form>
                    {attendanceMsg && <p style={styles.success}>{attendanceMsg}</p>}
                    {attendanceError && <p style={styles.error}>{attendanceError}</p>}
                </Card>

                {/* Request Leave */}
                <Card title="Request Leave">
                    <form onSubmit={handleRequestLeave} style={styles.formGrid}>
                        <div style={styles.field}>
                            <label style={styles.label}>Start Date</label>
                            <input
                                style={styles.input}
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>End Date</label>
                            <input
                                style={styles.input}
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Leave Type</label>
                            <select
                                style={styles.input}
                                value={leaveType}
                                onChange={(e) => setLeaveType(e.target.value)}
                            >
                                <option value="PAID">Paid</option>
                                <option value="UNPAID">Unpaid</option>
                            </select>
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>&nbsp;</label>
                            <button style={styles.btnPrimary} type="submit">
                                Submit Request
                            </button>
                        </div>
                    </form>
                    {leaveMsg && <p style={styles.success}>{leaveMsg}</p>}
                    {leaveError && <p style={styles.error}>{leaveError}</p>}
                </Card>

                {/* My Leave Requests */}
                <Card title="My Leave Requests">
                    {leavesLoading ? (
                        <p style={styles.muted}>Loading...</p>
                    ) : myLeaves.length === 0 ? (
                        <p style={styles.muted}>No leave requests yet.</p>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                            <tr>
                                <th style={styles.th}>Start Date</th>
                                <th style={styles.th}>End Date</th>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {myLeaves.map((leave) => (
                                <tr key={leave.id}>
                                    <td style={styles.td}>{leave.startDate}</td>
                                    <td style={styles.td}>{leave.endDate}</td>
                                    <td style={styles.td}>{leave.type}</td>
                                    <td style={styles.td}>
                      <span style={{
                          ...styles.badge,
                          color: statusColor[leave.status] || '#fff',
                          borderColor: statusColor[leave.status] || '#fff',
                      }}>
                        {leave.status}
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </Card>
            </div>
        </div>
    );
}

const styles = {
    page: { minHeight: '100vh', background: '#0f1117' },
    content: { maxWidth: '900px', margin: '0 auto', padding: '32px 20px' },
    heading: { color: '#fff', fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px' },
    form: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' },
    field: { display: 'flex', flexDirection: 'column' },
    label: { color: '#94a3b8', fontSize: '0.82rem', marginBottom: '6px' },
    input: {
        padding: '10px 14px',
        background: '#0f1117',
        border: '1px solid #2d3748',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '0.9rem',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
    },
    btnPrimary: {
        padding: '10px 20px',
        background: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    },
    success: { color: '#86efac', marginTop: '10px', fontSize: '0.85rem' },
    error: { color: '#f87171', marginTop: '10px', fontSize: '0.85rem' },
    muted: { color: '#64748b', fontSize: '0.85rem' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { color: '#94a3b8', fontSize: '0.8rem', textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #2d3748' },
    td: { color: '#e2e8f0', fontSize: '0.85rem', padding: '10px 12px', borderBottom: '1px solid #1e2433' },
    badge: { border: '1px solid', borderRadius: '20px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: '600' },
};