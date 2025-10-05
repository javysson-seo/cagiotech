import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CompanyMessage } from '@/hooks/useCompanyMessages';

interface ChatMessagesProps {
  messages: CompanyMessage[];
  currentUserId?: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isOwnMessage = message.sender_id === currentUserId;
        const isGeneralMessage = !message.recipient_id;

        return (
          <div
            key={message.id}
            className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                {message.sender?.name?.charAt(0) || '?'}
              </div>
            </Avatar>

            <div className={`flex-1 max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium">{message.sender?.name}</span>
                {isGeneralMessage && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Geral
                  </span>
                )}
              </div>

              <Card className={`${isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <CardContent className="p-3">
                  <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                  <p className={`text-xs mt-2 ${isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {format(new Date(message.created_at), 'HH:mm', { locale: ptBR })}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};