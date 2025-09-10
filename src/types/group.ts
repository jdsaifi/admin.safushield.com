export interface GroupSettings {
    website: string | null;
    tz: string | null;
    tg_channel: string | null;
    contract_address: string | null;
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
}

export interface GroupGreeting {
    message: string | null;
    mediaUrl: string | null;
    buttons: any[];
}

export interface GroupStats {
    users: number;
    admins: number;
    team_members: number;
    message_count: number;
    spam_count: number;
}

export interface AdminAIMessage {
    userId: number;
    text: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface BuybotToken {
    chart_tool?: string;
    social_twitter_enabled?: boolean;
    social_telegram_enabled?: boolean;
    social_website_enabled?: boolean;
    media_name?: string | null;
    media_mimetype?: string | null;
    mcap_usd?: number | null;
    network: string;
    networkName: string;
    address: string;
    name: string;
    symbol: string;
    decimal: number;
    website: string;
    emoji: string;
    minBuy: number;
    telegram: string;
    twitter: string;
    scan: string;
    pool: any;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface Group {
    _id: string;
    userRef: string;
    addedBy: string;
    botUsername: string;
    tg_group_id: string;
    tg_group_name: string;
    tg_group_image: string | null;
    admin: any[];
    groupType: string;
    settings: GroupSettings;
    greeting: GroupGreeting;
    agentEnabled: boolean;
    stats: GroupStats;
    banned_words: string[];
    whitelisted_links: string[];
    deleted_at: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
    agentAge: number;
    agentTriggerKeywords: string;
    botToken: string;
    knowledge: string;
    responseStyle: string;
    adminAIMessage: AdminAIMessage[];
    buybot: BuybotToken[];
    restrictedProfileNames: string;
    id: string;
}
