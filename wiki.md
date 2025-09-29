# Project Summary
LotteryLuck is a lottery application designed to enhance user experience through responsible gaming practices. It provides personalized lottery number generation based on user profiles, incorporating elements of numerology and statistical analysis. The application aims to entertain users while emphasizing the importance of playing responsibly and managing spending.

# Project Module Description
- **Dashboard**: Displays user’s lucky numbers, recent lottery results, and spending tracker.
- **Number Generator**: Offers multiple modes for generating lottery numbers, including numerological, random, and analysis-based options.
- **Lottery Analysis**: Provides historical data, frequency analysis of numbers, and insights on hot and cold numbers.
- **User Profile**: Allows users to manage personal information, significant dates, and preferred lotteries, along with setting spending limits.

# Directory Tree
```
shadcn-ui/
├── README.md                   # Project overview and setup instructions
├── components.json             # Component metadata
├── eslint.config.js            # ESLint configuration
├── index.html                  # Main HTML file
├── package.json                # Project dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── public/
│   ├── favicon.svg             # Application icon
│   └── robots.txt              # Robots.txt for SEO
├── src/
│   ├── App.css                 # Global styles
│   ├── App.tsx                 # Main application component
│   ├── components/              # UI components
│   │   ├── Dashboard.tsx       # Dashboard component
│   │   ├── LotteryAnalysis.tsx  # Lottery analysis component
│   │   ├── NumberGenerator.tsx   # Number generator component
│   │   └── UserProfile.tsx      # User profile component
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utility functions and data
│   ├── pages/                  # Application pages
│   ├── vite-env.d.ts           # Type definitions for Vite
│   ├── vite.config.ts          # Vite configuration
└── uploads/
    └── image-1.png            # Sample image for the application
```

# File Description Inventory
- **README.md**: Contains project setup and usage instructions.
- **components.json**: Metadata for components used in the application.
- **eslint.config.js**: Configuration file for ESLint to maintain code quality.
- **index.html**: Entry point for the application.
- **package.json**: Lists dependencies and scripts for the application.
- **postcss.config.js**: Configuration file for PostCSS processing.
- **src/**: Contains the source code for the application, including components, hooks, and utility functions.
- **uploads/**: Directory for images and other media used in the application.

# Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Libraries**: Pandas, NumPy, Scikit-learn for data analysis

# Usage
1. **Install Dependencies**: Run `pnpm install` to install all necessary dependencies.
2. **Build the Project**: Execute `pnpm run build` to create a production build.
3. **Run the Application**: Use `pnpm run start` to launch the application.
