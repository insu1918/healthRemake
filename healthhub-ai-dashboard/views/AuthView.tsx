import React, { useState } from 'react';
import { UserSettings, HealthGoal } from '../types';
import { login, register } from '../services/api';

interface AuthViewProps {
    onLoginSuccess: (user: any) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Login State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Register State
    const [name, setName] = useState('');
    const [height, setHeight] = useState<number>(170);
    const [targetWeight, setTargetWeight] = useState<number>(60);
    const [age, setAge] = useState<number>(25);
    const [gender, setGender] = useState<'남' | '여'>('남');
    const [goal, setGoal] = useState<HealthGoal>(HealthGoal.MAINTAIN);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLoginMode) {
                const user = await login(email, password);
                onLoginSuccess(user);
            } else {
                const settings: any = {
                    email,
                    password,
                    name,
                    height,
                    target_weight: targetWeight, // Map to snake_case for backend
                    goal,
                    age,
                    gender
                };
                await register(settings);
                // Auto login after register or ask user to login
                const user = await login(email, password);
                onLoginSuccess(user);
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4">
            <div className="w-full max-w-md p-8 bg-slate-800 rounded-3xl shadow-2xl border border-white/5">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white mb-2">HealthHub AI</h1>
                    <p className="text-slate-400">
                        {isLoginMode ? '다시 오신 것을 환영합니다!' : '건강한 시작을 함께해요'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1 ml-1">이메일</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2DE2A6] transition-all"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1 ml-1">비밀번호</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2DE2A6] transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {!isLoginMode && (
                        <div className="space-y-4 pt-2 border-t border-white/5">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1 ml-1">이름</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#2DE2A6]"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1 ml-1">키 (cm)</label>
                                    <input type="number" required className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#2DE2A6]" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1 ml-1">목표 체중 (kg)</label>
                                    <input type="number" required className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#2DE2A6]" value={targetWeight} onChange={(e) => setTargetWeight(Number(e.target.value))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1 ml-1">나이</label>
                                    <input type="number" required className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#2DE2A6]" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1 ml-1">성별</label>
                                    <select className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#2DE2A6]" value={gender} onChange={(e) => setGender(e.target.value as any)}>
                                        <option value="남">남성</option>
                                        <option value="여">여성</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1 ml-1">목표</label>
                                <select className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#2DE2A6]" value={goal} onChange={(e) => setGoal(e.target.value as HealthGoal)}>
                                    {Object.values(HealthGoal).map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-6 bg-[#2DE2A6] hover:bg-[#25cba4] text-slate-900 font-black rounded-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '처리중...' : (isLoginMode ? '로그인' : '회원가입 완료')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLoginMode(!isLoginMode);
                            setError(null);
                        }}
                        className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
                    >
                        {isLoginMode ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthView;
