import moment from "moment";
import Collections from "../enums/Collections";
import Chat from "../models/Chat";
import Message from "../models/Message";
import User from "../models/User";
import PocketBase from "pocketbase";
import AuthService from "./AuthService";

const PB_URL = "http://localhost:8090";

export default class ChatService {
  static async getChats(): Promise<Chat[]> {
    const pbInstance = new PocketBase(PB_URL);
    pbInstance.autoCancellation(false);

    const chats: Chat[] = await pbInstance.collection(Collections.CHAT).getFullList({
      expand: "participants,messages,messages.receiver,messages.sender",
      filter: `participants?~"${AuthService.getUserData().id}"`,
    });
    return chats;
  }

  static async getChatMessages(chat: Chat): Promise<Message[]> {
    const pbInstance = new PocketBase(PB_URL);
    pbInstance.autoCancellation(false);

    const fetchedChat: Chat = await pbInstance
      .collection(Collections.CHAT)
      .getOne(chat.id, {
        expand: "participants,messages,messages.receiver,messages.sender",
        filter: `participants?~"${AuthService.getUserData().id}"`,
      });

    return fetchedChat.expand?.messages || [];
  }

  static getChatAvatar(chat: Chat): string {
    const participant: User | undefined = chat.expand?.participants?.find(
      (participant) => participant.id !== AuthService.getUserData().id
    );

    if (!participant) {
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }
    const pbInstance = new PocketBase(PB_URL);
    return pbInstance.files.getUrl(participant, participant?.avatar);
  }

  static getChatTitle(chat: Chat): string {
    const sortedMessages: Message[] = !chat.expand?.messages
      ? []
      : chat.expand?.messages?.sort(
          (a, b) =>
            new Date(b.created).getTime() - new Date(a.created).getTime()
        );

    const message = sortedMessages[0];
    if (message) {
      if (message.content.length > 20) {
        return message.content.slice(0, 20) + "...";
      } else {
        return message.content;
      }
    }

    return chat.title;
  }

  static getChatLastTime(chat: Chat) {
    const updateTime = chat.updated;
    const timeFormat =
      moment(updateTime).get("date") === moment().get("date")
        ? "HH:mm"
        : "DD/MM/YYYY";
    return moment(updateTime).format(timeFormat);
  }

  static async createMessage(chat: Chat, content: string) {
    const pbInstance = new PocketBase(PB_URL);
    pbInstance.autoCancellation(false);

    const toUploadMessage: Partial<Message> & {
      receiver: string;
      sender: string;
    } = {
      content,
      receiver: chat.expand?.participants?.find(
        (participant) => participant.id !== AuthService.getUserData().id
      )?.id!,
      sender: AuthService.getUserData().id!,
    };
    const message: Message = await pbInstance
      .collection(Collections.MESSAGE)
      .create(toUploadMessage);
    await pbInstance.collection(Collections.CHAT).update(chat.id, {
      "messages+": message.id,
    });
  }

  static async createChat(title: string, lodgingOwner: string) {
    const pbInstance = new PocketBase(PB_URL);
    pbInstance.autoCancellation(false);
    const toUploadChat = {
      title,
      participants: [AuthService.getUserData().id!, lodgingOwner],
    }
    
    await pbInstance.collection(Collections.CHAT).create(toUploadChat);
  }
}
