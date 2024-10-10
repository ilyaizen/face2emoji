# Frontend Instructions

Create a Next.js application with TypeScript and Tailwind CSS:

1. Main page with image upload component:
   - Allow file upload via drag-and-drop or file selection
   - Input field for image URL
   - Display upload progress and processing status
2. API integration:
   - Send image data to backend API
   - Handle and display responses (processed image or error messages)
3. User interface:
   - Responsive design for various screen sizes
   - Clear feedback for each step of the process
4. Error handling and user guidance
5. (Optional) Preview of uploaded and processed images

Use React hooks for state management and Axios for API requests.
Implement proper TypeScript types for components and API responses.

Project Structure:

```
face2emoji/
├── backend/
│   ├── .env
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── fonts/
│   │   │   ├── GeistMonoVF.woff
│   │   │   └── GeistVF.woff
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── .eslintrc.json
│   ├── .gitignore
│   ├── components.json
│   ├── next-env.d.ts
│   ├── next.config.mjs
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── README.md
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── .cursorrules
├── add-comments.md
├── backend-instructions.md
└── frontend-instructions.md
```
