import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { BooAvatar } from './BooAvatar'
import { NudgeCard } from './NudgeCard'
import { ChatMessages } from './ChatMessages'
import { useNudges, useDismissNudge } from '../hooks/useNudges'
import { useSendMessage, useClearChat } from '../hooks/useChat'

export function FloatingBoo() {
  const [open, setOpen] = useState(false)
  const { data: nudges } = useNudges()
  const dismissNudge = useDismissNudge()

  const {
    messages,
    isStreaming,
    streamingContent,
    conversationId,
    sendMessage,
    clearMessages,
  } = useSendMessage()
  const clearChat = useClearChat()

  const count = nudges?.length ?? 0
  const topExpression = nudges?.[0]?.boo_expression ?? 'default'
  const defaultTab = count > 0 ? 'nudges' : 'chat'

  function handleClear() {
    if (conversationId) {
      clearChat.mutate(conversationId)
    }
    clearMessages()
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <BooAvatar size={32} expression={topExpression} />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </button>

      {/* Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <BooAvatar size={24} expression="happy" />
              Boo
            </SheetTitle>
            <SheetDescription className="sr-only">Boo assistant panel</SheetDescription>
          </SheetHeader>

          <Tabs defaultValue={defaultTab} className="flex flex-1 flex-col overflow-hidden px-4 pb-4">
            <TabsList className="w-full">
              <TabsTrigger value="nudges" className="flex-1">
                Nudges
                {count > 0 && (
                  <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                    {count}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
            </TabsList>

            {/* Nudges tab */}
            <TabsContent value="nudges" className="flex-1 overflow-y-auto">
              {count === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                  <BooAvatar size={48} expression="happy" />
                  <p className="text-sm text-muted-foreground">
                    Không có nudge nào~ Bạn làm tốt lắm!
                  </p>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  {nudges!.map((n) => (
                    <NudgeCard
                      key={n.type}
                      nudge={n}
                      onDismiss={(type) => dismissNudge.mutate(type)}
                      onAction={() => setOpen(false)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Chat tab */}
            <TabsContent value="chat" className="flex flex-1 flex-col overflow-hidden">
              <div className="flex flex-1 flex-col overflow-hidden">
                {messages.length > 0 && (
                  <div className="mb-2 flex justify-end">
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
                  </div>
                )}
                <ChatMessages
                  messages={messages}
                  isStreaming={isStreaming}
                  streamingContent={streamingContent}
                  onSend={sendMessage}
                  compact
                />
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  )
}
