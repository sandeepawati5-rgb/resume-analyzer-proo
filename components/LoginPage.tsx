
import React, { useState } from 'react';
import { SparklesIcon } from './Icons';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Simple validation
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        // Mock login success for any input
        onLogin();
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <header className="text-center mb-8">
                    <div className="inline-flex items-center justify-center bg-slate-800 p-3 rounded-full mb-4">
                        <SparklesIcon className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-2">
                        AI Resume Analyzer
                    </h1>
                    <p className="text-lg text-slate-400">
                        Log in to continue
                    </p>
                </header>
                <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300 text-slate-300 placeholder-slate-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300 text-slate-300 placeholder-slate-500"
                                required
                            />
                        </div>

                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                className="w-full mt-2 py-3 px-6 font-bold text-lg rounded-lg transition-all duration-300 flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-0.5"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;