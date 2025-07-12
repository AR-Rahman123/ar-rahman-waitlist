# Video Assets

## AR Rahman Demo Video

Place your MP4 video file here as `ar-rahman-demo.mp4`

The video will be served at `/video/ar-rahman-demo.mp4` and will replace the YouTube embed on the homepage.

### Benefits of Local Video:
- No YouTube ads or recommendations
- Complete control over player appearance
- No external dependencies
- Users stay on your site
- Better loading performance
- Custom branding and styling

### Supported Formats:
- MP4 (recommended)
- WebM
- OGG

### Recommended Settings:
- Resolution: 1920x1080 (Full HD)
- Bitrate: 2-5 Mbps for web
- Format: H.264 MP4
- Audio: AAC

### File Size Considerations:
- Keep file size under 50MB for good loading performance
- Consider creating multiple quality versions if needed

## Large File Solutions (100MB+)

### Option 1: Video Compression
Use tools to reduce file size while maintaining quality:
- **HandBrake** (free): Can reduce file size by 50-80%
- **FFmpeg** command: `ffmpeg -i input.mp4 -crf 28 -preset medium output.mp4`
- **Online compressors**: VideoSmaller.com, Clideo.com

### Option 2: External CDN Hosting
Host video on external service and link directly:
- **Vimeo** (recommended): Upload as unlisted, get direct MP4 link
- **AWS S3**: Upload to S3 bucket, use CloudFront for faster delivery
- **Google Drive**: Upload and get direct download link
- **Dropbox**: Upload and create direct link

### Option 3: Split into Chunks
Break video into smaller segments and create playlist

### Option 4: Use Replit's File System
Upload via Replit's shell using curl or wget:
```bash
# Example: Download from external source
wget "https://your-video-host.com/video.mp4" -O public/video/ar-rahman-demo.mp4
```