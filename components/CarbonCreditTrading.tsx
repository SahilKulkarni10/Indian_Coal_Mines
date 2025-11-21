import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { CarbonCreditListing, Transaction, UserPortfolio } from '../types';
import { getCarbonCreditListings, getTransactions, getUserPortfolio, purchaseCarbonCredits, createCarbonCreditListing } from '../services/carbonCreditService';

interface CarbonCreditProps {
  onClose: () => void;
}

const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'];

const CarbonCreditTrading: React.FC<CarbonCreditProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'portfolio' | 'sell'>('marketplace');
  const [listings, setListings] = useState<CarbonCreditListing[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [selectedListing, setSelectedListing] = useState<CarbonCreditListing | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);

  // Sell form state
  const [sellForm, setSellForm] = useState({
    mineName: '',
    state: '',
    credits: '',
    pricePerCredit: '',
    description: '',
    expiryDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [listingsData, transactionsData, portfolioData] = await Promise.all([
        getCarbonCreditListings(),
        getTransactions(),
        getUserPortfolio()
      ]);
      setListings(listingsData);
      setTransactions(transactionsData);
      setPortfolio(portfolioData);
    } catch (error) {
      console.error('Failed to load carbon credit data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedListing || purchaseAmount <= 0) return;
    
    try {
      await purchaseCarbonCredits(selectedListing.id, purchaseAmount, 'Current User');
      alert(`Successfully purchased ${purchaseAmount} carbon credits!`);
      setShowModal(false);
      setSelectedListing(null);
      setPurchaseAmount(0);
      loadData();
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newListing: Omit<CarbonCreditListing, 'id'> = {
        mineName: sellForm.mineName,
        state: sellForm.state,
        credits: parseInt(sellForm.credits),
        pricePerCredit: parseFloat(sellForm.pricePerCredit),
        totalValue: parseInt(sellForm.credits) * parseFloat(sellForm.pricePerCredit),
        verificationStatus: 'pending',
        listingDate: new Date().toISOString().split('T')[0],
        expiryDate: sellForm.expiryDate,
        seller: 'Current User',
        description: sellForm.description,
        type: 'sell'
      };
      
      await createCarbonCreditListing(newListing);
      alert('Successfully created carbon credit listing!');
      setShowSellModal(false);
      setSellForm({
        mineName: '',
        state: '',
        credits: '',
        pricePerCredit: '',
        description: '',
        expiryDate: ''
      });
      loadData();
    } catch (error) {
      console.error('Failed to create listing:', error);
      alert('Failed to create listing. Please try again.');
    }
  };

  const stateDistributionData = listings.reduce((acc, listing) => {
    const existing = acc.find(item => item.state === listing.state);
    if (existing) {
      existing.credits += listing.credits;
      existing.value += listing.totalValue;
    } else {
      acc.push({ state: listing.state, credits: listing.credits, value: listing.totalValue });
    }
    return acc;
  }, [] as { state: string; credits: number; value: number }[]);

  const priceData = listings.map(l => ({
    name: l.mineName.split(' ')[0],
    price: l.pricePerCredit,
    credits: l.credits
  }));

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-blue-900">Loading Carbon Credit Marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h1 className="text-3xl font-bold">Carbon Credit Exchange</h1>
                <p className="text-blue-100 text-sm">Trade and manage carbon credits from coal mining operations</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
              { id: 'portfolio', label: 'My Portfolio', icon: '💼' },
              { id: 'sell', label: 'Sell Credits', icon: '💰' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-6 font-semibold transition-all duration-200 border-b-4 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === 'marketplace' && (
          <div className="space-y-8">
            {/* Market Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Total Listings</p>
                    <p className="text-3xl font-bold text-blue-900">{listings.length}</p>
                  </div>
                  <div className="bg-blue-600 text-white p-3 rounded-full">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Available Credits</p>
                    <p className="text-3xl font-bold text-blue-900">{listings.reduce((sum, l) => sum + l.credits, 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-600 text-white p-3 rounded-full">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Avg. Price</p>
                    <p className="text-3xl font-bold text-blue-900">${(listings.reduce((sum, l) => sum + l.pricePerCredit, 0) / listings.length).toFixed(2)}</p>
                  </div>
                  <div className="bg-blue-600 text-white p-3 rounded-full">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Market Value</p>
                    <p className="text-3xl font-bold text-blue-900">${(listings.reduce((sum, l) => sum + l.totalValue, 0) / 1000).toFixed(1)}K</p>
                  </div>
                  <div className="bg-blue-600 text-white p-3 rounded-full">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Price Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                      labelStyle={{ color: '#1F2937' }}
                    />
                    <Legend />
                    <Bar dataKey="price" fill="#3B82F6" name="Price per Credit ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Credits by State</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={stateDistributionData}
                      dataKey="credits"
                      nameKey="state"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {stateDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Listings Grid */}
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Available Carbon Credits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(listing => (
                  <div key={listing.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-200">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{listing.mineName}</h3>
                          <p className="text-blue-100 text-sm">{listing.state}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          listing.verificationStatus === 'verified' 
                            ? 'bg-green-400 text-green-900' 
                            : 'bg-yellow-400 text-yellow-900'
                        }`}>
                          {listing.verificationStatus === 'verified' ? '✓ Verified' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Available Credits</span>
                        <span className="text-blue-900 font-bold text-lg">{listing.credits.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Price per Credit</span>
                        <span className="text-blue-900 font-bold text-lg">${listing.pricePerCredit}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Total Value</span>
                        <span className="text-blue-900 font-bold text-lg">${listing.totalValue.toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-gray-600 text-sm mb-3">{listing.description}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                          <span>Listed: {listing.listingDate}</span>
                          <span>Expires: {listing.expiryDate}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedListing(listing);
                            setShowModal(true);
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                          Buy Credits
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && portfolio && (
          <div className="space-y-8">
            {/* Portfolio Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md border border-blue-200">
                <p className="text-sm font-medium text-blue-600 mb-2">Credits Owned</p>
                <p className="text-3xl font-bold text-blue-900">{portfolio.totalCreditsOwned.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md border border-blue-200">
                <p className="text-sm font-medium text-blue-600 mb-2">Credits Sold</p>
                <p className="text-3xl font-bold text-blue-900">{portfolio.totalCreditsSold.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md border border-blue-200">
                <p className="text-sm font-medium text-blue-600 mb-2">Portfolio Value</p>
                <p className="text-3xl font-bold text-blue-900">${portfolio.totalValueUSD.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md border border-blue-200">
                <p className="text-sm font-medium text-blue-600 mb-2">Active Listings</p>
                <p className="text-3xl font-bold text-blue-900">{portfolio.activeListings}</p>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
                <h2 className="text-2xl font-bold text-white">Transaction History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Transaction ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Credits</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Price/Credit</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-blue-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{tx.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(tx.timestamp).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {tx.buyer === 'Current User' ? (
                            <span className="text-green-600 font-semibold">Purchase</span>
                          ) : (
                            <span className="text-blue-600 font-semibold">Sale</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{tx.credits.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${tx.pricePerCredit}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">${tx.totalAmount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            tx.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : tx.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sell' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
                <h2 className="text-2xl font-bold text-white">Create Carbon Credit Listing</h2>
                <p className="text-blue-100 mt-2">List your carbon credits for sale on the marketplace</p>
              </div>
              <form onSubmit={handleSellSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mine Name</label>
                    <input
                      type="text"
                      required
                      value={sellForm.mineName}
                      onChange={(e) => setSellForm({ ...sellForm, mineName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter mine name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      required
                      value={sellForm.state}
                      onChange={(e) => setSellForm({ ...sellForm, state: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter state"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Credits</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={sellForm.credits}
                      onChange={(e) => setSellForm({ ...sellForm, credits: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter credits"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Credit ($)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={sellForm.pricePerCredit}
                      onChange={(e) => setSellForm({ ...sellForm, pricePerCredit: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter price"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={sellForm.expiryDate}
                    onChange={(e) => setSellForm({ ...sellForm, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Expiry Date"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    value={sellForm.description}
                    onChange={(e) => setSellForm({ ...sellForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your carbon credits..."
                  />
                </div>

                {sellForm.credits && sellForm.pricePerCredit && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-semibold">Total Listing Value:</span>
                      <span className="text-2xl font-bold text-blue-900">
                        ${(parseFloat(sellForm.credits) * parseFloat(sellForm.pricePerCredit)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-lg"
                >
                  Create Listing
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {showModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-t-xl">
              <h3 className="text-2xl font-bold text-white">Purchase Carbon Credits</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Mine Name</p>
                <p className="text-lg font-bold text-blue-900">{selectedListing.mineName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Credits</p>
                <p className="text-lg font-bold text-blue-900">{selectedListing.credits.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price per Credit</p>
                <p className="text-lg font-bold text-blue-900">${selectedListing.pricePerCredit}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Credits to Purchase</label>
                <input
                  type="number"
                  min="1"
                  max={selectedListing.credits}
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>
              {purchaseAmount > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Total Cost:</span>
                    <span className="text-2xl font-bold text-blue-900">
                      ${(purchaseAmount * selectedListing.pricePerCredit).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedListing(null);
                    setPurchaseAmount(0);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={purchaseAmount <= 0 || purchaseAmount > selectedListing.credits}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarbonCreditTrading;
