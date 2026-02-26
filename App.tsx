
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
  const [allUsers, setAllUsers] = useState<User[]>([]);

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
        // Fetch profile from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const user: User = {
            id: profile.id,
            email: profile.email,
            username: profile.username || '',
            name: profile.name || '',
            role: profile.role || 'user',
          };
          setCurrentUser(user);
          if (user.role === 'admin') setCurrentView('ADMIN_PANEL');
        } else {
          // Fallback to metadata if profile not found (shouldn't happen with trigger)
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
      fetchUsers();
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
    
    if (error) {
      console.error('Error fetching orders:', error.message);
      return;
    }
    
    if (data) {
      setAllOrders(data as OrderData[]);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error.message);
      return;
    }
    
    if (data) {
      setAllUsers(data as User[]);
    }
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Error fetching products:', error.message);
      setProducts(PRODUCTS); // Fallback
      return;
    }
    
    if (data && data.length > 0) {
      setProducts(data as Product[]);
    } else {
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
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        username: profile?.username || data.user.user_metadata.username || '',
        name: profile?.name || data.user.user_metadata.name || '',
        role: profile?.role || data.user.user_metadata.role || 'user',
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

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (!error) {
      fetchUsers();
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete all their orders.')) return;
    
    // Supabase Auth deletion usually requires admin privileges via service role
    // For this demo, we'll delete the profile and orders which are linked by cascade
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    
    if (!error) {
      fetchUsers();
      fetchOrders();
    } else {
      alert('Failed to delete user profile: ' + error.message);
    }
  };

  const changeUserPassword = async (userId: string) => {
    const newPassword = window.prompt('Enter new password for this user:');
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    // Note: Changing another user's password requires Supabase Admin Auth API (Service Role)
    // In a standard client-side app, users can only change their own password.
    // We'll show a message explaining this limitation or use a mock update for the profile.
    alert('Note: Changing another user\'s password requires Admin Service Role privileges. This action is simulated for the UI demo.');
    
    const { error } = await supabase
      .from('profiles')
      .update({ updated_at: new Date().toISOString() }) // Mock update
      .eq('id', userId);

    if (error) {
      alert('Failed to update user: ' + error.message);
    }
  };

  const renderContent = () => {
    if (currentView === 'ADMIN_PANEL' && currentUser?.role === 'admin') {
      return <AdminPanel 
        orders={allOrders} 
        products={products} 
        users={allUsers}
        onUpdateStatus={updateOrderStatus} 
        onUpdateUserRole={updateUserRole}
        onDeleteUser={deleteUser}
        onChangeUserPassword={changeUserPassword}
        onLogout={handleLogout} 
      />;
    }

    switch (currentView) {
      case 'HOME':
        return (
          <div className="animate-in fade-in duration-1000">
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col justify-center overflow-hidden py-20">
              {/* Background Sea Image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=2000" 
                  alt="Deep Sea" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-12 w-full relative z-10 flex justify-center lg:justify-start pt-16 sm:pt-24">
                <div className="max-w-2xl w-full backdrop-blur-2xl bg-white/10 border border-white/20 p-8 sm:p-14 rounded-[24px] sm:rounded-[32px] shadow-2xl animate-in slide-in-from-left-8 duration-1000">
                  <div className="display text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.4em] text-white/70 mb-6 sm:mb-8 flex items-center space-x-4">
                    <span className="w-8 sm:w-12 h-[1px] bg-white/40"></span>
                    <span>Premium Hydration</span>
                  </div>
                  <h1 className="display text-4xl sm:text-8xl font-bold text-white leading-[0.9] tracking-tighter uppercase mb-8 sm:mb-12">
                    Purity <br/>
                    <span className="serif italic font-light lowercase tracking-normal text-white/50">Redefined.</span>
                  </h1>
                  <p className="serif text-lg sm:text-2xl text-white/80 mb-8 sm:mb-12 leading-relaxed italic">
                    Chennai's most sophisticated water delivery service, combining advanced purification with an editorial approach to living.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-8 sm:space-y-0 sm:space-x-12">
                    <button 
                      onClick={() => {
                        const el = document.getElementById('selections');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="display text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-white border-b-2 border-white pb-2 hover:text-blue-300 hover:border-blue-300 transition-all"
                    >
                      Explore Collection
                    </button>
                    <div className="flex flex-col">
                       <span className="display text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Purification</span>
                       <span className="display text-xs sm:text-sm font-bold uppercase text-white">04 Stages</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute bottom-8 right-8 sm:bottom-16 sm:right-16 z-10 hidden sm:block">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 sm:p-10 rounded-2xl sm:rounded-3xl">
                   <span className="display text-4xl sm:text-6xl font-bold text-white leading-none">12</span>
                   <p className="display text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mt-2 sm:mt-4 text-white/60">Years of <br/> Excellence</p>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-32 bg-white border-b border-black/5">
              <div className="max-w-7xl mx-auto px-6 sm:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
                  <div className="relative">
                    <span className="big-number">01</span>
                    <h3 className="display text-sm font-bold uppercase tracking-[0.3em] mb-6">Purity</h3>
                    <p className="serif text-xl italic text-black/60 leading-relaxed">
                      Every drop undergoes a rigorous 4-stage purification process, ensuring absolute safety and clarity.
                    </p>
                  </div>
                  <div className="relative">
                    <span className="big-number">02</span>
                    <h3 className="display text-sm font-bold uppercase tracking-[0.3em] mb-6">Reliability</h3>
                    <p className="serif text-xl italic text-black/60 leading-relaxed">
                      Our sophisticated logistics network guarantees that your hydration needs are met with precision and punctuality.
                    </p>
                  </div>
                  <div className="relative">
                    <span className="big-number">03</span>
                    <h3 className="display text-sm font-bold uppercase tracking-[0.3em] mb-6">Sustainability</h3>
                    <p className="serif text-xl italic text-black/60 leading-relaxed">
                      We are committed to reducing our environmental footprint through efficient operations and reusable solutions.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Products Section */}
            <section id="selections" className="py-32 bg-stone-50">
              <div className="max-w-7xl mx-auto px-6 sm:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                  <div>
                    <h2 className="display text-5xl font-bold tracking-tighter uppercase mb-4">The Collection</h2>
                    <p className="serif text-2xl italic text-black/40">Select your preferred hydration experience.</p>
                  </div>
                  <div className="flex space-x-8">
                     <div className="flex flex-col items-end">
                        <span className="display text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">Availability</span>
                        <span className="display text-sm font-bold uppercase">In Stock</span>
                     </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {products.map(p => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      onOrder={(prod, qty) => {
                        setSelectedProduct(prod);
                        setSelectedQuantity(qty);
                        setCurrentView('ORDER_FORM');
                      }} 
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Editorial Quote */}
            <section className="py-48 bg-white overflow-hidden">
               <div className="max-w-5xl mx-auto px-6 text-center">
                  <h2 className="serif text-4xl sm:text-6xl italic font-light text-black leading-tight">
                    "Water is the driving force of all nature. We simply ensure it reaches you in its most perfect form."
                  </h2>
                  <div className="mt-16 display text-[10px] font-bold uppercase tracking-[0.4em] text-black/30">
                    — The AquaFlow Philosophy
                  </div>
               </div>
            </section>
          </div>
        );

      case 'LOGIN':
        return (
          <div className="max-w-xl mx-auto py-24 px-6 animate-in fade-in duration-1000">
            <div className="display text-[10px] font-bold uppercase tracking-[0.4em] text-black/40 mb-8">Access Portal</div>
            <h2 className="display text-5xl font-bold text-black tracking-tighter uppercase mb-12 leading-none">
              Welcome <br/>
              <span className="serif italic font-light lowercase tracking-normal text-black/40">Back.</span>
            </h2>
            
            <form onSubmit={handleLogin} className="space-y-12">
              <div className="space-y-8">
                <div className="border-b border-black/10 pb-2">
                  <label className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] block mb-2">Username / Email</label>
                  <input type="text" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="admin" className="display w-full bg-transparent text-lg font-medium outline-none placeholder:text-black/10" />
                </div>
                <div className="border-b border-black/10 pb-2">
                  <label className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] block mb-2">Password</label>
                  <input type="password" required value={authPass} onChange={e => setAuthPass(e.target.value)} placeholder="••••••••" className="display w-full bg-transparent text-lg font-medium outline-none placeholder:text-black/10" />
                </div>
              </div>
              {authError && <p className="serif italic text-red-600 text-sm">{authError}</p>}
              <button type="submit" className="display w-full bg-black text-white py-6 font-bold uppercase tracking-[0.3em] hover:bg-black/80 transition-all">Sign In</button>
              <p className="serif italic text-black/40 text-center">New to AquaFlow? <button type="button" onClick={() => setCurrentView('SIGNUP')} className="text-black font-bold hover:underline not-italic display text-[11px] uppercase tracking-[0.1em] ml-2">Create Account</button></p>
            </form>
          </div>
        );

      case 'SIGNUP':
        return (
          <div className="max-w-xl mx-auto py-24 px-6 animate-in fade-in duration-1000">
            <div className="display text-[10px] font-bold uppercase tracking-[0.4em] text-black/40 mb-8">Registration</div>
            <h2 className="display text-5xl font-bold text-black tracking-tighter uppercase mb-12 leading-none">
              Join the <br/>
              <span className="serif italic font-light lowercase tracking-normal text-black/40">Circle.</span>
            </h2>
            <form onSubmit={handleSignup} className="space-y-12">
              <div className="space-y-8">
                <div className="border-b border-black/10 pb-2">
                  <label className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] block mb-2">Full Name</label>
                  <input type="text" required value={authName} onChange={e => setAuthName(e.target.value)} placeholder="John Doe" className="display w-full bg-transparent text-lg font-medium outline-none placeholder:text-black/10" />
                </div>
                <div className="border-b border-black/10 pb-2">
                  <label className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] block mb-2">Username</label>
                  <input type="text" required value={authUsername} onChange={e => setAuthUsername(e.target.value)} placeholder="johndoe" className="display w-full bg-transparent text-lg font-medium outline-none placeholder:text-black/10" />
                </div>
                <div className="border-b border-black/10 pb-2">
                  <label className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] block mb-2">Email Address</label>
                  <input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="john@example.com" className="display w-full bg-transparent text-lg font-medium outline-none placeholder:text-black/10" />
                </div>
                <div className="border-b border-black/10 pb-2">
                  <label className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] block mb-2">Password</label>
                  <input type="password" required value={authPass} onChange={e => setAuthPass(e.target.value)} placeholder="••••••••" className="display w-full bg-transparent text-lg font-medium outline-none placeholder:text-black/10" />
                </div>
              </div>
              {authError && <p className="serif italic text-red-600 text-sm">{authError}</p>}
              <button type="submit" className="display w-full bg-black text-white py-6 font-bold uppercase tracking-[0.3em] hover:bg-black/80 transition-all">Register</button>
              <p className="serif italic text-black/40 text-center">Already a member? <button type="button" onClick={() => setCurrentView('LOGIN')} className="text-black font-bold hover:underline not-italic display text-[11px] uppercase tracking-[0.1em] ml-2">Sign In</button></p>
            </form>
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
          <div className="max-w-xl mx-auto py-24 px-6 animate-in fade-in duration-1000">
            <div className="display text-[10px] font-bold uppercase tracking-[0.4em] text-black/40 mb-8">Order Retrieval</div>
            <h2 className="display text-5xl font-bold text-black tracking-tighter uppercase mb-12 leading-none">
              Track your <br/>
              <span className="serif italic font-light lowercase tracking-normal text-black/40">Shipment.</span>
            </h2>
            <p className="serif italic text-black/40 mb-12">Enter your unique Order ID to access real-time status and delivery details.</p>
            
            <form onSubmit={handleTrackSearch} className="space-y-12">
              <div className="border-b border-black/10 pb-2">
                <label className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] block mb-2">Order Identifier</label>
                <input 
                  type="text" 
                  placeholder="ORD-XXXXXX" 
                  value={searchId} 
                  onChange={e => setSearchId(e.target.value)} 
                  className="display w-full bg-transparent text-2xl font-bold outline-none placeholder:text-black/10 uppercase tracking-widest" 
                />
              </div>
              {searchError && <p className="serif italic text-red-600 text-sm">{searchError}</p>}
              <button type="submit" className="display w-full bg-black text-white py-6 font-bold uppercase tracking-[0.3em] hover:bg-black/80 transition-all">Retrieve Status</button>
            </form>
          </div>
        );

      case 'BILL':
        if (!activeOrder) return null;
        const prod = PRODUCTS.find(p => p.id === activeOrder.productId);
        return (
          <div className="max-w-4xl mx-auto py-24 px-6 animate-in fade-in duration-1000">
            <div className="display text-[10px] font-bold uppercase tracking-[0.4em] text-black/40 mb-8">Official Statement</div>
            <h2 className="display text-5xl font-bold text-black tracking-tighter uppercase mb-12 leading-none">
              Invoice <br/>
              <span className="serif italic font-light lowercase tracking-normal text-black/40">{activeOrder.id.split('-')[1]}</span>
            </h2>
            
            <div className="bg-white p-12 sm:p-24 border border-black/5 shadow-2xl shadow-black/5" id="bill-print">
               <div className="flex justify-between items-start mb-24">
                  <div>
                     <h3 className="display text-2xl font-bold uppercase tracking-tighter">AquaFlow</h3>
                     <p className="display text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 mt-2">Chennai, India</p>
                  </div>
                  <div className="text-right">
                     <p className="display text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">Date</p>
                     <p className="display text-sm font-bold uppercase mt-1">{new Date(activeOrder.createdAt).toLocaleDateString()}</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mb-24">
                  <div>
                     <p className="display text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 mb-4">Billed To</p>
                     <p className="display text-sm font-bold uppercase">{activeOrder.name}</p>
                     <p className="serif italic text-black/60 text-sm mt-2 leading-relaxed">
                        {activeOrder.address}<br/>
                        {activeOrder.area}, Chennai - {activeOrder.pincode}
                     </p>
                  </div>
                  <div className="text-right md:text-left">
                     <p className="display text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 mb-4">Payment Method</p>
                     <p className="display text-sm font-bold uppercase">Cash on Delivery</p>
                     <p className="serif italic text-black/60 text-sm mt-2">Payable at the time of delivery.</p>
                  </div>
               </div>

               <table className="w-full mb-24">
                  <thead>
                     <tr className="border-b border-black/10">
                        <th className="display text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 text-left pb-4">Description</th>
                        <th className="display text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 text-right pb-4">Quantity</th>
                        <th className="display text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 text-right pb-4">Amount</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr className="border-b border-black/5">
                        <td className="py-8">
                           <p className="display text-sm font-bold uppercase">{prod?.name}</p>
                           <p className="serif italic text-black/40 text-xs mt-1">Premium Purified Hydration</p>
                        </td>
                        <td className="py-8 text-right display text-sm font-bold">{activeOrder.quantity}</td>
                        <td className="py-8 text-right display text-sm font-bold">₹{(prod?.price || 0) * activeOrder.quantity}</td>
                     </tr>
                  </tbody>
                  <tfoot>
                     <tr>
                        <td colSpan={2} className="pt-12 text-right display text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">Total Amount</td>
                        <td className="pt-12 text-right display text-2xl font-bold">₹{(prod?.price || 0) * activeOrder.quantity}</td>
                     </tr>
                  </tfoot>
               </table>

               <div className="pt-24 border-t border-black/5 text-center">
                  <p className="serif italic text-black/40 text-sm">Thank you for choosing AquaFlow. Your commitment to purity is our greatest reward.</p>
               </div>
            </div>

            <div className="mt-12 flex justify-between items-center">
               <button 
                 onClick={() => setCurrentView('TRACKING')}
                 className="display text-[11px] font-bold uppercase tracking-[0.3em] text-black/40 hover:text-black transition-colors"
               >
                 ← Return to Tracking
               </button>
               <button 
                 onClick={() => window.print()}
                 className="display text-[11px] font-bold uppercase tracking-[0.3em] text-black border-b-2 border-black pb-2 hover:text-blue-600 hover:border-blue-600 transition-all"
               >
                 Print Statement
               </button>
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
      {showHeaderFooter && <Header setView={setCurrentView} currentUser={currentUser} onLogout={handleLogout} isTransparent={currentView === 'HOME'} />}
      <main className="flex-grow">{renderContent()}</main>
      {showHeaderFooter && <Footer setView={setCurrentView} />}
    </div>
  );
};

export default App;
