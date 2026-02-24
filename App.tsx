
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import OrderForm from './components/OrderForm';
import TrackingView from './components/TrackingView';
import AdminPanel from './components/AdminPanel';
import ClientDashboard from './components/ClientDashboard';
import LoadingScreen from './components/LoadingScreen';
import { Product, OrderData, ViewState, User, OrderStatus } from './types';
import { PRODUCTS } from './constants';
import { isRateLimited, sanitizeInput } from './utils/security';
import { supabase } from './utils/supabase';

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeOrder, setActiveOrder] = useState<OrderData | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchId, setSearchId] = useState('');
  const [searchError, setSearchError] = useState('');
  const [allOrders, setAllOrders] = useState<OrderData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Auth States
  const [authEmail, setAuthEmail] = useState('');
  const [authUsername, setAuthUsername] = useState(''); 
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    // Splash screen duration (1.5 seconds)
    const splashTimer = setTimeout(() => setIsAppLoading(false), 1500);

    // Initial session check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata.username || '',
          name: session.user.user_metadata.name || '',
          role: session.user.user_metadata.role || 'user',
        };
        setCurrentUser(user);
        if (user.role === 'admin') setCurrentView('ADMIN_PANEL');
      }
    };

    checkSession();
    fetchProducts();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata.username || '',
          name: session.user.user_metadata.name || '',
          role: session.user.user_metadata.role || 'user',
        };
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setCurrentView('HOME');
      }
    });

    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      try { setActiveOrder(JSON.parse(savedOrder)); } catch (e) {}
    }

    return () => {
      clearTimeout(splashTimer);
      subscription.unsubscribe();
    };
  }, []);

  // Fetch orders when needed
  useEffect(() => {
    if (currentUser?.role === 'admin' && currentView === 'ADMIN_PANEL') {
      fetchOrders();
    } else if (currentUser && currentView === 'CLIENT_DASHBOARD') {
      fetchOrders();
    }
  }, [currentUser, currentView]);

  const fetchOrders = async () => {
    let query = supabase.from('orders').select('*');
    
    if (currentUser?.role !== 'admin') {
      query = query.eq('userId', currentUser?.id);
    }

    const { data, error } = await query.order('createdAt', { ascending: false });
    
    if (!error && data) {
      setAllOrders(data as OrderData[]);
    }
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (!error && data && data.length > 0) {
      setProducts(data as Product[]);
    } else {
      // Fallback to constants if DB is empty or fails
      setProducts(PRODUCTS);
    }
  };

  const handleOrderInitiated = (product: Product, quantity: number) => {
    if (!currentUser) {
      setCurrentView('LOGIN');
      return;
    }
    setSelectedProduct(product);
    setSelectedQuantity(quantity);
    setCurrentView('ORDER_FORM');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSubmitted = async (order: OrderData) => {
    // Rate limit order creation to 5 per 10 minutes per client
    const limit = isRateLimited('order_creation', 5, 600000);
    if (limit.limited) {
      alert(`Rate limit exceeded. Please wait ${limit.retryAfter} seconds before placing another order.`);
      return;
    }

    const { error } = await supabase.from('orders').insert([order]);

    if (error) {
      alert('Failed to place order. Please try again.');
      console.error(error);
      return;
    }

    localStorage.setItem('lastOrder', JSON.stringify(order));
    setActiveOrder(order);
    setCurrentView('TRACKING');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchOrders();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // Rate limit login attempts removed for testing
    /*
    const limit = isRateLimited('login_attempts', 20, 60000);
    if (limit.limited) {
      setAuthError(`Too many login attempts. Retry in ${limit.retryAfter}s.`);
      return;
    }
    */

    const emailInput = sanitizeInput(authEmail);
    const passInput = authPass;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailInput,
      password: passInput,
    });

    if (error) {
      setAuthError(error.message);
    } else if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        username: data.user.user_metadata.username || '',
        name: data.user.user_metadata.name || '',
        role: data.user.user_metadata.role || 'user',
      };
      setCurrentUser(user);
      if (user.role === 'admin') setCurrentView('ADMIN_PANEL');
      else setCurrentView('HOME');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // Rate limit signup removed for testing
    /*
    const limit = isRateLimited('signup_attempts', 20, 60000);
    if (limit.limited) {
      setAuthError(`Rate limit reached. Retry in ${limit.retryAfter}s.`);
      return;
    }
    */

    const sanitizedEmail = sanitizeInput(authEmail);
    const sanitizedUser = sanitizeInput(authUsername, 20);
    const sanitizedName = sanitizeInput(authName, 50);

    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password: authPass,
      options: {
        data: {
          username: sanitizedUser,
          name: sanitizedName,
          role: 'user', // Default role
        }
      }
    });

    if (error) {
      setAuthError(error.message);
    } else if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        username: data.user.user_metadata.username || '',
        name: data.user.user_metadata.name || '',
        role: data.user.user_metadata.role || 'user',
      };
      setCurrentUser(user);
      setCurrentView('HOME');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentView('HOME');
  };

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    
    const inputId = sanitizeInput(searchId).toUpperCase();
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', inputId)
      .single();
    
    if (!error && data) {
      setActiveOrder(data as OrderData);
      setCurrentView('TRACKING');
    } else {
      setSearchError('Order ID not found.');
    }
  };

  const updateOrderStatus = async (id: string, newStatus: OrderStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      fetchOrders();
    }
  };

  const renderContent = () => {
    if (currentView === 'ADMIN_PANEL' && currentUser?.role === 'admin') {
      return <AdminPanel orders={allOrders} products={products} onUpdateStatus={updateOrderStatus} onLogout={handleLogout} />;
    }

    switch (currentView) {
      case 'HOME':
        return (
          <div className="animate-in fade-in duration-500">
            <section className="bg-white border-b border-slate-100 pt-16 pb-12 sm:pt-24 sm:pb-20 text-center px-4">
              <div className="max-w-4xl mx-auto">
                <div className="inline-block px-4 py-1.5 rounded-[12px] bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-6 border border-blue-100">
                  Premium Chennai Delivery
                </div>
                <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight mb-6">
                  Purity Delivered <br/>
                  <span className="text-blue-600">to Your Doorstep.</span>
                </h1>
                <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                  Fast, reliable 20L water can delivery across Chennai. Order in seconds, track in real-time. Drink healthy, live pure.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <button 
                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-[12px] hover:bg-blue-700 shadow-md transition-all active:scale-95"
                  >
                    Order Now
                  </button>
                  <button 
                    onClick={() => setCurrentView('SEARCH')}
                    className="w-full sm:w-auto px-10 py-4 bg-slate-100 text-slate-700 font-bold rounded-[12px] hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Track Status
                  </button>
                </div>
              </div>
            </section>
            
            <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              <div className="text-center mb-12 sm:mb-16">
                 <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4">Choose Your Plan</h2>
                 <p className="text-slate-500 text-sm sm:text-base">Multiple purification levels for every need.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {products.map(p => <ProductCard key={p.id} product={p} onOrder={handleOrderInitiated} />)}
              </div>
            </section>
          </div>
        );

      case 'LOGIN':
        return (
          <div className="max-w-md mx-auto py-16 sm:py-24 px-4">
            <div className="bg-white p-8 sm:p-10 rounded-[12px] border border-slate-200 shadow-md">
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Sign In</h2>
              
              {/* Helper for shared link users */}
              <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-[12px]">
                 <p className="text-[10px] text-blue-700 font-bold mb-2 uppercase tracking-[0.2em] text-center">Shared Preview Helper</p>
                 <button 
                   onClick={() => { setAuthEmail('admin'); setAuthPass('admin'); }}
                   className="w-full text-xs font-bold text-blue-600 bg-white border border-blue-200 py-2.5 rounded-[10px] hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                 >
                   Auto-fill Admin Credentials
                 </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Username / Email</label>
                  <input type="text" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="admin" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                  <input type="password" required value={authPass} onChange={e => setAuthPass(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
                </div>
                {authError && <p className="text-red-500 text-xs font-bold text-center">{authError}</p>}
                <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-[12px] font-bold shadow-sm hover:bg-blue-700 transition-all active:scale-95">Login</button>
                <p className="text-center text-slate-500 text-sm mt-6">New here? <button type="button" onClick={() => setCurrentView('SIGNUP')} className="text-blue-600 font-bold hover:underline">Create account</button></p>
              </form>
            </div>
          </div>
        );

      case 'SIGNUP':
        return (
          <div className="max-w-md mx-auto py-16 sm:py-24 px-4">
            <div className="bg-white p-8 sm:p-10 rounded-[12px] border border-slate-200 shadow-md">
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">Join AquaFlow</h2>
              <form onSubmit={handleSignup} className="space-y-4">
                <input type="text" required value={authName} onChange={e => setAuthName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[12px] outline-none" />
                <input type="text" required value={authUsername} onChange={e => setAuthUsername(e.target.value)} placeholder="Username" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[12px] outline-none" />
                <input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[12px] outline-none" />
                <input type="password" required value={authPass} onChange={e => setAuthPass(e.target.value)} placeholder="Password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[12px] outline-none" />
                {authError && <p className="text-red-500 text-xs font-bold text-center">{authError}</p>}
                <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-[12px] font-bold shadow-sm hover:bg-blue-700 transition-all">Sign Up</button>
                <p className="text-center text-slate-500 text-sm mt-6">Member? <button type="button" onClick={() => setCurrentView('LOGIN')} className="text-blue-600 font-bold hover:underline">Sign in</button></p>
              </form>
            </div>
          </div>
        );

      case 'CLIENT_DASHBOARD':
        return <ClientDashboard orders={allOrders} products={products} onTrackOrder={(order) => { setActiveOrder(order); setCurrentView('TRACKING'); }} setView={setCurrentView} />;

      case 'ORDER_FORM':
        return (selectedProduct && currentUser) ? <OrderForm product={selectedProduct} quantity={selectedQuantity} userId={currentUser.id} onSubmit={handleOrderSubmitted} onCancel={() => setCurrentView('HOME')} /> : null;

      case 'TRACKING':
        return activeOrder ? <TrackingView order={activeOrder} products={products} onClose={() => setCurrentView('CLIENT_DASHBOARD')} setView={setCurrentView} /> : null;

      case 'SEARCH':
        return (
          <div className="max-w-xl mx-auto py-16 sm:py-24 px-4">
             <div className="bg-white p-8 sm:p-10 rounded-[12px] shadow-md text-center border border-slate-200">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Track Order</h2>
                <p className="text-slate-500 text-sm mb-8">Enter your Order ID to get real-time delivery status.</p>
                <form onSubmit={handleTrackSearch} className="space-y-4">
                   <input type="text" placeholder="ORD-XXXXXX" value={searchId} onChange={e => setSearchId(e.target.value)} className="w-full px-6 py-4 bg-slate-50 rounded-[12px] outline-none border border-slate-200 font-bold text-center uppercase tracking-widest" />
                   {searchError && <p className="text-red-500 text-xs font-bold">{searchError}</p>}
                   <button className="w-full bg-blue-600 text-white py-4 rounded-[12px] font-bold shadow-sm hover:bg-blue-700 transition-all">Track Now</button>
                </form>
             </div>
          </div>
        );

      case 'BILL':
        if (!activeOrder) return null;
        const prod = PRODUCTS.find(p => p.id === activeOrder.productId);
        return (
          <div className="max-w-2xl mx-auto py-10 px-4">
             <div className="bg-white p-8 sm:p-12 rounded-[12px] shadow-md border border-slate-200" id="bill-print">
                <div className="flex justify-between items-start mb-10 pb-6 border-b border-slate-100">
                   <div>
                      <h2 className="text-2xl font-bold text-blue-600">AquaFlow</h2>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Invoice</p>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{activeOrder.id}</p>
                      <p className="text-xs text-slate-400">{new Date(activeOrder.createdAt).toLocaleDateString()}</p>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mb-10">
                   <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">To</h4>
                      <p className="font-bold text-sm text-slate-900">{activeOrder.name}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{activeOrder.address}, {activeOrder.area}</p>
                   </div>
                   <div className="text-right">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Payment</h4>
                      <p className="text-xs font-bold text-slate-900">Cash on Delivery</p>
                   </div>
                </div>

                <div className="border-t border-slate-100 py-6 mb-8">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 bg-slate-50 rounded-[12px] flex items-center justify-center font-bold text-slate-700 border border-slate-200">
                            {activeOrder.quantity}
                         </div>
                         <div>
                            <p className="font-bold text-sm text-slate-900">{prod?.name}</p>
                            <p className="text-[10px] text-slate-400">Unit: ₹{prod?.price}</p>
                         </div>
                      </div>
                      <span className="text-xl font-bold text-slate-900">₹{(prod?.price || 0) * activeOrder.quantity}</span>
                   </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                   <p className="text-xs font-bold text-slate-400 uppercase">Total Amount</p>
                   <p className="text-3xl font-bold text-blue-600">₹{(prod?.price || 0) * activeOrder.quantity}</p>
                </div>
             </div>
             
             <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button onClick={() => window.print()} className="flex-1 bg-slate-900 text-white py-4 rounded-[12px] font-bold shadow-sm hover:bg-slate-700 transition-all flex items-center justify-center space-x-2">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                   <span>Print Invoice</span>
                </button>
                <button onClick={() => setCurrentView('CLIENT_DASHBOARD')} className="flex-1 bg-white text-slate-600 py-4 rounded-[12px] font-bold border border-slate-200 transition-all">Close</button>
             </div>
          </div>
        );

      default: return null;
    }
  };

  const showHeaderFooter = !['ADMIN_PANEL'].includes(currentView);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      {isAppLoading && <LoadingScreen />}
      {showHeaderFooter && <Header setView={setCurrentView} currentUser={currentUser} onLogout={handleLogout} />}
      <main className="flex-grow">{renderContent()}</main>
      {showHeaderFooter && <Footer setView={setCurrentView} />}
    </div>
  );
};

export default App;
