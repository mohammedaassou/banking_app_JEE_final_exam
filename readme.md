# Chatbot Implementation Guide

This README documents the Angular chatbot implementation in this project, including UI behavior, data model, API integration, and how to run and validate it. It also links to assets and a short demo.

---

## Demo Video  
Click the image below to watch the demo:

[![Chatbot Demo](./assets/chat.png)](./assets/demo.mp4)

> If your Markdown preview does not autoplay MP4, it will open in your browser video player.

---

## Overview
- Conversational UI with thread management (create, select, delete)
- Fixed input composer at the bottom, messages area scrolls independently
- Auto-scroll to the latest message on send, receive, and thread switch
- Threads persisted in `localStorage` for continuity

---

## Key Files
- Component logic: `angular-banking-frontend/src/app/chatbot/chatbot.component.ts`
- Template: `angular-banking-frontend/src/app/chatbot/chatbot.component.html`
- Styles: `angular-banking-frontend/src/app/chatbot/chatbot.component.css`
- Chat service: `angular-banking-frontend/src/app/services/chat.service.ts`

---

## Data Model

```ts
export interface ChatThread {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// Storage key: chat_threads_v1

---

## Architecture & Flow

- Component: handles UI state, input, thread selection, scrolling, and loading.
- Service: encapsulates persistence and API calls to the backend chatbot endpoint.
- Backend contract: simple POST to `/ai/chat` returning `{ answer: string }`.

Sequence on send:
1. User types a message and submits.
2. Message is appended to the active thread, `updatedAt` refreshed, UI auto-scrolls.
3. `ChatService.send()` posts to backend; a loading bubble appears.
4. On success, assistant answer is appended; on error, a fallback message is shown.
5. Threads are persisted to `localStorage` after each change.

---

## UI Behavior

- Sidebar: lists threads with title (first 40 chars of the first user message). New chat creates a fresh thread at the top; delete removes it.
- Messages: distinct bubbles for `user` vs `assistant`, with a subtle box shadow and Bootstrap icons.
- Composer: sticky input at the bottom with a send button disabled while loading or when input is empty.
- Loading indicator: three animated dots shown while waiting for the backend response.
- Auto-scroll: after send/receive/select thread, the list scrolls to the bottom.

---

## Persistence

- Storage key: `chat_threads_v1`
- Persisted shape: array of `ChatThread`
- When creating a thread from the composer with text pre-typed, the first message is added automatically and the answer is fetched.

---

## API Integration

Service endpoint and call:

```ts
// angular-banking-frontend/src/app/services/chat.service.ts
private readonly API_BASE = 'http://localhost:8085';

send(message: string): Observable<{ answer: string }> {
  return this.http.post<{ answer: string }>(`${this.API_BASE}/ai/chat`, { message });
}
```

Example request/response:

```http
POST http://localhost:8085/ai/chat
Content-Type: application/json

{
  "message": "What is my current account balance?"
}

HTTP/1.1 200 OK
Content-Type: application/json

{
  "answer": "Your current account balance is 1,250.00 MAD."
}
```

Backend notes:
- Ensure CORS allows requests from `http://localhost:4200`.
- The controller should accept `{ message: string }` and return `{ answer: string }`.

---

## Running Locally

1) Start the Spring backend on port 8085

```bash
# From the project root
cd spring-banking-backend
./mvnw spring-boot:run
```

2) Start the Angular frontend on port 4200

```bash
# In a separate terminal
cd angular-banking-frontend
npm install
npm start
# Visit http://localhost:4200 and open Chatbot in the UI
```

Troubleshooting:
- If messages show "Error contacting assistant.", verify the backend is running and reachable at `http://localhost:8085`.
- Check browser console/network tab for CORS or connectivity issues.
- If port differs, update `API_BASE` in the chat service accordingly.

---

## Extensibility Ideas

- Move `API_BASE` to `environment.ts` for per-env configuration.
- Add markdown rendering for richer assistant responses.
- Stream partial answers for a more responsive UI.
- Implement rename thread and search across messages.
- Persist threads server-side to enable cross-device continuity.

---

## File References

- Component logic: angular-banking-frontend/src/app/chatbot/chatbot.component.ts
- Template: angular-banking-frontend/src/app/chatbot/chatbot.component.html
- Styles: angular-banking-frontend/src/app/chatbot/chatbot.component.css
- Service: angular-banking-frontend/src/app/services/chat.service.ts
