import ChatService from "@/src/services/ChatService";
import { useQuery } from "@tanstack/react-query";

const useChatMessages = function (chatId: string) {
  const { isPending, error, data } = useQuery({
    queryKey: ["chat-messages", chatId],
    queryFn: () => ChatService.getMessages(chatId),
    enabled: !!chatId,
  });

  return { isPending, error, data };
};

export default useChatMessages;
