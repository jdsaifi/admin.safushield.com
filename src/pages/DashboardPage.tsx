import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel } from 'rsuite';
import { useAuthStore } from '../stores/authStore';
import { MdGroup, MdPeople } from 'react-icons/md';
import Sidebar from '../components/Sidebar';
import api from '../lib/axios';
import { useQuery } from '@tanstack/react-query';

type DashboardData = {
    totalGroups: number;
    totalMembers: number;
}[];

const DashboardPage = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const [activeKey, setActiveKey] = useState('1');

    const { data: dashboardData, isSuccess } = useQuery({
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
        <div className="flex h-screen">
            <Sidebar activeKey={activeKey} onSelect={handleSelect} />

            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Welcome back, {user?.email}!
                        </h1>
                        <p className="text-gray-600">
                            Summary of the Safu Sheild telegram bot.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Panel
                            bordered
                            className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <MdGroup className="text-2xl text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Total Groups
                                    </h3>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {isSuccess
                                            ? dashboardData[0].totalGroups
                                            : 'NA'}
                                    </p>
                                    <p className="text-sm text-green-600">
                                        {/* +12% from last month */}
                                    </p>
                                </div>
                            </div>
                        </Panel>

                        <Panel
                            bordered
                            className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <MdPeople className="text-2xl text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Total Members
                                    </h3>
                                    <p className="text-3xl font-bold text-green-600">
                                        {isSuccess
                                            ? dashboardData[0].totalMembers
                                            : 'NA'}
                                    </p>
                                    <p className="text-sm text-green-600">
                                        {/* +8% from last month */}
                                    </p>
                                </div>
                            </div>
                        </Panel>

                        {/* <Panel
                            bordered
                            className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <MdPayment className="text-2xl text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Paid Groups
                                    </h3>
                                    <p className="text-3xl font-bold text-purple-600">
                                        456
                                    </p>
                                    <p className="text-sm text-green-600">
                                        +15% from last month
                                    </p>
                                </div>
                            </div>
                        </Panel> */}
                    </div>

                    {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Panel
                            header={
                                <h3 className="text-lg font-semibold">
                                    Recent Activity
                                </h3>
                            }
                            bordered
                            className="bg-white shadow-sm"
                        >
                            <div className="space-y-4">
                                
                                <p className="text-gray-600">
                                    No recent activity to display.
                                </p>
                            </div>
                        </Panel>

                        <Panel
                            header={
                                <h3 className="text-lg font-semibold">
                                    Quick Actions
                                </h3>
                            }
                            bordered
                            className="bg-white shadow-sm"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    appearance="ghost"
                                    className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50"
                                >
                                    <MdPeople className="mr-2" />
                                    Add User
                                </Button>
                                <Button
                                    appearance="ghost"
                                    className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50"
                                >
                                    <MdGroup className="mr-2" />
                                    Create Group
                                </Button>
                            </div>
                        </Panel>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
