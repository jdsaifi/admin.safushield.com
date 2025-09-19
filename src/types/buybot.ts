export interface TokenPool {
    poolAddress: string;
    dex: string;
    pair: string;
    baseAddress: string;
    quoteAddress: string;
    quoteName: string;
    quoteSymbol: string;
    quoteDecimal: number;
    baseVault: string | null;
    quoteVault: string | null;
    _id: string;
}

export interface BuybotToken {
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
    pool: TokenPool;
    media_name?: string;
    mcap_usd?: number | string;
    chart_tool?: string | string;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTokenData {
    address: string;
    network: string;
    emoji: string;
    minBuy: string | number;
    media_name?: string | null;
    media_mimetype?: string | null;
    mcap_usd?: number | string;
    chart_tool?: string;
    social_twitter_enabled?: boolean;
    social_telegram_enabled?: boolean;
    social_website_enabled?: boolean;
}

export interface UpdateTokenData extends Partial<CreateTokenData> {
    _id: string;
}
