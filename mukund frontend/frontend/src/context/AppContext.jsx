import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// ============================================================
// Rich Mock Data
// ============================================================
const initialVehicles = [
  { id: 'v1', regNumber: 'KA01AB1234', name: 'Tata 407', type: 'Truck', capacity: 3500, odometer: 45230, cost: 850000, status: 'Available' },
  { id: 'v2', regNumber: 'KA02CD5678', name: 'Eicher Pro 2049', type: 'Truck', capacity: 7000, odometer: 68500, cost: 1250000, status: 'On Trip' },
  { id: 'v3', regNumber: 'KA03EF9012', name: 'Ashok Leyland Dost', type: 'Mini Truck', capacity: 2000, odometer: 35000, cost: 650000, status: 'Available' },
  { id: 'v4', regNumber: 'KA04GH3456', name: 'Mahindra Bolero', type: 'SUV', capacity: 1000, odometer: 22100, cost: 950000, status: 'In Shop' },
  { id: 'v5', regNumber: 'MH01IJ7890', name: 'Volvo FH16', type: 'Heavy Truck', capacity: 20000, odometer: 125000, cost: 4500000, status: 'On Trip' },
  { id: 'v6', regNumber: 'MH02KL2345', name: 'BharatBenz 1617', type: 'Truck', capacity: 9000, odometer: 78200, cost: 2100000, status: 'Available' },
  { id: 'v7', regNumber: 'DL01MN6789', name: 'Force Traveller', type: 'Van', capacity: 1500, odometer: 41300, cost: 1100000, status: 'On Trip' },
  { id: 'v8', regNumber: 'TN01OP1234', name: 'Tata Ace', type: 'Mini Truck', capacity: 1000, odometer: 18200, cost: 450000, status: 'Available' },
  { id: 'v9', regNumber: 'GJ01QR5678', name: 'Isuzu D-Max', type: 'Pickup', capacity: 1200, odometer: 32000, cost: 1050000, status: 'Retired' },
  { id: 'v10', regNumber: 'RJ01ST9012', name: 'Tata Prima', type: 'Heavy Truck', capacity: 25000, odometer: 98000, cost: 3200000, status: 'Available' },
];

const initialDrivers = [
  { id: 'd1', name: 'Ramesh Kumar', licenseNumber: 'DL12345678', category: 'LMV', expiry: '2026-12-31', contact: '9876543210', safetyScore: 95, status: 'Available' },
  { id: 'd2', name: 'Suresh Yadav', licenseNumber: 'KA98765432', category: 'HMV', expiry: '2027-06-15', contact: '9876543211', safetyScore: 88, status: 'On Trip' },
  { id: 'd3', name: 'Amit Singh', licenseNumber: 'MH67891234', category: 'HMV', expiry: '2025-01-10', contact: '9876543212', safetyScore: 72, status: 'Available' },
  { id: 'd4', name: 'Prakash Rao', licenseNumber: 'TN13456789', category: 'LMV', expiry: '2026-08-20', contact: '9876543213', safetyScore: 91, status: 'On Trip' },
  { id: 'd5', name: 'Vikram Patel', licenseNumber: 'GJ21198765', category: 'HMV', expiry: '2028-03-25', contact: '9876543214', safetyScore: 96, status: 'Available' },
  { id: 'd6', name: 'Harish Bhat', licenseNumber: 'RJ45632178', category: 'LMV', expiry: '2023-11-05', contact: '9876543215', safetyScore: 65, status: 'Suspended' },
  { id: 'd7', name: 'Manoj Verma', licenseNumber: 'DL78954321', category: 'HMV', expiry: '2027-09-30', contact: '9876543216', safetyScore: 84, status: 'On Trip' },
  { id: 'd8', name: 'Kishore Nair', licenseNumber: 'KL32165498', category: 'LMV', expiry: '2026-04-18', contact: '9876543217', safetyScore: 79, status: 'Off Duty' },
];

