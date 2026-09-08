# X-Stitch

X-Stitch is a full-stack web application that transforms uploaded images into customizable cross-stitch patterns with DMC thread colors, symbols, and stitch counts.

## 🧠 About

Creating a cross-stitch chart from an image can require significant manual work. X-Stitch automates this process and provides a clear, interactive pattern that users can save, edit, and print.

## 🎯 Features

- Email and password authentication
- Google authentication
- reCAPTCHA-protected registration
- Protected routes and user profile management
- Profile photo upload and removal with Supabase Storage
- JPEG, PNG, and WebP image upload
- Pattern generation by stitch width or height
- Automatic DMC thread color mapping
- Canvas chart with colors, symbols, grid lines, and coordinates
- Zoom controls and scrolling for large patterns
- DMC legend with color codes, names, and stitch counts
- Save generated patterns
- View saved patterns in My Patterns
- Rename and delete saved patterns
- Edit saved pattern names and dimensions
- Print patterns or save them as PDF through the browser

## 📸 Screenshots

<img width="1114" height="732" alt="Screenshot 2026-09-05 at 1 11 04 PM" src="https://github.com/user-attachments/assets/0e268ff7-3795-4a42-a4df-5c1e2d481ede" />

<img width="1051" height="639" alt="Screenshot 2026-09-05 at 1 11 12 PM" src="https://github.com/user-attachments/assets/0318a6e3-b2f3-480d-9a20-40a7d73d07a6" />

<img width="988" height="564" alt="Screenshot 2026-09-05 at 1 11 35 PM" src="https://github.com/user-attachments/assets/dcc105ca-f371-4638-a145-8c22121045a6" />
<img width="1057" height="681" alt="Screenshot 2026-09-05 at 1 11 29 PM" src="https://github.com/user-attachments/assets/4033d19b-604c-4244-9395-e935d6995604" />


## 🛠 Tech Stack

### Frontend
- React
- JavaScript (ES6+)
- Vite
- Tailwind CSS
- HTML Canvas

### Backend
- Node.js
- Express.js
- Prisma
- Joi
- Multer
- Sharp
- PostgreSQL

### Authentication / Storage / Tooling

- Google OAuth
- Google reCAPTCHA
- JSON Web Tokens
- Supabase Storage
- Jest
- ESLint
- Prettier

## 📁 Project Structure
```text
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/        
│   │   ├── ...
│
├── backend/
│   ├── prisma/
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       ├── services/
│       └── ...
│
└── README.md
```
## ⚙️ Setup & Installation

### Prerequisites
- Node.js 20.19 or newer; Node.js 22 is recommended
- npm
- Google OAuth Web Client ID
- Google reCAPTCHA v2 site and secret keys
- Supabase project

### Clone Repository

```bash
git clone https://github.com/Code-the-Dream-School/summer-26-js-practicum-team4.git
cd summer-26-js-practicum-team4

### Backend Setup

Install the backend dependencies:

```bash
cd backend
npm install
```

Start a local Prisma development database:

```bash
npx prisma dev --name dev-db --detach
```

Copy the `DATABASE_URL` shown by Prisma.

Create a file named `backend/.env`:

```env
DATABASE_URL="postgresql://your-local-database-url"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_LIFETIME="7d"
RECAPTCHA_SECRET_KEY="your-recaptcha-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
CLIENT_URL="http://localhost:5173"
PORT="8080"
```

Apply the Prisma schema:

```bash
npm run db:push
```

Start the backend:

```bash
npm run dev
```

The backend runs at [http://localhost:8080](http://localhost:8080).

### Frontend Setup

Open another terminal from the project root:

```bash
cd frontend
npm install
```

Create a file named `frontend/.env`:

```env
VITE_API_URL="http://localhost:8080"
VITE_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"
VITE_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
VITE_SUPABASE_URL="your-supabase-project-url"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Google Authentication Setup

1. Create a Google OAuth 2.0 Web Client ID in Google Cloud Console.
2. Add `http://localhost:5173` as an authorized JavaScript origin.
3. Use the same Client ID for:
   - `GOOGLE_CLIENT_ID` in `backend/.env`
   - `VITE_GOOGLE_CLIENT_ID` in `frontend/.env`

The current implementation does not require a Google Client Secret.

### reCAPTCHA Setup

1. Create a Google reCAPTCHA v2 Checkbox site.
2. Allow `localhost` for local development.
3. Add the Site Key to `VITE_RECAPTCHA_SITE_KEY`.
4. Add the Secret Key to `RECAPTCHA_SECRET_KEY`.

### Supabase Storage Setup

1. Create a Supabase project.
2. Create a Storage bucket named `profile_photo`.
3. Configure the bucket policies required for browser uploads, public image access, and file deletion.
4. Add the project URL and publishable key to `frontend/.env`:

```env
VITE_SUPABASE_URL="your-supabase-project-url"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
```

Profile photos are uploaded to Supabase Storage, and their public URLs are saved with the user profile.

### Prisma

Start the local Prisma database:

```bash
npx prisma dev --name dev-db --detach
```

Apply the current schema:

```bash
npm run db:push
```

Open Prisma Studio when needed:

```bash
npm run studio
```

## Available Scripts

### Frontend

Run these commands from `frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format files with Prettier |
| `npm run format:check` | Check formatting without changing files |

### Backend

Run these commands from `backend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the backend with Nodemon |
| `npm start` | Start the backend with Node |
| `npm test` | Run Jest tests |
| `npm run db:push` | Apply the Prisma schema |
| `npm run db:push:test` | Apply the schema using `.env.test` |
| `npm run studio` | Open Prisma Studio |
| `npm run studio:test` | Open Prisma Studio using `.env.test` |
| `npm run dev:test` | Start the backend using `.env.test` |

## 🤝 Team & Collaboration

### Team Members
- Smah Riki — Full-Stack Developer
- Oksana Mosendz — Full-Stack Developer
- Darya Pogas — Full-Stack Developer
- Jahaira Flores - Full-Stack Developer
- Millicent Traylor - Full-Stack Developer

### Workflow
- GitHub Issues for task tracking
- Feature branches for development
- Pull Requests required for all merges
- Code reviews before merging to `main`


## 🧩 Development Process

- Agile / sprint-based workflow
- Backend API built before frontend integration
- MVP defined early
- Incremental feature development

## 📌 Known Issues / Limitations

- The application is currently designed for desktop use and is not optimized for mobile devices.
- Pattern quality depends on the quality and complexity of the uploaded image.
- PDF export uses the browser’s print dialog and may vary between browsers.
- Generated patterns are currently private and cannot be published to a shared Gallery.

## 🛣 Future Improvements

- Create a responsive mobile version.
- Add a public Gallery for sharing patterns.
- Use Cloudinary to store optimized Gallery preview images.
- Add direct PDF downloads with consistent formatting across browsers.
- Add pattern search, sorting, and filtering.

  
## 🙌 Acknowledgments

- Mentors
- Instructors
- Open-source libraries and tools

## 📄 License

This project is for educational purposes only.
