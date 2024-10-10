# Backend Instructions

Create a Flask API with the following features:

1. Endpoint to receive image uploads (file or URL)
2. Image processing:
   - Resize images if they exceed size limits
   - Detect if the image contains a single face
   - If a single face is detected, crop the image to include the face with a slight margin
3. Error handling for invalid inputs or processing failures
4. Return processed image or error message

Use OpenCV for face detection and PIL for image manipulation.
Ensure proper CORS configuration for frontend communication.

Project Structure:

```
image-to-emoji-converter/
├── backend/
│   ├── uploads/
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
