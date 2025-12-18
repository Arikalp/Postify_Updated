# Postify - Next.js Version

A modern social platform built with Next.js, MongoDB, and Tailwind CSS.

## Features

- User authentication (register/login)
- Create, read, and delete posts
- Like/unlike posts
- User profiles
- Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with httpOnly cookies
- **Password Hashing**: bcrypt

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication routes
│   │   ├── posts/         # Post-related routes
│   │   └── profile/       # Profile route
│   ├── login/             # Login page
│   ├── profile/           # Profile page
│   ├── layout.js          # Root layout
│   ├── page.js            # Register page
│   └── globals.css        # Global styles
├── lib/
│   ├── mongodb.js         # MongoDB connection
│   └── auth.js            # Authentication utilities
├── models/
│   ├── user.js            # User model
│   └── post.js            # Post model
└── public/                # Static assets
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other platforms

Build the production version:

```bash
npm run build
npm start
```

## License

MIT
