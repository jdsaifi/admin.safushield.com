import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel, Button } from 'rsuite';
import { useAuthStore } from '../stores/authStore';
import {
    MdGroup,
    MdPeople,
    MdSecurity,
    MdSettings,
    MdAnalytics,
    MdRefresh,
    MdMessage,
} from 'react-icons/md';
import Sidebar from '../components/Sidebar';
import api from '../lib/axios';
import { useQuery } from '@tanstack/react-query';

type DashboardData = {
    totalGroups: number;
    totalMembers: number;
    totalMessages: number;
    totalTokens: number;
}[];

const DashboardPage = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const [activeKey, setActiveKey] = useState('1');

    const {
        data: dashboardData,
        isSuccess,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['dashboardData'],
        queryFn: async () => {
            const response = await api.get('/v1/admin/dashboard');
            return response.data.data as DashboardData;
        },
    });

    console.log('dashboardData: ', dashboardData);

    const handleSelect = (key: string) => {
        setActiveKey(key);
        switch (key) {
            case '1':
                navigate('/dashboard');
                break;
            case '2':
                navigate('/users');
                break;
            case '3':
                navigate('/groups');
                break;
            case '4':
                navigate('/payments');
                break;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar activeKey={activeKey} onSelect={handleSelect} />

            <div className="flex-1 overflow-auto">
                {/* Header Section */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Dashboard
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Welcome back, {user?.email} • Here's what's
                                    happening with your SafuShield bot
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Button
                                    appearance="ghost"
                                    size="sm"
                                    onClick={() => refetch()}
                                    loading={isLoading}
                                    className="flex items-center"
                                >
                                    <MdRefresh className="mr-2" />
                                    Refresh
                                </Button>
                                {/* <Badge content="3" color="red">
                                    <Button appearance="ghost" size="sm">
                                        <MdNotifications className="text-xl" />
                                    </Button>
                                </Badge> */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Groups Card */}
                        <Panel className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-600 text-sm font-medium uppercase tracking-wide">
                                            Total Groups
                                        </p>
                                        <p className="text-3xl font-bold text-blue-900 mt-2">
                                            {isLoading ? (
                                                <div className="animate-pulse bg-blue-200 h-8 w-16 rounded"></div>
                                            ) : isSuccess ? (
                                                dashboardData[0]?.totalGroups ||
                                                0
                                            ) : (
                                                'N/A'
                                            )}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            {/* <MdTrendingUp className="text-green-500 text-sm mr-1" />
                                            <span className="text-green-600 text-sm font-medium">
                                                +12% from last month
                                            </span> */}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                                        <MdGroup className="text-2xl text-white" />
                                    </div>
                                </div>
                            </div>
                        </Panel>

                        {/* Total Members Card */}
                        <Panel className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-600 text-sm font-medium uppercase tracking-wide">
                                            Total Members
                                        </p>
                                        <p className="text-3xl font-bold text-green-900 mt-2">
                                            {isLoading ? (
                                                <div className="animate-pulse bg-green-200 h-8 w-20 rounded"></div>
                                            ) : isSuccess ? (
                                                dashboardData[0]
                                                    ?.totalMembers || 0
                                            ) : (
                                                'N/A'
                                            )}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            {/* <MdTrendingUp className="text-green-500 text-sm mr-1" />
                                            <span className="text-green-600 text-sm font-medium">
                                                +8% from last month
                                            </span> */}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                                        <MdPeople className="text-2xl text-white" />
                                    </div>
                                </div>
                            </div>
                        </Panel>

                        {/* Active Groups Card */}
                        <Panel className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-600 text-sm font-medium uppercase tracking-wide">
                                            Total Messages
                                        </p>
                                        <p className="text-3xl font-bold text-purple-900 mt-2">
                                            {isLoading ? (
                                                <div className="animate-pulse bg-purple-200 h-8 w-16 rounded"></div>
                                            ) : isSuccess ? (
                                                (
                                                    dashboardData[0]
                                                        ?.totalMessages || 0
                                                ).toLocaleString(undefined, {
                                                    maximumFractionDigits: 2,
                                                })
                                            ) : (
                                                'N/A'
                                            )}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            <span className="text-purple-600 text-sm font-medium">
                                                {/* 85% active rate */}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                                        <MdMessage className="text-2xl text-white" />
                                    </div>
                                </div>
                            </div>
                        </Panel>

                        {/* Tokens Monitoring */}
                        <Panel className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-600 text-sm font-medium uppercase tracking-wide">
                                            Tokens Monitoring
                                        </p>
                                        <p className="text-3xl font-bold text-orange-900 mt-2">
                                            {isLoading ? (
                                                <div className="animate-pulse bg-purple-200 h-8 w-16 rounded"></div>
                                            ) : isSuccess ? (
                                                (
                                                    dashboardData[0]
                                                        ?.totalTokens || 0
                                                ).toLocaleString(undefined, {
                                                    maximumFractionDigits: 0,
                                                })
                                            ) : (
                                                'N/A'
                                            )}
                                        </p>
                                        {/* <div className="mt-2">
                                            <Progress.Line
                                                percent={98}
                                                strokeColor="#f97316"
                                            />
                                        </div> */}
                                    </div>
                                    <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
                                        <MdAnalytics className="text-2xl text-white" />
                                    </div>
                                </div>
                            </div>
                        </Panel>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Activity */}
                        <div className="lg:col-span-2 hidden">
                            <Panel
                                header={
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Recent Activity
                                        </h3>
                                        <Button appearance="ghost" size="sm">
                                            View All
                                        </Button>
                                    </div>
                                }
                                className="bg-white shadow-lg border-0"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                        <div className="p-2 bg-blue-100 rounded-full mr-4">
                                            <MdGroup className="text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                New group registered
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Crypto Trading Group #1234
                                            </p>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            2 min ago
                                        </span>
                                    </div>

                                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                        <div className="p-2 bg-green-100 rounded-full mr-4">
                                            <MdPeople className="text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                Member joined
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                +25 new members in DeFi Alpha
                                            </p>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            15 min ago
                                        </span>
                                    </div>

                                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                        <div className="p-2 bg-purple-100 rounded-full mr-4">
                                            <MdSecurity className="text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                Security alert
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Suspicious activity detected
                                            </p>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            1 hour ago
                                        </span>
                                    </div>
                                </div>
                            </Panel>
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <Panel
                                header={
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Quick Actions
                                    </h3>
                                }
                                className="bg-white shadow-lg border-0"
                            >
                                <div className="space-y-3">
                                    <Button
                                        appearance="ghost"
                                        block
                                        className="flex items-center justify-start p-4 h-auto hover:bg-blue-50 transition-colors"
                                        onClick={() => navigate('/groups')}
                                    >
                                        <MdGroup className="mr-3 text-blue-600" />
                                        <div className="text-left">
                                            <p className="font-medium">
                                                Manage Groups
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                View and configure groups
                                            </p>
                                        </div>
                                    </Button>

                                    <Button
                                        appearance="ghost"
                                        block
                                        className="flex items-center justify-start p-4 h-auto hover:bg-green-50 transition-colors"
                                        onClick={() =>
                                            navigate('/bot-settings')
                                        }
                                    >
                                        <MdSettings className="mr-3 text-green-600" />
                                        <div className="text-left">
                                            <p className="font-medium">
                                                Bot Settings
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Configure bot parameters
                                            </p>
                                        </div>
                                    </Button>

                                    {/* <Button
                                        appearance="ghost"
                                        block
                                        className="flex items-center justify-start p-4 h-auto hover:bg-purple-50 transition-colors"
                                    >
                                        <MdAnalytics className="mr-3 text-purple-600" />
                                        <div className="text-left">
                                            <p className="font-medium">
                                                View Analytics
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Detailed performance metrics
                                            </p>
                                        </div>
                                    </Button> */}
                                </div>
                            </Panel>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
