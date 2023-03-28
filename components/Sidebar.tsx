import Tooltip from '@mui/material/Tooltip';
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField,
} from '@mui/material';
import React, { useState } from 'react';

import styled from 'styled-components';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVerticalIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';

import { signOut } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import * as EmailValidator from 'email-validator';
import { addDoc, collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Conversation } from '@/types';
import ConversationSelect from './ConversationSelect';

const StyledContainer = styled.div`
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow: scroll;
    border-right: 1px solid whitesmoke;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    ::-webkit-scrollbar {
        display: none;
    }
`;
const StyledHeader = styled.div`
    position: sticky;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    border-bottom: 1px solid whitesmoke;
    top: 0;
    z-index: 1;
    padding: 15px;
    height: 80px;
`;
const StyledSearch = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    border-radius: 2px;
`;
const StyleSidebarButton = styled(Button)`
    width: 100%;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
`;
const StyledUserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`;
const StyledSearchInput = styled.input`
    outline: none;
    border: none;
    flex: 1;
`;

const Sidebar = () => {
    const [loggedInUser, _loading, _error] = useAuthState(auth);
    const [isOpenNewConversationDialog, setIsOpenNewConversationDialog] = useState(false);
    const [recipientsEmail, setRecipientsEmail] = useState('');

    const toggleNewConversationDialog = (isOpen: boolean) => {
        setIsOpenNewConversationDialog(isOpen);

        if (!isOpen) setRecipientsEmail('');
    };

    const closeNewConversationDialog = () => {
        setIsOpenNewConversationDialog(false);
    };

    // Check if conversation already exists between the current logged user and recipient
    const queryGetConversationForCurrentUser = query(
        collection(db, 'conversations'),
        where('users', 'array-contains', loggedInUser?.email),
    );

    const [conversationsSnapshot, __loading, __error] = useCollection(queryGetConversationForCurrentUser);

    const isConversationAlreadyExists = (recipientsEmail: string) =>
        conversationsSnapshot?.docs.find((conversation) =>
            (conversation.data() as Conversation).users.includes(recipientsEmail),
        );

    const createConversation = async () => {
        if (!recipientsEmail) return;

        const isInvitingSelf = recipientsEmail === loggedInUser?.email;

        if (
            EmailValidator.validate(recipientsEmail) &&
            !isInvitingSelf &&
            !isConversationAlreadyExists(recipientsEmail)
        ) {
            // Add conversation user to Db "conversations" collection
            // A conversation is between the currently logged
            await addDoc(collection(db, 'conversations'), {
                users: [loggedInUser?.email, recipientsEmail],
            });
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <StyledContainer>
            <StyledHeader>
                <Tooltip title={loggedInUser?.email as string} placement="right">
                    <StyledUserAvatar src={loggedInUser?.photoURL || ''} />
                </Tooltip>

                <div>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVerticalIcon />
                    </IconButton>
                    <IconButton onClick={logout}>
                        <LogoutIcon />
                    </IconButton>
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                </div>
            </StyledHeader>
            <StyledSearch>
                <SearchIcon />
                <StyledSearchInput placeholder="Search in conversations" />
            </StyledSearch>
            <StyleSidebarButton onClick={() => toggleNewConversationDialog(true)}>
                Start a new conversations
            </StyleSidebarButton>

            {/* List of conversations */}

            {conversationsSnapshot?.docs.map((conversation) => (
                <ConversationSelect
                    key={conversation.id}
                    id={conversation.id}
                    conversationUsers={(conversation.data() as Conversation).users}
                />
            ))}

            <Dialog open={isOpenNewConversationDialog} onClose={() => toggleNewConversationDialog(false)}>
                <DialogTitle>New Conversations</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a google email address for the user you wish to chat with
                    </DialogContentText>
                    <TextField
                        autoFocus
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={recipientsEmail}
                        onChange={(e) => setRecipientsEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeNewConversationDialog}>Cancel</Button>
                    <Button disabled={!recipientsEmail} onClick={createConversation}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </StyledContainer>
    );
};

export default Sidebar;
