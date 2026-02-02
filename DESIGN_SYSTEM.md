# ProductVid Design System

## Color Palette

### Primary Colors
- **Primary**: `#0F172A` (slate-900) - Main text, headers
- **Secondary**: `#64748B` (slate-500) - Secondary text, labels
- **Accent**: `#3B82F6` (blue-500) - Buttons, links, active states
- **Background**: `#F8FAFC` (slate-50) - Page background
- **Card Background**: `#FFFFFF` - White cards with shadows

### Semantic Colors
- **Success**: `#10B981` (green-500)
- **Warning**: `#F59E0B` (amber-500)
- **Error**: `#EF4444` (red-500)
- **Info**: `#3B82F6` (blue-500)

### UI Elements
- **Border**: `#E2E8F0` (slate-200)
- **Border Hover**: `#CBD5E1` (slate-300)
- **Disabled**: `#F1F5F9` (slate-100)

## Typography

### Font Family
- System fonts: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen'`
- All text uses anti-aliasing for smooth rendering

### Font Sizes
- **Heading 1**: `text-3xl` (30px) - Page titles
- **Heading 2**: `text-xl` (20px) - Section headers
- **Heading 3**: `text-lg` (18px) - Card titles
- **Body**: `text-base` (16px) - Regular text
- **Small**: `text-sm` (14px) - Helper text, labels
- **Tiny**: `text-xs` (12px) - Badges, micro copy

### Font Weights
- **Regular**: `font-normal` (400)
- **Medium**: `font-medium` (500)
- **Semibold**: `font-semibold` (600)
- **Bold**: `font-bold` (700)

## Spacing

Uses 4px grid system:
- **xs**: `4px` - Tight spacing
- **sm**: `8px` - Small gaps
- **md**: `16px` - Default spacing
- **lg**: `24px` - Section spacing
- **xl**: `32px` - Large spacing
- **2xl**: `48px` - Extra large spacing

## Components

### Buttons

#### Primary Button (`.btn-primary`)
- Background: `bg-blue-500`
- Hover: `bg-blue-600`
- Active: `bg-blue-700`
- Text: White
- Padding: `px-6 py-3`
- Border Radius: `rounded-xl` (12px)
- Shadow: `shadow-sm` → `shadow-md` on hover

#### Secondary Button (`.btn-secondary`)
- Background: White
- Border: `2px solid #E2E8F0`
- Hover: `bg-slate-50`, `border-slate-300`
- Text: `text-slate-700`
- Same padding and radius as primary

### Input Fields (`.input-field`)
- Border: `2px solid #E2E8F0`
- Focus: Blue border with 4px ring
- Padding: `px-4 py-3`
- Border Radius: `rounded-xl` (12px)
- Background: White

### Cards (`.card`)
- Background: White
- Border: `1px solid #E2E8F0`
- Border Radius: `rounded-2xl` (16px)
- Shadow: `shadow-sm`
- Hover variant: `shadow-md` transition

## Layout

### Navigation Bar
- Height: `64px` (h-16)
- Background: White with bottom border
- Sticky positioning
- Contains: Logo, tabs, user profile, upgrade button

### Content Area
- Max width: `1280px` (max-w-7xl)
- Padding: `24px` (px-6)
- Margin: Centered with `mx-auto`

### Grid System
- Generate page: `lg:grid-cols-[1fr_400px]`
- Form column: Flexible width
- Preview column: Fixed `400px` width, sticky

## Interactions

### Hover States
- Cards: Elevation increase (`shadow-sm` → `shadow-md`)
- Buttons: Slight color darkening
- Links: Underline appearance
- Duration: `200ms`

### Active States
- Buttons: Further color darkening
- Inputs: Blue focus ring

### Transitions
- Default: `150ms` cubic-bezier(0.4, 0, 0.2, 1)
- Shadows: `200ms`

### Animations
- Fade in: `animate-fade-in` (opacity + translateY)
- Loading spinners: `animate-spin`

## Accessibility

- All interactive elements have focus states
- Color contrast meets WCAG AA standards
- Semantic HTML used throughout
- ARIA labels on icons and interactive elements
- Keyboard navigation supported

## Icons

Using Lucide React icons:
- Size: `w-5 h-5` (20px) for most UI icons
- Size: `w-4 h-4` (16px) for inline icons
- Color: Inherits from parent text color

## Badges

- "Beta": Blue (`bg-blue-100`, `text-blue-700`)
- "Pro": Amber/Orange gradient
- "Soon": Gray (`bg-slate-100`, `text-slate-500`)

## Empty States

- Large icon: `w-16 h-16` or `w-20 h-20`
- Background: `bg-slate-100` rounded
- Icon color: `text-slate-400`
- Centered layout with descriptive text
