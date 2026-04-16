import type { SystemPrompt } from '@org/types';
import type { OpenAI } from 'openai/client';
import type { ChatCompletion } from 'openai/resources';
import type { BaseAgent } from './agents/types.js';

export interface SendMessageInputs extends SystemPrompt, Omit<BaseAgent, 'messages'> {
  conversationId: string;
}

export type ToolHandler = (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
) => string | Promise<string>;

export interface ToolCallHandlerInputs {
  conversationId: string;
  response: ChatCompletion;
  baseAgentInputs: Omit<BaseAgent, 'messages'>;
}
