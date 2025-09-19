import api from '../lib/axios';
import { BuybotToken, CreateTokenData } from '../types/buybot';

export const buybotService = {
    // Get all tokens for a group
    getTokens: async (groupId: string): Promise<BuybotToken[]> => {
        const response = await api.get(`/groups/${groupId}/buybot`);
        return response.data;
    },

    // Create a new token
    createToken: async (
        groupId: string,
        tokenData: CreateTokenData
    ): Promise<BuybotToken> => {
        const response = await api.post(`/groups/${groupId}/buybot`, tokenData);
        return response.data;
    },

    // Update an existing token
    updateToken: async (
        groupId: string,
        tokenId: string,
        tokenData: Partial<CreateTokenData>
    ): Promise<BuybotToken> => {
        const response = await api.put(
            `/groups/${groupId}/buybot/${tokenId}`,
            tokenData
        );
        return response.data;
    },

    // Delete a token
    deleteToken: async (groupId: string, tokenId: string): Promise<void> => {
        await api.delete(`/groups/${groupId}/buybot/${tokenId}`);
    },
};
