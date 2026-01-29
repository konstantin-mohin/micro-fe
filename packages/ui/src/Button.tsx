// packages/ui/src/Button.tsx

export const Button = () => {
  return (
    <button
      style={{
        backgroundColor: '#61DAFB',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
      }}
      onClick={() => alert('Button clicked!')}
    >
      Shared UI Button
    </button>
  );
};
