# DealNDone POS Frontend

A modern React-based Point of Sale system for men's garments.

## Features

- 🛍️ **Product Selection**: Browse and search through available shirts
- 🔍 **Search Functionality**: Search by product name or SKU
- 📊 **Real-time Stock Display**: See current stock levels
- 💳 **Checkout Process**: Easy quantity selection and payment processing
- 🔗 **API Integration**: Connects to FastAPI backend
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   ├── POSScreen.jsx      # Main POS interface
│   └── ProductCard.jsx    # Reusable product card component
├── App.js                 # Main app component
├── index.js              # React entry point
└── index.css             # Global styles with Tailwind CSS
```

## API Integration

The frontend connects to the FastAPI backend at `http://localhost:8000`:

- **Health Check**: `GET /health` - Check API status
- **Sales Processing**: `POST /sales` - Process shirt sales

## Technologies Used

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Create React App** - React development environment

## Development

### Adding New Products

To add new products, modify the `products` array in `POSScreen.jsx`:

```javascript
const products = [
  {
    id: 'shirt_004',
    name: 'New Product Name',
    price: 25.00,
    stock: 10,
    image: 'https://example.com/image.jpg',
    category: 'Dress Shirts'
  }
];
```

### Styling

The app uses Tailwind CSS for styling. Custom styles can be added in `index.css` or by extending the Tailwind configuration in `tailwind.config.js`.

## Production Build

To create a production build:

```bash
npm run build
```

This creates a `build` folder with optimized files ready for deployment. 