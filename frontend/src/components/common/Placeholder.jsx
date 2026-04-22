import React from 'react';

const Placeholder = ({ title = 'Page', description = '' }) => {
  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>{title}</h1>
      {description && <p style={{ color: 'var(--color-muted-foreground)' }}>{description}</p>}
      <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: 8, background: 'var(--color-card)' }}>
        <p style={{ margin: 0 }}>This is a placeholder page. Replace with a proper implementation when ready.</p>
      </div>
    </div>
  );
};

export default Placeholder;
