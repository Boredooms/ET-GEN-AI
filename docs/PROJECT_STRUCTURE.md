# My App - Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   └── route.ts           # API endpoint examples
│   ├── dashboard/             # Dashboard routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css            # Global styles with monochrome theme
│   ├── layout.tsx             # Root layout with Header/Footer
│   ├── page.tsx               # Home page
│   └── favicon.ico
├── components/
│   ├── common/                # Reusable components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── ui/                    # shadcn/ui components
│       └── button.tsx         # Pre-installed button
├── hooks/                     # Custom React hooks
│   └── useTheme.ts           # Theme toggle hook
├── lib/
│   ├── cn.ts                 # Class name utilities
│   └── utils.ts              # Generated shadcn utilities
├── types/                     # TypeScript type definitions
│   └── index.ts
├── utils/                     # Utility functions
│   └── constants.ts          # App constants
└── config/
    └── index.ts              # Project configuration
```

## Features Included

✅ **Next.js 15** - Latest version with App Router  
✅ **TypeScript** - Full type safety  
✅ **Tailwind CSS 4** - Utility-first CSS  
✅ **shadcn/ui** - Beautiful, accessible components  
✅ **Monochrome White Theme** - Clean, professional design  
✅ **Dark Mode Support** - Light/dark theme toggle  
✅ **Proper Folder Structure** - Organized and scalable  
✅ **Custom Hooks** - Theme management ready  
✅ **API Routes** - Example endpoints  
✅ **Dashboard Layout** - Multi-page routing example  

## Getting Started

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

## Adding More Components

Add new shadcn/ui components with:
\`\`\`bash
npx shadcn@latest add [component-name]
\`\`\`

## Customizing the Theme

Edit `src/app/globals.css` to modify the monochrome theme colors in the `:root` and `.dark` sections.

## Project Structure Philosophy

- **`/app`** - Next.js app router pages and layouts
- **`/components`** - React components (UI and common)
- **`/hooks`** - Custom React hooks
- **`/lib`** - Utility libraries and helpers
- **`/types`** - TypeScript type definitions
- **`/utils`** - Pure utility functions
- **`/config`** - Application configuration

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
