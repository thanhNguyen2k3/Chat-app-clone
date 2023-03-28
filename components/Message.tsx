import { auth } from '@/config/firebase';
import { IMessage } from '@/types';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';

const StyledMessage = styled.p`
    position: relative;
    width: fit-content;
    word-wrap: break-all;
    max-width: 90%;
    min-width: 30%;
    padding: 15px 15px 30px;
    border-radius: 8px;
    margin: 10px;
`;

const StyledSenderMessage = styled(StyledMessage)`
    margin-left: auto;
    background-color: #dcf8c6;
`;

const StyledReceiverMessage = styled(StyledMessage)`
    background-color: whitesmoke;
`;

const StyledTimestamp = styled.span`
    color: gray;
    padding: 10px;
    font-size: x-small;
    position: absolute;
    right: 0;
    bottom: 0;
    text-align: right;
`;

const Message = ({ message }: { message: IMessage }) => {
    const [loggedInUser, _loading, _error] = useAuthState(auth);

    const MessageType = loggedInUser?.email === message.user ? StyledSenderMessage : StyledReceiverMessage;

    return (
        <MessageType>
            {message.text} <StyledTimestamp>{message.sent_at}</StyledTimestamp>
        </MessageType>
    );
};

export default Message;
