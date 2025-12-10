import axios from 'axios';
import { BACKEND_URL } from '../constant';

export const getPendingInvitations = async (token: string) => {
    const response = await axios.get(`${BACKEND_URL}/api/collaborations/invites/pending`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const acceptInvite = async (inviteId: number, token: string) => {
    const response = await axios.post(`${BACKEND_URL}/api/collaborations/invites/${inviteId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const declineInvite = async (inviteId: number, token: string) => {
    const response = await axios.post(`${BACKEND_URL}/api/collaborations/invites/${inviteId}/decline`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};