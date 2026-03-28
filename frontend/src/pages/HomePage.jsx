import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function HomePage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      setLoading(true)
      const response = await axios.post(
        'http://localhost:8080/api/analysis/upload',
        formData
      )
      navigate('/result', { state: { result: response.data } })
    } catch (err) {
      setError('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.title}>🔍 AI Deepfake Detector</h1>
        <p style={styles.subtitle}>
          Upload an image or video to check if it is AI generated or fake
        </p>

        <div style={styles.uploadBox}>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          {file && (
            <p style={styles.fileName}>📁 {file.name}</p>
          )}
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={loading ? styles.buttonDisabled : styles.button}
        >
          {loading ? '⏳ Analyzing...' : '🚀 Analyze'}
        </button>

        <button
          onClick={() => navigate('/history')}
          style={styles.historyButton}
        >
          📜 View History
        </button>

      </div>
    </div>
  )
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
    marginBottom: '10px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '15px',
    marginBottom: '30px',
  },
  uploadBox: {
    border: '2px dashed #334155',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '20px',
    cursor: 'pointer',
  },
  fileInput: {
    color: '#94a3b8',
    width: '100%',
  },
  fileName: {
    color: '#38bdf8',
    marginTop: '10px',
    fontSize: '14px',
  },
  error: {
    color: '#f87171',
    marginBottom: '10px',
    fontSize: '14px',
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
    marginBottom: '12px',
  },
  buttonDisabled: {
    backgroundColor: '#1e40af',
    color: '#93c5fd',
    border: 'none',
    padding: '12px 40px',
    borderRadius: '8px',
    fontSize: '16px',
    width: '100%',
    marginBottom: '12px',
    cursor: 'not-allowed',
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
}

export default HomePage