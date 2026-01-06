import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

interface ChatResponse { answer: string; }

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly STORAGE_KEY = 'chat_threads_v1';
  private readonly API_BASE = 'http://localhost:8085';

  constructor(private http: HttpClient) {}

  send(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.API_BASE}/ai/chat`, { message });
  }

  listThreads(): ChatThread[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  saveThreads(threads: ChatThread[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(threads));
  }

  newThread(initialUserMessage?: string): ChatThread {
    const id = 't_' + Math.random().toString(36).slice(2);
    const now = Date.now();
    const title = (initialUserMessage?.slice(0, 40) || 'New chat');
    const messages: ChatMessage[] = [];
    if (initialUserMessage && initialUserMessage.trim()) {
      messages.push({ role: 'user', content: initialUserMessage.trim(), timestamp: now });
    }
    return { id, title, messages, createdAt: now, updatedAt: now };
  }
}
