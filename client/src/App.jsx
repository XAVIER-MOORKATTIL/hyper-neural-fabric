import React, { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState('Connecting to backend...');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // 1. Fetch baseline status from the live Render web service
    fetch('https://hyper-neural-fabric-backend.onrender.com/')
      .then(res => res.json())
      .then(data => {
        setStatus(`${data.status}: ${data.message} (${data.intellectStatus})`);
      })
      .catch(() => {
        setStatus('Production Backend Server Unreachable (Warming up or connection blocked)');
      });

    // 2. Establish live production WebSocket connection (using secure wss:// protocol)
    const ws = new WebSocket('wss://hyper-neural-fabric-backend.onrender.com');
    
    ws.onopen = () => {
      console.log('Websocket production synchronization active.');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.payload) {
          setMessages(prev => [...prev, data.payload]);
        }
      } catch (err) {
        console.log('Received raw text stream:', event.data);
      }
    };

    setSocket(ws);

    return () => ws.close();
  }, []);

  const handleSend = () => {
    if (socket && input.trim()) {
      socket.send(input);
      setInput('');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Hyper-Neural Fabric Dashboard</h2>
      <p style={{ background: '#eef3f7', padding: '12px', borderRadius: '4px' }}>
        <strong>System Connectivity Status:</strong> <br />
        <span style={{ color: '#0066cc', fontFamily: 'monospace' }}>{status}</span>
      </p>
      
      <div style={{ margin: '25px 0' }}>
        <input 
          type="text"
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Enter data stream injection..." 
          style={{ padding: '10px', width: '300px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button onClick={handleSend} style={{ padding: '10px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Inject Data Stream
        </button>
      </div>

      <h3>Received Real-Time Logs:</h3>
      <div style={{ background: '#1e1e1e', color: '#00ff00', padding: '15px', borderRadius: '4px', minHeight: '120px', fontFamily: 'monospace', overflowY: 'auto' }}>
        {messages.length === 0 ? (
          <em style={{ color: '#888' }}>No active signals captured on this dimension.</em>
        ) : (
          <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'square' }}>
            {messages.map((msg, index) => (
              <li key={index} style={{ margin: '6px 0' }}>{msg}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;