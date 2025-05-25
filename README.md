# PDF Translator Frontend

A modern, elegant PDF translation application with internationalization support and advanced Gemini AI integration.

## 🏗️ Project Status

✅ **Backend**: Deployed and ready  
🚀 **Frontend**: Ready for deployment to Vercel/Netlify/Replit

## ✨ Features

- 🌍 **Internationalization**: Complete Chinese (default) and English support
- 🎨 **Modern Design**: Beautiful gradient backgrounds, card-based layout, smooth animations
- ⚙️ **Advanced Settings**: Custom Gemini API key and model configuration (collapsible)
- 📱 **Responsive**: Works perfectly on desktop and mobile devices
- 🚀 **Real-time Status**: Live service health monitoring
- 🎯 **Enhanced UX**: Drag & drop file upload, clear loading states, comprehensive error handling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

#### Option 1: Automated Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pdf-docat-frontend
   ```

2. **Run the setup script**
   ```bash
   ./setup.sh
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

#### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pdf-docat-frontend
   ```

2. **Install all dependencies** (including UI components and Tailwind plugins)
   ```bash
   # Install main dependencies
   npm install
   
   # Install additional required packages for the modern UI
   npm install @radix-ui/react-collapsible @tailwindcss/typography tailwindcss-animate
   ```

   **Or install everything in one command:**
   ```bash
   npm install && npm install @radix-ui/react-collapsible @tailwindcss/typography tailwindcss-animate
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in your terminal)

### 🚨 Troubleshooting Dependencies

If you encounter missing dependency errors, install them individually:

```bash
# Core UI dependencies
npm install @radix-ui/react-collapsible
npm install @radix-ui/react-dialog
npm install @radix-ui/react-select
npm install @radix-ui/react-slot
npm install @radix-ui/react-switch
npm install @radix-ui/react-toast
npm install @radix-ui/react-tooltip
npm install @radix-ui/react-progress

# Tailwind plugins
npm install @tailwindcss/typography
npm install tailwindcss-animate

# Utility libraries
npm install class-variance-authority
npm install clsx
npm install tailwind-merge
npm install lucide-react
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
src/
├── components/
│   └── ui/           # Reusable UI components (Button, Card, Input, etc.)
├── lib/
│   ├── api.ts        # API client and types
│   ├── i18n.ts       # Internationalization system
│   └── utils.ts      # Utility functions
├── App.tsx           # Main application component
├── main.tsx          # Application entry point
└── index.css         # Global styles and design system
```

## 🌍 Internationalization

The application supports:
- **Chinese (Simplified)** - Default language
- **English** - Secondary language

Language can be switched using the dropdown in the top-right corner.

## ⚙️ Advanced Settings

### Custom Gemini Configuration

Users can configure their own Gemini AI settings:

1. Click "Advanced Settings" to expand the panel
2. Toggle "Use custom Gemini settings"
3. Enter your Gemini API key
4. Select your preferred model:
   - Gemini 1.5 Flash (default)
   - Gemini 1.5 Pro
   - Gemini Pro

## 🎨 Design System

The application uses a modern design system with:

- **Colors**: HSL-based color system with CSS custom properties
- **Typography**: System font stack with proper font weights
- **Spacing**: Consistent spacing scale
- **Components**: Radix UI primitives with custom styling
- **Animations**: Smooth transitions and micro-interactions

## 📦 Dependencies

### Core Dependencies
- React 18+ with TypeScript
- Vite for build tooling
- TanStack Query for data fetching
- React Dropzone for file uploads
- Axios for HTTP requests

### UI Dependencies
- Radix UI primitives for accessibility
- Lucide React for icons
- Tailwind CSS for styling
- Class Variance Authority for component variants

### Required Additional Packages
- `@radix-ui/react-collapsible` - For collapsible advanced settings
- `@tailwindcss/typography` - For enhanced typography support
- `tailwindcss-animate` - For smooth animations

## 🔧 Configuration

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Tailwind Configuration

