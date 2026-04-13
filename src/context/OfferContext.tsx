import React, { createContext, useState, useEffect, ReactNode } from 'react';

import { Offer, OfferContextType } from '../interfaces';


const defaultOffers: Offer[] = [
  { id: 1, badge: '20% OFF', title: 'Weekend Getaway' },
  { id: 2, badge: '15% OFF', title: 'Early Bird Alpine' }
];

export const OfferContext = createContext<OfferContextType | undefined>(undefined);

export const OfferProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem('lodge_offers_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultOffers;
  });

  useEffect(() => {
    localStorage.setItem('lodge_offers_data', JSON.stringify(offers));
  }, [offers]);

  const addOffer = (newOffer: Omit<Offer, 'id'>) => {
    setOffers(prev => [...prev, { ...newOffer, id: Date.now() }]);
  };

  const deleteOffer = (id: number) => {
    setOffers(prev => prev.filter(o => o.id !== id));
  };

  return (
    <OfferContext.Provider value={{ offers, addOffer, deleteOffer }}>
      {children}
    </OfferContext.Provider>
  );
};
