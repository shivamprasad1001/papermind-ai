# Open Graph Image Guide

## Required Images

To complete the Open Graph setup, you need to create the following images:

### 1. **og-image.png**
- **Dimensions**: 1200 x 630 pixels (recommended by Facebook/Twitter)
- **Format**: PNG or JPG
- **Location**: `/public/og-image.png`
- **Purpose**: Social media preview image when sharing your app

### 2. **logo.svg** (if not exists)
- **Format**: SVG
- **Location**: `/public/logo.svg`
- **Purpose**: Favicon for the browser tab

## Creating the Open Graph Image

### Design Recommendations:
1. **Include your brand name**: "PaperMind AI v2"
2. **Tagline**: "Chat with Your PDFs Using AI"
3. **Visual elements**: 
   - Document/PDF icon
   - AI/Brain icon
   - Chat bubbles
4. **Colors**: Match your app's theme
5. **Readable text**: Use large, bold fonts

### Tools to Create:
- **Canva** (easiest): Use their "Facebook Post" template (1200x630)
- **Figma**: Professional design tool
- **Photoshop/GIMP**: Advanced editing
- **Online OG Image Generators**: 
  - https://www.opengraph.xyz/
  - https://ogimage.gallery/

### Quick Setup:
```bash
# Create public folder if it doesn't exist
mkdir public

# Add your images
# public/og-image.png
# public/logo.svg
```

## Current Meta Tags

The following Open Graph tags have been added to `index.html`:

```html
<!-- Primary Meta Tags -->
<meta name="title" content="PaperMind AI v2 - Intelligent Document Chat Assistant" />
<meta name="description" content="Chat with your PDFs using advanced AI..." />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://papermind-ai.vercel.app/" />
<meta property="og:title" content="PaperMind AI v2 - Intelligent Document Chat Assistant" />
<meta property="og:image" content="https://papermind-ai.vercel.app/og-image.png" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:image" content="https://papermind-ai.vercel.app/og-image.png" />
```

## Testing Your Open Graph Tags

After adding the image, test your OG tags using:
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/
- **General**: https://www.opengraph.xyz/url/

## Notes
- Update the URL in `index.html` if your deployment URL is different
- The image should be publicly accessible
- Cache: Social platforms cache OG images, so updates may take time to reflect
