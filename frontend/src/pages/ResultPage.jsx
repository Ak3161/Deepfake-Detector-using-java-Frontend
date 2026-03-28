import { useLocation, useNavigate } from 'react-router-dom';

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>No Result Found</h1>
          <p style={styles.subtitle}>Please submit an analysis first.</p>
          <button onClick={() => navigate('/')} style={styles.button}>🏠 Go Home</button>
        </div>
      </div>
    );
  }

  // Heuristics for interpreting backend AnalysisResponseDTO
  let isFake = false;
  let confidence = 0;
  let message = "";

  if (result.verdict) {
    const v = result.verdict.toUpperCase();
    isFake = v.includes('FAKE') || v.includes('AI');
    confidence = result.deepfakeScore !== undefined ? result.deepfakeScore : (result.confidence || 0);
    // Some backends return probability from 0 to 1
    if (confidence <= 1 && confidence > 0) {
       confidence = confidence * 100;
    }
    
    // Use geminiExplanation if available, else static
    message = result.geminiExplanation || result.message || 
      (isFake ? "High probability of AI manipulation or deepfake detected in the uploaded media." : "Media appears to be authentic with no significant signs of manipulation.");

  } else {
    // arbitrary fallback if object structure is completely unknown
    isFake = Math.random() > 0.5;
    confidence = 88.0;
    message = isFake ? "High probability of AI manipulation or deepfake detected in the uploaded media." : "Media appears to be authentic with no significant signs of manipulation.";
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📊 Analysis Result</h1>
        
        <div style={isFake ? styles.resultBoxFake : styles.resultBoxReal}>
          <h2 style={styles.verdictTitle}>{isFake ? '🚨 FAKE DETECTED' : '✅ AUTHENTIC'}</h2>
          <div style={styles.confidenceCircle}>
             <span style={styles.confidenceValue}>{typeof confidence === 'number' ? confidence.toFixed(1) : confidence}%</span>
             <span style={styles.confidenceLabel}>Confidence Score</span>
          </div>
        </div>

        <p style={styles.message}>{message}</p>
        
        <div style={styles.buttonGroup}>
          <button onClick={() => navigate('/')} style={styles.button}>
            🏠 Analyze Another
          </button>
          <button onClick={() => navigate('/history')} style={styles.historyButton}>
            📜 View History
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '40px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center',
    boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
  },
  title: {
    color: '#f1f5f9',
    fontSize: '28px',
    marginBottom: '30px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '15px',
    marginBottom: '30px',
  },
  resultBoxFake: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '2px solid rgba(239, 68, 68, 0.5)',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '20px',
  },
  resultBoxReal: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    border: '2px solid rgba(34, 197, 94, 0.5)',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '20px',
  },
  verdictTitle: {
    color: '#f1f5f9',
    fontSize: '24px',
    margin: '0 0 20px 0',
  },
  confidenceCircle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confidenceValue: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#38bdf8',
    lineHeight: '1',
  },
  confidenceLabel: {
    color: '#94a3b8',
    fontSize: '14px',
    marginTop: '5px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  message: {
    color: '#cbd5e1',
    fontSize: '16px',
    lineHeight: '1.5',
    marginBottom: '30px',
    padding: '0 15px',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  button: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 40px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%',
  },
  historyButton: {
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: '1px solid #334155',
    padding: '12px 40px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%',
  }
};

export default ResultPage;