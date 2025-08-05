import React, { useState } from 'react';

const LoginRegister = ({postLoginAction, setPostLoginAction}) => {
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      maxWidth: '400px',
      margin: '0 auto',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    title: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    tabContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '1.5rem',
    },
    tabButton: (active) => ({
      cursor: 'pointer',
      padding: '0.5rem 1rem',
      borderBottom: active ? '2px solid #2563eb' : '2px solid transparent',
      fontWeight: active ? 'bold' : 'normal',
      color: active ? '#2563eb' : '#64748b',
      background: 'none',
      border: 'none',
      outline: 'none',
      fontSize: '1rem',
      margin: '0 0.5rem',
    }),
    input: {
      display: 'block',
      padding: '0.75rem 1rem',
      marginBottom: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid #cbd5e1',
      fontSize: '0.9rem',
      outline: 'none',
      boxSizing: 'border-box',
      width: '100%',
    },
    inputWrapper: {
      width: '100%',
    },
    button: {
      display: 'block',
      width: '100%',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      fontSize: '0.75rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      backgroundColor: '#2563eb',
      color: 'white',
    },
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('Username dan password wajib diisi');
      return;
    }

    try {
      const res = await fetch('https://bot.kediritechnopark.com/webhook/user-dev/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.text();
        alert(`Login gagal: ${err}`);
        return;
      }

      const data = await res.json();
      const token = data[0].token;
      if (token) {
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        
        if (postLoginAction) {
          postLoginAction(); // resume action (e.g., checkout)
          setPostLoginAction(null);
        }
        // window.location.reload()
      } else {
        alert('Token tidak ditemukan pada respons login');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat login');
      console.error(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      alert('Email, username, dan password wajib diisi');
      return;
    }

    try {
      const res = await fetch('https://bot.kediritechnopark.com/webhook/user-dev/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      if (!res.ok) {
        const err = await res.text();
        alert(`Registrasi gagal: ${err}`);
        return;
      }

      alert('Registrasi berhasil! Silakan login.');
      setTab('login');
      setEmail('');
      setUsername('');
      setPassword('');
    } catch (error) {
      alert('Terjadi kesalahan saat registrasi');
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{tab === 'login' ? 'Login' : 'Register'}</h2>

      <div style={styles.tabContainer}>
        <button
          style={styles.tabButton(tab === 'login')}
          onClick={() => setTab('login')}
          type="button"
        >
          Login
        </button>
        <button
          style={styles.tabButton(tab === 'register')}
          onClick={() => setTab('register')}
          type="button"
        >
          Register
        </button>
      </div>

      {tab === 'login' ? (
        <form onSubmit={handleLogin}>
          <div style={styles.inputWrapper}>
            <input
              style={styles.input}
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div style={styles.inputWrapper}>
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#1d4ed8')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#2563eb')}
          >
            Masuk
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <div style={styles.inputWrapper}>
            <input
              style={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div style={styles.inputWrapper}>
            <input
              style={styles.input}
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div style={styles.inputWrapper}>
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#1d4ed8')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#2563eb')}
          >
            Daftar
          </button>
        </form>
      )}
    </div>
  );
};

export default LoginRegister;
