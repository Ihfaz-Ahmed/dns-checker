# DNS Checker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13.5.6-black)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-blue)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-16.20.0-green)](https://nodejs.org/)

A modern web application built with Next.js, TailwindCSS, and Node's DNS module for checking DNS records of any domain name. This tool allows users to lookup various DNS record types including A, AAAA, MX, TXT, CNAME, NS, and SOA records.

## Features

- 🔍 Lookup multiple DNS record types
- 🎯 Support for A, AAAA, MX, TXT, CNAME, NS, and SOA records
- 🌓 Dark mode support with system preference detection
- 💫 Modern, responsive UI built with TailwindCSS
- ⚡ Fast DNS lookups using Node's native DNS resolver
- 🎨 Clean and intuitive interface
- 🔄 Loading states and error handling
- 📱 Mobile-friendly design
- 📜 Horizontal scrolling for long records
- 🎚️ Toggle switches for record type selection

## Prerequisites

- Node.js 16.20.0 or later
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd dns-checker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Enter a domain name in the input field (e.g., example.com)
2. Select the DNS record types you want to lookup using the toggle switches
3. Click the "Lookup" button to fetch the DNS records
4. View the results in a clean, tabular format
5. Toggle between light and dark modes using the sun/moon icon

## Features in Detail

### DNS Record Types
- **A Records**: IPv4 addresses
- **AAAA Records**: IPv6 addresses
- **MX Records**: Mail exchange servers with priority
- **TXT Records**: Text records for various purposes
- **CNAME Records**: Canonical names (aliases)
- **NS Records**: Nameserver information
- **SOA Records**: Start of Authority records

### User Interface
- Clean, modern design with TailwindCSS
- Dark mode support with system preference detection
- Responsive layout for all screen sizes
- Interactive toggle switches for record type selection
- Loading spinners for better UX
- Error handling with user-friendly messages
- Horizontal scrolling for long record values

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for production
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Node DNS](https://nodejs.org/api/dns.html) - Node.js DNS module
- [Headless UI](https://headlessui.dev/) - Unstyled UI components
- [Hero Icons](https://heroicons.com/) - Beautiful hand-crafted SVG icons

## Development

To run the development server:

```bash
npm run dev
```

To build for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Error Handling

The application includes comprehensive error handling for:
- Invalid domain names
- DNS resolution failures
- Network connectivity issues
- Individual record type failures

## Browser Support

The application supports all modern browsers and includes fallbacks for:
- Dark mode preferences
- CSS features
- JavaScript functionality

## License

MIT License - feel free to use this project for your own purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
