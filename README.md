# Mock File Upload with Polling

This is a React + TypeScript project that simulates a file upload process and tracks the task status through polling.

## Features

- ✅ Select and submit PDF or image files (under 2MB)
- ✅ Simulated task creation (returns `taskId`)
- ✅ Poll task status every few seconds until complete
- ✅ Cancel polling when component unmounts or manually
- ✅ Display all submitted tasks with status
- ✅ Mobile-friendly responsive layout
- ✅ Error and loading states
- ✅ Retry on polling failure (up to 3 times)
- ✅ Visual feedback with loading and status colors

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- `uuid` for generating task IDs
- `setTimeout`-based polling
- Custom hook (`useTaskPolling`)
- Vitest + Testing Library for unit tests

---

## How to Run

```bash
npm install
npm run dev
```

## How to Test

```bash
npm run test
```

---

## Folder Structure

```
src/
├── api/
│   └── mockApi.ts
├── components/
│   └── task.ts
├── hooks/
│   └── useTaskPolling.ts
├── App.tsx
├── task.type.ts
└── main.tsx
```

---

## Reflection Questions

### What did you choose to mock the API and why?

I chose to mock the API using in-memory logic with setTimeout and a simple taskStore object in mockApi.ts. The createTask function generates a random duration and success/failure result, while getTaskStatus simulates polling behavior by checking elapsed time.

### If you used an AI tool, what parts did it help with?

I used AI tools like ChatGPT to assist with:

- Quickly scaffolding unit tests for my custom hook (useTaskPolling), including mocking API behavior and managing fake timers
- Generating initial layout and styles for form elements, like the custom file upload component with Tailwind CSS

While the logic and decisions were implemented and adapted manually, using AI helped reduce the time spent on boilerplate and styling, allowing me to focus more on functionality and structure.

### What tradeoffs or shortcuts did you take?

I focused on delivering core functionality first and deferred enhancements like styling and animations until later. I also avoided using third-party libraries like React Query to keep the logic simple and avoid unnecessary complexity for a small project.

### What would you improve or add with more time?

I would improve the UI/UX with better feedback (e.g. toast notifications), add drag-and-drop support for uploads, and refactor polling using a library like React Query for cleaner state handling.

### What was the trickiest part and how did you debug it?

The trickiest part was designing the custom useTaskPolling hook. I had to clearly think through the task state flow—when polling should start, stop, or be canceled—before writing the code. Mapping out the logic ahead of time helped avoid issues and made the implementation smoother.
