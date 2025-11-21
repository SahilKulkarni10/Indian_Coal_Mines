import type { CarbonCreditListing, Transaction, UserPortfolio } from '../types';

// Mock data for carbon credit listings
const mockListings: CarbonCreditListing[] = [
  {
    id: 'CC001',
    mineName: 'Jharia Coalfield',
    state: 'Jharkhand',
    credits: 5000,
    pricePerCredit: 25,
    totalValue: 125000,
    verificationStatus: 'verified',
    listingDate: '2025-10-15',
    expiryDate: '2026-10-15',
    seller: 'Coal India Limited',
    description: 'High-quality carbon credits from renewable energy projects',
    type: 'sell'
  },
  {
    id: 'CC002',
    mineName: 'Singrauli Coalfield',
    state: 'Madhya Pradesh',
    credits: 3200,
    pricePerCredit: 28,
    totalValue: 89600,
    verificationStatus: 'verified',
    listingDate: '2025-10-20',
    expiryDate: '2026-10-20',
    seller: 'Reliance Power',
    description: 'Credits from afforestation and carbon sequestration',
    type: 'sell'
  },
  {
    id: 'CC003',
    mineName: 'Korba Coalfield',
    state: 'Chhattisgarh',
    credits: 8000,
    pricePerCredit: 22,
    totalValue: 176000,
    verificationStatus: 'verified',
    listingDate: '2025-10-25',
    expiryDate: '2026-10-25',
    seller: 'NTPC Limited',
    description: 'Carbon offset from solar energy installations',
    type: 'sell'
  },
  {
    id: 'CC004',
    mineName: 'Talcher Coalfield',
    state: 'Odisha',
    credits: 4500,
    pricePerCredit: 30,
    totalValue: 135000,
    verificationStatus: 'pending',
    listingDate: '2025-11-01',
    expiryDate: '2026-11-01',
    seller: 'Mahanadi Coalfields',
    description: 'Credits from methane capture and utilization',
    type: 'sell'
  },
  {
    id: 'CC005',
    mineName: 'Raniganj Coalfield',
    state: 'West Bengal',
    credits: 6200,
    pricePerCredit: 26,
    totalValue: 161200,
    verificationStatus: 'verified',
    listingDate: '2025-10-18',
    expiryDate: '2026-10-18',
    seller: 'Eastern Coalfields',
    description: 'Credits from wind energy and efficiency improvements',
    type: 'sell'
  },
  {
    id: 'CC006',
    mineName: 'Godavari Valley',
    state: 'Telangana',
    credits: 2800,
    pricePerCredit: 32,
    totalValue: 89600,
    verificationStatus: 'verified',
    listingDate: '2025-11-05',
    expiryDate: '2026-11-05',
    seller: 'Singareni Collieries',
    description: 'Premium credits from comprehensive emission reduction',
    type: 'sell'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'TX001',
    creditId: 'CC001',
    buyer: 'Tata Steel',
    seller: 'Coal India Limited',
    credits: 1000,
    pricePerCredit: 25,
    totalAmount: 25000,
    timestamp: '2025-10-30T10:30:00Z',
    status: 'completed'
  },
  {
    id: 'TX002',
    creditId: 'CC002',
    buyer: 'JSW Energy',
    seller: 'Reliance Power',
    credits: 500,
    pricePerCredit: 28,
    totalAmount: 14000,
    timestamp: '2025-11-01T14:20:00Z',
    status: 'completed'
  },
  {
    id: 'TX003',
    creditId: 'CC003',
    buyer: 'Adani Power',
    seller: 'NTPC Limited',
    credits: 2000,
    pricePerCredit: 22,
    totalAmount: 44000,
    timestamp: '2025-11-02T09:15:00Z',
    status: 'pending'
  }
];

export const getCarbonCreditListings = async (): Promise<CarbonCreditListing[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockListings;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockTransactions;
};

export const getUserPortfolio = async (): Promise<UserPortfolio> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const completedTransactions = mockTransactions.filter(t => t.status === 'completed');
  const totalCreditsOwned = completedTransactions
    .filter(t => t.buyer === 'Current User')
    .reduce((sum, t) => sum + t.credits, 0);
  
  const totalCreditsSold = completedTransactions
    .filter(t => t.seller === 'Current User')
    .reduce((sum, t) => sum + t.credits, 0);
  
  const totalValueUSD = completedTransactions
    .filter(t => t.buyer === 'Current User')
    .reduce((sum, t) => sum + t.totalAmount, 0);
  
  return {
    totalCreditsOwned,
    totalCreditsSold,
    totalValueUSD,
    activeListings: mockListings.filter(l => l.seller === 'Current User').length,
    transactions: mockTransactions
  };
};

export const createCarbonCreditListing = async (listing: Omit<CarbonCreditListing, 'id'>): Promise<CarbonCreditListing> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newListing: CarbonCreditListing = {
    ...listing,
    id: `CC${String(mockListings.length + 1).padStart(3, '0')}`
  };
  
  mockListings.push(newListing);
  return newListing;
};

export const purchaseCarbonCredits = async (creditId: string, credits: number, buyer: string): Promise<Transaction> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const listing = mockListings.find(l => l.id === creditId);
  if (!listing) {
    throw new Error('Credit listing not found');
  }
  
  const newTransaction: Transaction = {
    id: `TX${String(mockTransactions.length + 1).padStart(3, '0')}`,
    creditId,
    buyer,
    seller: listing.seller,
    credits,
    pricePerCredit: listing.pricePerCredit,
    totalAmount: credits * listing.pricePerCredit,
    timestamp: new Date().toISOString(),
    status: 'completed'
  };
  
  mockTransactions.push(newTransaction);
  return newTransaction;
};