const initialTrips = [
  { id: 't1', source: 'Delhi', destination: 'Mumbai', vehicleId: 'v2', driverId: 'd2', weight: 5000, distance: 1400, status: 'Dispatched', date: '2026-07-12T04:30:00.000Z' },
  { id: 't2', source: 'Bangalore', destination: 'Chennai', vehicleId: 'v5', driverId: 'd4', weight: 15000, distance: 350, status: 'Dispatched', date: '2026-07-11T08:00:00.000Z' },
  { id: 't3', source: 'Hyderabad', destination: 'Pune', vehicleId: 'v7', driverId: 'd7', weight: 1200, distance: 560, status: 'Dispatched', date: '2026-07-10T10:15:00.000Z' },
  { id: 't4', source: 'Kolkata', destination: 'Patna', vehicleId: 'v1', driverId: 'd1', weight: 3000, distance: 590, status: 'Completed', date: '2026-07-09T06:00:00.000Z', finalOdometer: 45820, fuelConsumed: 85 },
  { id: 't5', source: 'Jaipur', destination: 'Delhi', vehicleId: 'v10', driverId: 'd5', weight: 18000, distance: 280, status: 'Completed', date: '2026-07-08T14:00:00.000Z', finalOdometer: 98280, fuelConsumed: 120 },
  { id: 't6', source: 'Ahmedabad', destination: 'Surat', vehicleId: 'v6', driverId: 'd3', weight: 8000, distance: 265, status: 'Completed', date: '2026-07-07T09:30:00.000Z', finalOdometer: 78465, fuelConsumed: 65 },
  { id: 't7', source: 'Mumbai', destination: 'Nagpur', vehicleId: 'v3', driverId: 'd1', weight: 1800, distance: 840, status: 'Completed', date: '2026-07-06T07:00:00.000Z', finalOdometer: 35840, fuelConsumed: 95 },
  { id: 't8', source: 'Chennai', destination: 'Coimbatore', vehicleId: 'v8', driverId: 'd8', weight: 800, distance: 505, status: 'Completed', date: '2026-07-05T11:00:00.000Z', finalOdometer: 18705, fuelConsumed: 55 },
  { id: 't9', source: 'Pune', destination: 'Goa', vehicleId: 'v1', driverId: 'd5', weight: 2500, distance: 460, status: 'Cancelled', date: '2026-07-04T13:00:00.000Z' },
  { id: 't10', source: 'Lucknow', destination: 'Varanasi', vehicleId: 'v6', driverId: 'd3', weight: 6500, distance: 320, status: 'Completed', date: '2026-07-03T05:30:00.000Z', finalOdometer: 78785, fuelConsumed: 50 },
  { id: 't11', source: 'Indore', destination: 'Bhopal', vehicleId: 'v3', driverId: 'd1', weight: 1500, distance: 195, status: 'Completed', date: '2026-07-02T08:00:00.000Z', finalOdometer: 36035, fuelConsumed: 30 },
  { id: 't12', source: 'Chandigarh', destination: 'Shimla', vehicleId: 'v8', driverId: 'd8', weight: 600, distance: 115, status: 'Completed', date: '2026-07-01T06:00:00.000Z', finalOdometer: 18820, fuelConsumed: 18 },
];

const initialMaintenance = [
  { id: 'm1', vehicleId: 'v4', description: 'Brake pad replacement', cost: 8500, status: 'Open', date: '2026-07-11T10:00:00.000Z' },
  { id: 'm2', vehicleId: 'v1', description: 'Oil change & filter', cost: 3200, status: 'Closed', date: '2026-07-08T09:00:00.000Z' },
  { id: 'm3', vehicleId: 'v9', description: 'Engine overhaul', cost: 45000, status: 'Closed', date: '2026-07-05T08:00:00.000Z' },
  { id: 'm4', vehicleId: 'v6', description: 'Clutch plate issue', cost: 12000, status: 'Closed', date: '2026-07-03T07:00:00.000Z' },
  { id: 'm5', vehicleId: 'v3', description: 'General inspection', cost: 2500, status: 'Closed', date: '2026-06-28T10:00:00.000Z' },
];

