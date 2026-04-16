import type OpenAI from 'openai';
import type { ChatModel } from 'openai/resources';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export interface BaseAgent {
  messages: ChatCompletionMessageParam[];
  model?: ChatModel;
  tools?: OpenAI.Chat.Completions.ChatCompletionTool[];
  maxTokens?: number;
  temperature?: number;
}