The project uses a custom Tailwind configuration with:
- Design system colors
- Custom animations
- Typography plugin
- Component-friendly utilities

## 🚀 Production Build

```bash
npm run build
npm run preview
```

## 📝 License

[Your License Here]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions, please open an issue on GitHub.

## 🚀 Quick Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial frontend commit"
   git remote add origin https://github.com/zhanghanduo/pdf-docat-frontend.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Set environment variable:
     ```
     VITE_API_BASE_URL=https://your-backend-api.example.com
     ```
   - Deploy!

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Drag & drop the `dist/` folder
   - Or connect GitHub repository for auto-deployment
   - Set environment variable: `VITE_API_BASE_URL=https://your-backend-api.example.com`

### Deploy to Replit

1. **Create new Replit project**
   - Visit [replit.com](https://replit.com)
   - Create new Node.js project
   - Import from GitHub: `https://github.com/zhanghanduo/pdf-docat-frontend`

2. **Configure environment**
   - Add environment variable in Replit Secrets:
     ```
     VITE_API_BASE_URL=https://your-backend-api.example.com
     ```

3. **Deploy**
   - Replit will automatically build and deploy
   - Your app will be available at `https://your-project.username.replit.app`

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and set VITE_API_BASE_URL to your backend API URL
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🧪 Testing Connection

Test the connection to your deployed backend:

```bash
# Test from project root
API_BASE_URL=https://your-backend-api.example.com node test-connection.js
```

Or open `test-connection.html` in your browser.

## 📋 API Integration

The frontend communicates with the backend API through these endpoints:

- `GET /health` - Check API status
- `GET /api/v1/supported-languages` - Get available languages
- `POST /api/v1/translate` - Upload and translate PDF
- `GET /api/v1/download/{task_id}` - Download translated PDF
- `DELETE /api/v1/cleanup/{task_id}` - Clean up temporary files

## 🌍 Supported Languages

- 🇺🇸 English (en)
- 🇨🇳 Chinese Simplified (zh)
- 🇹🇼 Chinese Traditional (zh-TW)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇪🇸 Spanish (es)
- 🇮🇹 Italian (it)
- 🇵🇹 Portuguese (pt)
- 🇷🇺 Russian (ru)
- 🇸🇦 Arabic (ar)

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Query** - Data fetching and caching
- **Axios** - HTTP client
- **React Dropzone** - File upload handling
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📁 Project Structure

```
pdf-docat-frontend/
├── src/
│   ├── lib/
│   │   ├── api.ts          # API client configuration
│   │   └── utils.ts        # Utility functions
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # React entry point
│   ├── index.css           # Global styles
│   └── vite-env.d.ts       # TypeScript definitions
├── docs/                   # Documentation
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── index.html              # HTML template
├── .env.example            # Environment template
├── test-connection.js      # Backend connection test
└── README.md               # This file
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🚨 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify the backend is running
   - Check browser console for CORS errors
   - Test connection using `API_BASE_URL=https://your-api.com node test-connection.js`

2. **File Upload Fails**
   - Ensure the file is a valid PDF
   - Check file size limits (backend dependent)
   - Verify API endpoint is reachable

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check Node.js version (requires 18+)
   - Clear cache: `rm -rf node_modules package-lock.json && npm install`

### CORS Issues

The backend should be configured to allow requests from:
- `http://localhost:*` (local development)
- `https://*.vercel.app` (Vercel deployments)
- `https://*.netlify.app` (Netlify deployments)
- `https://*.replit.app` (Replit deployments)
- `https://*.pages.dev` (Cloudflare Pages)

## 🌐 Environment Variables

For all deployment platforms, set:
```
VITE_API_BASE_URL=https://your-backend-api.example.com
```

Replace `https://your-backend-api.example.com` with your actual backend API URL.

## 📚 Documentation

For detailed deployment guides, see the `docs/` folder:
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Complete deployment instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [PDFMathTranslate](https://github.com/Byaidu/PDFMathTranslate) - Core translation engine
- Built with modern React and TypeScript