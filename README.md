# WhiskQR

UPC barcode scanner PWA. Scan barcodes on your phone, install it like an app.

## Quick Start

Open in Safari on iOS or Chrome on Android:

<https://<username>.github.io/whiskqr/>

## Install

### iOS (iPhone/iPad)

1. Open the link above in **Safari**
2. Tap the **Share** button (square with upward arrow)
3. Tap **Add to Home Screen**
4. Confirm

### Android

1. Open the link above in **Chrome**
2. Tap the **⋮** menu
3. Tap **Add to Home Screen** or **Install App**
4. Confirm

### Desktop

Works on any browser with a camera. Just open the link and point at a UPC barcode.

## How It Works

- Points at a UPC-A, UPC-E, EAN-8, or EAN-13 barcode
- Scans in real-time using the back camera
- Shows the decoded barcode number with haptic feedback
- Tap **Scan Another** to rescan

## Development

```bash
npm install
npm run dev
```

Requires HTTPS or localhost for camera access — the dev server handles this automatically.
