import firebase from 'firebase/app';
import { ChatroomInfo } from './chatroom.model';

// Meant to model the top level collection in which user chatrooms are stored in
// firestore
export class UserChatrooms {
  constructor(
    public chatrooms: ChatroomInfo[] | firebase.firestore.FieldValue
  ) {}
}

export const USER_CHATROOMS_CONVERTER: firebase.firestore.FirestoreDataConverter<UserChatrooms> = {
  toFirestore(userChatrooms: UserChatrooms) {
    return {
      chatrooms: firebase.firestore.FieldValue.arrayUnion(
        userChatrooms.chatrooms
      ),
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<UserChatrooms>,
    options: firebase.firestore.SnapshotOptions
  ) {
    const data = snapshot.data(options);
    return new UserChatrooms(data.chatrooms);
  },
};
