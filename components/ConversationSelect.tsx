import { useRecipient } from '@/hooks/useRecipient';
import { Conversation } from '@/types';
import styled from 'styled-components';
import RecipientAvatar from './RecipientAvatar';
import { useRouter } from 'next/router';

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-all;

    :hover {
        background-color: #e9eaeb;
    }
`;

function ConversationSelect({ id, conversationUsers }: { id: string; conversationUsers: Conversation['users'] }) {
    const { recipientEmail, recipient } = useRecipient(conversationUsers);

    const router = useRouter();

    const onSelectConversation = () => {
        router.push(`/conversations/${id}`);
    };

    return (
        <StyledContainer onClick={onSelectConversation}>
            <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail} />
            <span>{recipientEmail}</span>
        </StyledContainer>
    );
}

export default ConversationSelect;
