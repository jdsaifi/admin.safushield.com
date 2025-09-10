import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import {
    Form,
    Button,
    Input,
    Toggle,
    Message,
    Loader,
    ButtonGroup,
    TagInput,
} from 'rsuite';
import {
    MdArrowBack,
    MdSave,
    MdRefresh,
    MdContentCopy,
    MdAdd,
    MdDelete,
} from 'react-icons/md';
import Sidebar from '../../components/Sidebar';
import { Group } from '../../types/group';
import api from '../../lib/axios';
import { toast } from 'sonner';

const { Group: FormGroup } = Form;

interface FormData {
    settings: {
        website: string;
        tg_channel: string;
        contract_address: string;
        language: string;
        greeting_enabled: boolean;
        captcha_enabled: boolean;
        forward_enabled: boolean;
        flood_enabled: boolean;
        link_enabled: boolean;
        announce_bans_enabled: boolean;
        mention_enabled: boolean;
        ca_enabled: boolean;
        adminAIMessageEnabled: boolean;
        buybot_enabled: boolean;
    };
    greeting: {
        welcomeMessage: string;
        buttons: Array<
            Array<{
                text: string;
                url: string;
            }>
        >;
    };
    agentEnabled: boolean;
    agentAge: number;
    agentTriggerKeywords: string;
    knowledge: string;
    responseStyle: string;
    restrictedProfileNames: string[];
    banned_words: string[];
    whitelisted_links: string[];
}

