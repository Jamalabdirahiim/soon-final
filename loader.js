'use client';

// A custom loader for Next.js images that specifies how to fetch images from Firebase Storage.
export default function firebaseImageLoader({ src, width, quality }) {
  // Right now, this loader simply returns the original image source.
  // For even better performance, you could use a Firebase Extension like the a custom image resizer
  // to serve dynamically resized images. For example:
  // return `${src}?w=${width}&q=${quality || 75}`;
  return src;
}
