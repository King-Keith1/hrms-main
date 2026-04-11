import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import { createEmployee, getAllEmployees } from '../../api/employee';
import { getAllLeaves, approveLeave } from '../../api/leaves';
import { getAllPayroll, generatePayroll } from '../../api/payroll';
import { getAttendanceByEmployee } from '../../api/attendance';
import { register } from '../../api/auth';

const DEPARTMENTS = [
    { id: 1, name: 'Human Resources' },
    { id: 2, name: 'Information Technology' },
    { id: 3, name: 'Finance' },
    { id: 4, name: 'Operations' },
    { id: 5, name: 'Marketing' },
    { id: 6, name: 'Legal' },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('employees');

    // Employees
    const [employees, setEmployees] = useState([]);
    const [empLoading, setEmpLoading] = useState(true);
    const [empForm, setEmpForm] = useState({
        username: '', password: '', fullName: '',
        employeeNumber: '', departmentId: 1, hourlyRate: '',
        contractType: 'FULL_TIME',
    });

    const [empMsg, setEmpMsg] = useState('');
    const [empError, setEmpError] = useState('');

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

    useEffect(() => { fetchEmployees(); fetchLeaves(); fetchPayroll(); }, []);

    const fetchEmployees = async () => {
        try {
            const res = await getAllEmployees();
            setEmployees(res.data);
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

    // Create employee — registers user account then creates employee record
    const handleCreateEmployee = async (e) => {
        e.preventDefault();
        setEmpMsg(''); setEmpError('');
        try {
            // Step 1: register user account
            await register({
                username: empForm.username,
                password: empForm.password,
                role: 'EMPLOYEE',
                departmentId: Number(empForm.departmentId),
            });

            // Step 2: create employee record linked to that user
            await createEmployee({
                fullName: empForm.fullName,
                employeeNumber: empForm.employeeNumber,
                departmentId: Number(empForm.departmentId),
                hourlyRate: Number(empForm.hourlyRate),
                username: empForm.username,
                contractType: empForm.contractType,
            });

            setEmpMsg('Employee created successfully!');
            setEmpForm({ username: '', password: '', fullName: '', employeeNumber: '', departmentId: 1, hourlyRate: '', contractType: 'FULL_TIME' });
            fetchEmployees();
        } catch (err) {
            setEmpError(err.response?.data?.message || 'Failed to create employee');
        }
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
        { key: 'employees', label: 'Employees' },
        { key: 'leaves', label: 'Leaves' },
        { key: 'attendance', label: 'Attendance' },
        { key: 'payroll', label: 'Payroll' },
    ];

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.content}>
                <h1 style={styles.heading}>Admin Dashboard</h1>

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

                {/* EMPLOYEES TAB */}
                {activeTab === 'employees' && (
                    <>
                        <Card title="Create New Employee">
                            <form onSubmit={handleCreateEmployee} style={styles.grid}>
                                <div style={styles.field}>
                                    <label style={styles.label}>Full Name</label>
                                    <input style={styles.input} placeholder="John Doe" value={empForm.fullName}
                                           onChange={(e) => setEmpForm({ ...empForm, fullName: e.target.value })} required />
                                </div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Employee Number</label>
                                    <input style={styles.input} placeholder="EMP001" value={empForm.employeeNumber}
                                           onChange={(e) => setEmpForm({ ...empForm, employeeNumber: e.target.value })} required />
                                </div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Username</label>
                                    <input style={styles.input} placeholder="johndoe" value={empForm.username}
                                           onChange={(e) => setEmpForm({ ...empForm, username: e.target.value })} required />
                                </div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Password</label>
                                    <input style={styles.input} type="password" placeholder="••••••" value={empForm.password}
                                           onChange={(e) => setEmpForm({ ...empForm, password: e.target.value })} required />
                                </div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Department</label>
                                    <select style={styles.input} value={empForm.departmentId}
                                            onChange={(e) => setEmpForm({ ...empForm, departmentId: e.target.value })}>
                                        {DEPARTMENTS.map((d) => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Hourly Rate (R)</label>
                                    <input style={styles.input} type="number" placeholder="50" value={empForm.hourlyRate}
                                           onChange={(e) => setEmpForm({ ...empForm, hourlyRate: e.target.value })} required />
                                </div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Contract Type</label>
                                    <select style={styles.input} value={empForm.contractType}
                                            onChange={(e) => setEmpForm({ ...empForm, contractType: e.target.value })}>
                                        <option value="FULL_TIME">Full Time</option>
                                        <option value="PART_TIME">Part Time</option>
                                        <option value="CONTRACT">Contract</option>
                                    </select>
                                </div>
                                <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
                                    <button style={styles.btnPrimary} type="submit">Create Employee</button>
                                </div>
                            </form>
                            {empMsg && <p style={styles.success}>{empMsg}</p>}
                            {empError && <p style={styles.error}>{empError}</p>}
                        </Card>

                        <Card title="All Employees">
                            {empLoading ? <p style={styles.muted}>Loading...</p> :
                                employees.length === 0 ? <p style={styles.muted}>No employees yet.</p> : (
                                    <table style={styles.table}>
                                        <thead>
                                        <tr>
                                            <th style={styles.th}>ID</th>
                                            <th style={styles.th}>Full Name</th>
                                            <th style={styles.th}>Employee #</th>
                                            <th style={styles.th}>Department</th>
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
                                                <td style={styles.td}>{emp.department?.name}</td>
                                                <td style={styles.td}>R{emp.hourlyRate}</td>
                                                <td style={styles.td}>
                            <span style={{ ...styles.badge, color: emp.active ? '#86efac' : '#f87171', borderColor: emp.active ? '#86efac' : '#f87171' }}>
                              {emp.active ? 'Active' : 'Inactive'}
                            </span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                )}
                        </Card>
                    </>
                )}

                {/* LEAVES TAB */}
                {activeTab === 'leaves' && (
                    <Card title="All Leave Requests">
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
                          <span style={{ ...styles.badge, color: statusColor[leave.status], borderColor: statusColor[leave.status] }}>
                            {leave.status}
                          </span>
                                            </td>
                                            <td style={styles.td}>
                                                {leave.status === 'PENDING' && (
                                                    <button style={styles.btnSmall} onClick={() => handleApproveLeave(leave.id)}>
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

                        <Card title="All Payroll Records">
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
    heading: { color: '#fff', fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px' },
    tabs: { display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' },
    tab: {
        padding: '10px 20px', background: '#1e2433', color: '#94a3b8',
        border: '1px solid #2d3748', borderRadius: '8px', cursor: 'pointer',
        fontSize: '0.88rem', fontWeight: '600',
    },
    tabActive: { background: '#4f46e5', color: '#fff', borderColor: '#4f46e5' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
    inlineForm: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' },
    field: { display: 'flex', flexDirection: 'column' },
    label: { color: '#94a3b8', fontSize: '0.82rem', marginBottom: '6px' },
    input: {
        padding: '10px 14px', background: '#0f1117', border: '1px solid #2d3748',
        borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none',
        width: '100%', boxSizing: 'border-box',
    },
    btnPrimary: {
        padding: '10px 20px', background: '#4f46e5', color: '#fff',
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
    muted: { color: '#64748b', fontSize: '0.85rem' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { color: '#94a3b8', fontSize: '0.8rem', textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #2d3748' },
    td: { color: '#e2e8f0', fontSize: '0.85rem', padding: '10px 12px', borderBottom: '1px solid #1e2433' },
    badge: { border: '1px solid', borderRadius: '20px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: '600' },
};