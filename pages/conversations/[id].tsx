import Head from 'next/head';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import { auth, db } from '@/config/firebase';
import { doc, getDoc, getDocs } from 'firebase/firestore';
import Sidebar from '../../components/Sidebar';
import { Conversation, IMessage } from '../../types';
import { getRecipientEmail } from '@/utils/getRecipientEmail';
import { useAuthState } from 'react-firebase-hooks/auth';
import { generateQueryGetMessage, transformMessage } from '@/utils/getMessageInConversation';
import ConversationScreen from '@/components/ConversationScreen';

const StyledContainer = styled.div`
    display: flex;
`;

const StyledConversationContainer = styled.div`
    flex-grow: 1;
    overflow: scroll;
    height: 100vh;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    ::-webkit-scrollbar {
        display: none;
    }
`;

interface Props {
    conversation: Conversation;
    messages: IMessage[];
}

const Conversation = ({ conversation, messages }: Props) => {
    const [loggedInUser, _loading, _error] = useAuthState(auth);

    return (
        <StyledContainer>
            <Head>
                <title>Conversation with {getRecipientEmail(conversation.users, loggedInUser)}</title>
            </Head>
            <Sidebar />

            <StyledConversationContainer>
                <ConversationScreen conversation={conversation} messages={messages} />
            </StyledConversationContainer>
        </StyledContainer>
    );
};

export default Conversation;

export const getServerSideProps: GetServerSideProps<Props, { id: string }> = async (context) => {
    const conversationId = context.params?.id;

    // Get the conversation, to know who we are chatting with
    const conversationRef = doc(db, 'conversations', conversationId as string);
    const conversationSnapshot = await getDoc(conversationRef);
    // Get all messages between logged in user and recipient in the conversation
    const queryMessage = generateQueryGetMessage(conversationId);

    const messageSnapshot = await getDocs(queryMessage);

    const messages = messageSnapshot.docs.map((messageDoc) => transformMessage(messageDoc));

    return {
        props: {
            conversation: conversationSnapshot.data() as Conversation,
            messages,
        },
    };
};
