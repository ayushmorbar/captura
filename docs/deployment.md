# Deployment Guide

## Platforms
- **Vercel** (Recommended)
- Netlify
- Railway
- Docker

## Vercel
```bash
npm i -g vercel
vercel --prod
```

## Netlify
- Build command: `pnpm build`
- Publish directory: `.next`

## Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables
- See `.env.example` for required variables

## Production Checklist
- Run `pnpm build` and `pnpm start` to verify
- Check SEO and performance with Lighthouse
- Monitor errors and analytics

## Support
- [Issues](https://github.com/ayushmorbar/captura/issues)
- [Discussions](https://github.com/ayushmorbar/captura/discussions)
