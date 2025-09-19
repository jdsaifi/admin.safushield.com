import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import EmojiPicker from 'emoji-picker-react';
import {
    Form,
    Button,
    Input,
    Message,
    Loader,
    ButtonGroup,
    Table,
    Modal,
    IconButton,
    Tooltip,
    Whisper,
    Tag,
    Panel,
} from 'rsuite';
import {
    MdArrowBack,
    MdAdd,
    MdEdit,
    MdDelete,
    MdRefresh,
    MdContentCopy,
} from 'react-icons/md';
import Sidebar from '../../components/Sidebar';
import {
    BuybotToken,
    CreateTokenData,
    UpdateTokenData,
} from '../../types/buybot';

// Extended type for tokens with media
interface BuybotTokenWithMedia extends BuybotToken {
    media_name?: string;
}
import api from '../../lib/axios';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const { Column, HeaderCell, Cell } = Table;

interface TokenFormData {
    network: string;
    address: string;
    minBuy: number;
    chartTool: string;
    marketCap: string | number;
    socialMedia: {
        twitter: boolean;
        telegram: boolean;
        website: boolean;
    };
    buyEmoji: string;
    buyMedia: File | null;
}

const BuyBotPage = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [showModal, setShowModal] = useState(false);
    const [editingToken, setEditingToken] = useState<BuybotToken | null>(null);
    const [deleteToken, setDeleteToken] = useState<BuybotToken | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { control, handleSubmit, reset, setValue } = useForm<TokenFormData>({
        defaultValues: {
            network: '',
            address: '',
            minBuy: 0,
            chartTool: 'DexTools',
            marketCap: '',
            socialMedia: {
                twitter: true,
                telegram: true,
                website: true,
            },
            buyEmoji: '',
            buyMedia: null,
        },
    });

    const [selectedEmoji, setSelectedEmoji] = useState('🪙');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Fetch tokens
    const {
        data: groupData,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['buybot-tokens', groupId],
        queryFn: async () => {
            const response = await api.get(`/v1/admin/groups/${groupId}`);
            console.log('response: ', response.data);
            return response.data?.data[0];
            // response.data.data[0].buybot as BuybotToken[];
        },
        enabled: !!groupId,
    });

    console.log('tokens---->>>: ', groupData?.buybot);

    // Create token mutation
    const createTokenMutation = useMutation({
        mutationFn: async (tokenData: CreateTokenData) => {
            ///v1/admin/groups/:groupId/buybot
            const response = await api.post(
                `/v1/admin/groups/${groupId}/buybot`,
                tokenData
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['buybot-tokens', groupId],
            });
            toast.success('Token added successfully');
            setShowModal(false);
            reset();
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error && 'response' in error
                    ? (error as { response?: { data?: { message?: string } } })
                          .response?.data?.message || 'Failed to add token'
                    : 'Failed to add token';
            toast.error(errorMessage);
        },
    });

    // Update token mutation
    const updateTokenMutation = useMutation({
        mutationFn: async ({ _id, ...tokenData }: UpdateTokenData) => {
            ///v1/admin/groups/:groupId/buybot
            const response = await api.put(
                `/v1/admin/groups/${groupId}/buybot/${_id}`,
                tokenData
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['buybot-tokens', groupId],
            });
            toast.success('Token updated successfully');
            setShowModal(false);
            setEditingToken(null);
            reset();
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error && 'response' in error
                    ? (error as { response?: { data?: { message?: string } } })
                          .response?.data?.message || 'Failed to update token'
                    : 'Failed to update token';
            toast.error(errorMessage);
        },
    });

    // Delete token mutation
    const deleteTokenMutation = useMutation({
        mutationFn: async (tokenId: string) => {
            ///v1/admin/groups/:groupId/buybot/:id
            await api.delete(`/v1/admin/groups/${groupId}/buybot/${tokenId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['buybot-tokens', groupId],
            });
            toast.success('Token deleted successfully');
            setShowDeleteModal(false);
            setDeleteToken(null);
        },
        onError: (error: unknown) => {
            const errorMessage =
                error instanceof Error && 'response' in error
                    ? (error as { response?: { data?: { message?: string } } })
                          .response?.data?.message || 'Failed to delete token'
                    : 'Failed to delete token';
            toast.error(errorMessage);
        },
    });

    // upload buybot media
    const uploadBuybotMediaMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await api.post(
                '/v1/admin/buybot/media',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            return response.data;
        },
        onSuccess: (data) => {
            console.log('upload buybot media success: ', data);
        },
        onError: (error) => {
            console.log('upload buybot media error: ', error);
        },
    });

    const handleAddToken = () => {
        setEditingToken(null);
        reset();
        setSelectedEmoji('🪙');
        setShowEmojiPicker(false);
        setSelectedFile(null);
        setShowModal(true);
    };

    const handleEditToken = (token: BuybotToken) => {
        setEditingToken(token);
        setValue('network', token.network);
        setValue('address', token.address);
        setValue('minBuy', token.minBuy);
        setValue('chartTool', token.chart_tool || '');
        setValue('marketCap', token.mcap_usd || '');
        setValue('socialMedia', {
            twitter: !!token.twitter,
            telegram: !!token.telegram,
            website: !!token.website,
        });
        setValue('buyEmoji', token.emoji);
        setSelectedEmoji(token.emoji);
        setShowModal(true);
    };

    const handleDeleteToken = (token: BuybotToken) => {
        setDeleteToken(token);
        setShowDeleteModal(true);
    };

    const onSubmit = async (data: TokenFormData) => {
        const tokenData: CreateTokenData = {
            address: data.address,
            network: data.network.toLowerCase(),
            emoji: selectedEmoji,
            minBuy: (data.minBuy || '1').toString(),
            chart_tool: data.chartTool,
            social_twitter_enabled: data.socialMedia.twitter,
            social_telegram_enabled: data.socialMedia.telegram,
            social_website_enabled: data.socialMedia.website,
            mcap_usd: data.marketCap,
        };

        // Handle media upload if file is selected
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            try {
                const rs = await uploadBuybotMediaMutation.mutateAsync(
                    formData
                );

                console.log('\n\n---->>>: upload buybot media success: ', rs);
                if (rs.status === 'success') {
                    const mediaData = rs.data[0];
                    tokenData.media_name = mediaData.fileName;
                    tokenData.media_mimetype = mediaData.mimetype;
                } else {
                    return toast.error('File upload failed');
                }
            } catch (err) {
                if (err instanceof AxiosError) {
                    console.log('axios error: ', err);
                    return toast.error(err.response?.data?.error?.messages[0]);
                } else {
                    return toast.error('File upload failed');
                }
            }
        }

        // console.log('Token data: ', tokenData);
        // createTokenMutation.mutate(tokenData);

        // Handle create or update based on editingToken state
        if (editingToken) {
            updateTokenMutation.mutate({ _id: editingToken._id, ...tokenData });
        } else {
            createTokenMutation.mutate(tokenData);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const handleEmojiSelect = (emoji: { emoji: string }) => {
        setSelectedEmoji(emoji.emoji);
        setValue('buyEmoji', emoji.emoji);
        setShowEmojiPicker(false);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = [
                'image/png',
                'image/jpeg',
                'image/jpg',
                'image/gif',
            ];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Please select a PNG, JPG, or GIF file');
                return;
            }

            // Validate file size (1MB max)
            if (file.size > 1024 * 1024) {
                toast.error('File size must be less than 1MB');
                return;
            }

            setValue('buyMedia', file);
            setSelectedFile(file);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen">
                <Sidebar activeKey="3" />
                <div className="flex-1 flex items-center justify-center">
                    <Loader size="lg" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen">
                <Sidebar activeKey="3" />
                <div className="flex-1 flex items-center justify-center">
                    <Message type="error">Failed to load tokens</Message>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar activeKey="3" />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button
                                appearance="subtle"
                                onClick={() => navigate(-1)}
                            >
                                <MdArrowBack className="mr-2" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    BuyBot Tokens
                                </h1>
                                <p className="text-gray-600">
                                    Group:{' '}
                                    <strong>
                                        {groupData?.tg_group_name} (
                                        {groupData?.tg_group_id})
                                    </strong>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                appearance="subtle"
                                onClick={() => refetch()}
                            >
                                <MdRefresh className="mr-2" />
                                Refresh
                            </Button>
                            <Button
                                appearance="primary"
                                onClick={handleAddToken}
                            >
                                <MdAdd className="mr-2" />
                                Add Token
                            </Button>
                        </div>
                    </div>

                    {/* Tokens Table */}
                    <Panel className="mb-6">
                        <div className="w-full overflow-x-auto">
                            <Table
                                data={groupData?.buybot || []}
                                height={400}
                                rowHeight={60}
                                loading={isLoading}
                                className="w-full min-w-[1200px]"
                                autoHeight={false}
                            >
                                <Column width={80} align="center" fixed>
                                    <HeaderCell>Emoji</HeaderCell>
                                    <Cell>
                                        {(rowData) => (
                                            <div className="text-center">
                                                <span className="text-2xl">
                                                    {rowData.emoji}
                                                </span>
                                            </div>
                                        )}
                                    </Cell>
                                </Column>
                                <Column width={150} fixed>
                                    <HeaderCell>Token</HeaderCell>
                                    <Cell>
                                        {(rowData) => (
                                            <div>
                                                <div className="font-semibold text-sm">
                                                    {rowData.symbol}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate">
                                                    {rowData.name}
                                                </div>
                                            </div>
                                        )}
                                    </Cell>
                                </Column>
                                <Column flexGrow={1} minWidth={250}>
                                    <HeaderCell>Address</HeaderCell>
                                    <Cell>
                                        {(rowData) => (
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-sm">
                                                    {rowData.address.slice(
                                                        0,
                                                        8
                                                    )}
                                                    ...
                                                    {rowData.address.slice(-6)}
                                                </span>
                                                <Whisper
                                                    speaker={
                                                        <Tooltip>
                                                            Copy address
                                                        </Tooltip>
                                                    }
                                                >
                                                    <IconButton
                                                        size="xs"
                                                        icon={<MdContentCopy />}
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                rowData.address
                                                            )
                                                        }
                                                    />
                                                </Whisper>
                                            </div>
                                        )}
                                    </Cell>
                                </Column>
                                <Column width={150}>
                                    <HeaderCell>Network</HeaderCell>
                                    <Cell>
                                        {(rowData) => (
                                            <Tag color="blue" size="sm">
                                                {rowData.networkName}
                                            </Tag>
                                        )}
                                    </Cell>
                                </Column>
                                <Column width={100}>
                                    <HeaderCell>Min Buy</HeaderCell>
                                    <Cell>
                                        {(rowData) => (
                                            <span className="font-semibold text-sm">
                                                ${rowData.minBuy}
                                            </span>
                                        )}
                                    </Cell>
                                </Column>
                                <Column flexGrow={1} minWidth={200}>
                                    <HeaderCell>Pool</HeaderCell>
                                    <Cell>
                                        {(rowData) => (
                                            <div>
                                                <div className="text-sm font-medium">
                                                    {rowData.pool.dex}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate">
                                                    {rowData.pool.pair}
                                                </div>
                                            </div>
                                        )}
                                    </Cell>
                                </Column>
                                <Column width={120}>
                                    <HeaderCell>Social</HeaderCell>
                                    <Cell>
                                        {(rowData) => (
                                            <div className="flex gap-1 flex-wrap">
                                                {rowData.telegram && (
                                                    <Tag size="sm" color="cyan">
                                                        TG
                                                    </Tag>
                                                )}
                                                {rowData.twitter && (
                                                    <Tag size="sm" color="blue">
                                                        TW
                                                    </Tag>
                                                )}
                                                {rowData.website && (
                                                    <Tag
                                                        size="sm"
                                                        color="green"
                                                    >
                                                        WEB
                                                    </Tag>
                                                )}
                                            </div>
                                        )}
                                    </Cell>
                                </Column>
                                <Column width={120} fixed="right">
                                    <HeaderCell>Actions</HeaderCell>
                                    <Cell>
                                        {(rowData) => (
                                            <ButtonGroup size="sm">
                                                <Whisper
                                                    speaker={
                                                        <Tooltip>
                                                            Edit token
                                                        </Tooltip>
                                                    }
                                                    placement="left"
                                                >
                                                    <IconButton
                                                        icon={<MdEdit />}
                                                        onClick={() =>
                                                            handleEditToken(
                                                                rowData as BuybotToken
                                                            )
                                                        }
                                                    />
                                                </Whisper>
                                                <Whisper
                                                    speaker={
                                                        <Tooltip>
                                                            Delete token
                                                        </Tooltip>
                                                    }
                                                    placement="left"
                                                >
                                                    <IconButton
                                                        icon={<MdDelete />}
                                                        color="red"
                                                        onClick={() =>
                                                            handleDeleteToken(
                                                                rowData as BuybotToken
                                                            )
                                                        }
                                                    />
                                                </Whisper>
                                            </ButtonGroup>
                                        )}
                                    </Cell>
                                </Column>
                            </Table>
                        </div>
                    </Panel>

                    {/* Add Token Contract Modal */}
                    <Modal
                        open={showModal}
                        onClose={() => {
                            setShowModal(false);
                            setEditingToken(null);
                            reset();
                            setSelectedEmoji('🪙');
                            setShowEmojiPicker(false);
                        }}
                        size="md"
                        className="add-token-modal"
                    >
                        <Modal.Header className="relative">
                            <Modal.Title className="text-lg font-semibold">
                                Add Token Contract
                            </Modal.Title>
                            {/* <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingToken(null);
                                    reset();
                                    setSelectedEmoji('🪙');
                                    setShowEmojiPicker(false);
                                    setSelectedFile(null);
                                }}
                                className="close-button"
                            >
                                <MdClose size={20} />
                            </button> */}
                        </Modal.Header>
                        <Modal.Body className="p-6">
                            <Form>
                                <div className="space-y-4">
                                    {/* Network */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Network
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Controller
                                            name="network"
                                            control={control}
                                            rules={{
                                                required: 'Network is required',
                                            }}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    {/* <option value="">
                                                        Select
                                                    </option> */}
                                                    <option value="eth">
                                                        Ethereum
                                                    </option>
                                                    <option value="bsc">
                                                        BSC
                                                    </option>
                                                    <option value="solana">
                                                        Solana
                                                    </option>
                                                </select>
                                            )}
                                        />
                                    </div>

                                    {/* Token Contract Address */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Token Contract Address
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Controller
                                            name="address"
                                            control={control}
                                            rules={{
                                                required:
                                                    'Token contract address is required',
                                            }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder="0x..."
                                                    className="w-full"
                                                />
                                            )}
                                        />
                                    </div>

                                    {/* Minimum Buy */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Minimum Buy (USD Value)
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Controller
                                            name="minBuy"
                                            control={control}
                                            rules={{
                                                required:
                                                    'Minimum buy is required',
                                            }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    // defaultValue={0}
                                                    className="w-full"
                                                />
                                            )}
                                        />
                                    </div>

                                    {/* Chart Tool */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Chart Tool
                                        </label>
                                        <Controller
                                            name="chartTool"
                                            control={control}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="dextools">
                                                        DexTools
                                                    </option>
                                                    <option value="geckoterminal">
                                                        GeckoTerminal
                                                    </option>
                                                    <option value="dexscreener">
                                                        DEX Screener
                                                    </option>
                                                </select>
                                            )}
                                        />
                                    </div>

                                    {/* Market Cap USD */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Market Cap USD{' '}
                                            <span className="text-gray-500">
                                                (optional)
                                            </span>
                                        </label>
                                        <Controller
                                            name="marketCap"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder=""
                                                    className="w-full"
                                                />
                                            )}
                                        />
                                    </div>

                                    {/* Social Media Links */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Social Media Links{' '}
                                            <span className="text-orange-500">
                                                (if available)
                                            </span>
                                        </label>
                                        <div className="flex gap-4 mt-2">
                                            <Controller
                                                name="socialMedia.twitter"
                                                control={control}
                                                render={({ field }) => (
                                                    <label className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                field.value
                                                            }
                                                            onChange={
                                                                field.onChange
                                                            }
                                                            className="mr-2"
                                                        />
                                                        <span className="text-sm">
                                                            Twitter
                                                        </span>
                                                    </label>
                                                )}
                                            />
                                            <Controller
                                                name="socialMedia.telegram"
                                                control={control}
                                                render={({ field }) => (
                                                    <label className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                field.value
                                                            }
                                                            onChange={
                                                                field.onChange
                                                            }
                                                            className="mr-2"
                                                        />
                                                        <span className="text-sm">
                                                            Telegram
                                                        </span>
                                                    </label>
                                                )}
                                            />
                                            <Controller
                                                name="socialMedia.website"
                                                control={control}
                                                render={({ field }) => (
                                                    <label className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                field.value
                                                            }
                                                            onChange={
                                                                field.onChange
                                                            }
                                                            className="mr-2"
                                                        />
                                                        <span className="text-sm">
                                                            Website
                                                        </span>
                                                    </label>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Buy Emoji */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Buy Emoji
                                        </label>
                                        <div className="emoji-picker-container">
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setShowEmojiPicker(
                                                        !showEmojiPicker
                                                    )
                                                }
                                                className="emoji-button"
                                            >
                                                Select Emoji{' '}
                                                {selectedEmoji &&
                                                    `(${selectedEmoji})`}
                                            </Button>
                                            {showEmojiPicker && (
                                                <div className="absolute top-full left-0 z-50 mt-2">
                                                    <EmojiPicker
                                                        onEmojiClick={
                                                            handleEmojiSelect
                                                        }
                                                        width={300}
                                                        height={400}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Buy Media */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Buy Media (Image or Gif only)
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="file"
                                                accept=".png,.jpg,.jpeg,.gif"
                                                onChange={handleFileSelect}
                                                className="p-2 block w-full mb-5 text-xs border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                                id="file-upload"
                                            />
                                            {/* <label
                                                htmlFor="file-upload"
                                                className="file-upload-button"
                                            >
                                                Choose File
                                            </label> */}
                                            {/* <span className="text-sm text-gray-500">
                                                {fileName}
                                            </span> */}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            PNG, JPG or GIF (MAX. 1Mb).
                                        </p>

                                        {/* Show existing media when editing */}
                                        {editingToken &&
                                            (
                                                editingToken as BuybotTokenWithMedia
                                            ).media_name && (
                                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                                        Current Media:
                                                    </p>
                                                    <img
                                                        src={`${
                                                            import.meta.env
                                                                .VITE_MEDIA_BASEURL
                                                        }/v1/public/${
                                                            (
                                                                editingToken as BuybotTokenWithMedia
                                                            ).media_name
                                                        }`}
                                                        alt="Current media"
                                                        className="max-w-full h-auto max-h-32 rounded border"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Upload a new file to
                                                        replace this media
                                                    </p>
                                                </div>
                                            )}

                                        {/* Show preview of newly selected file */}
                                        {selectedFile && (
                                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                <p className="text-sm font-medium text-blue-700 mb-2">
                                                    New Media Preview:
                                                </p>
                                                <img
                                                    src={URL.createObjectURL(
                                                        selectedFile
                                                    )}
                                                    alt="New media preview"
                                                    className="max-w-full h-auto max-h-32 rounded border"
                                                />
                                                <p className="text-xs text-blue-500 mt-1">
                                                    This will replace the
                                                    current media
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer className="flex justify-end gap-2 p-6 pt-0">
                            <Button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingToken(null);
                                    reset();
                                    setSelectedEmoji('🪙');
                                    setShowEmojiPicker(false);
                                    setSelectedFile(null);
                                }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Cancel
                            </Button>
                            <Button
                                appearance="primary"
                                onClick={handleSubmit(onSubmit)}
                                loading={
                                    createTokenMutation.isPending ||
                                    updateTokenMutation.isPending
                                }
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Delete Confirmation Modal */}
                    <Modal
                        open={showDeleteModal}
                        onClose={() => {
                            setShowDeleteModal(false);
                            setDeleteToken(null);
                        }}
                    >
                        <Modal.Header>
                            <Modal.Title>Delete Token</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Message type="warning">
                                Are you sure you want to delete the token{' '}
                                <strong>
                                    {deleteToken?.name} ({deleteToken?.symbol})
                                </strong>
                                ? This action cannot be undone.
                            </Message>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteToken(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                appearance="primary"
                                color="red"
                                onClick={() =>
                                    deleteToken &&
                                    deleteTokenMutation.mutate(deleteToken._id)
                                }
                                loading={deleteTokenMutation.isPending}
                            >
                                Delete Token
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default BuyBotPage;
