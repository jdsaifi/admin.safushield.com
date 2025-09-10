import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidenav, Nav, Button, Tooltip, Whisper } from 'rsuite';
import { useAuthStore } from '../stores/authStore';
import {
    // MdDashboard,
    // MdGroup,
    MdLogout,
    MdChevronLeft,
    // MdChevronRight,
} from 'react-icons/md';
import DashboardIcon from '@rsuite/icons/Dashboard';
import {
    Peoples as UsersIcon,
    CreditCardPlus as CreditCardPlusIcon,
    // OffRound as LogoutIcon,
    ArrowRightLine as ArrowRightLineIcon,
} from '@rsuite/icons';

interface SidebarProps {
    activeKey?: string;
    onSelect?: (key: string) => void;
}

const Sidebar = ({ activeKey, onSelect }: SidebarProps) => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const [expanded, setExpanded] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSelect = (key: string) => {
        if (onSelect) {
            onSelect(key);
        }
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
            case '5':
                navigate('/bot-settings');
                break;
        }
    };

    return (
        <div className="h-screen bg-white shadow-lg transition-all duration-300">
            <Sidenav
                expanded={expanded}
                defaultOpenKeys={['1', '2', '3', '4', '5']}
                appearance="subtle"
                className="h-full"
            >
                <Sidenav.Header className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="">
                                {/* <MdDashboard className="text-2xl text-blue-600" /> */}
                                <img
                                    src="https://safushield.com/assets/img/hero-img.png"
                                    width={35}
                                />
                            </div>
                            {expanded && (
                                <span className="ml-3 text-xl font-bold text-gray-800 mr-3">
                                    Admin Panel
                                </span>
                            )}
                        </div>
                        <Button
                            appearance="ghost"
                            size="sm"
                            onClick={() => setExpanded(!expanded)}
                            className="p-2"
                        >
                            {expanded ? (
                                <MdChevronLeft className="text-xl" />
                            ) : (
                                // <MdChevronRight className="text-xl" />
                                <span>
                                    <ArrowRightLineIcon />
                                </span>
                            )}
                        </Button>
                    </div>
                </Sidenav.Header>

                <Sidenav.Body>
                    <Nav activeKey={activeKey} onSelect={handleSelect}>
                        {/* <Nav.Menu
                            eventKey="1"
                            title="Dashboard"
                            icon={<DashboardIcon />}
                        >
                            <Nav.Item eventKey="1-1">Overview</Nav.Item>
                            <Nav.Item eventKey="1-2">Analytics</Nav.Item>
                            <Nav.Item eventKey="1-3">Reports</Nav.Item>
                        </Nav.Menu> */}

                        {/* <Nav.Menu
                            eventKey="2"
                            title="Users"
                            icon={<UsersIcon />}
                        >
                            <Nav.Item eventKey="2-1">All Users</Nav.Item>
                            <Nav.Item eventKey="2-2">Active Users</Nav.Item>
                            <Nav.Item eventKey="2-3">Inactive Users</Nav.Item>
                        </Nav.Menu> */}

                        {/* <Nav.Menu
                            eventKey="3"
                            title="Groups"
                            icon={<MdGroup />}
                        >
                            <Nav.Item eventKey="3-1">All Groups</Nav.Item>
                            <Nav.Item eventKey="3-2">Active Groups</Nav.Item>
                            <Nav.Item eventKey="3-3">Archived Groups</Nav.Item>
                        </Nav.Menu> */}

                        {/* <Nav.Menu
                            eventKey="4"
                            title="Payments"
                            icon={<CreditCardPlusIcon />}
                        >
                            <Nav.Item eventKey="4-1">Transactions</Nav.Item>
                            <Nav.Item eventKey="4-2">Subscriptions</Nav.Item>
                            <Nav.Item eventKey="4-3">Refunds</Nav.Item>
                        </Nav.Menu> */}

                        <Nav.Item
                            eventKey="1"
                            title="Dashboard"
                            icon={<DashboardIcon />}
                        >
                            Dashboard
                        </Nav.Item>

                        <Nav.Item
                            eventKey="3"
                            title="Groups"
                            icon={<UsersIcon />}
                        >
                            All Groups
                        </Nav.Item>

                        <Nav.Item
                            eventKey="5"
                            title="Bot Settings"
                            icon={<CreditCardPlusIcon />}
                        >
                            Bot Settings
                        </Nav.Item>
                    </Nav>
                </Sidenav.Body>

                <div className="p-4 border-t border-gray-100 mt-auto">
                    <Whisper
                        placement="right"
                        trigger="hover"
                        speaker={<Tooltip>Logout</Tooltip>}
                    >
                        <Button
                            color="red"
                            appearance="ghost"
                            block
                            onClick={handleLogout}
                            className="flex items-center justify-center hover:bg-red-50 transition-colors duration-200"
                        >
                            <MdLogout className="text-xl" />
                            {expanded && <span className="ml-2">Logout</span>}
                            {!expanded && (
                                <span className="ml-0">
                                    <MdLogout className="" />
                                </span>
                            )}
                        </Button>
                    </Whisper>
                </div>
            </Sidenav>
        </div>
    );
};

export default Sidebar;