const initialExpenses = [
  { id: 'e1', type: 'Fuel', amount: 12750, date: '2026-07-09T06:30:00.000Z', vehicleId: 'v1', driverId: 'd1', description: 'Fuel for Trip Kolkata-Patna' },
  { id: 'e2', type: 'Fuel', amount: 18000, date: '2026-07-08T14:30:00.000Z', vehicleId: 'v10', driverId: 'd5', description: 'Fuel for Trip Jaipur-Delhi' },
  { id: 'e3', type: 'Fuel', amount: 9750, date: '2026-07-07T10:00:00.000Z', vehicleId: 'v6', driverId: 'd3', description: 'Fuel for Trip Ahmedabad-Surat' },
  { id: 'e4', type: 'Fuel', amount: 14250, date: '2026-07-06T07:30:00.000Z', vehicleId: 'v3', driverId: 'd1', description: 'Fuel for Trip Mumbai-Nagpur' },
  { id: 'e5', type: 'Fuel', amount: 8250, date: '2026-07-05T11:30:00.000Z', vehicleId: 'v8', driverId: 'd8', description: 'Fuel for Trip Chennai-Coimbatore' },
  { id: 'e6', type: 'Fuel', amount: 7500, date: '2026-07-03T06:00:00.000Z', vehicleId: 'v6', driverId: 'd3', description: 'Fuel for Trip Lucknow-Varanasi' },
  { id: 'e7', type: 'Fuel', amount: 4500, date: '2026-07-02T08:30:00.000Z', vehicleId: 'v3', driverId: 'd1', description: 'Fuel for Trip Indore-Bhopal' },
  { id: 'e8', type: 'Fuel', amount: 2700, date: '2026-07-01T06:30:00.000Z', vehicleId: 'v8', driverId: 'd8', description: 'Fuel for Trip Chandigarh-Shimla' },
  { id: 'e9', type: 'Maintenance', amount: 8500, date: '2026-07-11T10:30:00.000Z', vehicleId: 'v4', description: 'Brake pad replacement' },
  { id: 'e10', type: 'Maintenance', amount: 3200, date: '2026-07-08T09:30:00.000Z', vehicleId: 'v1', description: 'Oil change & filter' },
  { id: 'e11', type: 'Maintenance', amount: 45000, date: '2026-07-05T08:30:00.000Z', vehicleId: 'v9', description: 'Engine overhaul' },
  { id: 'e12', type: 'Maintenance', amount: 12000, date: '2026-07-03T07:30:00.000Z', vehicleId: 'v6', description: 'Clutch plate issue' },
  { id: 'e13', type: 'Maintenance', amount: 2500, date: '2026-06-28T10:30:00.000Z', vehicleId: 'v3', description: 'General inspection' },
  { id: 'e14', type: 'Toll', amount: 3400, date: '2026-07-09T08:00:00.000Z', vehicleId: 'v1', description: 'Toll charges Kolkata-Patna route' },
  { id: 'e15', type: 'Toll', amount: 2800, date: '2026-07-08T16:00:00.000Z', vehicleId: 'v10', description: 'Toll charges Jaipur-Delhi route' },
  { id: 'e16', type: 'Insurance', amount: 35000, date: '2026-07-01T00:00:00.000Z', vehicleId: 'v2', description: 'Annual insurance premium renewal' },
  { id: 'e17', type: 'Insurance', amount: 28000, date: '2026-07-01T00:00:00.000Z', vehicleId: 'v5', description: 'Annual insurance premium renewal' },
];

const initialUsers = [
  { email: 'admin@transitops.com', password: 'password', role: 'Admin', name: 'Rajesh Admin' },
  { email: 'manager@transitops.com', password: 'password', role: 'Fleet Manager', name: 'Alice Manager' },
  { email: 'driver@transitops.com', password: 'password', role: 'Driver', name: 'Bob Driver' },
  { email: 'safety@transitops.com', password: 'password', role: 'Safety Officer', name: 'Charlie Safety' },
  { email: 'finance@transitops.com', password: 'password', role: 'Financial Analyst', name: 'Dana Finance' },
];

