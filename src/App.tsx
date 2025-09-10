import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomProvider } from 'rsuite';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'rsuite/dist/rsuite.min.css';
import './index.css';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { useAuthStore } from './stores/authStore';
import GroupsPage from './pages/GroupsPage';
import GroupSettingsPage from './pages/group/GroupSettingsPage';
import BotSettingsPage from './pages/BotSettingsPage';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? <Navigate to="/dashboard" /> : <>{children}</>;
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <CustomProvider>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <LoginPage />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/groups"
                            element={
                                <ProtectedRoute>
                                    <GroupsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/groups/:groupId/settings"
                            element={
                                <ProtectedRoute>
                                    <GroupSettingsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/bot-settings"
                            element={
                                <ProtectedRoute>
                                    <BotSettingsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/"
                            element={<Navigate to="/dashboard" />}
                        />
                    </Routes>
                </BrowserRouter>
                <Toaster />
            </CustomProvider>
        </QueryClientProvider>
    );
}

export default App;
