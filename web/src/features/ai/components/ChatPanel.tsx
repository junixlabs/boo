import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BooAvatar } from './BooAvatar'
import { ChatMessages } from './ChatMessages'
import { useSendMessage, useClearChat } from '../hooks/useChat'

export function ChatPanel() {
  const {
    messages,
    isStreaming,
    streamingContent,
    conversationId,
    sendMessage,
    clearMessages,
  } = useSendMessage()
  const clearChat = useClearChat()

  function handleClear() {
    if (conversationId) {
      clearChat.mutate(conversationId)
    }
    clearMessages()
  }

  return (
    <Card className="flex h-[calc(100dvh-10rem)] flex-col md:h-[calc(100dvh-12rem)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BooAvatar size={24} expression="happy" />
          Boo
        </CardTitle>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={clearChat.isPending}
          >
            {clearChat.isPending ? (
              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="mr-1 h-3.5 w-3.5" />
            )}
            Clear chat
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-hidden">
        <ChatMessages
          messages={messages}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
          onSend={sendMessage}
        />
      </CardContent>
    </Card>
  )
}
