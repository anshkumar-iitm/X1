interface ParticipantBalance {
  address: string;
  balance: number;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export function calculateDebts(expenses: any[]): Settlement[] {
  const balances: Map<string, number> = new Map();

  // Calculate net balance for each participant
  for (const expense of expenses) {
    // Deduct from person who paid
    const currentBalance = balances.get(expense.paidByAddress) || 0;
    balances.set(expense.paidByAddress, currentBalance + expense.amount);

    // Calculate share for each participant
    for (const participant of expense.participants) {
      const currentShare = balances.get(participant.address) || 0;
      balances.set(participant.address, currentShare - participant.share);
    }
  }

  // Create settlement pairs
  const settlements: Settlement[] = [];
  const debtors = Array.from(balances.entries())
    .filter(([_, balance]) => balance < 0)
    .map(([address, balance]) => ({ address, amount: Math.abs(balance) }));

  const creditors = Array.from(balances.entries())
    .filter(([_, balance]) => balance > 0)
    .map(([address, balance]) => ({ address, amount: balance }));

  // Greedy matching algorithm to pair debtors with creditors
  for (const debtor of debtors) {
    for (let i = creditors.length - 1; i >= 0; i--) {
      const creditor = creditors[i];
      if (creditor.amount === 0) {
        creditors.splice(i, 1);
        continue;
      }

      const settlementAmount = Math.min(debtor.amount, creditor.amount);
      settlements.push({
        from: debtor.address,
        to: creditor.address,
        amount: settlementAmount
      });

      debtor.amount -= settlementAmount;
      creditor.amount -= settlementAmount;

      if (creditor.amount === 0) {
        creditors.splice(i, 1);
      }

      if (debtor.amount === 0) break;
    }
  }

  return settlements;
}

export function getGroupBalances(expenses: any[]): ParticipantBalance[] {
  const balances: Map<string, number> = new Map();

  for (const expense of expenses) {
    const currentBalance = balances.get(expense.paidByAddress) || 0;
    balances.set(expense.paidByAddress, currentBalance + expense.amount);

    for (const participant of expense.participants) {
      const currentShare = balances.get(participant.address) || 0;
      balances.set(participant.address, currentShare - participant.share);
    }
  }

  return Array.from(balances.entries())
    .map(([address, balance]) => ({ address, balance }))
    .filter(item => item.balance !== 0);
}