// ============================================================
// Provider
// ============================================================
export const AppProvider = ({ children }) => {
  const loadState = (key, initial) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  };

  const [currentUser, setCurrentUser] = useState(() => loadState('currentUser', null));
  const [vehicles, setVehicles] = useState(() => loadState('vehicles', initialVehicles));
  const [drivers, setDrivers] = useState(() => loadState('drivers', initialDrivers));
  const [trips, setTrips] = useState(() => loadState('trips', initialTrips));
  const [maintenance, setMaintenance] = useState(() => loadState('maintenance', initialMaintenance));
  const [expenses, setExpenses] = useState(() => loadState('expenses', initialExpenses));

  // Persist to localStorage
  useEffect(() => localStorage.setItem('currentUser', JSON.stringify(currentUser)), [currentUser]);
  useEffect(() => localStorage.setItem('vehicles', JSON.stringify(vehicles)), [vehicles]);
  useEffect(() => localStorage.setItem('drivers', JSON.stringify(drivers)), [drivers]);
  useEffect(() => localStorage.setItem('trips', JSON.stringify(trips)), [trips]);
  useEffect(() => localStorage.setItem('maintenance', JSON.stringify(maintenance)), [maintenance]);
  useEffect(() => localStorage.setItem('expenses', JSON.stringify(expenses)), [expenses]);

  // --- Auth ---
  const login = (email, password) => {
    const user = initialUsers.find(u => u.email === email && u.password === password);
    if (user) { setCurrentUser(user); return true; }
    return false;
  };
  const logout = () => setCurrentUser(null);

  // --- Vehicles ---
  const addVehicle = (vehicle) => {
    setVehicles(prev => [...prev, { ...vehicle, id: 'v' + Date.now(), status: 'Available' }]);
  };
  const updateVehicleStatus = (id, status) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, status } : v));
  };

  // --- Drivers ---
  const addDriver = (driver) => {
    setDrivers(prev => [...prev, { ...driver, id: 'd' + Date.now(), status: 'Available' }]);
  };
  const updateDriverStatus = (id, status) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  // --- Trips ---
  const createTrip = (trip) => {
    setTrips(prev => [...prev, { ...trip, id: 't' + Date.now(), status: 'Dispatched', date: new Date().toISOString() }]);
    updateVehicleStatus(trip.vehicleId, 'On Trip');
    updateDriverStatus(trip.driverId, 'On Trip');
  };

  const completeTrip = (tripId, finalOdometer, fuelConsumed) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'Completed', finalOdometer, fuelConsumed } : t));
    setVehicles(prev => prev.map(v => v.id === trip.vehicleId ? { ...v, odometer: finalOdometer, status: 'Available' } : v));
    updateDriverStatus(trip.driverId, 'Available');
    if (fuelConsumed > 0) {
      addExpense({
        type: 'Fuel',
        amount: fuelConsumed * 150, // ₹150/litre mock
        vehicleId: trip.vehicleId,
        driverId: trip.driverId,
        description: `Fuel for trip ${trip.source} → ${trip.destination}`
      });
    }
  };

  const cancelTrip = (tripId) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'Cancelled' } : t));
    updateVehicleStatus(trip.vehicleId, 'Available');
    updateDriverStatus(trip.driverId, 'Available');
  };

  // --- Maintenance ---
  const logMaintenance = (record) => {
    setMaintenance(prev => [...prev, { ...record, id: 'm' + Date.now(), status: 'Open', date: new Date().toISOString() }]);
    updateVehicleStatus(record.vehicleId, 'In Shop');
  };

  const closeMaintenance = (maintenanceId) => {
    const record = maintenance.find(m => m.id === maintenanceId);
    if (!record) return;
    setMaintenance(prev => prev.map(m => m.id === maintenanceId ? { ...m, status: 'Closed' } : m));
    updateVehicleStatus(record.vehicleId, 'Available');
    addExpense({
      type: 'Maintenance',
      amount: record.cost,
      vehicleId: record.vehicleId,
      description: record.description
    });
  };

  // --- Expenses ---
  const addExpense = (expense) => {
    setExpenses(prev => [...prev, {
      ...expense,
      id: 'e' + Date.now(),
      date: new Date().toISOString()
    }]);
  };

  // --- Reset Data (useful for demos) ---
  const resetAllData = () => {
    setVehicles(initialVehicles);
    setDrivers(initialDrivers);
    setTrips(initialTrips);
    setMaintenance(initialMaintenance);
    setExpenses(initialExpenses);
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      vehicles, addVehicle, updateVehicleStatus,
      drivers, addDriver, updateDriverStatus,
      trips, createTrip, completeTrip, cancelTrip,
      maintenance, logMaintenance, closeMaintenance,
      expenses, addExpense,
      resetAllData,
      initialUsers
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