const GroupSettingsPage = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    // const [showFeatureModal, setShowFeatureModal] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { isDirty, isValid },
    } = useForm<FormData>({
        defaultValues: {
            settings: {
                website: '',
                tg_channel: '',
                contract_address: '',
                language: 'EN',
                greeting_enabled: false,
                captcha_enabled: false,
                forward_enabled: false,
                flood_enabled: false,
                link_enabled: false,
                announce_bans_enabled: false,
                mention_enabled: false,
                ca_enabled: false,
                adminAIMessageEnabled: false,
                buybot_enabled: false,
            },
            greeting: {
                welcomeMessage: '',
                buttons: [],
            },
            agentEnabled: false,
            agentAge: 0,
            agentTriggerKeywords: '',
            knowledge: '',
            responseStyle: '',
            restrictedProfileNames: [],
            banned_words: [],
            whitelisted_links: [],
        },
        mode: 'onChange',
    });

    const watchedValues = watch();

    // Fetch group details
    const {
        data: group,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['group', groupId],
        queryFn: async () => {
            const response = await api.get(`/v1/admin/groups/${groupId}`);
            return response.data.data[0] as Group;
        },
        enabled: !!groupId,
    });

    // console.log('group details: ', group);

    // if (error) {
    //     return <div>Error loading group settings</div>;
    // }

    // Update group mutation
    const updateGroupMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await api.put(
                `/v1/admin/groups/${groupId}/settings`,
                data
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success('Group settings updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['group', groupId] });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
        onError: (error: unknown) => {
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ||
                'Failed to update group settings';
            toast.error(errorMessage);
        },
    });

    // Initialize form when group data is loaded
    useEffect(() => {
        if (group) {
            reset({
                settings: {
                    website: group.settings.website || '',
                    tg_channel: group.settings.tg_channel || '',
                    contract_address: group.settings.contract_address || '',
                    language: group.settings.language,
                    greeting_enabled: group.settings.greeting_enabled,
                    captcha_enabled: group.settings.captcha_enabled,
                    forward_enabled: group.settings.forward_enabled,
                    flood_enabled: group.settings.flood_enabled,
                    link_enabled: group.settings.link_enabled,
                    announce_bans_enabled: group.settings.announce_bans_enabled,
                    mention_enabled: group.settings.mention_enabled,
                    ca_enabled: group.settings.ca_enabled,
                    adminAIMessageEnabled: group.settings.adminAIMessageEnabled,
                    buybot_enabled: group.settings.buybot_enabled,
                },
                greeting: {
                    welcomeMessage: group.greeting?.message || '',
                    buttons: group.greeting?.buttons || [],
                },
                agentEnabled: group.agentEnabled,
                agentAge: group.agentAge,
                agentTriggerKeywords: group.agentTriggerKeywords,
                knowledge: group.knowledge,
                responseStyle: group.responseStyle,
                restrictedProfileNames: Array.isArray(
                    group.restrictedProfileNames
                )
                    ? group.restrictedProfileNames
                    : group.restrictedProfileNames
                    ? group.restrictedProfileNames
                          .split(',')
                          .map((name) => name.trim())
                          .filter((name) => name.length > 0)
                    : [],
                banned_words: Array.isArray(group.banned_words)
                    ? group.banned_words
                    : [],
                // /group.banned_words?.join(',') || '',
                whitelisted_links: group.whitelisted_links || [],
            });
        }
    }, [group, reset]);

    const onSubmit = (data: FormData) => {
        // console.log('Form data: ', data);
        updateGroupMutation.mutate(data);
    };

    if (isLoading) {
        return (
            <div className="flex h-screen">
                <Sidebar activeKey="3" onSelect={() => {}} />
                <div className="flex-1 flex items-center justify-center">
                    <Loader size="md" content="Loading group settings..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen">
                <Sidebar activeKey="3" onSelect={() => {}} />
                <div className="flex-1 flex items-center justify-center">
                    <Message type="error" title="Error">
                        Failed to load group settings
                    </Message>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            <Sidebar activeKey="3" onSelect={() => {}} />

            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">
                                    Group Settings
                                </h1>
                                <p className="text-gray-600 font-semibold">
                                    Group: {group?.tg_group_name}
                                </p>
                            </div>
                        </div>
                        <ButtonGroup>
                            <Button
                                appearance="ghost"
                                onClick={() => navigate('/groups')}
                                className="mr-4"
                            >
                                <MdArrowBack className="mr-2" />
                                Back to Groups
                            </Button>
                            <Button
                                appearance="ghost"
                                onClick={() => window.location.reload()}
                            >
                                <MdRefresh className="mr-2" />
                                Refresh
                            </Button>
                            <Button
                                appearance="primary"
                                onClick={handleSubmit(onSubmit)}
                                loading={updateGroupMutation.isPending}
                            >
                                <MdSave className="mr-2" />
                                Save Changes
                            </Button>
                        </ButtonGroup>
                    </div>

                    <div className="flex gap-6">
                        {/* Left Column - Main Settings */}
                        <div className="flex-1">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit(onSubmit)();
                                }}
                            >
                                {/* Website */}
                                <div className="mb-6">
                                    <FormGroup>
                                        <Form.ControlLabel>
                                            Website
                                        </Form.ControlLabel>
                                        <Controller
                                            name="settings.website"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder="https://example.com"
                                                />
                                            )}
                                        />
                                    </FormGroup>
                                </div>

                                {/* Telegram Channel */}
                                <div className="mb-6">
                                    <FormGroup>
                                        <Form.ControlLabel>
                                            Telegram channel
                                        </Form.ControlLabel>
                                        <Controller
                                            name="settings.tg_channel"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder="@channel_username"
                                                />
                                            )}
                                        />
                                    </FormGroup>
                                </div>

                                {/* Banned Words */}
                                <div className="mb-6">
                                    <FormGroup>
                                        <Form.ControlLabel>
                                            Banned words list
                                        </Form.ControlLabel>
                                        {/* <Controller
                                            name="banned_words"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    as="textarea"
                                                    placeholder="Enter comma separated list of words that will be banned from the group."
                                                    rows={3}
                                                    value={field.value}
                                                    onChange={(value) => {
                                                        field.onChange(value);
                                                    }}
                                                />
                                            )}
                                        /> */}

                                        <Controller
                                            name="banned_words"
                                            control={control}
                                            render={({ field }) => (
                                                <TagInput
                                                    placeholder="Enter restricted profile names (e.g., John, Jane, Admin)"
                                                    value={field.value || []}
                                                    onChange={(value) => {
                                                        // Validate profile names (basic validation - no empty strings)
                                                        const validNames =
                                                            value.filter(
                                                                (
                                                                    name: string
                                                                ) => {
                                                                    return (
                                                                        name.trim()
                                                                            .length >
                                                                        0
                                                                    );
                                                                }
                                                            );

                                                        // Show warning for empty names
                                                        const invalidNames =
                                                            value.filter(
                                                                (
                                                                    name: string
                                                                ) => {
                                                                    return (
                                                                        name.trim()
                                                                            .length ===
                                                                        0
                                                                    );
                                                                }
                                                            );

                                                        if (
                                                            invalidNames.length >
                                                            0
                                                        ) {
                                                            toast.error(
                                                                'Empty profile names are not allowed'
                                                            );
                                                        }

                                                        field.onChange(
                                                            validNames
                                                        );
                                                    }}
                                                    trigger={['Enter', 'Comma']}
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                        />
                                        <Form.HelpText>
                                            Add banned words as tags. Press
                                            Enter or comma to add a new word.
                                            These words will be banned from the
                                            group.
                                        </Form.HelpText>
                                    </FormGroup>
                                </div>

                                {/* Restricted Profile Names */}
                                <div className="mb-6">
                                    <FormGroup>
                                        <Form.ControlLabel>
                                            Restricted profile names
                                        </Form.ControlLabel>
                                        <Controller
                                            name="restrictedProfileNames"
                                            control={control}
                                            render={({ field }) => (
                                                <TagInput
                                                    placeholder="Enter restricted profile names (e.g., John, Jane, Admin)"
                                                    value={field.value || []}
                                                    onChange={(value) => {
                                                        // Validate profile names (basic validation - no empty strings)
                                                        const validNames =
                                                            value.filter(
                                                                (
                                                                    name: string
                                                                ) => {
                                                                    return (
                                                                        name.trim()
                                                                            .length >
                                                                        0
                                                                    );
                                                                }
                                                            );

                                                        // Show warning for empty names
                                                        const invalidNames =
                                                            value.filter(
                                                                (
                                                                    name: string
                                                                ) => {
                                                                    return (
                                                                        name.trim()
                                                                            .length ===
                                                                        0
                                                                    );
                                                                }
                                                            );

                                                        if (
                                                            invalidNames.length >
                                                            0
                                                        ) {
                                                            toast.error(
                                                                'Empty profile names are not allowed'
                                                            );
                                                        }

                                                        field.onChange(
                                                            validNames
                                                        );
                                                    }}
                                                    trigger={['Enter', 'Comma']}
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                        />
                                        <Form.HelpText>
                                            Add profile names as tags. Press
                                            Enter or comma to add a new name.
                                            These names will be restricted from
                                            joining the group.
                                        </Form.HelpText>
                                    </FormGroup>
                                </div>

                                {/* Contract Address */}
                                <div className="mb-6">
                                    <FormGroup>
                                        <Form.ControlLabel>
                                            Enter Contract Address
                                        </Form.ControlLabel>
                                        <Controller
                                            name="settings.contract_address"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    as="textarea"
                                                    {...field}
                                                    placeholder="Enter contract address information"
                                                    rows={4}
                                                />
                                            )}
                                        />
                                    </FormGroup>
                                </div>

                                {/* whitelisted_links list */}
                                <div className="mb-6">
                                    <FormGroup>
                                        <Form.ControlLabel>
                                            Whitelisted Links
                                        </Form.ControlLabel>
                                        <Controller
                                            name="whitelisted_links"
                                            control={control}
                                            render={({ field }) => (
                                                <TagInput
                                                    placeholder="Enter whitelisted links (e.g., https://example.com)"
                                                    value={field.value || []}
                                                    onChange={(value) => {
                                                        // Validate URLs before adding
                                                        const validUrls =
                                                            value.filter(
                                                                (
                                                                    url: string
                                                                ) => {
                                                                    try {
                                                                        new URL(
                                                                            url
                                                                        );
                                                                        return true;
                                                                    } catch {
                                                                        return false;
                                                                    }
                                                                }
                                                            );

                                                        // Show warning for invalid URLs
                                                        const invalidUrls =
                                                            value.filter(
                                                                (
                                                                    url: string
                                                                ) => {
                                                                    try {
                                                                        new URL(
                                                                            url
                                                                        );
                                                                        return false;
                                                                    } catch {
                                                                        return true;
                                                                    }
                                                                }
                                                            );

                                                        if (
                                                            invalidUrls.length >
                                                            0
                                                        ) {
                                                            toast.error(
                                                                `Invalid URLs detected: ${invalidUrls.join(
                                                                    ', '
                                                                )}`
                                                            );
                                                        }

                                                        field.onChange(
                                                            validUrls
                                                        );
                                                    }}
                                                    trigger={['Enter', 'Comma']}
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                        />
                                        <Form.HelpText>
                                            Add URLs as tags. Press Enter or
                                            comma to add a new link. Only these
                                            links will be allowed when link
                                            protection is enabled.
                                        </Form.HelpText>
                                    </FormGroup>
                                </div>

                                {/* Feature Toggles */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Feature Settings
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Captcha */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-800">
                                                    Captcha
                                                </h4>
                                                <Controller
                                                    name="settings.captcha_enabled"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Toggle
                                                            checked={
                                                                field.value
                                                            }
                                                            onChange={
                                                                field.onChange
                                                            }
                                                            size="lg"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Enable Captcha to protect your
                                                group from automated bots. This
                                                is optional and can be disabled
                                                at any time.
                                            </p>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${
                                                    watchedValues.settings
                                                        ?.captcha_enabled
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {watchedValues.settings
                                                    ?.captcha_enabled
                                                    ? 'Feature Activated'
                                                    : 'Feature Deactivated'}
                                            </span>
                                        </div>

                                        {/* Forwards */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-800">
                                                    Forwards
                                                </h4>
                                                <Controller
                                                    name="settings.forward_enabled"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Toggle
                                                            checked={
                                                                field.value
                                                            }
                                                            onChange={
                                                                field.onChange
                                                            }
                                                            size="lg"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Enable Forwards to protect your
                                                group from unwanted forwarded
                                                messages.
                                            </p>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${
                                                    watchedValues.settings
                                                        ?.forward_enabled
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {watchedValues.settings
                                                    ?.forward_enabled
                                                    ? 'Feature Activated'
                                                    : 'Feature Deactivated'}
                                            </span>
                                        </div>

                                        {/* CA (Contract Address) */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-800">
                                                    CA (Contract Address)
                                                </h4>
                                                <Controller
                                                    name="settings.ca_enabled"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Toggle
                                                            checked={
                                                                field.value
                                                            }
                                                            onChange={
                                                                field.onChange
                                                            }
                                                            size="lg"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Enable CA to protect your group
                                                from unwanted messages that
                                                contains contract address or
                                                blockchain address other then
                                                your own contract address.
                                            </p>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${
                                                    watchedValues.settings
                                                        ?.ca_enabled
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {watchedValues.settings
                                                    ?.ca_enabled
                                                    ? 'Feature Activated'
                                                    : 'Feature Deactivated'}
                                            </span>
                                        </div>

                                        {/* Mention */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-800">
                                                    Mention
                                                </h4>
                                                <Controller
                                                    name="settings.mention_enabled"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Toggle
                                                            checked={
                                                                field.value
                                                            }
                                                            onChange={
                                                                field.onChange
                                                            }
                                                            size="lg"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Enable mention to protect your
                                                group from unwanted user's
                                                mentions in the group.
                                            </p>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${
                                                    watchedValues.settings
                                                        ?.mention_enabled
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {watchedValues.settings
                                                    ?.mention_enabled
                                                    ? 'Feature Activated'
                                                    : 'Feature Deactivated'}
                                            </span>
                                        </div>

                                        {/* link_enabled */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-800">
                                                    Whitelisted Links
                                                </h4>
                                                <Controller
                                                    name="settings.link_enabled"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Toggle
                                                            checked={
                                                                field.value
                                                            }
                                                            onChange={
                                                                field.onChange
                                                            }
                                                            size="lg"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Enable whitelisted links to
                                                protect your group from unwanted
                                                user's links in the group.
                                            </p>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${
                                                    watchedValues.settings
                                                        ?.link_enabled
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {watchedValues.settings
                                                    ?.link_enabled
                                                    ? 'Feature Activated'
                                                    : 'Feature Deactivated'}
                                            </span>
                                        </div>

                                        {/* greeting_enabled */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-800">
                                                    Greetings
                                                </h4>
                                                <Controller
                                                    name="settings.greeting_enabled"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Toggle
                                                            checked={
                                                                field.value
                                                            }
                                                            onChange={
                                                                field.onChange
                                                            }
                                                            size="lg"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                Enable user's greetings in the
                                                group.
                                            </p>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${
                                                    watchedValues.settings
                                                        ?.greeting_enabled
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {watchedValues.settings
                                                    ?.greeting_enabled
                                                    ? 'Feature Activated'
                                                    : 'Feature Deactivated'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Greeting Settings */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Greeting Settings
                                    </h3>

                                    <div className="mt-3">
                                        <FormGroup>
                                            <Form.ControlLabel>
                                                Greeting Message
                                            </Form.ControlLabel>
                                            <Controller
                                                name="greeting.welcomeMessage"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        as="textarea"
                                                        {...field}
                                                        placeholder="Enter your greeting message"
                                                        rows={4}
                                                    />
                                                )}
                                            />
                                        </FormGroup>
                                    </div>

                                    <div className="mt-6">
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                                                        <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                            <span className="text-blue-600 font-bold text-sm">
                                                                📱
                                                            </span>
                                                        </span>
                                                        Greeting Buttons
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Create interactive
                                                        buttons for your
                                                        greeting messages
                                                    </p>
                                                </div>
                                                <Controller
                                                    name="greeting.buttons"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Button
                                                            size="sm"
                                                            appearance="primary"
                                                            className="shadow-sm"
                                                            onClick={() => {
                                                                if (
                                                                    field.value
                                                                        .length <
                                                                    16
                                                                ) {
                                                                    field.onChange(
                                                                        [
                                                                            ...field.value,
                                                                            [
                                                                                {
                                                                                    text: '',
                                                                                    url: '',
                                                                                },
                                                                            ],
                                                                        ]
                                                                    );
                                                                    toast.success(
                                                                        'New button row added!'
                                                                    );
                                                                } else {
                                                                    toast.error(
                                                                        'Maximum 16 button rows allowed'
                                                                    );
                                                                }
                                                            }}
                                                            disabled={
                                                                field.value
                                                                    .length >=
                                                                16
                                                            }
                                                        >
                                                            <MdAdd className="mr-2" />
                                                            Add Row
                                                        </Button>
                                                    )}
                                                />
                                            </div>

                                            <Controller
                                                name="greeting.buttons"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="space-y-4">
                                                        {field.value.map(
                                                            (
                                                                buttonRow: Array<{
                                                                    text: string;
                                                                    url: string;
                                                                }>,
                                                                rowIndex: number
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        rowIndex
                                                                    }
                                                                    className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
                                                                >
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <div className="flex items-center">
                                                                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                                                <span className="text-blue-600 font-bold text-xs">
                                                                                    {rowIndex +
                                                                                        1}
                                                                                </span>
                                                                            </div>
                                                                            <span className="text-sm font-medium text-gray-700">
                                                                                Button
                                                                                Row{' '}
                                                                                {rowIndex +
                                                                                    1}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                            <Button
                                                                                size="sm"
                                                                                appearance="ghost"
                                                                                className="hover:bg-blue-50"
                                                                                onClick={() => {
                                                                                    const newButtons =
                                                                                        [
                                                                                            ...field.value,
                                                                                        ];
                                                                                    if (
                                                                                        newButtons[
                                                                                            rowIndex
                                                                                        ]
                                                                                            .length <
                                                                                        4
                                                                                    ) {
                                                                                        newButtons[
                                                                                            rowIndex
                                                                                        ] =
                                                                                            [
                                                                                                ...newButtons[
                                                                                                    rowIndex
                                                                                                ],
                                                                                                {
                                                                                                    text: '',
                                                                                                    url: '',
                                                                                                },
                                                                                            ];
                                                                                        field.onChange(
                                                                                            newButtons
                                                                                        );
                                                                                        toast.success(
                                                                                            'Button added to row!'
                                                                                        );
                                                                                    } else {
                                                                                        toast.error(
                                                                                            'Maximum 4 buttons per row'
                                                                                        );
                                                                                    }
                                                                                }}
                                                                                disabled={
                                                                                    field
                                                                                        .value[
                                                                                        rowIndex
                                                                                    ]
                                                                                        ?.length >=
                                                                                    4
                                                                                }
                                                                            >
                                                                                <MdAdd className="text-blue-500" />
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                appearance="ghost"
                                                                                color="red"
                                                                                className="hover:bg-red-50"
                                                                                onClick={() => {
                                                                                    const newButtons =
                                                                                        field.value.filter(
                                                                                            (
                                                                                                _: Array<{
                                                                                                    text: string;
                                                                                                    url: string;
                                                                                                }>,
                                                                                                index: number
                                                                                            ) =>
                                                                                                index !==
                                                                                                rowIndex
                                                                                        );
                                                                                    field.onChange(
                                                                                        newButtons
                                                                                    );
                                                                                    toast.success(
                                                                                        'Button row removed'
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <MdDelete className="text-red-500" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-4">
                                                                        {buttonRow.map(
                                                                            (
                                                                                button,
                                                                                buttonIndex
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        buttonIndex
                                                                                    }
                                                                                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                                                                                >
                                                                                    <div className="flex items-center justify-between mb-3">
                                                                                        <div className="flex items-center">
                                                                                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                                                                <span className="text-blue-600 font-bold text-xs">
                                                                                                    {buttonIndex +
                                                                                                        1}
                                                                                                </span>
                                                                                            </div>
                                                                                            <h5 className="text-sm font-medium text-gray-700">
                                                                                                Button{' '}
                                                                                                {buttonIndex +
                                                                                                    1}
                                                                                            </h5>
                                                                                        </div>
                                                                                        {buttonRow.length >
                                                                                            1 && (
                                                                                            <Button
                                                                                                size="sm"
                                                                                                appearance="ghost"
                                                                                                color="red"
                                                                                                className="hover:bg-red-50"
                                                                                                onClick={() => {
                                                                                                    const newButtons =
                                                                                                        [
                                                                                                            ...field.value,
                                                                                                        ];
                                                                                                    newButtons[
                                                                                                        rowIndex
                                                                                                    ] =
                                                                                                        newButtons[
                                                                                                            rowIndex
                                                                                                        ].filter(
                                                                                                            (
                                                                                                                _,
                                                                                                                index
                                                                                                            ) =>
                                                                                                                index !==
                                                                                                                buttonIndex
                                                                                                        );
                                                                                                    field.onChange(
                                                                                                        newButtons
                                                                                                    );
                                                                                                    toast.success(
                                                                                                        'Button removed'
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                <MdDelete className="text-red-500" />
                                                                                            </Button>
                                                                                        )}
                                                                                    </div>

                                                                                    <div className="space-y-3">
                                                                                        <div>
                                                                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                                                                Button
                                                                                                Text
                                                                                            </label>
                                                                                            <Input
                                                                                                size="sm"
                                                                                                placeholder="Enter button text (e.g., Visit Website)"
                                                                                                value={
                                                                                                    button.text ||
                                                                                                    ''
                                                                                                }
                                                                                                onChange={(
                                                                                                    value
                                                                                                ) => {
                                                                                                    const newButtons =
                                                                                                        [
                                                                                                            ...field.value,
                                                                                                        ];
                                                                                                    newButtons[
                                                                                                        rowIndex
                                                                                                    ][
                                                                                                        buttonIndex
                                                                                                    ] =
                                                                                                        {
                                                                                                            ...newButtons[
                                                                                                                rowIndex
                                                                                                            ][
                                                                                                                buttonIndex
                                                                                                            ],
                                                                                                            text: value,
                                                                                                        };
                                                                                                    field.onChange(
                                                                                                        newButtons
                                                                                                    );
                                                                                                }}
                                                                                                className="border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                                                                                            />
                                                                                        </div>

                                                                                        <div>
                                                                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                                                                Button
                                                                                                URL
                                                                                            </label>
                                                                                            <Input
                                                                                                size="sm"
                                                                                                placeholder="https://example.com"
                                                                                                value={
                                                                                                    button.url ||
                                                                                                    ''
                                                                                                }
                                                                                                onChange={(
                                                                                                    value
                                                                                                ) => {
                                                                                                    const newButtons =
                                                                                                        [
                                                                                                            ...field.value,
                                                                                                        ];
                                                                                                    newButtons[
                                                                                                        rowIndex
                                                                                                    ][
                                                                                                        buttonIndex
                                                                                                    ] =
                                                                                                        {
                                                                                                            ...newButtons[
                                                                                                                rowIndex
                                                                                                            ][
                                                                                                                buttonIndex
                                                                                                            ],
                                                                                                            url: value,
                                                                                                        };
                                                                                                    field.onChange(
                                                                                                        newButtons
                                                                                                    );
                                                                                                }}
                                                                                                className="border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                                                                                            />
                                                                                        </div>

                                                                                        {(button.text ||
                                                                                            button.url) && (
                                                                                            <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                                                                                                ✓
                                                                                                Button
                                                                                                configured
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}

                                                        {field.value.length ===
                                                            0 && (
                                                            <div className="text-center py-12 bg-white border-2 border-dashed border-gray-200 rounded-lg">
                                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                    <MdAdd className="text-2xl text-gray-400" />
                                                                </div>
                                                                <h3 className="text-lg font-medium text-gray-700 mb-2">
                                                                    No greeting
                                                                    buttons yet
                                                                </h3>
                                                                <p className="text-gray-500 mb-4">
                                                                    Create
                                                                    interactive
                                                                    buttons to
                                                                    enhance your
                                                                    greeting
                                                                    messages
                                                                </p>
                                                                <Button
                                                                    appearance="primary"
                                                                    onClick={() => {
                                                                        field.onChange(
                                                                            [
                                                                                [
                                                                                    {
                                                                                        text: '',
                                                                                        url: '',
                                                                                    },
                                                                                ],
                                                                            ]
                                                                        );
                                                                        toast.success(
                                                                            'First button row added!'
                                                                        );
                                                                    }}
                                                                >
                                                                    <MdAdd className="mr-2" />
                                                                    Create Your
                                                                    First Row
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            />

                                            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <div className="flex items-start">
                                                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                                        <span className="text-blue-600 text-xs">
                                                            💡
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-blue-800">
                                                        <p className="font-medium mb-2">
                                                            Tips for great
                                                            greeting buttons:
                                                        </p>
                                                        <ul className="space-y-1 text-blue-700">
                                                            <li>
                                                                • Use clear,
                                                                action-oriented
                                                                button text
                                                                (e.g., "Join
                                                                Community",
                                                                "Learn More")
                                                            </li>
                                                            <li>
                                                                • Maximum 4
                                                                buttons per row
                                                                for best mobile
                                                                experience
                                                            </li>
                                                            <li>
                                                                • Leave fields
                                                                empty to skip
                                                                unused button
                                                                slots
                                                            </li>
                                                            <li>
                                                                • Test your URLs
                                                                to ensure they
                                                                work properly
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="mb-6">
                                    <Button
                                        type="submit"
                                        appearance="primary"
                                        size="lg"
                                        className="w-full"
                                        loading={updateGroupMutation.isPending}
                                        disabled={!isDirty || !isValid}
                                    >
                                        <MdSave className="mr-2" />
                                        Save Group Settings
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Right Column - Quick Access */}
                        <div className="w-80">
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                {/* Group ID */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                                        Group ID
                                    </h3>
                                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                        <span className="text-sm font-mono text-gray-800">
                                            {group?.tg_group_id}
                                        </span>
                                        <Button
                                            size="sm"
                                            appearance="ghost"
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    group?.tg_group_id || ''
                                                );
                                                toast.success(
                                                    'Group ID copied to clipboard'
                                                );
                                            }}
                                        >
                                            <MdContentCopy />
                                        </Button>
                                    </div>
                                </div>

                                {/* View All Groups Link */}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <Button
                                        appearance="ghost"
                                        className="w-full"
                                        onClick={() => navigate('/groups')}
                                    >
                                        View all groups
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupSettingsPage;
