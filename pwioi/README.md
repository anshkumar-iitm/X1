# Split the Bill - Algorand dApp

A decentralized application for splitting expenses among friends using Algorand.

## Features

- **Group Creation**: Create expense groups with friends using their Algorand addresses
- **Expense Tracking**: Log bills with descriptions and automatic split calculations
- **Debt Calculation**: Advanced algorithm automatically calculates who owes whom
- **Algorand Payments**: Settle debts directly using Algorand blockchain
- **Transaction Transparency**: All payments recorded on the blockchain

## Tech Stack

### Backend
- Node.js with Express.js
- MongoDB for data storage
- Algorand SDK for blockchain integration

### Frontend
- Vue.js 3 with Composition API
- Pinia for state management
- Vue Router for navigation
- Algorand SDK for wallet integration
- MyAlgo for wallet connection

## Project Structure

```
split-the-bill/
├── backend/
│   ├── src/
│   │   ├── models/           # MongoDB schemas
│   │   ├── controllers/      # Business logic
│   │   ├── routes/           # API endpoints
│   │   ├── config/           # Configuration
│   │   └── server.ts         # Express server
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/       # Vue components
│   │   ├── views/            # Page components
│   │   ├── stores/           # Pinia stores
│   │   ├── services/         # API & Algorand services
│   │   ├── router/           # Vue Router config
│   │   ├── App.vue
│   │   └── main.ts
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MongoDB Atlas account (or local MongoDB)
- Algorand account with testnet/mainnet ALGO

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI:
```env
MONGODB_URI=mongodb+srv://your-user:your-password@cluster.mongodb.net/split-the-bill
```

4. Install dependencies:
```bash
npm install
```

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Groups
- `GET /api/groups` - Get all groups (with optional address filter)
- `POST /api/groups` - Create a new group
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/:id/members` - Add member to group

### Expenses
- `GET /api/expenses` - Get expenses (with optional groupId filter)
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Settlements
- `GET /api/settlements` - Get settlements
- `GET /api/settlements/group/:groupId` - Get group settlements
- `GET /api/settlements/pending/:address` - Get pending settlements for address
- `PUT /api/settlements/:id` - Mark settlement as paid

## Debt Calculation Algorithm

The system uses a greedy matching algorithm to minimize the number of transactions needed:

1. Calculate net balance for each participant
2. Identify debtors (negative balance) and creditors (positive balance)
3. Match debtors with creditors to minimize transactions

Example:
- A paid $30, B paid $0, C paid $10 (split equally 3 ways)
- A: owes -$10 (owed money)
- B: owes +$10 (owes money)
- C: owes 0 (break even)
- Settlements: B pays A $10

## Wallet Integration

The app uses MyAlgo for wallet connection:
1. User clicks "Connect Wallet"
2. MyAlgo extension prompt appears
3. User authorizes connection
4. Address is stored in localStorage
5. User can now create groups and make payments

## How to Use

1. **Connect Wallet**: Click the "Connect Wallet" button in the navbar
2. **Create Group**: Enter group name, add friends by their Algorand addresses
3. **Add Expenses**: Record bills as they happen, select who paid and who participated
4. **View Settlements**: See calculated debts automatically
5. **Settle Debts**: Click "Pay Now" to send ALGO directly to settle a debt

## Development

### Adding a New Component

1. Create `.vue` file in `frontend/src/components/`
2. Import and register in parent component
3. Implement as per existing component patterns

### Adding a New API Endpoint

1. Create controller in `backend/src/controllers/`
2. Create route in `backend/src/routes/`
3. Register route in `backend/src/server.ts`
4. Add API call in `frontend/src/services/api.ts`

## Deployment

### Backend (Render, AWS, Heroku, etc.)
```bash
npm run build
npm start
```

### Frontend (Vercel, Netlify, etc.)
```bash
npm run build
# Deploy dist/ folder
```

## Security Considerations

- All payments require wallet signature
- Transaction amounts are immutable on blockchain
- Settlement records stored with transaction IDs
- Address verification for group operations

## Future Enhancements

- Multi-currency support
- Group invitations
- Expense categories and budgets
- Payment history and analytics
- Mobile app
- Additional wallet support (Pera, Defly)
- Recurring expenses
- Email notifications

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
