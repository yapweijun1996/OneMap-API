import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: (email: string, pass: string) => Promise<void>;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 h-full bg-white shadow-xl p-6 flex flex-col z-20 absolute left-0 top-0 overflow-y-auto">
      <h2 className="text-2xl font-bold text-red-600 mb-2">OneMap SG</h2>
      <p className="text-sm text-gray-500 mb-6">Authoritative National Map</p>
      <div className="bg-blue-50 p-4 rounded text-xs text-blue-800 mb-4">
        Token Required. Please Login.
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full border p-2 rounded" 
          placeholder="Email" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full border p-2 rounded" 
          placeholder="Password" 
          required 
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-2 bg-red-600 text-white rounded disabled:bg-gray-400"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </form>
    </div>
  );
};

export default LoginView;
