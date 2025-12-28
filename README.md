# ASAC - Al-Hikmah University SDG Advocacy Club

Welcome to the official website for the Al-Hikmah University SDG Advocacy Club (ASAC). This project serves as the digital platform for students passionate about the United Nations Sustainable Development Goals (SDGs) and creating positive change in our community.

## Table of Contents
- [About ASAC](#about-asac)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [Deployment](#deployment)
- [Support](#support)

## About ASAC

The Al-Hikmah University SDG Advocacy Club is dedicated to promoting awareness and action around the 17 Sustainable Development Goals. Our mission is to engage students in meaningful activities that contribute to sustainable development both within our university and the broader community.

### Our Goals
- Raise awareness about the UN SDGs among students
- Organize events and workshops focused on sustainability
- Create a network of student advocates for change
- Implement projects that address local sustainability challenges

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **SDG Information**: Comprehensive information about all 17 Sustainable Development Goals
- **Event Calendar**: Upcoming events and activities organized by ASAC
- **Registration System**: Easy registration process for new members
- **Member Dashboard**: Personalized dashboard for club members
- **Contact Form**: Easy way to get in touch with the club
- **Social Media Integration**: Links to our social media platforms

## Technology Stack

This project is built with:

- **Vite**: Fast build tool and development server
- **TypeScript**: Typed JavaScript for improved code quality
- **React**: Component-based UI library
- **shadcn/ui**: Reusable UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth interactions
- **Lucide React**: Beautiful icon library
- **React Router**: Client-side routing

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or pnpm package manager

### Installation

1. Clone the repository:
```sh
git clone <YOUR_REPOSITORY_URL>
```

2. Navigate to the project directory:
```sh
cd asac-hui
```

3. Install dependencies:
```sh
npm install
# or
pnpm install
```

4. Create a `.env` file in the root directory and add your environment variables:
```env
VITE_API_URL=your_api_url_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

5. Start the development server:
```sh
npm run dev
# or
pnpm run dev
```

6. Open your browser and visit `http://localhost:5173` to see the application

### Environment Variables

The application requires the following environment variables:

- `VITE_API_URL`: Base URL for API requests
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

## Project Structure

```
asac-hui/
├── public/                 # Static assets
│   ├── assets/             # Images and other media
│   └── favicon.ico         # Site favicon
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── layout/         # Layout components (Navbar, Footer)
│   │   └── sections/       # Page sections
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and libraries
│   ├── types/              # TypeScript type definitions
│   ├── assets/             # Imported assets (images, icons)
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Entry point
├── .env                    # Environment variables
├── .env.example            # Example environment variables
├── .gitignore              # Files to ignore in Git
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.ts          # Vite configuration
└── README.md               # Project documentation
```

## Development Workflow

### Adding New Components

1. Create a new component file in the appropriate directory under `src/components/`
2. Follow the naming convention: `ComponentName.tsx`
3. Use TypeScript interfaces for props
4. Follow the existing code style and patterns

### Styling Guidelines

- Use Tailwind CSS utility classes for styling
- Follow the existing color palette and typography
- Use shadcn/ui components where possible
- Maintain consistency across the application

### Component Structure

Each component should follow this structure:

```tsx
import { ComponentNameProps } from "@/types/component-types";

const ComponentName = ({ prop1, prop2 }: ComponentNameProps) => {
  return (
    <div className="...">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

### Routing

The application uses React Router for navigation. Routes are defined in `src/App.tsx`. When adding new pages:

1. Create the page component in `src/pages/`
2. Add the route to `src/App.tsx`
3. Update navigation links if necessary

## Contributing

We welcome contributions to the ASAC project! Here's how you can help:

### Reporting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists in our issue tracker
2. If not, create a new issue with a clear title and description
3. Include steps to reproduce the issue if applicable

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes following the coding standards
4. Test your changes thoroughly
5. Submit a pull request with a clear description of your changes

### Coding Standards

- Write clean, readable code
- Use TypeScript for type safety
- Follow the existing code style
- Write meaningful commit messages
- Add comments where necessary

## Deployment

### Local Build

To create a production build:

```sh
npm run build
# or
pnpm run build
```

This will create a `dist/` directory with the production-ready application.

### Deployment Options

1. **Vercel**: 
   - Connect your GitHub repository to Vercel
   - Vercel will automatically deploy your application on pushes to the main branch

2. **Netlify**:
   - Connect your GitHub repository to Netlify
   - Set the build command to `npm run build` or `pnpm run build`
   - Set the publish directory to `dist`

3. **GitHub Pages**:
   - Build the project locally with `npm run build`
   - Push the `dist/` directory to the `gh-pages` branch

### Environment Variables in Production

Make sure to set the required environment variables in your deployment platform:

- `VITE_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Support

If you need help with the application:

- Check the documentation in this README
- Look at the existing code for examples
- Contact the development team via the contact form on the website
- Create an issue in the GitHub repository

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The United Nations for the Sustainable Development Goals framework
- The Al-Hikmah University community for supporting this initiative
- The open-source community for the tools and libraries used in this project