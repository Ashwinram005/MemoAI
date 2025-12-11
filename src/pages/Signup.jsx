import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';
import { User, Mail, Lock } from 'lucide-react';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await signup(name, email, password);
            toast.success('Account created successfully');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-300 relative overflow-hidden">
            {/* Decorative Background - Subtle & Professional */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-[480px] z-10 relative">
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-600/20 mb-6 transform transition-transform duration-300">
                        M
                    </div>
                    <h2 className="text-center text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                        Create an account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                        Start your journey with MemoAI Assistant today
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white dark:bg-gray-900 py-10 px-10 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-2xl border border-gray-100 dark:border-gray-800">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <Input
                            label="Full Name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon={User}
                            placeholder="John Doe"
                            className="bg-gray-50 dark:bg-gray-800/50"
                        />

                        <Input
                            label="Email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={Mail}
                            placeholder="name@work-email.com"
                            className="bg-gray-50 dark:bg-gray-800/50"
                        />

                        <Input
                            label="Password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={Lock}
                            placeholder="Create a password"
                            className="bg-gray-50 dark:bg-gray-800/50"
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            icon={Lock}
                            placeholder="Confirm password"
                            className="bg-gray-50 dark:bg-gray-800/50"
                        />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full h-12 text-base shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all font-semibold tracking-wide"
                                isLoading={loading}
                                variant="primary"
                            >
                                Create Account
                            </Button>
                        </div>
                    </form>


                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Professional Footer */}
                <div className="mt-8 text-center space-x-6 text-xs text-gray-400 dark:text-gray-500">
                    <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Help Center</a>
                </div>
            </div>
        </div>
    );
}
