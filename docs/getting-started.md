# Getting Started with Captura

## Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Modern browser (Chrome, Firefox, Safari, Edge)

## Installation
```bash
git clone https://github.com/ayushmorbar/captura.git
cd captura
pnpm install
cp .env.example .env.local
```

## Running Locally
```bash
pnpm dev
```
Visit [http://localhost:3000](http://localhost:3000)

## Project Structure
```
app/         # Next.js app directory
components/  # UI and feature components
hooks/       # Custom React hooks
lib/         # Utilities and helpers
public/      # Static assets
styles/      # Global styles
```

## Environment Variables
Edit `.env.local` for custom configuration. See `.env.example` for available options.

## Useful Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - TypeScript checks

## Need Help?
- [Issues](https://github.com/ayushmorbar/captura/issues)
- [Discussions](https://github.com/ayushmorbar/captura/discussions)
- [Contributing Guide](./CONTRIBUTING.md)
