import { jsx as _jsx } from "react/jsx-runtime";
// packages/ui/src/Button.tsx
export const Button = () => {
    return (_jsx("button", { style: {
            backgroundColor: '#61DAFB',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
        }, onClick: () => alert('Button clicked!'), children: "Shared UI Button" }));
};
