# AHSAC Documentation

Comprehensive documentation for the Al-Hikmah University SDG Advocacy Club (AHSAC) web application.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [Authentication](#authentication)
5. [Features](#features)
6. [Admin Guide](#admin-guide)
7. [Member Guide](#member-guide)
8. [API Reference](#api-reference)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Overview

AHSAC is a full-stack web application designed to manage the Al-Hikmah University SDG Advocacy Club. It provides tools for member management, event organization, attendance tracking, and promoting the UN Sustainable Development Goals.

### Key Objectives
- Streamline member registration and management
- Facilitate event organization and attendance tracking
- Promote awareness of the 17 SDGs
- Provide analytics on club demographics and engagement

---

## Architecture

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| State Management | TanStack Query |
| Backend | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |

### Project Structure

```
src/
├── components/
│   ├── admin/              # Admin components
│   │   ├── AdminLayout.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── FoundingMemberForm.tsx
│   │   ├── ImageUpload.tsx
│   │   └── ProtectedRoute.tsx
│   ├── layout/
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   └── Navbar.tsx
│   ├── sections/           # Homepage sections
│   │   ├── AboutSection.tsx
│   │   ├── CTASection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── SDGSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── UpcomingEventsSection.tsx
│   ├── MemberQRCode.tsx    # QR code component
│   └── ui/                 # shadcn/ui components
├── hooks/
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   └── useAuth.tsx
├── integrations/
│   └── supabase/
│       ├── client.ts
│       └── types.ts
├── lib/
│   ├── calendar.ts
│   └── utils.ts
├── pages/
│   ├── admin/
│   │   ├── AcademicStructure.tsx
│   │   ├── Alumni.tsx
│   │   ├── Analytics.tsx
│   │   ├── Dashboard.tsx
│   │   ├── EventCheckIn.tsx
│   │   ├── Events.tsx
│   │   ├── FeedbackAdmin.tsx
│   │   ├── FoundingMembers.tsx
│   │   ├── Members.tsx
│   │   ├── RegistrationLinks.tsx
│   │   └── Settings.tsx
│   ├── About.tsx
│   ├── Auth.tsx
│   ├── Contact.tsx
│   ├── EventDetails.tsx
│   ├── Events.tsx
│   ├── Feedback.tsx
│   ├── Index.tsx
│   ├── MemberDashboard.tsx
│   ├── MemberLogin.tsx
│   ├── Register.tsx
│   ├── Resources.tsx
│   ├── SDGs.tsx
│   ├── Team.tsx
│   └── Testimonials.tsx
└── assets/
```

---

## Database Schema

### Tables Overview

#### `members`
Stores active club members.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| full_name | TEXT | Member's full name |
| matric_number | TEXT | Unique matriculation number |
| department | TEXT | Department name |
| department_id | UUID | Reference to departments table |
| faculty_id | UUID | Reference to faculties table |
| whatsapp_number | TEXT | Contact number |
| gender | TEXT | Male/Female |
| level_of_study | TEXT | 100-700 level |
| expected_graduation_year | INTEGER | Expected year of graduation |
| user_id | UUID | Reference to auth.users |
| created_at | TIMESTAMP | Registration date |
| updated_at | TIMESTAMP | Last update date |

#### `alumni`
Stores graduated members.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| full_name | TEXT | Alumni's full name |
| matric_number | TEXT | Matriculation number |
| department | TEXT | Department name |
| graduation_year | INTEGER | Year of graduation |
| whatsapp_number | TEXT | Contact number |
| gender | TEXT | Male/Female |

#### `events`
Stores club events.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Event title |
| description | TEXT | Event description |
| start_date | TIMESTAMP | Event start date/time |
| end_date | TIMESTAMP | Event end date/time |
| location | TEXT | Event venue |
| image_url | TEXT | Banner image URL |
| max_attendees | INTEGER | Maximum capacity |
| registration_required | BOOLEAN | Whether registration is needed |
| is_published | BOOLEAN | Visibility status |
| created_by | UUID | Admin who created it |

#### `event_registrations`
Tracks event registrations.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| event_id | UUID | Reference to events |
| member_id | UUID | Reference to members |
| name | TEXT | Registrant name |
| email | TEXT | Registrant email |
| whatsapp_number | TEXT | Contact number |
| registered_at | TIMESTAMP | Registration time |

#### `event_attendance`
Tracks actual event attendance.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| event_id | UUID | Reference to events |
| member_id | UUID | Reference to members |
| registration_id | UUID | Reference to registration |
| checked_in_at | TIMESTAMP | Check-in time |
| checked_in_by | UUID | Admin who checked them in |

#### `colleges`, `faculties`, `departments`
Academic structure hierarchy.

#### `feedback`
Member feedback and testimonials.

#### `founding_members`
Club founding team profiles.

#### `organization_settings`
Club configuration and information.

#### `profiles`
User profile information.

#### `registration_links`
Shareable registration links.

#### `user_roles`
Role-based access control.

---

## Authentication

### User Roles

| Role | Permissions |
|------|-------------|
| `admin` | Full access to all features |
| `user` | Member dashboard access only |

### Authentication Flow

1. **Member Registration**: `/register` → Creates member record
2. **Member Login**: `/member-login` → Access member dashboard
3. **Admin Login**: `/auth` → Access admin panel

### Row Level Security (RLS)

All tables have RLS enabled with policies:
- Admins can perform all operations on most tables
- Members can only view/update their own records
- Public can view published content (events, testimonials)

---

## Features

### QR Code Check-in System

#### How It Works

1. **Member QR Code Generation**
   - Each member has a unique QR code containing:
     ```json
     {
       "type": "ahsac_member",
       "id": "member-uuid",
       "matric": "AHU/19/0001"
     }
     ```
   - Displayed in member dashboard
   - Downloadable as PNG image

2. **Admin Scanning**
   - Access via `/admin/event-check-in`
   - Select event from dropdown
   - Scan QR code using device camera
   - Automatic attendance logging

3. **Manual Check-in**
   - Search by name or matric number
   - Click to check in member

4. **Printable Attendance Sheet**
   - Generate professional attendance sheets
   - Includes event details, attendee list, and signature column
   - Extra blank rows for manual entries
   - Print directly from browser

#### Implementation

**Member Side** (`src/components/MemberQRCode.tsx`):
- Uses `qrcode.react` for QR generation
- SVG to PNG conversion for download

**Admin Side** (`src/pages/admin/EventCheckIn.tsx`):
- Uses `html5-qrcode` for camera scanning
- Real-time attendance list
- Duplicate check-in prevention
- Print button for attendance sheet

**Printable Sheet** (`src/components/admin/PrintableAttendanceSheet.tsx`):
- Professional layout with AHSAC branding
- Event details section
- Attendance table with serial numbers
- Signature column for verification
- Empty rows for walk-in attendees

### Member Management

#### Bulk Actions
- **Bulk Delete**: Remove multiple members
- **Bulk Move to Alumni**: Graduate members
- **Bulk Update Level**: Change study level

#### Contact Export
- **Copy WhatsApp**: Copy numbers to clipboard
- **Export CSV**: Download as spreadsheet
- **Export vCard**: For phone contacts
- **Google Contacts**: Import via vCard

### Analytics

- Total members count
- Gender distribution (pie chart)
- Department breakdown (bar chart)
- Event attendance trends

---

## Admin Guide

### Accessing Admin Panel

1. Navigate to `/auth`
2. Login with admin credentials
3. Access dashboard at `/admin`

### Managing Members

1. Go to `/admin/members`
2. Use search/filter to find members
3. Select members for bulk actions
4. Export contacts as needed

### Creating Events

1. Go to `/admin/events`
2. Click "Add Event"
3. Fill in event details:
   - Title, description
   - Date and time
   - Location
   - Banner image
   - Registration settings
4. Toggle "Published" to make visible

### Event Check-in

1. Go to `/admin/event-check-in`
2. Select the event
3. Use camera to scan member QR codes
4. Or search manually by name/matric
5. Click "Print Sheet" to generate printable attendance

### Printing Attendance Sheets

1. Check in attendees for the event
2. Click "Print Sheet" button in attendance section
3. A new window opens with formatted sheet
4. Print dialog appears automatically
5. Sheets include:
   - AHSAC logo and header
   - Event details (title, date, location)
   - Numbered attendance list
   - Signature column
   - Extra blank rows for manual additions

### Managing Academic Structure

1. Go to `/admin/academic-structure`
2. Add/edit colleges, faculties, departments
3. Drag to reorder display order

---

## Member Guide

### Registration

1. Navigate to `/register`
2. Fill in personal details:
   - Full name
   - Matric number
   - Faculty and department
   - WhatsApp number
   - Gender
3. Create account or use registration link

### Accessing Dashboard

1. Go to `/member-login`
2. Login with credentials
3. View profile, registrations, attendance

### Using QR Code

1. Access dashboard
2. Find QR code card in profile section
3. Show to admin at events for check-in
4. Download for offline use

### Registering for Events

1. Browse events at `/events`
2. Click event for details
3. Click "Register Now"
4. Fill registration form

---

## API Reference

### Supabase Client

```typescript
import { supabase } from "@/integrations/supabase/client";

// Query examples
const { data: members } = await supabase
  .from('members')
  .select('*')
  .order('created_at', { ascending: false });

const { data: events } = await supabase
  .from('events')
  .select('*')
  .eq('is_published', true);
```

### Authentication

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: { full_name: 'John Doe' }
  }
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Sign out
await supabase.auth.signOut();
```

---

## Deployment

### Lovable Deployment

1. Click "Publish" in Lovable interface
2. App deploys to Lovable hosting
3. Access via provided URL

### Custom Domain

1. Go to Project Settings → Domains
2. Add custom domain
3. Configure DNS as instructed

### Environment Variables

Required in production:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Troubleshooting

### Common Issues

#### "Member not found" after registration
- Wait a few seconds for database sync
- Click "Refresh Profile" in dashboard
- Ensure matric number matches exactly

#### QR Scanner not working
- Allow camera permissions
- Use HTTPS (required for camera access)
- Try different browser

#### Admin access denied
- Verify admin role in `user_roles` table
- Clear browser cache
- Re-login

#### Event not showing
- Check `is_published` is true
- Verify event date is in future
- Check RLS policies

### Getting Help

1. Check browser console for errors
2. Review Supabase logs
3. Contact AHSAC administrators

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024 | Initial release |
| 1.1.0 | 2024 | Added QR check-in system |
| 1.2.0 | 2024 | Added bulk member actions |
| 1.3.0 | 2024 | Added analytics dashboards |
| 1.4.0 | 2025 | Added printable attendance sheets |
| 1.5.0 | 2025 | Updated branding to AHSAC |

---

*Documentation last updated: January 2025*
