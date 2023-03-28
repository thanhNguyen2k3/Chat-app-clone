import { auth, db } from '@/config/firebase';
import { AddUser, Conversation } from '@/types';
import { getRecipientEmail } from '@/utils/getRecipientEmail';
import { collection, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';

export const useRecipient = (conversationUsers: Conversation['users']) => {
    const [loggedInUser, _loading, _error] = useAuthState(auth);

    // get recipients Email
    const recipientEmail = getRecipientEmail(conversationUsers, loggedInUser);
    // get recipients Avatar
    const queryRecipients = query(collection(db, 'users'), where('email', '==', recipientEmail));
    const [recipientSnapshot, __loading, __error] = useCollection(queryRecipients);

    // recipientsSnapshot?.doc could be an empty array, leading to docs[0] being undefined
    // so we have to force "?" after docs because there is no data() on "undefined"
    const recipient = recipientSnapshot?.docs[0]?.data() as AddUser | undefined;

    return { recipient, recipientEmail };
};
