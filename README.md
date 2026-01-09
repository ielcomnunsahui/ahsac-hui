# Al-Hikmah University SDG Advocacy Club (AHSAC)

A comprehensive web application for managing the Al-Hikmah University SDG Advocacy Club (AHSAC), built with modern web technologies.

## 🌍 About AHSAC

The Al-Hikmah University SDG Advocacy Club is dedicated to promoting and advancing the United Nations Sustainable Development Goals (SDGs) within the university community and beyond.

## ✨ Features

### Public Features
- **Homepage** - Overview of AHSAC with upcoming events and testimonials
- **Events** - Browse and register for upcoming club events
- **SDGs Information** - Learn about the 17 Sustainable Development Goals
- **Resources** - Access educational materials and resources
- **Member Registration** - Join AHSAC as a member
- **Feedback & Testimonials** - Share experiences and feedback

### Member Features
- **Member Dashboard** - Personal profile and activity overview
- **QR Code Check-in** - Unique QR code for event attendance tracking
- **Event Registration** - Register for upcoming events
- **Attendance History** - View past event participation

### Admin Features
- **Dashboard** - Overview of club statistics
- **Analytics** - Member demographics, gender distribution, department analytics
- **Member Management** - Add, edit, bulk actions (delete, move to alumni, update level)
- **Contact Export** - Export member contacts to CSV, vCard, Google Contacts
- **Event Management** - Create, edit, publish events
- **QR Code Check-in System** - Scan member QR codes for quick attendance
- **Academic Structure** - Manage colleges, faculties, and departments
- **Alumni Management** - Track graduated members
- **Feedback Moderation** - Approve/reject member feedback
- **Founding Members** - Manage founding member profiles
- **Registration Links** - Generate shareable registration links
- **Organization Settings** - Configure club information

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Animation**: Framer Motion
- **State Management**: TanStack Query (React Query)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **QR Code**: qrcode.react, html5-qrcode

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Supabase account (for backend)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ahsac-website
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
# or
bun dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📖 Documentation

For comprehensive documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md).

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── admin/           # Admin-specific components
│   ├── layout/          # Layout components (Navbar, Footer)
│   ├── sections/        # Homepage sections
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
├── integrations/        # Third-party integrations
│   └── supabase/        # Supabase client and types
├── lib/                 # Utility functions
├── pages/               # Page components
│   └── admin/           # Admin pages
└── assets/              # Static assets
```

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Role-based access control (Admin/User)
- Secure authentication via Supabase Auth

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please contact the AHSAC team.

---

Built with ❤️ for the Al-Hikmah University community
