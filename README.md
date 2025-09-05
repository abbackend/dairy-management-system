# Dairy Management System

A modern React-based dairy management system built with Tailwind CSS and Heroicons. This application helps manage dairy cooperative operations including member management, milk collections, and analytics reporting.

## Features

- **Authentication System**: Secure login with demo credentials
- **Dashboard**: Overview of key metrics and recent activities
- **Members Management**: Add, edit, and manage dairy cooperative members
- **Milk Collections**: Record and track daily milk collections with quality metrics
- **Reports & Analytics**: Comprehensive charts and analytics for business insights

## Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Charts**: Recharts
- **Routing**: React Router DOM
- **Date Utilities**: date-fns

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Login Credentials
- **Username**: admin
- **Password**: admin123

### Navigation
- **Dashboard**: Main overview with key statistics and quick actions
- **Members**: Manage dairy cooperative members
- **Milk Collections**: Record and view milk collection data
- **Reports**: View analytics and generate reports

## Features Overview

### Dashboard
- Real-time statistics display
- Recent collections summary
- Quick action buttons for common tasks
- Performance indicators with trend analysis

### Members Management
- Add new members with complete information
- Search and filter members
- Edit member details
- View member performance statistics
- Status management (Active/Inactive)

### Milk Collections
- Record daily milk collections
- Track quality metrics (fat %, SNF %)
- Automatic amount calculations
- Date-wise filtering and search
- Export capabilities for reports

### Reports & Analytics
- Daily collection trends
- Monthly performance analysis
- Quality distribution charts
- Top performing members
- Revenue analytics
- Interactive charts with multiple data views

## Project Structure

```
src/
├── components/
│   └── Layout.js          # Main layout with navigation
├── contexts/
│   └── AuthContext.js     # Authentication context
├── pages/
│   ├── Dashboard.js       # Dashboard page
│   ├── Login.js           # Login page
│   ├── Members.js         # Members management
│   ├── MilkCollections.js # Collections tracking
│   └── Reports.js         # Analytics and reports
├── App.js                 # Main app component
├── index.js              # Entry point
└── index.css             # Global styles with Tailwind
```

## Available Scripts

- `npm start` - Runs the development server
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Removes the single build dependency

## Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## Customization

### Colors
The application uses a custom primary color scheme defined in `tailwind.config.js`. You can modify the color palette by updating the configuration.

### Data Management
Currently uses mock data for demonstration. In production, replace with actual API calls:
- Update authentication logic in `AuthContext.js`
- Replace mock data in components with API endpoints
- Add proper error handling and loading states

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
