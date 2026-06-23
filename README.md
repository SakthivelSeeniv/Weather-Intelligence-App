# Weather Forecast Application

This is a modern, responsive Weather Forecast application built with React, TypeScript, Tailwind CSS, and Vite. It provides current weather conditions, hourly forecasts, and weekly outlooks with smooth animations using `motion`.

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Build Instructions

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd weather-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000` (or the port specified in your console).

4. **Build for production**:
   ```bash
   npm run build
   ```
   This will bundle the application and output the static files to the `dist` directory, ready for deployment.

---

## 🔄 Exporting from Google AI Studio to GitHub

If you are developing this application within the Google AI Studio platform, you can easily export your workspace directly to a GitHub repository:

1. In the Google AI Studio top navigation bar, click on the **Share & Export** menu (often represented by an export or cloud icon).
2. Select **Export to GitHub**.
3. You will be prompted to authenticate your GitHub account and grant access to AI Studio.
4. Choose whether to export to an **existing repository** or **create a new one**.
5. Confirm the export. AI Studio will securely commit and push your entire workspace (including this `README.md`, `package.json`, and all source code) to the selected repository.

*(Alternative: You can also choose "Download ZIP" from the menu, extract it locally, run `git init`, and push to GitHub manually).*

---

## ☁️ Deploying to Cloudflare Pages

Since this is a client-side Single Page Application (SPA) built with Vite, **Cloudflare Pages** is the perfect hosting solution. It is fast, free, and integrates seamlessly with GitHub for CI/CD.

### Step-by-Step Deployment

1. **Ensure your code is on GitHub** (using the AI Studio export steps above).
2. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
3. Click **Create Application**, then select the **Pages** tab.
4. Click **Connect to Git** and authorize Cloudflare to access your GitHub account.
5. Select the repository containing your Weather App project.
6. In the **Set up builds and deployments** section, configure the following settings:
   - **Framework preset**: `Vite` (If Vite isn't an option, select `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
7. Click **Save and Deploy**.

Cloudflare will securely clone your repository, install dependencies, run the Vite build process, and deploy your site to their global edge network. 

**Continuous Deployment:** Moving forward, every time you push new code to your GitHub repository's main branch, Cloudflare Pages will automatically trigger a new deployment!
