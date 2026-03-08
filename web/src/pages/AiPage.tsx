import { CalendarDays, Target, BookOpen, Calendar } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { ChatPanel } from '@/features/ai/components/ChatPanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSendMessage } from '@/features/ai/hooks/useChat'

const quickActions = [
  { key: 'weekly-summary', label: 'Weekly Summary', icon: CalendarDays, prompt: 'Tổng kết tuần này cho tôi' },
  { key: 'suggest-priorities', label: 'Suggest Priorities', icon: Target, prompt: 'Gợi ý task nên ưu tiên hôm nay' },
  { key: 'review-weekly', label: 'Review Weekly', icon: BookOpen, prompt: 'Review tuần này giúp tôi' },
  { key: 'review-monthly', label: 'Review Monthly', icon: Calendar, prompt: 'Review tháng này giúp tôi' },
]

export default function AiPage() {
  const { sendMessage, isStreaming } = useSendMessage()

  return (
    <div className="space-y-6">
      <PageHeader title="Boo AI" description="Chat with Boo or use AI tools" />

      {/* Mobile: horizontal quick actions */}
      <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
        {quickActions.map((action) => (
          <Button
            key={action.key}
            size="sm"
            variant="outline"
            className="shrink-0"
            disabled={isStreaming}
            onClick={() => sendMessage(action.prompt)}
          >
            <action.icon className="mr-1.5 h-3.5 w-3.5" />
            {action.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChatPanel />
        </div>

        <div className="hidden space-y-4 md:block">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => (
                <Button
                  key={action.key}
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                  disabled={isStreaming}
                  onClick={() => sendMessage(action.prompt)}
                >
                  <action.icon className="mr-2 h-3.5 w-3.5" />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
