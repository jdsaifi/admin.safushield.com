import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    Button,
    Input,
    InputGroup,
    Panel,
    Tag,
    Badge,
    SelectPicker,
    Form,
    Row,
    Col,
} from 'rsuite';
import { MdSearch } from 'react-icons/md';
import Sidebar from '../components/Sidebar';
import { Group } from '../types/group';
import api from '../lib/axios';

const { Column, HeaderCell, Cell } = Table;

const GroupsPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const {
        data: groupsData,
        isLoading,
        isSuccess,
    } = useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
            const response = await api.get('/v1/admin/groups');
            return response.data.data as Group[];
        },
    });

    const filteredGroups =
        isSuccess &&
        groupsData?.length &&
        groupsData?.filter((group) => {
            const matchesSearch = group.tg_group_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesStatus =
                !statusFilter ||
                (statusFilter === 'active' && !group.deleted_at) ||
                (statusFilter === 'deleted' && group.deleted_at);
            return matchesSearch && matchesStatus;
        });

    // const languageOptions = [
    //     { label: 'English', value: 'EN' },
    //     { label: 'Spanish', value: 'ES' },
    //     { label: 'French', value: 'FR' },
    //     // Add more languages as needed
    // ];

    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Deleted', value: 'deleted' },
    ];

    return (
        <div className="flex h-screen">
            <Sidebar activeKey="3" onSelect={() => {}} />

            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Groups
                            </h1>
                            <p className="text-gray-600">
                                Manage your Telegram groups
                            </p>
                        </div>
                        {/* <Button
                            appearance="primary"
                            className="flex items-center"
                            onClick={() => {}}
                        >
                            <MdAdd className="mr-2" />
                            Add Group
                        </Button> */}
                    </div>

                    <Panel bordered className="mb-6">
                        <Form fluid>
                            <Row>
                                <Col xs={24} md={8}>
                                    <Form.Group>
                                        <InputGroup>
                                            <InputGroup.Addon>
                                                <MdSearch />
                                            </InputGroup.Addon>
                                            <Input
                                                placeholder="Search groups..."
                                                value={searchQuery}
                                                onChange={(value) =>
                                                    setSearchQuery(value)
                                                }
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Group>
                                        <SelectPicker
                                            placeholder="Status"
                                            data={statusOptions}
                                            value={statusFilter}
                                            onChange={setStatusFilter}
                                            cleanable
                                        />
                                    </Form.Group>
                                    {/* <Form.Group>
                                        <SelectPicker
                                            placeholder="Language"
                                            data={languageOptions}
                                            value={languageFilter}
                                            onChange={setLanguageFilter}
                                            cleanable
                                        />
                                    </Form.Group> */}
                                </Col>
                                <Col xs={24} md={8}></Col>
                            </Row>
                        </Form>
                    </Panel>

                    <Panel bordered>
                        <Table
                            data={filteredGroups || []}
                            loading={isLoading}
                            autoHeight
                        >
                            <Column flexGrow={1}>
                                <HeaderCell>Group Name</HeaderCell>
                                <Cell>
                                    {(rowData: Group) => (
                                        <div className="flex items-center">
                                            {rowData.tg_group_image && (
                                                <img
                                                    src={rowData.tg_group_image}
                                                    alt={rowData.tg_group_name}
                                                    className="w-8 h-8 rounded-full mr-3"
                                                />
                                            )}
                                            <span>{rowData.tg_group_name}</span>
                                        </div>
                                    )}
                                </Cell>
                            </Column>

                            <Column flexGrow={1}>
                                <HeaderCell>Group ID</HeaderCell>
                                <Cell dataKey="tg_group_id" />
                            </Column>

                            {/* <Column flexGrow={1}>
                                <HeaderCell>Language</HeaderCell>
                                <Cell>
                                    {(rowData: Group) => (
                                        <Tag color="blue">
                                            {rowData.settings.language}
                                        </Tag>
                                    )}
                                </Cell>
                            </Column> */}

                            <Column flexGrow={1}>
                                <HeaderCell>Users</HeaderCell>
                                <Cell>
                                    {(rowData: Group) => (
                                        <Badge
                                            content={rowData.stats.users}
                                            color="blue"
                                        />
                                    )}
                                </Cell>
                            </Column>

                            <Column flexGrow={1}>
                                <HeaderCell>Status</HeaderCell>
                                <Cell>
                                    {(rowData: Group) => (
                                        <Tag
                                            color={
                                                rowData.deleted_at
                                                    ? 'red'
                                                    : 'green'
                                            }
                                        >
                                            {rowData.deleted_at
                                                ? 'Deleted'
                                                : 'Active'}
                                        </Tag>
                                    )}
                                </Cell>
                            </Column>

                            <Column flexGrow={1}>
                                <HeaderCell>Actions</HeaderCell>
                                <Cell>
                                    {(rowData: Group) => (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                appearance="ghost"
                                                color="blue"
                                                onClick={() =>
                                                    navigate(
                                                        `/groups/${rowData._id}/settings`
                                                    )
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                appearance="ghost"
                                                color="red"
                                                onClick={() => {}}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    )}
                                </Cell>
                            </Column>
                        </Table>
                    </Panel>
                </div>
            </div>
        </div>
    );
};

export default GroupsPage;
