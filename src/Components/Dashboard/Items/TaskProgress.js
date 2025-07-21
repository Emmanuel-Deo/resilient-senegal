import React, { useState, useEffect } from 'react';

const TaskProgress = () => {
  const [status, setStatus] = useState('idle'); // idle | starting | active | success | error
  const [progress, setProgress] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const pollStatus = () => {
    const id = setInterval(async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/task-status');
        const data = await res.json();

        setStatus(data.status);
        setProgress(data.progress);

        if (['success', 'error'].includes(data.status)) {
          clearInterval(id);
          setIntervalId(null);
        }
      } catch (err) {
        console.error('Error fetching task status:', err);
        clearInterval(id);
        setStatus('error');
      }
    }, 1000);

    setIntervalId(id);
  };

  const triggerTask = async (url) => {
    setStatus('starting');
    setProgress(0);
    try {
      const res = await fetch(`http://127.0.0.1:8000/${url}`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Failed to start task');

      pollStatus();
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="task-container">
      <h2>Task Runner</h2>

      {status === 'idle' && (
        <>
          <button className="start-btn" onClick={() => triggerTask('start-task')}>
            Start Task (Random)
          </button>
          <button className="fail-btn" onClick={() => triggerTask('start-failing-task')}>
            Start Failing Task
          </button>
        </>
      )}

      {status === 'starting' || status === 'active' ? (
        <div className="status-box loading">
          <div className="loader" />
          <p>{status === 'starting' ? 'Initializing...' : `Processing... ${progress}%`}</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : null}

      {status === 'success' && (
        <div className="status-box success">
          <p>✅ Task completed successfully!</p>
          <button onClick={() => setStatus('idle')}>Run Again</button>
        </div>
      )}

      {status === 'error' && (
        <div className="status-box error">
          <p>❌ Task failed.</p>
          <button onClick={() => setStatus('idle')}>Try Again</button>
        </div>
      )}

      <style>{`
        .task-container {
          max-width: 400px;
          margin: 2rem auto;
          text-align: center;
          font-family: sans-serif;
          border: 1px solid #ccc;
          padding: 2rem;
          border-radius: 10px;
        }

        .start-btn, .fail-btn {
          padding: 0.6rem 1.2rem;
          font-size: 16px;
          margin: 0.5rem;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .start-btn {
          background-color: #007bff;
        }

        .fail-btn {
          background-color: #dc3545;
        }

        .start-btn:hover {
          background-color: #0056b3;
        }

        .fail-btn:hover {
          background-color: #a71d2a;
        }

        .status-box {
          padding: 1rem;
          border-radius: 8px;
        }

        .loading {
          background-color: #fff8e1;
        }

        .success {
          background-color: #e8f5e9;
        }

        .error {
          background-color: #ffebee;
        }

        .loader {
          width: 30px;
          height: 30px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .progress-bar {
          width: 100%;
          height: 10px;
          background-color: #ddd;
          margin-top: 10px;
          border-radius: 5px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background-color: #007bff;
          transition: width 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default TaskProgress;
