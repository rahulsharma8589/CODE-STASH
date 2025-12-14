// client/src/App.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Try to fetch data from our new backend
    axios.get('http://localhost:5000/')
      .then(response => setMessage(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>CodeStash (MERN)</h1>
      <p>Backend Status: {message ? <span style={{color: 'green'}}>{message}</span> : <span style={{color: 'red'}}>Connecting...</span>}</p>
    </div>
  );
}

export default App;