import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ChatService, ChatThread, ChatMessage } from '../services/chat.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  threads: ChatThread[] = [];
  active?: ChatThread;
  input = '';
  loading = false;
  @ViewChild('messagesContainer') messagesEl?: ElementRef<HTMLDivElement>;

  constructor(private chat: ChatService) {}

  ngOnInit(): void {
    this.threads = this.chat.listThreads();
    if (this.threads.length) this.active = this.threads[0];
  }

  selectThread(t: ChatThread) {
    this.active = t;
    this.scrollToBottom();
  }

  newThread() {
    const initial = this.input.trim();
    const t = this.chat.newThread(initial);
    this.threads.unshift(t);
    this.active = t;
    this.chat.saveThreads(this.threads);
    if (initial) {
      this.input = '';
      this.fetchAnswer(initial);
    }
  }

  deleteThread(t: ChatThread) {
    this.threads = this.threads.filter(x => x.id !== t.id);
    if (this.active?.id === t.id) this.active = this.threads[0];
    this.chat.saveThreads(this.threads);
  }

  send() {
    if (!this.active) return this.newThread();
    if (!this.input.trim()) return;
    const now = Date.now();
    this.active.messages.push({ role: 'user', content: this.input.trim(), timestamp: now });
    this.active.updatedAt = now;
    const userInput = this.input.trim();
    this.input = '';
    this.chat.saveThreads(this.threads);
    this.scrollToBottom();
    this.fetchAnswer(userInput);
  }

  private sendCurrentInput() {
    const msg = this.input.trim();
    this.input = '';
    this.fetchAnswer(msg);
  }

  private fetchAnswer(prompt: string) {
    if (!this.active) return;
    this.loading = true;
    this.scrollToBottom();
    this.chat.send(prompt).subscribe({
      next: (resp) => {
        const now = Date.now();
        const assistant: ChatMessage = { role: 'assistant', content: resp.answer || '', timestamp: now };
        this.active!.messages.push(assistant);
        this.active!.updatedAt = now;
        this.chat.saveThreads(this.threads);
        this.scrollToBottom();
      },
      error: (err) => {
        const now = Date.now();
        const assistant: ChatMessage = { role: 'assistant', content: 'Error contacting assistant.', timestamp: now };
        this.active!.messages.push(assistant);
        this.active!.updatedAt = now;
        this.chat.saveThreads(this.threads);
        this.scrollToBottom();
        console.error(err);
      },
      complete: () => this.loading = false
    });
  }

  private scrollToBottom() {
    const el = this.messagesEl?.nativeElement;
    if (!el) return;
    setTimeout(() => { el.scrollTop = el.scrollHeight; }, 0);
  }
}
