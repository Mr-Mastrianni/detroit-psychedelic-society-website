# GitHub Pages Deployment Guide

## Quick Setup Instructions

### 1. Push to GitHub Repository

First, make sure all your files are committed and pushed to your GitHub repository:

```bash 
git add .
git commit -m "Set up GitHub Pages deployment"
git push origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub.com
2. Click on the **Settings** tab
3. Scroll down to the **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. The deployment workflow will automatically triggers

### 3. Access Your Website

After the deployment completes (usually 1-2 minutes), your site will be available at:
`https://[your-username].github.io/[repository-name]`

For example: `https://yourusername.github.io/detroit-psychedelic-society-website`

## Custom Domain Setup (Optional)

If you want to use a custom domain like `detroitpsychedelicsociety.com`:

1. In the **Pages** settings, add your custom domain
2. Create a `CNAME` file in your repository root with your domain
3. Configure DNS records with your domain provider:
   - Add a CNAME record pointing to `[your-username].github.io`
   - Or use A records pointing to GitHub's IP addresses

## Files Added for Deployment

- `.github/workflows/deploy.yml` - Automated deployment workflow
- `.gitignore` - Excludes unnecessary files from the repository
- `DEPLOYMENT.md` - This deployment guide

## Features of Your Site

Your Detroit Psychedelic Society website includes:

✅ Responsive design that works on all devices
✅ Interactive animations and Three.js graphics
✅ Brand identity guidelines
✅ Educational content sections
✅ Community-focused navigation
✅ Professional typography and color schemes

## Troubleshooting

### If deployment fails:
1. Check the **Actions** tab in your GitHub repository
2. Look for error messages in the workflow logs
3. Ensure all file paths use forward slashes (/)
4. Make sure all external resources (fonts, CDN links) use HTTPS

### If images don't load:
- Verify image URLs are accessible via HTTPS
- Consider hosting images directly in your repository

### For custom domain issues:
- Allow 24-48 hours for DNS propagation
- Use online DNS checker tools to verify your records

## Security Notes

- All external resources (CDNs, fonts) use HTTPS
- No sensitive information is exposed in the client-side code
- GitHub Pages serves content over HTTPS by default

## Next Steps

1. Test your site thoroughly on different devices
2. Consider adding Google Analytics or other tracking
3. Set up monitoring for uptime and performance
4. Regularly update content and check for broken links

Your website is now ready for professional hosting on GitHub Pages!
