import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Form, Button, Panel } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { MdEmail, MdLock } from 'react-icons/md';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const { mutate, isPending, error } = useMutation({
        mutationFn: () => login(email, password),
        onSuccess: () => {
            navigate('/dashboard');
        },
    });

    const handleSubmit = (formValue: Record<string, string> | null) => {
        if (formValue) {
            mutate();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    {/* <MdSecurity className="text-5xl text-blue-600 mb-4 mx-auto" /> */}
                    <span className="text-5xl text-blue-600 mb-4 mx-auto">
                        <img
                            src="https://safushield.com/assets/img/hero-img.png"
                            width={80}
                            className="mx-auto"
                        />
                    </span>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">
                        Please sign in to your account
                    </p>
                </div>

                <Panel
                    bordered
                    className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl"
                >
                    <Form onSubmit={handleSubmit} fluid>
                        <Form.Group>
                            <Form.ControlLabel className="text-gray-700 font-medium">
                                Email Address
                            </Form.ControlLabel>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <MdEmail className="text-gray-400 text-xl" />
                                </div>
                                <Form.Control
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={setEmail}
                                    placeholder="Enter your email"
                                    required
                                    className="pl-10 !bg-white"
                                    style={{
                                        paddingLeft: '40px',
                                    }}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel className="text-gray-700 font-medium">
                                Password
                            </Form.ControlLabel>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <MdLock className="text-gray-400 text-xl" />
                                </div>
                                <Form.Control
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={setPassword}
                                    placeholder="Enter your password"
                                    required
                                    // className="pl-10 !bg-white"
                                    style={{
                                        paddingLeft: '40px',
                                    }}
                                />
                            </div>
                        </Form.Group>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                                {error instanceof Error
                                    ? error.message
                                    : 'Login failed'}
                            </div>
                        )}

                        <Form.Group>
                            <Button
                                type="submit"
                                appearance="primary"
                                block
                                disabled={isPending}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-200"
                            >
                                {isPending ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </Form.Group>

                        <div className="text-center mt-4">
                            {/* <a
                                href="#"
                                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                                Forgot your password?
                            </a> */}
                        </div>
                    </Form>
                </Panel>

                {/* <div className="text-center mt-6 text-sm text-gray-600">
                    <p>
                        Don't have an account?{' '}
                        <a
                            href="#"
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                        >
                            Sign up
                        </a>
                    </p>
                </div> */}
            </div>
        </div>
    );
};

export default LoginPage;
