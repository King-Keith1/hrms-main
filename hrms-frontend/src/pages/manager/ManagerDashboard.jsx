import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import { getAllEmployees } from '../../api/employee';
import { getAllLeaves, approveLeave } from '../../api/leaves';
import { getAllPayroll, generatePayroll } from '../../api/payroll';
import { getAttendanceByEmployee } from '../../api/attendance';
import { getMe } from '../../api/auth';

export default function ManagerDashboard() {
    const [activeTab, setActiveTab] = useState('employees');
    const [myDepartment, setMyDepartment] = useState(null);

    // Employees
    const [employees, setEmployees] = useState([]);
    const [empLoading, setEmpLoading] = useState(true);

    // Leaves
    const [leaves, setLeaves] = useState([]);
    const [leavesLoading, setLeavesLoading] = useState(true);
    const [leaveMsg, setLeaveMsg] = useState('');

    // Payroll
    const [payroll, setPayroll] = useState([]);
    const [payrollLoading, setPayrollLoading] = useState(true);
    const [payrollForm, setPayrollForm] = useState({ employeeId: '', month: '' });
    const [payrollMsg, setPayrollMsg] = useState('');
    const [payrollError, setPayrollError] = useState('');

    // Attendance
    const [attendanceEmpId, setAttendanceEmpId] = useState('');
    const [attendance, setAttendance] = useState([]);
    const [attendanceMsg, setAttendanceMsg] = useState('');

    useEffect(() => {
        fetchMe();
        fetchLeaves();
        fetchPayroll();
    }, []);

    const fetchMe = async () => {
        try {
            const res = await getMe();
            setMyDepartment(res.data.department);
            fetchEmployees(res.data.department?.id);
        } catch { }
    };

    // Only fetch employees in manager's department
    const fetchEmployees = async (deptId) => {
        try {
            const res = await getAllEmployees();
            const filtered = res.data.filter(
                (emp) => emp.department?.id === deptId
            );
            setEmployees(filtered);
        } catch { } finally { setEmpLoading(false); }
    };

    const fetchLeaves = async () => {
        try {
            const res = await getAllLeaves();
            setLeaves(res.data);
        } catch { } finally { setLeavesLoading(false); }
    };

    const fetchPayroll = async () => {
        try {
            const res = await getAllPayroll();
            setPayroll(res.data);
        } catch { } finally { setPayrollLoading(false); }
    };

    const handleApproveLeave = async (id) => {
        try {
            await approveLeave(id);
            setLeaveMsg(`Leave #${id} approved!`);
            fetchLeaves();
            setTimeout(() => setLeaveMsg(''), 3000);
        } catch (err) {
            setLeaveMsg(err.response?.data?.message || 'Failed to approve leave');
        }
    };

    const handleGeneratePayroll = async (e) => {
        e.preventDefault();
        setPayrollMsg(''); setPayrollError('');
        try {
            const res = await generatePayroll(payrollForm.employeeId, payrollForm.month);
            setPayrollMsg(`Payroll generated! Gross pay: R${res.data.grossPay}`);
            fetchPayroll();
        } catch (err) {
            setPayrollError(err.response?.data?.message || 'Failed to generate payroll');
        }
    };

    const handleViewAttendance = async (e) => {
        e.preventDefault();
        try {
            const res = await getAttendanceByEmployee(attendanceEmpId);
            setAttendance(res.data);
            if (res.data.length === 0) setAttendanceMsg('No attendance records found.');
            else setAttendanceMsg('');
        } catch (err) {
            setAttendanceMsg(err.response?.data?.message || 'Failed to fetch attendance');
        }
    };

    const statusColor = { PENDING: '#fbbf24', APPROVED: '#86efac', REJECTED: '#f87171' };

    const tabs = [
        { key: 'employees', label: 'My Department' },
        { key: 'leaves', label: 'Leaves' },
        { key: 'attendance', label: 'Attendance' },
        { key: 'payroll', label: 'Payroll' },
    ];

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.content}>
                <div style={styles.headingRow}>
                    <h1 style={styles.heading}>Manager Dashboard</h1>
                    {myDepartment && (
                        <span style={styles.deptTag}>📁 {myDepartment.name}</span>
                    )}
                </div>

                {/* Tabs */}
                <div style={styles.tabs}>
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            style={{ ...styles.tab, ...(activeTab === t.key ? styles.tabActive : {}) }}
                            onClick={() => setActiveTab(t.key)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* MY DEPARTMENT TAB */}
                {activeTab === 'employees' && (
                    <Card title={`Employees in ${myDepartment?.name || 'your department'}`}>
                        {empLoading ? <p style={styles.muted}>Loading...</p> :
                            employees.length === 0 ? (
                                <p style={styles.muted}>No employees in your department yet.</p>
                            ) : (
                                <table style={styles.table}>
                                    <thead>
                                    <tr>
                                        <th style={styles.th}>ID</th>
                                        <th style={styles.th}>Full Name</th>
                                        <th style={styles.th}>Employee #</th>
                                        <th style={styles.th}>Hourly Rate</th>
                                        <th style={styles.th}>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {employees.map((emp) => (
                                        <tr key={emp.id}>
                                            <td style={styles.td}>{emp.id}</td>
                                            <td style={styles.td}>{emp.fullName}</td>
                                            <td style={styles.td}>{emp.employeeNumber}</td>
                                            <td style={styles.td}>R{emp.hourlyRate}</td>
                                            <td style={styles.td}>
                          <span style={{
                              ...styles.badge,
                              color: emp.active ? '#86efac' : '#f87171',
                              borderColor: emp.active ? '#86efac' : '#f87171',
                          }}>
                            {emp.active ? 'Active' : 'Inactive'}
                          </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                    </Card>
                )}

                {/* LEAVES TAB */}
                {activeTab === 'leaves' && (
                    <Card title="Leave Requests">
                        {leaveMsg && <p style={styles.success}>{leaveMsg}</p>}
                        {leavesLoading ? <p style={styles.muted}>Loading...</p> :
                            leaves.length === 0 ? <p style={styles.muted}>No leave requests.</p> : (
                                <table style={styles.table}>
                                    <thead>
                                    <tr>
                                        <th style={styles.th}>ID</th>
                                        <th style={styles.th}>Employee</th>
                                        <th style={styles.th}>Start</th>
                                        <th style={styles.th}>End</th>
                                        <th style={styles.th}>Type</th>
                                        <th style={styles.th}>Status</th>
                                        <th style={styles.th}>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {leaves.map((leave) => (
                                        <tr key={leave.id}>
                                            <td style={styles.td}>{leave.id}</td>
                                            <td style={styles.td}>{leave.employee?.fullName}</td>
                                            <td style={styles.td}>{leave.startDate}</td>
                                            <td style={styles.td}>{leave.endDate}</td>
                                            <td style={styles.td}>{leave.type}</td>
                                            <td style={styles.td}>
                          <span style={{
                              ...styles.badge,
                              color: statusColor[leave.status],
                              borderColor: statusColor[leave.status],
                          }}>
                            {leave.status}
                          </span>
                                            </td>
                                            <td style={styles.td}>
                                                {leave.status === 'PENDING' && (
                                                    <button
                                                        style={styles.btnSmall}
                                                        onClick={() => handleApproveLeave(leave.id)}
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                    </Card>
                )}

                {/* ATTENDANCE TAB */}
                {activeTab === 'attendance' && (
                    <Card title="View Attendance by Employee">
                        <p style={styles.hint}>
                            Enter an employee ID from your department to view their attendance.
                        </p>
                        <form onSubmit={handleViewAttendance} style={styles.inlineForm}>
                            <input
                                style={{ ...styles.input, maxWidth: '200px' }}
                                type="number"
                                placeholder="Employee ID"
                                value={attendanceEmpId}
                                onChange={(e) => setAttendanceEmpId(e.target.value)}
                                required
                            />
                            <button style={styles.btnPrimary} type="submit">View</button>
                        </form>
                        {attendanceMsg && <p style={styles.muted}>{attendanceMsg}</p>}
                        {attendance.length > 0 && (
                            <table style={{ ...styles.table, marginTop: '16px' }}>
                                <thead>
                                <tr>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Hours Worked</th>
                                    <th style={styles.th}>Overtime Hours</th>
                                </tr>
                                </thead>
                                <tbody>
                                {attendance.map((a) => (
                                    <tr key={a.id}>
                                        <td style={styles.td}>{a.date}</td>
                                        <td style={styles.td}>{a.hoursWorked}</td>
                                        <td style={styles.td}>{a.overtimeHours}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </Card>
                )}

                {/* PAYROLL TAB */}
                {activeTab === 'payroll' && (
                    <>
                        <Card title="Generate Payroll">
                            <p style={styles.hint}>
                                Only generate payroll for employees in your department.
                            </p>
                            <form onSubmit={handleGeneratePayroll} style={styles.inlineForm}>
                                <input
                                    style={{ ...styles.input, maxWidth: '160px' }}
                                    type="number"
                                    placeholder="Employee ID"
                                    value={payrollForm.employeeId}
                                    onChange={(e) => setPayrollForm({ ...payrollForm, employeeId: e.target.value })}
                                    required
                                />
                                <input
                                    style={{ ...styles.input, maxWidth: '160px' }}
                                    type="month"
                                    value={payrollForm.month}
                                    onChange={(e) => setPayrollForm({ ...payrollForm, month: e.target.value })}
                                    required
                                />
                                <button style={styles.btnPrimary} type="submit">Generate</button>
                            </form>
                            {payrollMsg && <p style={styles.success}>{payrollMsg}</p>}
                            {payrollError && <p style={styles.error}>{payrollError}</p>}
                        </Card>

                        <Card title="Payroll Records">
                            {payrollLoading ? <p style={styles.muted}>Loading...</p> :
                                payroll.length === 0 ? <p style={styles.muted}>No payroll records yet.</p> : (
                                    <table style={styles.table}>
                                        <thead>
                                        <tr>
                                            <th style={styles.th}>Employee</th>
                                            <th style={styles.th}>Month</th>
                                            <th style={styles.th}>Gross Pay</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {payroll.map((p) => (
                                            <tr key={p.id}>
                                                <td style={styles.td}>{p.employee?.fullName}</td>
                                                <td style={styles.td}>{p.payrollMonth}</td>
                                                <td style={styles.td}>R{p.grossPay}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                )}
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    page: { minHeight: '100vh', background: '#0f1117' },
    content: { maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' },
    headingRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
    heading: { color: '#fff', fontSize: '1.5rem', fontWeight: '700' },
    deptTag: {
        background: '#0f2a1f', border: '1px solid #166534', color: '#86efac',
        padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: '600',
    },
    tabs: { display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' },
    tab: {
        padding: '10px 20px', background: '#1e2433', color: '#94a3b8',
        border: '1px solid #2d3748', borderRadius: '8px', cursor: 'pointer',
        fontSize: '0.88rem', fontWeight: '600',
    },
    tabActive: { background: '#7c3aed', color: '#fff', borderColor: '#7c3aed' },
    inlineForm: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginTop: '12px' },
    field: { display: 'flex', flexDirection: 'column' },
    label: { color: '#94a3b8', fontSize: '0.82rem', marginBottom: '6px' },
    hint: { color: '#64748b', fontSize: '0.82rem', marginBottom: '8px' },
    input: {
        padding: '10px 14px', background: '#0f1117', border: '1px solid #2d3748',
        borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none',
        width: '100%', boxSizing: 'border-box',
    },
    btnPrimary: {
        padding: '10px 20px', background: '#7c3aed', color: '#fff',
        border: 'none', borderRadius: '8px', fontSize: '0.9rem',
        fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap',
    },
    btnSmall: {
        padding: '5px 12px', background: '#16a34a', color: '#fff',
        border: 'none', borderRadius: '6px', fontSize: '0.78rem',
        fontWeight: '600', cursor: 'pointer',
    },
    success: { color: '#86efac', marginTop: '10px', fontSize: '0.85rem' },
    error: { color: '#f87171', marginTop: '10px', fontSize: '0.85rem' },
    muted: { color: '#64748b', fontSize: '0.85rem', marginTop: '10px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { color: '#94a3b8', fontSize: '0.8rem', textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #2d3748' },
    td: { color: '#e2e8f0', fontSize: '0.85rem', padding: '10px 12px', borderBottom: '1px solid #1e2433' },
    badge: { border: '1px solid', borderRadius: '20px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: '600' },
};