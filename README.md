# ProductVid - AI-Powered Product Video Generator

Create stunning product showcase videos in seconds with AI-powered automation.

## Features

- **Drag & Drop Upload**: Upload up to 5 product images
- **Real-time Preview**: See your video as you build it
- **Customizable**: Change product name, price, and colors
- **Social Media Ready**: 1080x1920 vertical format at 30 FPS
- **Smooth Animations**: Professional transitions and spring animations

## Tech Stack

- **Next.js 14** - React framework with App Router
- **Remotion 4.x** - Programmatic video generation
- **Tailwind CSS** - Utility-first styling
- **React Dropzone** - File upload handling
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Remotion Studio

To open the Remotion Studio for direct composition editing:

```bash
npm run remotion:studio
```

### Build Video

To render the video to a file:

```bash
npm run remotion:build
```

## Project Structure

```
productvid-app/
├── app/
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main UI with controls and preview
├── remotion/
│   ├── compositions/
│   │   └── ProductShowcase.tsx  # Video template
│   ├── Root.tsx          # Composition registration
│   └── index.ts          # Remotion entry point
├── package.json
├── remotion.config.ts    # Remotion CLI config
└── tailwind.config.ts    # Tailwind config
```

## Video Composition

The ProductShowcase composition includes:

- Smooth zoom and fade transitions between product images
- Spring-animated text (product name and price)
- Progress dots showing current image
- "Shop Now" call-to-action at the end
- 10-second duration with 2-second display per image

## Customization

You can customize the following via the UI:

| Property | Description |
|----------|-------------|
| Product Images | Up to 5 images |
| Product Name | Main heading text |
| Product Price | Price display |
| Background Color | Video background |
| Text Color | All text elements |

## License

MIT
