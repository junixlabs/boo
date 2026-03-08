import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/utils'
import { BooAvatar } from './BooAvatar'
import type { ChatMessage } from '../types'

function BooMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
        em: ({ children }) => (
          <span className="text-xs text-muted-foreground italic">{children}</span>
        ),
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        ul: ({ children }) => <ul className="mb-1.5 ml-4 list-disc last:mb-0">{children}</ul>,
        ol: ({ children }) => <ol className="mb-1.5 ml-4 list-decimal last:mb-0">{children}</ol>,
        li: ({ children }) => <li className="mb-0.5">{children}</li>,
        pre: ({ children }) => (
          <pre className="my-1.5 rounded bg-muted/50 p-2 text-xs overflow-x-auto last:mb-0 [&>code]:bg-transparent [&>code]:p-0">
            {children}
          </pre>
        ),
        code: ({ children }) => (
          <code className="rounded bg-muted/50 px-1 py-0.5 text-xs">{children}</code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-2', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {!isUser && (
        <BooAvatar size={28} expression={message.boo_expression ?? 'default'} className="shrink-0 mt-1" />
      )}
      <div
        className={cn(
          'max-w-[85%] rounded-lg px-3 py-2 text-sm md:max-w-[80%]',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'border bg-card',
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <BooMarkdown content={message.content} />
        )}
      </div>
    </div>
  )
}

export function StreamingBubble({ content }: { content: string }) {
  return (
    <div className="flex gap-2">
      <BooAvatar size={28} expression="default" className="shrink-0 mt-1" />
      <div className="max-w-[85%] rounded-lg border bg-card px-3 py-2 text-sm md:max-w-[80%]">
        <BooMarkdown content={content} />
        <span className="animate-pulse">|</span>
      </div>
    </div>
  )
}
