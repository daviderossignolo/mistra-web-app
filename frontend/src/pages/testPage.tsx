import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TestPage: React.FC = () => {
  const history = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history('/login');
    }
  }, [history]);

  return (
    <div>
      <h2>Ecco qua i miei contenuti nascosti</h2>
    </div>
  );
};

export default TestPage;