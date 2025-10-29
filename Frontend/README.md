
# ClubIQ converted to Next.js (app router)

What's here:
- `app/` — Next.js app router files (`layout.jsx`, `page.jsx`)
- `public/` — all original site files copied from the uploaded ZIP
- `package.json`, `next.config.js`

How to run locally:
1. Ensure Node.js is installed (v18+ recommended).
2. In this project folder, run:
   ```bash
   npm install
   npm run dev
   ```
3. Open http://localhost:3000

Notes:
- I placed your original files into `/public`. If `index.html` exists, you can open `/index.html` directly.
- For a proper React migration, you'd convert the HTML into React components under `app/` or `components/`.
- If you'd like, I can automatically convert specific HTML files into React components and wire up styles — tell me which page(s) to convert next.

Files extracted from the ZIP (short listing):
clubiq-ui/
  package.json
  index.html
  src/
    main.jsx
    App.jsx
    index.css
    App.css
    pages/
      LoginPage.jsx
      RegisterPage.jsx
      MemberDashboard.jsx
      AdminDashboard.jsx
    components/
      Sidebar.jsx
      ActivityCard.jsx
      RatingCard.jsx
      admin/
        MemberManagement.jsx
        ActivityManagement.jsx
        RatingPanel.jsx
        ReportsAnalytics.jsx
    styles/
      auth.css
      dashboard.css
      sidebar.css
      components.css
      admin.css
