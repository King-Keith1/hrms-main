export default function Card({ title, children }) {
    return (
        <div style={styles.card}>
            {title && <h2 style={styles.title}>{title}</h2>}
            {children}
        </div>
    );
}

const styles = {
    card: {
        background: '#1e2433',
        border: '1px solid #2d3748',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
    },
    title: {
        color: '#f1f5f9',
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid #2d3748',
    },
};