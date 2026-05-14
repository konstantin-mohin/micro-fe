import React, { useState, useEffect } from 'react';
import { Button as UIButton } from 'ui';

interface RandomNumberResponse {
  number: number;
}

const Button = () => {
  const [number, setNumber] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/random-number')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch number');
        return res.json() as Promise<RandomNumberResponse>;
      })
      .then((data) => setNumber(data.number))
      .catch((err) => {
        console.error('Error fetching random number:', err);
        setError('Error');
      });
  }, []);

  return (
    <UIButton variant="outline">
      {error ? error : number !== null ? `Remote Count: ${number}` : 'Loading...'}
    </UIButton>
  );
};

export default Button;
