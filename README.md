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

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- `uuid` for generating task IDs
- Custom polling logic with `setTimeout`

---

## How to Run

```bash
npm install
npm run dev
```

---

## Folder Structure

```
src/
├── api/
│   └── mockApi.ts
├── App.tsx
└── main.tsx
```

---

## Reflection Questions

### What did you choose to mock the API and why?

### If you used an AI tool, what parts did it help with?

### What tradeoffs or shortcuts did you take?

### What would you improve or add with more time?

### What was the trickiest part and how did you debug it?
