import { useState, useEffect, useRef, useMemo } from 'react';
import logoPng from './assets/logo.png';
import collageStripWebp from './assets/collage-strip.webp';
import polaroidCategoryBannerWebp from './assets/polaroid-category-banner.webp';
import { getApiBaseSync } from './api/config';
import { fetchProducts, fetchProductBySlug } from './api/products';
import { fetchStoreSettings } from './api/settings';
import { getImageUrl } from './utils/image';
import { getEffectivePrice } from './utils/price';
import { calculateCartItems, groupCalculatedCartItems } from './utils/cartOffers';
import type { GroupedCartItem } from './utils/cartOffers';
import type { Product, StoreSettings } from './types';
import { ProductCard } from './components/ProductCard';
import { ProductDetails } from './components/ProductDetails';
import { AuthModal } from './components/AuthModal';
import { CheckoutForm } from './components/CheckoutForm';
import { OrderConfirmation } from './components/OrderConfirmation';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { Footer } from './components/Footer';
import { AboutUsPage } from './components/AboutUsPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { ShippingPolicyPage } from './components/ShippingPolicyPage';
import { RefundPolicyPage } from './components/RefundPolicyPage';
import { CancelOrderPage } from './components/CancelOrderPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { BrandBuffer } from './components/BrandBuffer';
import { SidebarDrawer } from './components/SidebarDrawer';
import { QuickAddModal } from './components/QuickAddModal';
import { 
  fetchUserCart, syncUserCart, mergeGuestCart,
  fetchUserWishlist, addToUserWishlist, removeFromUserWishlist,
  createOrder, fetchUserOrders, updateUserProfile
} from './api/auth';
import type { UserProfile } from './api/auth';
import { 
  X, Check, ShoppingBag, Heart, Search, Home, User, Menu, ChevronLeft, ChevronRight, Sparkles, Layers
} from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info';
}

interface IntendedAction {
  type: 'WISHLIST' | 'CHECKOUT' | 'PROFILE' | 'ADD_TO_CART' | 'BUY_NOW';
  payload?: any;
}

const ITEMS_PER_PAGE = 24;

const HERO_SLIDES = [
  {
    image: '/hero-slide1.webp',
    line1: 'LEVEL UP',
    line2: 'YOUR GAMING SETUP',
    gradient: 'from-cyan-300 via-sky-200 to-indigo-300'
  },
  {
    image: '/hero-slide2.webp',
    line1: 'ELEVATE',
    line2: 'YOUR SPACE',
    gradient: 'from-amber-200 via-orange-300 to-rose-300'
  }
];

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSingleCategory, setActiveSingleCategory] = useState<string>('Supercar Single Poster');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const singlePostersSliderRef = useRef<HTMLDivElement>(null);
  const newArrivalsSliderRef = useRef<HTMLDivElement>(null);

  const scrollSinglePosters = (direction: 'left' | 'right') => {
    if (singlePostersSliderRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      singlePostersSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollNewArrivals = (direction: 'left' | 'right') => {
    if (newArrivalsSliderRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      newArrivalsSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Initial site splash buffer timer - instant 50ms transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Automated sliding effect every 5 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (diff > 30) {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    } else if (diff < -30) {
      setCurrentSlideIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
    }
    touchStartXRef.current = null;
  };
  const [activeTab, setActiveTab] = useState<'home' | 'category_page' | 'search' | 'wishlist' | 'cart' | 'profile' | 'details' | 'checkout' | 'confirmation' | 'about' | 'terms' | 'shipping' | 'refund' | 'cancel_order' | 'privacy'>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('page') === 'about' || window.location.hash === '#about') {
      return 'about';
    }
    if (params.get('page') === 'terms' || window.location.hash === '#terms') {
      return 'terms';
    }
    if (params.get('page') === 'shipping' || window.location.hash === '#shipping') {
      return 'shipping';
    }
    if (params.get('page') === 'refund' || window.location.hash === '#refund') {
      return 'refund';
    }
    if (params.get('page') === 'cancel_order' || params.get('page') === 'cancel' || window.location.hash === '#cancel_order' || window.location.hash === '#cancel') {
      return 'cancel_order';
    }
    if (params.get('page') === 'privacy' || window.location.hash === '#privacy') {
      return 'privacy';
    }
    if (params.has('product') || params.has('p') || window.location.pathname.startsWith('/product/')) {
      return 'details';
    }
    const savedTab = sessionStorage.getItem('mwm_active_tab');
    if (savedTab === 'details') {
      const savedProd = sessionStorage.getItem('mwm_selected_product');
      if (!savedProd) return 'home';
    }
    return (savedTab || 'home') as any;
  });
  const [previousTab, setPreviousTab] = useState<'home' | 'search' | 'wishlist'>(() => {
    return (sessionStorage.getItem('mwm_previous_tab') || 'home') as any;
  });

  const isInitialUrlChecked = useRef(false);
  
  // Cart & Wishlist state
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [buyNowItems, setBuyNowItems] = useState<Product[] | null>(null);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  
  // Detail state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    const saved = sessionStorage.getItem('mwm_selected_product');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  
  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Infinite Scroll States with instant local storage cache for 0ms loading across all browser sessions
  const [productsList, setProductsList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mwm_cached_products_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Categories & Slidebar Drawer state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState<string[]>(["All Products"]);

  // Category selection handler: opens dedicated category page view
  const handleCategorySelect = (category: string | null) => {
    if (!category || category === "All Products") {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
    setSelectedProduct(null);
    setProductsList([]);
    setSkip(0);
    setHasMore(true);
    setActiveTab('category_page');
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User Profile & Authentication States
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mwm_token'));
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mwm_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });
  const isLoggedIn = !!token;

  // Profile Edit fields
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  // Protected actions recovery queues
  const [intendedAction, setIntendedAction] = useState<IntendedAction | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Checkout & Order Confirmation States
  const [placedOrder, setPlacedOrder] = useState<{
    orderId: string;
    name: string;
    phone: string;
    address: string;
    paymentMethod: string;
    cart: Product[];
    grandTotal: number;
  } | null>(() => {
    const saved = sessionStorage.getItem('mwm_placed_order');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

function sanitizeForStorage(obj: any): any {
  if (!obj) return obj;
  try {
    const clone = JSON.parse(JSON.stringify(obj));
    const cleanItem = (item: any) => {
      if (!item) return;
      if (typeof item.custom_photo === 'string' && item.custom_photo.startsWith('data:')) {
        item.custom_photo = '[Custom Photo Attached]';
      }
    };

    if (Array.isArray(clone)) {
      clone.forEach(cleanItem);
    } else if (typeof clone === 'object') {
      if (Array.isArray(clone.items)) {
        clone.items.forEach(cleanItem);
      }
      cleanItem(clone);
    }
    return clone;
  } catch (e) {
    return obj;
  }
}

  // Safe storage helper that strips large Base64 strings to prevent QuotaExceededError
  const safeSetStorage = (storage: Storage, key: string, value: any) => {
    try {
      if (typeof value === 'string') {
        storage.setItem(key, value);
      } else {
        const sanitized = sanitizeForStorage(value);
        storage.setItem(key, JSON.stringify(sanitized));
      }
    } catch (e) {
      console.warn(`Storage quota exceeded or error for key ${key}:`, e);
    }
  };

  // Persist routing states to sessionStorage safely & clean URL query param when navigating away from details
  useEffect(() => {
    safeSetStorage(sessionStorage, 'mwm_active_tab', activeTab);
    if (activeTab !== 'details' && isInitialUrlChecked.current) {
      const params = new URLSearchParams(window.location.search);
      if (params.has('product') || params.has('p')) {
        try {
          window.history.replaceState({}, '', window.location.pathname);
        } catch (e) {}
      }
    }
  }, [activeTab]);

  // Always reset window scroll position to top when switching tabs or viewing product details
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [activeTab, selectedProduct]);

  useEffect(() => {
    safeSetStorage(sessionStorage, 'mwm_previous_tab', previousTab);
  }, [previousTab]);

  useEffect(() => {
    if (selectedProduct) {
      safeSetStorage(sessionStorage, 'mwm_selected_product', selectedProduct);
    } else {
      try { sessionStorage.removeItem('mwm_selected_product'); } catch (e) {}
      if (activeTab !== 'details' && isInitialUrlChecked.current) {
        const params = new URLSearchParams(window.location.search);
        if (params.has('product') || params.has('p')) {
          try {
            window.history.replaceState({}, '', window.location.pathname);
          } catch (e) {}
        }
      }
    }
  }, [selectedProduct, activeTab]);

  useEffect(() => {
    if (placedOrder) {
      safeSetStorage(sessionStorage, 'mwm_placed_order', placedOrder);
    } else {
      try { sessionStorage.removeItem('mwm_placed_order'); } catch (e) {}
    }
  }, [placedOrder]);

  // Persistent Order History State
  const [orderHistory, setOrderHistory] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('mwm_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    safeSetStorage(localStorage, 'mwm_orders', orderHistory);
  }, [orderHistory]);

  // Toast trigger
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  // Convert client cart array to server list
  const toServerCartList = (clientCart: Product[]) => {
    const counts: Record<string, number> = {};
    clientCart.forEach(item => {
      const pid = item.id || item._id;
      if (pid) {
        counts[pid] = (counts[pid] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([pid, qty]) => ({ product_id: pid, quantity: qty }));
  };

  // Convert server cart items list back to client Product array
  const toClientCartList = async (serverItems: any[]) => {
    const clientCart: Product[] = [];
    if (!Array.isArray(serverItems)) return clientCart;

    for (const item of serverItems) {
      if (!item || !item.product_id) continue;
      try {
        const apiBaseUrl = getApiBaseSync();
        const res = await fetch(`${apiBaseUrl}/products/${item.product_id}`);
        if (res.ok) {
          const product = await res.json();
          if (product && (product.id || product._id) && typeof product.price === 'number') {
            const qty = Math.max(1, parseInt(item.quantity) || 1);
            for (let i = 0; i < qty; i++) {
              clientCart.push(product);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load product for cart sync:", err);
      }
    }
    return clientCart;
  };

  // Convert server wishlist IDs to client Product array
  const toClientWishlist = async (ids: string[]) => {
    const wl: Product[] = [];
    if (!Array.isArray(ids)) return wl;

    for (const id of ids) {
      if (!id) continue;
      try {
        const apiBaseUrl = getApiBaseSync();
        const res = await fetch(`${apiBaseUrl}/products/${id}`);
        if (res.ok) {
          const product = await res.json();
          if (product && (product.id || product._id) && typeof product.price === 'number') {
            wl.push(product);
          }
        }
      } catch (err) {
        console.error("Failed to load product for wishlist sync:", err);
      }
    }
    return wl;
  };

function formatDateSafe(dateStr: any): string {
  if (!dateStr) return new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      const isoStr = String(dateStr).replace(' ', 'T');
      const d2 = new Date(isoStr);
      if (isNaN(d2.getTime())) return 'Recently';
      return d2.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return 'Recently';
  }
}

  // Load initial Cart and Wishlist based on Authentication state
  useEffect(() => {
    const syncData = async () => {
      if (token) {
        // Authenticated client
        try {
          const serverCart = await fetchUserCart(token);
          const clientCart = await toClientCartList(serverCart);
          setCart(clientCart);

          const wlIds = await fetchUserWishlist(token);
          const clientWl = await toClientWishlist(wlIds);
          setWishlist(clientWl);

          try {
            const userOrders = await fetchUserOrders(token);
            const formattedOrders = (Array.isArray(userOrders) ? userOrders : []).map((ord: any) => ({
              orderId: ord.order_id || ord.orderId || 'MWM-ORDER',
              items: Array.isArray(ord.items) ? ord.items : [],
              grandTotal: ord.grand_total || ord.grandTotal || 0,
              date: formatDateSafe(ord.created_at || ord.date),
              status: ord.status || 'Processing',
              payment_status: ord.payment_status || (ord.payment_method === 'Cash on Delivery' ? 'pending' : (ord.status === 'Processing' || ord.status === 'Paid' ? 'paid' : 'pending')),
              short_url: ord.short_url || ord.payment_url || '',
              phone: ord.phone || '',
              address: ord.address || '',
              tracking_id: ord.tracking_id || ''
            }));
            setOrderHistory(formattedOrders);
          } catch (e) {
            console.error("Order history fetch failed:", e);
          }
        } catch (err: any) {
          console.error("Failed to sync authenticated data:", err);
          // Token expired or invalid (Only logout on explicit 401 or 403 status)
          if (err && (err.status === 401 || err.status === 403)) {
            handleLogout();
            showToast("🔒 Session expired. Please log in again.", "info");
          } else {
            showToast("⚠️ Connection issue. Retrying...", "info");
          }
        }
      } else {
        // Guest client
        const guestCart = localStorage.getItem('mwm_guest_cart');
        if (guestCart) {
          try {
            setCart(JSON.parse(guestCart));
          } catch {
            setCart([]);
          }
        } else {
          setCart([]);
        }
        setWishlist([]);
      }
    };
    syncData();
  }, [token]);

  // Load store configurations on mount
  useEffect(() => {
    fetchStoreSettings()
      .then((data) => setStoreSettings(data))
      .catch((err) => console.error("Failed to load store settings:", err));
  }, []);

  // Sync Cart changes back to storage
  const syncCartChanges = async (newCart: Product[]) => {
    setCart(newCart);
    if (token) {
      try {
        const serverItems = toServerCartList(newCart);
        await syncUserCart(token, serverItems);
      } catch (err) {
        console.error("Failed to sync cart changes to server:", err);
      }
    } else {
      localStorage.setItem('mwm_guest_cart', JSON.stringify(newCart));
    }
  };

  // Handle Razorpay Redirect Callback verification
  useEffect(() => {
    const handlePaymentRedirectCallback = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      
      const paymentId = searchParams.get('razorpay_payment_id');
      const linkId = searchParams.get('razorpay_payment_link_id');
      const refId = searchParams.get('razorpay_payment_link_reference_id');
      const linkStatus = searchParams.get('razorpay_payment_link_status');
      const signature = searchParams.get('razorpay_signature');

      if (paymentId && linkId && refId && linkStatus && signature) {
        const savedToken = token || localStorage.getItem('mwm_token');
        if (!savedToken) {
          alert('Payment returned, but user session token not found.');
          return;
        }

        // Check and remove the pending order synchronously before starting the async verify link.
        // This prevents duplicate submissions during concurrent React 18 strict mode double-renders.
        const pendingOrderStr = localStorage.getItem('mwm_pending_order');
        if (!pendingOrderStr) {
          return; // Already processed by a concurrent execution
        }
        localStorage.removeItem('mwm_pending_order');
        const pending = JSON.parse(pendingOrderStr);

        try {
          const { verifyRazorpayPaymentLink } = await import('./api/payment');
          
          // 1. Verify payment signature with backend
          const verifyRes = await verifyRazorpayPaymentLink(savedToken, {
            razorpay_payment_id: paymentId,
            razorpay_payment_link_id: linkId,
            razorpay_payment_link_reference_id: refId,
            razorpay_payment_link_status: linkStatus,
            razorpay_signature: signature
          });

          if (verifyRes && verifyRes.success) {
            const verifiedPayload = {
              order_id: refId,
              name: pending.name,
              email: pending.email,
              phone: pending.phone,
              address: pending.address,
              payment_method: 'Razorpay UPI',
              items: pending.cart.map((it: any, idx: number) => {
                const photoFromSession = (it.storage_photo_key ? sessionStorage.getItem(it.storage_photo_key) : null) || sessionStorage.getItem(`mwm_custom_photo_${idx}`);
                return {
                  product_id: it.id || it._id,
                  sku: it.SKU || it.sku || '',
                  title: it.title,
                  price: getEffectivePrice(it),
                  thumbnail: it.thumbnail,
                  custom_photo: photoFromSession || it.custom_photo || undefined,
                  selected_size: it.selected_size
                };
              }),
              grand_total: pending.grandTotal,
              status: 'Processing',
              payment_status: 'paid'
            };

            // 3. Save order to MongoDB database
            await createOrder(savedToken, verifiedPayload);

            // Trigger Success Confirmation Popup Modal ONLY AFTER PAYMENT IS SUCCESSFUL
            setCompletedOrder(verifiedPayload);

            // Clear cart & reset
            await syncCartChanges([]);
            setBuyNowItems(null);
            setActiveTab('home');
            showToast("🎉 Payment verified & order placed!");
          }
        } catch (err: any) {
          alert(`Razorpay payment verification failed: ${err.message || 'Unknown error'}`);
        } finally {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      }
    };

    handlePaymentRedirectCallback();
  }, [token]);

  // Reset infinite scroll list when search query or category changes
  useEffect(() => {
    if (searchQuery || selectedCategory) {
      setProductsList([]);
    }
    setSkip(0);
    setHasMore(true);
    fetchPage(0, true);
  }, [searchQuery, selectedCategory]);

  // Update categories list dynamically from loaded product batches without making heavy 100-item API calls
  useEffect(() => {
    if (productsList.length > 0) {
      setCategoriesList((prev) => {
        const set = new Set(prev);
        productsList.forEach(p => {
          if (p.category && p.category.trim()) set.add(p.category.trim());
        });
        return Array.from(set);
      });
    }
  }, [productsList]);

  // Homepage Split Poster category cards (Strictly 8 Split Poster categories - Wall Sets and Collage kits are accessed via sidebar)
  const homepageCategoryCards = useMemo(() => {
    return [
      { name: "Super Cars Split Posters", category: "Supercar Split Posters", image: "/cat-supercars-opt.mp4", poster: "/cat-supercars-poster.webp" },
      { name: "Anime Split Posters", category: "Anime Split Posters", image: "/cat-anime-opt.mp4", poster: "/cat-anime-poster.webp" },
      { name: "Superhero Split Posters", category: "Superhero Split Posters", image: "/cat-superhero-opt.mp4", poster: "/cat-superhero-poster.webp" },
      { name: "Superbike Split Posters", category: "Superbike Split Posters", image: "/cat-superbike-opt.mp4", poster: "/cat-superbike-poster.webp" },
      { name: "Cricket Split Posters", category: "Cricket Split Posters", image: "/cat-cricket-opt.mp4", poster: "/cat-cricket-poster.webp" },
      { name: "Devotional Split Posters", category: "Devotional Split Posters", image: "/cat-devotional-opt.mp4", poster: "/cat-devotional-poster.webp" },
      { name: "Gym & Fitness Split Posters", category: "Gym & Fitness Split Posters", image: "/cat-gym-opt.mp4", poster: "/cat-gym-poster.webp" },
      { name: "Music & Bands Split Posters", category: "Music Split Posters", image: "/cat-music-opt.mp4", poster: "/cat-music-poster.webp" },
    ];
  }, []);

  // SINGLE POSTERS sub-tabs (Strictly Single Poster categories)
  const singlePosterSubTabs = useMemo(() => {
    return [
      { label: 'Car Posters', key: 'Supercar Single Poster' },
      { label: 'Anime Posters', key: 'Anime Single Poster' },
      { label: 'Cricket Posters', key: 'Cricket Single Poster' },
      { label: 'Superhero Posters', key: 'Superhero Single Poster' },
      { label: 'Superbike Posters', key: 'Superbike Single Poster' },
      { label: 'Devotional Posters', key: 'Devotional Single Poster' },
      { label: 'Gym Posters', key: 'Gym & Fitness Single Poster' },
      { label: 'Music Posters', key: 'Music Single Poster' }
    ];
  }, []);

  // Collage & Wall Sets categories displayed below New Arrivals
  const collageAndWallSetCategories = useMemo(() => [
    { 
      name: "Wall Sets", 
      category: "Wall Sets",
      subtitle: "Multi-Panel Statement Art",
      badge: "FEATURED",
      image: "/collage-strip.webp",
      glowColor: "#ff3d3d"
    },
    { 
      name: "Anime Collage", 
      category: "Anime Collage",
      subtitle: "Otaku & Manga Edition",
      badge: "HOT PICK",
      image: "/cat-anime-poster.webp",
      glowColor: "#a855f7"
    },
    { 
      name: "Supercar Collage", 
      category: "Supercar Colage",
      subtitle: "Speed, F1 & Hypercars",
      badge: "EXOTICS",
      image: "/cat-supercars-poster.webp",
      glowColor: "#f97316"
    },
    { 
      name: "Cricket Collage", 
      category: "Cricket Collage Block Kits",
      subtitle: "Stadium & Legends",
      badge: "CHAMPIONS",
      image: "/cat-cricket-poster.webp",
      glowColor: "#10b981"
    },
    { 
      name: "Football Collage", 
      category: "Football Collage",
      subtitle: "Matchday & Superstars",
      badge: "FOOTBALL",
      image: "/cat-superbike-poster.webp",
      glowColor: "#0284c7"
    },
    { 
      name: "God Collage", 
      category: "God Collage/Block kit",
      subtitle: "Spiritual & Divine Art",
      badge: "DEVOTIONAL",
      image: "/cat-devotional-poster.webp",
      glowColor: "#f59e0b"
    },
    { 
      name: "Movie Collage", 
      category: "Movie Collage",
      subtitle: "Cinema & Superhero",
      badge: "BLOCKBUSTER",
      image: "/cat-superhero-poster.webp",
      glowColor: "#e11d48"
    },
    { 
      name: "Motivation Collage", 
      category: "Motivation Collage",
      subtitle: "Gym, Hustle & Mindset",
      badge: "FITNESS",
      image: "/cat-gym-poster.webp",
      glowColor: "#3b82f6"
    },
    { 
      name: "All Collage Kits", 
      category: "Collage/Block Kits",
      subtitle: "Browse Full Collection",
      badge: "FULL RANGE",
      image: "/collage-strip.webp",
      glowColor: "#fbc638"
    }
  ], []);

  // Filter products strictly for Category Page view (ensures Wall Sets, Split Posters, Single Posters never bleed into each other)
  const categoryProducts = useMemo(() => {
    if (!selectedCategory) return productsList;
    const selLower = selectedCategory.toLowerCase().trim();
    const isSplitCategory = selLower.includes('split');
    const isSingleCategory = selLower.includes('single');

    return productsList.filter(p => {
      if (!p || !p.category) return false;
      const pCat = p.category.toLowerCase().trim();
      const pTitle = (p.title || '').toLowerCase().trim();

      // 1. Wall Sets: strictly matches products with "wall"
      if (selLower === 'wall sets' || selLower === 'wall set') {
        return pCat.includes('wall');
      }

      // 2. Collage / Block Kits: strictly matches that specific collage category
      if (selLower.includes('collage') || selLower.includes('colage')) {
        const normSel = selLower.replace('colage', 'collage').replace('/', ' ');
        const normPCat = pCat.replace('colage', 'collage').replace('/', ' ');
        if (normSel === 'collage kits' || normSel === 'collage block kits' || normSel.includes('all collage')) {
          return normPCat.includes('collage');
        }
        return normPCat === normSel || normPCat.includes(normSel) || normSel.includes(normPCat);
      }

      // 3. Wall Sets, Collage, and Polaroids NEVER match poster categories
      if (pCat.includes('wall') || pCat.includes('collage') || pCat.includes('polaroid') || pCat.includes('poloride')) {
        return false;
      }

      // 4. Strict Split vs Single isolation:
      if (isSplitCategory) {
        if (pCat.includes('single') || pTitle.includes('single')) return false;
      }
      if (isSingleCategory) {
        if (pCat.includes('split') || pTitle.includes('split')) return false;
      }

      // 5. Direct exact or normalized category match (handling singular/plural 'posters' vs 'poster')
      const normPCat = pCat.replace(/s\b/g, '');
      const normSel = selLower.replace(/s\b/g, '');
      if (pCat === selLower || normPCat === normSel) {
        return true;
      }

      // 6. Match genre and type strictly
      const checkGenreAndType = (genreWords: string[]) => {
        const matchesGenre = genreWords.some(w => pCat.includes(w) || pTitle.includes(w));
        if (!matchesGenre) return false;
        if (isSplitCategory) {
          return pCat.includes('split') || pTitle.includes('split');
        }
        if (isSingleCategory) {
          return !pCat.includes('split') && !pTitle.includes('split');
        }
        return true;
      };

      if (selLower.includes('car')) {
        return checkGenreAndType(['supercar', 'car', 'racing', 'f1']);
      }
      if (selLower.includes('anime')) {
        return checkGenreAndType(['anime', 'manga', 'gaming']);
      }
      if (selLower.includes('superbike') || selLower.includes('bike')) {
        return checkGenreAndType(['bike', 'motorcycle']);
      }
      if (selLower.includes('cricket')) {
        return checkGenreAndType(['cricket']);
      }
      if (selLower.includes('superhero')) {
        return checkGenreAndType(['superhero', 'marvel', 'dc']);
      }
      if (selLower.includes('devotional')) {
        return checkGenreAndType(['devotional', 'spiritual']);
      }
      if (selLower.includes('gym')) {
        return checkGenreAndType(['gym', 'fitness']);
      }
      if (selLower.includes('music')) {
        return checkGenreAndType(['music', 'band']);
      }

      return pCat === selLower;
    });
  }, [productsList, selectedCategory]);

  // Support direct product links & handle Browser/Mobile Back Button (popstate)
  useEffect(() => {
    const handleUrlChange = async () => {
      const params = new URLSearchParams(window.location.search);
      const productSlug = params.get('product') || params.get('p');
      const pathSlug = window.location.pathname.startsWith('/product/') 
        ? window.location.pathname.replace('/product/', '').replace(/\/$/, '')
        : null;
      
      const targetSlug = productSlug || pathSlug;
      if (targetSlug) {
        let foundProduct: Product | null = null;
        try {
          foundProduct = await fetchProductBySlug(targetSlug);
        } catch (err) {
          console.warn("Direct product link backend fetch failed, checking local products list fallback...", err);
        }

        // Fallback: check in productsList
        if (!foundProduct && productsList.length > 0) {
          foundProduct = productsList.find(p => 
            p.slug === targetSlug || 
            p.id === targetSlug || 
            p._id === targetSlug
          ) || null;
        }

        if (foundProduct && (foundProduct.id || foundProduct._id)) {
          setSelectedProduct(foundProduct);
          setActiveTab('details');
        } else if (isInitialUrlChecked.current) {
          setSelectedProduct(null);
          setActiveTab('home');
        }
      } else {
        // If URL has no product parameter (e.g. back button clicked), close details view if open
        if (isInitialUrlChecked.current) {
          setSelectedProduct(null);
          setActiveTab((prev) => (prev === 'details' ? (previousTab || 'home') : prev));
        }
      }
      isInitialUrlChecked.current = true;
    };

    // Initial check on page load
    handleUrlChange();

    // Listen for browser back/forward buttons
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [previousTab, productsList]);

  // State Refs to prevent infinite observer loops
  const skipRef = useRef(skip);
  const hasMoreRef = useRef(hasMore);
  const loadingMoreRef = useRef(loadingMore);

  useEffect(() => {
    skipRef.current = skip;
    hasMoreRef.current = hasMore;
    loadingMoreRef.current = loadingMore;
  }, [skip, hasMore, loadingMore]);

  // Fetch paginated products safely
  const fetchPage = async (currentSkip: number, isReset: boolean = false) => {
    if (loadingMoreRef.current && !isReset) return;
    setLoadingMore(true);
    try {
      const data = await fetchProducts({
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        skip: currentSkip,
        limit: ITEMS_PER_PAGE
      });

      const safeData = Array.isArray(data) ? data : [];

      if (isReset) {
        setProductsList(safeData);
        if (safeData.length > 0 && !searchQuery && !selectedCategory) {
          safeSetStorage(localStorage, 'mwm_cached_products_v2', safeData);
        }
      } else {
        setProductsList((prev) => {
          const existingIds = new Set(prev.map(p => p?.id || p?._id));
          const uniques = safeData.filter(p => p && !existingIds.has(p.id || p._id));
          return [...prev, ...uniques];
        });
      }

      setHasMore(safeData.length === ITEMS_PER_PAGE);
      setSkip(currentSkip + safeData.length);
    } catch (err) {
      console.error("Error loading paginated products:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Setup Intersection Observer for infinite scrolling (Triggered safely without loops)
  useEffect(() => {
    fetchPage(0, true);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current && !loadingMoreRef.current) {
          fetchPage(skipRef.current);
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [searchQuery, selectedCategory]);

  // Add/Remove Interactions
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    if (product.has_custom_options && product.allow_photo_upload && !product.custom_photo) {
      setSelectedProduct(product);
      setActiveTab('details');
      showToast(`📸 Please upload your photo to customize "${product.title}" before adding to cart.`, 'info');
      return;
    }
    const count = Math.max(1, quantity);
    const itemsToAdd: Product[] = Array.from({ length: count }, () => ({ ...product }));
    if (!isLoggedIn) {
      setIntendedAction({ type: 'ADD_TO_CART', payload: itemsToAdd });
      setAuthModalOpen(true);
      return;
    }
    const newCart = [...cart, ...itemsToAdd];
    syncCartChanges(newCart);
    showToast(`🛒 Added ${count > 1 ? `${count}x ` : ''}"${product.title}" to Cart!`);
  };

  // Quick Add multiple variants batch handler
  const handleQuickAddBatch = (items: { product: Product; sizeName: string; sizePrice: number; qty: number }[]) => {
    const itemsToAdd: Product[] = [];
    items.forEach(it => {
      for (let i = 0; i < it.qty; i++) {
        itemsToAdd.push({
          ...it.product,
          price: it.sizePrice,
          discount_price: null,
          selected_size: it.sizeName
        });
      }
    });

    if (itemsToAdd.length === 0) return;

    if (!isLoggedIn) {
      setIntendedAction({ type: 'ADD_TO_CART', payload: itemsToAdd });
      setAuthModalOpen(true);
      return;
    }

    const newCart = [...cart, ...itemsToAdd];
    syncCartChanges(newCart);
    showToast(`🛒 Added ${itemsToAdd.length} items to Cart!`);
  };

  // Protected Action: Wishlist Add/Remove
  const handleAddToWishlist = async (product: Product) => {
    if (!isLoggedIn) {
      setIntendedAction({ type: 'WISHLIST', payload: product });
      setAuthModalOpen(true);
      return;
    }
    const pid = product.id || product._id;
    if (!pid) return;
    const isAlreadyWishlisted = wishlist.some((p) => (p.id || p._id) === pid);
    try {
      if (isAlreadyWishlisted) {
        const wlIds = await removeFromUserWishlist(token!, pid);
        const clientWl = await toClientWishlist(wlIds);
        setWishlist(clientWl);
        showToast(`💔 Removed "${product.title}" from Wishlist.`, 'info');
      } else {
        const wlIds = await addToUserWishlist(token!, pid);
        const clientWl = await toClientWishlist(wlIds);
        setWishlist(clientWl);
        showToast(`💖 Added "${product.title}" to Wishlist!`);
      }
    } catch (err) {
      console.error("Wishlist operation failed:", err);
    }
  };

  // Direct buy triggers single-item checkout without modifying shopping cart
  const handleBuyNow = (product: Product, quantity: number = 1) => {
    if (product.has_custom_options && product.allow_photo_upload && !product.custom_photo) {
      setSelectedProduct(product);
      setActiveTab('details');
      showToast(`📸 Please upload your photo to customize "${product.title}" before buying.`, 'info');
      return;
    }
    const count = Math.max(1, quantity);
    const items: Product[] = Array.from({ length: count }, () => ({ ...product }));
    setBuyNowItems(items);
    setSelectedProduct(null);
    fetchStoreSettings()
      .then((data) => setStoreSettings(data))
      .catch((err) => console.error("Failed to refresh settings:", err));

    if (!isLoggedIn) {
      setIntendedAction({ type: 'BUY_NOW', payload: product });
      setAuthModalOpen(true);
    } else {
      setActiveTab('checkout');
    }
  };

  // Protected Action: Cart Checkout
  const handleCheckout = () => {
    const missingPhotoItem = cart.find(it => Boolean(it.has_custom_options && it.allow_photo_upload && !it.custom_photo));
    if (missingPhotoItem) {
      setSelectedProduct(missingPhotoItem);
      setActiveTab('details');
      showToast(`📸 Please upload your photo for "${missingPhotoItem.title}" before proceeding to checkout.`, 'info');
      return;
    }
    setBuyNowItems(null);
    if (!isLoggedIn) {
      setIntendedAction({ type: 'CHECKOUT' });
      setAuthModalOpen(true);
      return;
    }
    fetchStoreSettings()
      .then((data) => setStoreSettings(data))
      .catch((err) => console.error("Failed to refresh settings:", err));
    setActiveTab('checkout');
  };

  const handleRemoveFromCheckout = (idx: number) => {
    if (buyNowItems) {
      setBuyNowItems(null);
      setActiveTab('home');
    } else {
      const newCart = cart.filter((_, i) => i !== idx);
      syncCartChanges(newCart);
      if (newCart.length === 0) {
        setActiveTab('home');
      }
    }
  };

  const handleIncreaseGroupQuantity = (group: GroupedCartItem) => {
    const templateItem = group.sample_item;
    const itemToAdd: Product = { ...templateItem };
    delete (itemToAdd as any).cart_index;
    delete (itemToAdd as any).original_unit_price;
    delete (itemToAdd as any).final_price;
    delete (itemToAdd as any).is_free;
    delete (itemToAdd as any).offer_applied;

    const newCart = [...cart, itemToAdd];
    syncCartChanges(newCart);
  };

  const handleDecreaseGroupQuantity = (group: GroupedCartItem) => {
    if (group.cart_indices.length === 0) return;
    const removeIdx = group.cart_indices[group.cart_indices.length - 1];
    const newCart = cart.filter((_, i) => i !== removeIdx);
    syncCartChanges(newCart);
  };

  const handleRemoveGroup = (group: GroupedCartItem) => {
    const removeSet = new Set(group.cart_indices);
    const newCart = cart.filter((_, i) => !removeSet.has(i));
    syncCartChanges(newCart);
  };

  // Auth Handler Success Integration
  const handleAuthSuccess = async (authToken: string, profile: UserProfile) => {
    setToken(authToken);
    setUserProfile(profile);
    localStorage.setItem('mwm_token', authToken);
    localStorage.setItem('mwm_user', JSON.stringify(profile));
    setAuthModalOpen(false);
    const greetingName = profile.name?.trim() || 'Guest';
    showToast(`👋 Welcome back, ${greetingName}!`);

    // Retrieve guest cart items
    const guestCartStr = localStorage.getItem('mwm_guest_cart');
    let guestCartList: Product[] = [];
    if (guestCartStr) {
      try {
        guestCartList = JSON.parse(guestCartStr);
      } catch {}
    }

    let clientCart: Product[] = [];
    try {
      // Merge guest cart with database cart
      const guestItems = toServerCartList(guestCartList);
      const mergedServerCart = await mergeGuestCart(authToken, guestItems);
      clientCart = await toClientCartList(mergedServerCart);
      setCart(clientCart);
      
      // Clear local guest cart cache
      localStorage.removeItem('mwm_guest_cart');
    } catch (err) {
      console.error("Cart merging failed:", err);
    }

    // Sync wishlist
    try {
      const wlIds = await fetchUserWishlist(authToken);
      const clientWl = await toClientWishlist(wlIds);
      setWishlist(clientWl);
    } catch (err) {
      console.error("Wishlist sync failed post-login:", err);
    }

    // Recover intended queue actions
    if (intendedAction) {
      const action = intendedAction;
      setIntendedAction(null); // Clear
      
      if (action.type === 'WISHLIST') {
        const product = action.payload;
        const pid = product.id || product._id;
        if (pid) {
          try {
            const wlIds = await addToUserWishlist(authToken, pid);
            const clientWl = await toClientWishlist(wlIds);
            setWishlist(clientWl);
            showToast(`💖 Added "${product.title}" to Wishlist!`);
          } catch (e) {
            console.error("Post-auth wishlist failed:", e);
          }
        }
      } else if (action.type === 'ADD_TO_CART') {
        const addedItems: Product[] = Array.isArray(action.payload) ? action.payload : [action.payload];
        clientCart = [...clientCart, ...addedItems];
        const serverItems = toServerCartList(clientCart);
        await syncUserCart(authToken, serverItems);
        showToast(`🛒 Added ${addedItems.length} items to Cart!`);
      } else if (action.type === 'BUY_NOW') {
        const product = action.payload;
        setBuyNowItems([product]);
        setSelectedProduct(null);
        fetchStoreSettings()
          .then((data) => setStoreSettings(data))
          .catch((err) => console.error("Failed to load settings:", err));
        setActiveTab('checkout');
      } else if (action.type === 'CHECKOUT') {
        setBuyNowItems(null);
        fetchStoreSettings()
          .then((data) => setStoreSettings(data))
          .catch((err) => console.error("Failed to load settings:", err));
        setActiveTab('checkout');
      } else if (action.type === 'PROFILE') {
        setActiveTab('profile');
      }
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUserProfile(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('mwm_token');
    localStorage.removeItem('mwm_user');
    localStorage.removeItem('mwm_guest_cart');
    showToast("👋 Signed out successfully.", "info");
    setActiveTab('home');
  };

  // Helper to identify custom polaroid photo products
  const isPolaroidProduct = (p: Product) => {
    const cat = (p.category || '').toLowerCase();
    const title = (p.title || '').toLowerCase();
    const slug = (p.slug || '').toLowerCase();
    return cat.includes('poloride') || cat.includes('polaroid') ||
           title.includes('poloride') || title.includes('polaroid') ||
           slug.includes('poloride') || slug.includes('polaroid');
  };

  // Helper to match products accurately to single poster category tabs
  const isCategoryMatch = (p: Product, activeKey: string): boolean => {
    if (!p || !p.category) return false;
    const pCat = p.category.toLowerCase().trim();
    const pTitle = (p.title || '').toLowerCase().trim();
    const targetKey = activeKey.toLowerCase().trim();

    // 1. Wall Sets, Collage kits, Polaroids, and SPLIT POSTERS must NEVER show in Single Posters
    if (pCat.includes('wall') || pCat.includes('collage') || pCat.includes('polaroid') || pCat.includes('poloride')) {
      return false;
    }
    if (pCat.includes('split') || pTitle.includes('split')) {
      return false;
    }

    // 2. Direct or normalized match (e.g. 'supercar single poster' vs 'supercar single posters')
    const normPCat = pCat.replace(/s\b/g, '');
    const normTarget = targetKey.replace(/s\b/g, '');
    if (pCat === targetKey || normPCat === normTarget) {
      return true;
    }

    // 3. Specific sub-tab keyword matching for single posters
    if (targetKey.includes('car')) {
      return (pCat.includes('supercar') || pCat.includes('car') || pCat.includes('racing') || pCat.includes('f1')) && !pCat.includes('split');
    }
    if (targetKey.includes('anime')) {
      return (pCat.includes('anime') || pCat.includes('gaming') || pCat.includes('manga')) && !pCat.includes('split');
    }
    if (targetKey.includes('superbike') || targetKey.includes('bike')) {
      return (pCat.includes('bike') || pCat.includes('motorcycle')) && !pCat.includes('split');
    }
    if (targetKey.includes('cricket')) {
      return pCat.includes('cricket') && !pCat.includes('split');
    }
    if (targetKey.includes('superhero')) {
      return (pCat.includes('superhero') || pCat.includes('marvel') || pCat.includes('dc')) && !pCat.includes('split');
    }
    if (targetKey.includes('devotional')) {
      return (pCat.includes('devotional') || pCat.includes('spiritual')) && !pCat.includes('split');
    }
    if (targetKey.includes('gym')) {
      return (pCat.includes('gym') || pCat.includes('fitness')) && !pCat.includes('split');
    }
    if (targetKey.includes('music')) {
      return (pCat.includes('music') || pCat.includes('band')) && !pCat.includes('split');
    }

    return false;
  };

  const handleOpenPolaroid = () => {
    const polaroidProd = productsList.find(isPolaroidProduct);
    if (polaroidProd) {
      openProductDetails(polaroidProd);
    } else {
      handleCategorySelect('Custom Poloride Photo');
    }
  };

  const handleOpenAbout = () => {
    setActiveTab('about');
    setSelectedProduct(null);
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTerms = () => {
    setActiveTab('terms');
    setSelectedProduct(null);
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenShipping = () => {
    setActiveTab('shipping');
    setSelectedProduct(null);
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRefund = () => {
    setActiveTab('refund');
    setSelectedProduct(null);
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCancelOrder = () => {
    setActiveTab('cancel_order');
    setSelectedProduct(null);
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPrivacy = () => {
    setActiveTab('privacy');
    setSelectedProduct(null);
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSplitNewArrivals = () => {
    const isAlreadyHome = activeTab === 'home';
    if (!isAlreadyHome) {
      setActiveTab('home');
      setSelectedCategory(null);
      setSelectedProduct(null);
    }
    setTimeout(() => {
      const el = document.getElementById('new-arrivals');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (newArrivalsSliderRef.current) {
        newArrivalsSliderRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, isAlreadyHome ? 50 : 250);
  };

  const handleOpenSinglePosters = () => {
    const isAlreadyHome = activeTab === 'home';
    if (!isAlreadyHome) {
      setActiveTab('home');
      setSelectedCategory(null);
      setSelectedProduct(null);
    }
    setTimeout(() => {
      const el = document.getElementById('single-posters');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (singlePostersSliderRef.current) {
        singlePostersSliderRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, isAlreadyHome ? 50 : 250);
  };

  // Open details view in-line instead of a overlapping popup
  const openProductDetails = (product: Product) => {
    if (activeTab !== 'details') {
      setPreviousTab(activeTab as any);
    }
    setSelectedProduct(product);
    setActiveTab('details');
    if (product.slug) {
      try {
        window.history.pushState({}, '', `/?product=${product.slug}`);
      } catch (e) {}
    }
  };



  const isTabActive = (tab: 'home' | 'search' | 'wishlist' | 'cart' | 'profile') => {
    return activeTab === tab || 
           (activeTab === 'details' && previousTab === tab) ||
           (tab === 'cart' && (activeTab === 'checkout' || activeTab === 'confirmation'));
  };

  // Handle Profile click protection
  const handleProfileClick = () => {
    if (!isLoggedIn) {
      setIntendedAction({ type: 'PROFILE' });
      setAuthModalOpen(true);
    } else {
      setEditName(userProfile?.name || '');
      setEditEmail(userProfile?.email || '');
      setActiveTab('profile');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-950 pb-28 flex flex-col font-sans">
      {/* Brand Initial Splash Buffer */}
      {isInitialLoading && <BrandBuffer fullScreen message="Buffering PrintOkiyo Store..." />}

      {/* 1. Modern Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md py-3.5 px-4 sm:px-6 lg:px-8 border-b border-gray-100 transition-all select-none">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative">
          {/* Left categories menu & desktop navigation links */}
          <div className="flex items-center gap-2">
            {activeTab !== 'checkout' ? (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 transition-colors cursor-pointer"
                aria-label="Categories menu"
              >
                <Menu size={22} />
              </button>
            ) : (
              <div className="w-9 h-9" />
            )}

            <nav className="hidden md:flex items-center gap-4 text-xs font-bold text-gray-700 ml-1">
              <button 
                type="button"
                onClick={() => { setActiveTab('home'); setSelectedCategory(null); setSelectedProduct(null); }}
                className={`hover:text-black transition-colors cursor-pointer bg-transparent border-0 p-0 ${activeTab === 'home' ? 'text-black font-black' : ''}`}
              >
                Shop
              </button>
              <button 
                type="button"
                onClick={() => { setActiveTab('about'); setSelectedCategory(null); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`hover:text-black transition-colors cursor-pointer bg-transparent border-0 p-0 ${activeTab === 'about' ? 'text-black font-black' : ''}`}
              >
                About Us
              </button>
            </nav>
          </div>

          {/* Brand Logo centered - Reset category & go to All Products */}
          <div 
            onClick={() => {
              setActiveTab('home');
              setSelectedCategory(null);
              setSelectedProduct(null);
              setSearchQuery('');
            }}
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 cursor-pointer"
          >
            <img src={logoPng} alt="PrintOkiyo" className="h-11.5 sm:h-14 w-auto object-contain" />
          </div>

          {/* Right Header Actions - Cart & Profile shown on ALL devices (Mobile + Desktop); Search & Wishlist shown on Desktop only */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={() => { 
                setActiveTab('search'); 
                setSelectedProduct(null); 
              }}
              className="hidden md:flex p-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 transition-all cursor-pointer"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <button 
              onClick={() => { 
                setActiveTab('wishlist'); 
                setSelectedProduct(null); 
              }}
              className="hidden md:flex relative p-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 transition-all cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart size={20} className={wishlist.length > 0 ? "text-red-500 fill-red-500" : ""} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => { 
                setActiveTab('cart'); 
                setSelectedProduct(null); 
              }}
              className="relative p-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 transition-all cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-black text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
                  {cart.length}
                </span>
              )}
            </button>

            {activeTab !== 'profile' && (
              <button 
                onClick={handleProfileClick}
                className="p-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 transition-all cursor-pointer"
                aria-label="Profile"
              >
                <User size={20} />
              </button>
            )}
          </div>
        </div>
      </header>



      {/* 3. Slidebar Categories Drawer - hidden on checkout */}
      <SidebarDrawer
        isOpen={sidebarOpen && activeTab !== 'checkout'}
        onClose={() => setSidebarOpen(false)}
        onSelectCategory={handleCategorySelect}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'profile' && !isLoggedIn) {
            setAuthModalOpen(true);
          }
        }}
        isLoggedIn={isLoggedIn}
        userProfile={userProfile}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        categoriesList={categoriesList}
        onSelectPolaroid={handleOpenPolaroid}
        onAboutClick={handleOpenAbout}
        onTermsClick={handleOpenTerms}
        onShippingClick={handleOpenShipping}
        onRefundClick={handleOpenRefund}
        onCancelOrderClick={handleOpenCancelOrder}
        onPrivacyClick={handleOpenPrivacy}
        onOpenSplitNewArrivals={handleOpenSplitNewArrivals}
        onOpenSinglePosters={handleOpenSinglePosters}
      />

      {/* 4. Content main container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Active Product Details Inline View */}
        {activeTab === 'details' && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            allProducts={productsList}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onBuyNow={handleBuyNow}
            onViewDetails={openProductDetails}
            onQuickAdd={setQuickAddProduct}
            isWishlisted={wishlist.some((p) => (p.id || p._id) === (selectedProduct.id || selectedProduct._id))}
          />
        )}

        {/* Homepage View */}
        {activeTab === 'home' && (
          <div>
            {/* Full Screen Edge-to-Edge Sliding Hero Banner (No curved borders, no side gaps, FrameKro style) */}
            <div 
              className="relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-2 rounded-none text-white select-none group touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              
              {/* Sliding Track for Full WebP Images (Aspect ratio 716/1024 - 100% Full Uncropped Image) */}
              <div className="relative w-full aspect-[716/1024] max-h-[85vh] overflow-hidden">
                <div 
                  className="flex w-full h-full transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
                >
                  {HERO_SLIDES.map((slide, idx) => (
                    <div key={idx} className="w-full shrink-0 h-full relative overflow-hidden flex items-center justify-center">
                      <img 
                        src={slide.image} 
                        alt={slide.line1} 
                        loading="eager"
                        className="w-full h-full object-cover object-center" 
                      />
                      
                      {/* Gradient Overlay & Bottom-Left Creative Stacked Typography */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end justify-start p-6 sm:p-10 md:p-14">
                        <div 
                          className={`flex flex-col items-start gap-1 sm:gap-2 transition-all duration-700 delay-100 transform ${
                            currentSlideIndex === idx 
                              ? 'opacity-100 translate-y-0 scale-100' 
                              : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
                          }`}
                        >
                          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black leading-none tracking-tight text-white uppercase drop-shadow-lg text-left">
                            {slide.line1}
                          </h1>
                          
                          <h2 className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black leading-tight tracking-tight uppercase bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent drop-shadow-2xl text-left`}>
                            {slide.line2}
                          </h2>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Infinite Smooth Circular Collage Banner Strip - WebP Format (Aligned with Site Body & Hero Banner Width) */}
            <div className="overflow-hidden relative -mx-4 sm:-mx-6 lg:-mx-8 my-3 md:my-5 bg-white py-0 flex items-center border-none outline-none select-none pointer-events-none">
              <div className="collage-marquee-track border-none outline-none">
                <img 
                  src={collageStripWebp} 
                  alt="PrintOkiyo Collage Strip" 
                  loading="eager"
                  decoding="async"
                  className="h-24 sm:h-32 md:h-36 lg:h-40 w-auto flex-none shrink-0 max-w-none border-none outline-none" 
                />
                <img 
                  src={collageStripWebp} 
                  alt="" 
                  loading="eager"
                  decoding="async"
                  aria-hidden="true" 
                  className="h-24 sm:h-32 md:h-36 lg:h-40 w-auto flex-none shrink-0 max-w-none border-none outline-none" 
                />
                <img 
                  src={collageStripWebp} 
                  alt="" 
                  loading="eager"
                  decoding="async"
                  aria-hidden="true" 
                  className="h-24 sm:h-32 md:h-36 lg:h-40 w-auto flex-none shrink-0 max-w-none border-none outline-none" 
                />
                <img 
                  src={collageStripWebp} 
                  alt="" 
                  loading="eager"
                  decoding="async"
                  aria-hidden="true" 
                  className="h-24 sm:h-32 md:h-36 lg:h-40 w-auto flex-none shrink-0 max-w-none border-none outline-none" 
                />
              </div>
            </div>

            {/* Category Cards Section (2 by 2 Grid on Mobile, Responsive 4-Cols on Desktop - Sharp 90 Deg Edges, Motion/Video Enabled) */}
            <div className="mb-8 select-none text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-gray-950 text-center mb-4 tracking-tight uppercase">
                Split Poster Categories
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
                {homepageCategoryCards.map((cat) => (
                  <div
                    key={cat.name}
                    onClick={() => handleCategorySelect(cat.category)}
                    className="group relative overflow-hidden rounded-none border-none bg-zinc-900 cursor-pointer shadow-none transition-all duration-300 aspect-[16/9] flex items-center justify-center"
                  >
                    {/* Instant 0ms Poster Image (No Black Screen Ever) */}
                    <img 
                      src={cat.poster} 
                      alt={cat.name} 
                      loading="eager"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                    />

                    {/* Smooth Crossfade Compressed Video Loop */}
                    {cat.image ? (
                      <video 
                        src={cat.image} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        preload="metadata"
                        onCanPlay={(e) => {
                          e.currentTarget.classList.remove('opacity-0');
                          e.currentTarget.classList.add('opacity-100');
                        }}
                        ref={(el) => {
                          if (el) {
                            el.muted = true;
                            el.play().catch(() => {});
                          }
                        }}
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 opacity-0" 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-end justify-center p-3">
                        <span className="text-white font-display font-black text-xs sm:text-sm uppercase tracking-wider text-center drop-shadow-lg">
                          {cat.name}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Polaroid Category Banner Button (No heading, sharp 90-degree edges, borderless) */}
            <div className="mb-10 select-none">
              <button
                type="button"
                onClick={handleOpenPolaroid}
                className="w-full block overflow-hidden rounded-none border-none shadow-none hover:opacity-95 transition-opacity cursor-pointer focus:outline-none"
                aria-label="Custom Polaroid Photos"
              >
                <img 
                  src={polaroidCategoryBannerWebp} 
                  alt="Custom Polaroid Photos" 
                  loading="eager"
                  decoding="async"
                  className="w-full h-auto object-cover block rounded-none border-none" 
                />
              </button>
            </div>

            {/* SINGLE POSTERS Section matching reference image media_1790514554594.png */}
            <div id="single-posters" className="mb-12 text-left select-none scroll-mt-24">
              {/* Header: Title in #0e0d0d + Scroll Arrows + EXPLORE link */}
              <div className="flex items-center justify-between mb-3 border-b border-gray-150 pb-2">
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#0e0d0d] tracking-tight uppercase">
                  SINGLE POSTERS
                </h2>

                <div className="flex items-center gap-3">
                  {/* Left to Right / Right to Left Sliding Chevron Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => scrollSinglePosters('left')}
                      className="p-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => scrollSinglePosters('right')}
                      className="p-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                      aria-label="Scroll right"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('search');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[#0e0d0d] font-bold text-xs sm:text-sm underline hover:text-black cursor-pointer uppercase tracking-wider"
                  >
                    EXPLORE
                  </button>
                </div>
              </div>

              {/* Category Sub-Tabs in RED */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar text-xs sm:text-sm whitespace-nowrap">
                {singlePosterSubTabs.map((cat, idx) => {
                  const isActive = activeSingleCategory === cat.key;
                  return (
                    <span key={cat.key} className="inline-flex items-center gap-2">
                      {idx > 0 && <span className="text-gray-300 font-light select-none">|</span>}
                      <button
                        onClick={() => setActiveSingleCategory(cat.key)}
                        className={`transition-all cursor-pointer ${
                          isActive 
                            ? 'font-extrabold text-red-600 border-b-2 border-red-600 pb-0.5' 
                            : 'text-red-500/80 font-semibold hover:text-red-600'
                        }`}
                      >
                        {cat.label}
                      </button>
                    </span>
                  );
                })}
              </div>

              {/* Single Posters Horizontal Sliding Carousel */}
              <div 
                ref={singlePostersSliderRef}
                className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
              >
                {(() => {
                  const nonPolaroid = productsList.filter(p => !isPolaroidProduct(p));
                  const filtered = nonPolaroid.filter(p => isCategoryMatch(p, activeSingleCategory));

                  if (filtered.length === 0) {
                    const currentTabLabel = singlePosterSubTabs.find(t => t.key === activeSingleCategory)?.label || 'posters';
                    return (
                      <div className="w-full py-10 px-4 text-center bg-gray-50/80 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 my-2">
                        <span className="text-2xl">🖼️</span>
                        <p className="text-xs font-bold text-gray-800">No {currentTabLabel} available yet</p>
                        <p className="text-[11px] text-gray-500">New arrivals for this category are on the way! Check back soon.</p>
                      </div>
                    );
                  }

                  return filtered.map((product) => (
                    <div key={product.id || product._id || product.slug} className="w-56 sm:w-72 shrink-0">
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        onAddToWishlist={handleAddToWishlist}
                        onViewDetails={openProductDetails}
                        onQuickAdd={setQuickAddProduct}
                        isWishlisted={wishlist.some((p) => (p.id || p._id) === (product.id || product._id))}
                        showQuickAdd={true}
                      />
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* NEW ARRIVALS Section directly below Single Posters */}
            <div id="new-arrivals" className="mb-12 text-left select-none scroll-mt-24">
              {/* Header: Title in #0e0d0d + Scroll Arrows + EXPLORE link */}
              <div className="flex items-center justify-between mb-4 border-b border-gray-150 pb-2">
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#0e0d0d] tracking-tight uppercase">
                  NEW ARRIVALS
                </h2>

                <div className="flex items-center gap-3">
                  {/* Left to Right / Right to Left Sliding Chevron Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => scrollNewArrivals('left')}
                      className="p-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => scrollNewArrivals('right')}
                      className="p-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                      aria-label="Scroll right"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('search');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[#0e0d0d] font-bold text-xs sm:text-sm underline hover:text-black cursor-pointer uppercase tracking-wider"
                  >
                    EXPLORE
                  </button>
                </div>
              </div>

              {/* New Arrivals Horizontal Sliding Carousel */}
              <div 
                ref={newArrivalsSliderRef}
                className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
              >
                {(() => {
                  const nonPolaroid = productsList.filter(p => !isPolaroidProduct(p));
                  const newArrivals = nonPolaroid.filter(p => p.new_arrival);
                  const listToRender = newArrivals.length > 0 ? newArrivals : nonPolaroid.slice(0, 10);
                  return listToRender.map((product) => (
                    <div key={product.id || product._id || product.slug} className="w-56 sm:w-72 shrink-0">
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        onAddToWishlist={handleAddToWishlist}
                        onViewDetails={openProductDetails}
                        onQuickAdd={setQuickAddProduct}
                        isWishlisted={wishlist.some((p) => (p.id || p._id) === (product.id || product._id))}
                        showQuickAdd={true}
                      />
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* COLLAGE KITS & WALL SETS CATEGORIES SECTION directly below New Arrivals */}
            <div id="collage-wall-sets" className="mb-16 text-left select-none scroll-mt-24">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5 sm:mb-6 border-b border-gray-150 pb-3 sm:pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase bg-red-600 text-white shadow-xs mb-1.5">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> CURATED ROOM AESTHETICS
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-gray-950 tracking-tight uppercase">
                    COLLAGE KITS & WALL SETS
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                    Transform your walls into gallery masterpieces with curated collage aesthetics and multi-panel wall sets.
                  </p>
                </div>
              </div>

              {/* 1. FEATURED HERO BANNER: WALL SETS */}
              {(() => {
                const wallSetItem = collageAndWallSetCategories.find(c => c.name === "Wall Sets") || collageAndWallSetCategories[0];
                return (
                  <div
                    onClick={() => handleCategorySelect(wallSetItem.category)}
                    className="collage-bento-card group relative mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/60 shadow-lg cursor-pointer transition-all duration-300 min-h-[175px] sm:min-h-[210px] flex items-center"
                    style={{ '--card-glow': '#ff3d3d' } as React.CSSProperties}
                    role="button"
                    tabIndex={0}
                    aria-label="Browse Wall Sets Collection"
                  >
                    {/* Background Banner Artwork */}
                    <img
                      src={wallSetItem.image}
                      alt="Wall Sets"
                      loading="eager"
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Scrim for Pristine Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/35 sm:to-black/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent sm:hidden" />

                    {/* Content Box */}
                    <div className="relative z-10 p-4 sm:p-7 md:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
                      <div className="max-w-xl">
                        <span className="inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-red-600 text-white mb-1.5 shadow-xs">
                          <Layers className="w-3 h-3" /> {wallSetItem.badge} • MULTI-PANEL ART
                        </span>
                        <h3 className="text-lg sm:text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight drop-shadow-sm group-hover:text-amber-400 transition-colors">
                          WALL SETS & ART BUNDLES
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-300 font-medium mt-1 line-clamp-2 max-w-lg">
                          Multi-frame synchronized gallery sets designed to give your bedroom, workspace, or living room an iconic designer aesthetic.
                        </p>
                      </div>

                      {/* Animated CTA Button */}
                      <div className="shrink-0 pt-1 sm:pt-0">
                        <div
                          className="cta !py-2.5 !px-5 sm:!py-3 sm:!px-6 !text-xs sm:!text-sm !shadow-[4px_4px_0_black] group-hover:!shadow-[6px_6px_0_#fbc638] !bg-red-600"
                        >
                          <span className="span font-black tracking-wider">EXPLORE SETS</span>
                          <span className="second">
                            <svg
                              width="40px"
                              height="18px"
                              viewBox="0 0 66 43"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g id="arrow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <path className="one" d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z" fill="#FFFFFF" />
                                <path className="two" d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z" fill="#FFFFFF" />
                                <path className="three" d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z" fill="#FFFFFF" />
                              </g>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 2. 2-COLUMN MOBILE / 4-COLUMN DESKTOP BENTO GRID FOR COLLAGE KITS */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
                {collageAndWallSetCategories
                  .filter(cat => cat.name !== "Wall Sets")
                  .map((cat) => (
                    <div
                      key={cat.name}
                      onClick={() => handleCategorySelect(cat.category)}
                      className="collage-bento-card group relative flex flex-col justify-end p-3 sm:p-4 md:p-5 aspect-[3/4] rounded-2xl overflow-hidden border border-gray-800/80 hover:border-white/40 cursor-pointer"
                      style={{ '--card-glow': cat.glowColor } as React.CSSProperties}
                      role="button"
                      tabIndex={0}
                      aria-label={`Explore ${cat.name}`}
                    >
                      {/* Background Art Image */}
                      <img
                        src={cat.image}
                        alt={cat.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                      />

                      {/* Multi-tier Gradient for legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10 group-hover:via-black/65 transition-colors" />

                      {/* Category Badge */}
                      <div className="relative z-10 mb-auto">
                        <span
                          className="inline-block text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white backdrop-blur-md shadow-xs border border-white/10"
                          style={{ backgroundColor: `${cat.glowColor}d9` }}
                        >
                          {cat.badge}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <div className="relative z-10 pt-2">
                        <h3 className="text-sm sm:text-base md:text-lg font-display font-black text-white leading-tight drop-shadow-sm group-hover:text-amber-400 transition-colors uppercase">
                          {cat.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-gray-300 font-medium line-clamp-1 mt-0.5 opacity-90">
                          {cat.subtitle}
                        </p>

                        {/* Interactive Chevrons Bottom Bar */}
                        <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-white/90">
                          <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-gray-300 group-hover:text-amber-300 transition-colors">
                            DISCOVER
                          </span>
                          <div className="cta-anim-arrow flex items-center">
                            <svg
                              width="26px"
                              height="13px"
                              viewBox="0 0 66 43"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              className="drop-shadow-sm"
                            >
                              <g id="arrow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <path className="one" d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z" fill="#FFFFFF" />
                                <path className="two" d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z" fill="#FFFFFF" />
                                <path className="three" d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z" fill="#FFFFFF" />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Brand Footer */}
            <div className="-mx-4 sm:-mx-6 lg:-mx-8 mt-12 border-t border-gray-100">
              <Footer 
                onAboutClick={handleOpenAbout}
                onTermsClick={handleOpenTerms}
                onShippingClick={handleOpenShipping}
                onRefundClick={handleOpenRefund}
                onCancelOrderClick={handleOpenCancelOrder}
                onPrivacyClick={handleOpenPrivacy}
                onOpenSplitNewArrivals={handleOpenSplitNewArrivals}
                onOpenSinglePosters={handleOpenSinglePosters}
                onCategoryClick={handleCategorySelect}
              />
            </div>
          </div>
        )}

        {/* Dedicated Category Page View ("Second Page for Anime and all categories") */}
        {activeTab === 'category_page' && (
          <div className="animate-in fade-in duration-200 text-left">
            {/* Top Back Navigation Button */}
            <button
              onClick={() => {
                setActiveTab('home');
                setSelectedCategory(null);
                setProductsList([]);
                setSkip(0);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-950 mb-4 bg-gray-100 hover:bg-gray-200 px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
            >
              <span>←</span>
              <span>Back to Home</span>
            </button>

            {/* Filtered Product Cards Grid */}
            {categoryProducts.length === 0 && loadingMore ? (
              <div className="py-16">
                <BrandBuffer size="lg" message={`Buffering ${selectedCategory || 'Products'}...`} />
              </div>
            ) : categoryProducts.length === 0 && !loadingMore ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
                <p className="text-xs text-gray-500 font-semibold">No products found in category "{selectedCategory || 'Selected Category'}".</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product.id || product._id || product.slug}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onAddToWishlist={handleAddToWishlist}
                    onViewDetails={openProductDetails}
                    onQuickAdd={setQuickAddProduct}
                    isWishlisted={wishlist.some((p) => (p.id || p._id) === (product.id || product._id))}
                  />
                ))}
              </div>
            )}

            <div ref={observerTarget} className="min-h-16 flex items-center justify-center mt-6">
              {loadingMore && productsList.length > 0 && (
                <BrandBuffer size="sm" message="Buffering more posters..." />
              )}
            </div>

            {/* Brand Footer */}
            <div className="-mx-4 sm:-mx-6 lg:-mx-8 mt-12 border-t border-gray-100">
              <Footer 
                onAboutClick={handleOpenAbout}
                onTermsClick={handleOpenTerms}
                onShippingClick={handleOpenShipping}
                onRefundClick={handleOpenRefund}
                onCancelOrderClick={handleOpenCancelOrder}
                onPrivacyClick={handleOpenPrivacy}
                onOpenSplitNewArrivals={handleOpenSplitNewArrivals}
                onOpenSinglePosters={handleOpenSinglePosters}
                onCategoryClick={handleCategorySelect}
              />
            </div>
          </div>
        )}

        {/* Dedicated About Us Page View */}
        {activeTab === 'about' && (
          <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 animate-in fade-in duration-300">
            <AboutUsPage 
              onNavigateHome={() => {
                setActiveTab('home');
                setSelectedCategory(null);
                setSelectedProduct(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreProducts={() => {
                setActiveTab('home');
                setSelectedCategory(null);
                setSelectedProduct(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            {/* Brand Footer */}
            <div className="border-t border-zinc-900">
              <Footer 
                onAboutClick={handleOpenAbout}
                onTermsClick={handleOpenTerms}
                onShippingClick={handleOpenShipping}
                onRefundClick={handleOpenRefund}
                onCancelOrderClick={handleOpenCancelOrder}
                onPrivacyClick={handleOpenPrivacy}
                onOpenSplitNewArrivals={handleOpenSplitNewArrivals}
                onOpenSinglePosters={handleOpenSinglePosters}
                onCategoryClick={handleCategorySelect}
              />
            </div>
          </div>
        )}

        {/* Dedicated Terms of Service Page View */}
        {activeTab === 'terms' && (
          <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 animate-in fade-in duration-300">
            <TermsOfServicePage 
              onNavigateHome={() => {
                setActiveTab('home');
                setSelectedCategory(null);
                setSelectedProduct(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            {/* Brand Footer */}
            <div className="border-t border-zinc-900">
              <Footer 
                onAboutClick={handleOpenAbout}
                onTermsClick={handleOpenTerms}
                onShippingClick={handleOpenShipping}
                onRefundClick={handleOpenRefund}
                onCancelOrderClick={handleOpenCancelOrder}
                onPrivacyClick={handleOpenPrivacy}
                onOpenSplitNewArrivals={handleOpenSplitNewArrivals}
                onOpenSinglePosters={handleOpenSinglePosters}
                onCategoryClick={handleCategorySelect}
              />
            </div>
          </div>
        )}

        {/* Dedicated Shipping Policy Page View */}
        {activeTab === 'shipping' && (
          <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 animate-in fade-in duration-300">
            <ShippingPolicyPage 
              onNavigateHome={() => {
                setActiveTab('home');
                setSelectedCategory(null);
                setSelectedProduct(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreProducts={() => {
                setActiveTab('home');
                setSelectedCategory(null);
                setSelectedProduct(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            {/* Brand Footer */}
            <div className="border-t border-zinc-900">
              <Footer 
                onAboutClick={handleOpenAbout}
                onTermsClick={handleOpenTerms}
                onShippingClick={handleOpenShipping}
                onRefundClick={handleOpenRefund}
                onCancelOrderClick={handleOpenCancelOrder}
                onPrivacyClick={handleOpenPrivacy}
                onOpenSplitNewArrivals={handleOpenSplitNewArrivals}
                onOpenSinglePosters={handleOpenSinglePosters}
                onCategoryClick={handleCategorySelect}
              />
            </div>
          </div>
        )}

        {/* Dedicated Refund Policy Page View */}
        {activeTab === 'refund' && (
          <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 animate-in fade-in duration-300">
            <RefundPolicyPage 
              onNavigateHome={() => {
                setActiveTab('home');
                setSelectedCategory(null);
                setSelectedProduct(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreProducts={() => {
                setActiveTab('home');
                setSelectedCategory(null);
                setSelectedProduct(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            {/* Brand Footer */}
            <div className="border-t border-zinc-900">
              <Footer 
                onAboutClick={handleOpenAbout}
                onTermsClick={handleOpenTerms}
                onShippingClick={handleOpenShipping}
                onRefundClick={handleOpenRefund}
                onCancelOrderClick={handleOpenCancelOrder}
                onPrivacyClick={handleOpenPrivacy}
              />
            </div>
          </div>
        )}

        {/* Dedicated Cancel Order Page View */}
        {activeTab === 'cancel_order' && (
          <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 animate-in fade-in duration-300">
            <CancelOrderPage 
              onNavigateHome={() => {
                setActiveTab('home');
                setSelectedCategory(null);
                setSelectedProduct(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreProducts={() => {
                setActiveTab('home');
                setSelectedCategory(null);
                setSelectedProduct(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateOrders={() => {
                if (isLoggedIn) {
                  setActiveTab('profile');
                } else {
                  setAuthModalOpen(true);
                }
                setSelectedCategory(null);
                setSelectedProduct(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            {/* Brand Footer */}
            <div className="border-t border-zinc-900">
              <Footer 
                onAboutClick={handleOpenAbout}
                onTermsClick={handleOpenTerms}
                onShippingClick={handleOpenShipping}
                onRefundClick={handleOpenRefund}
                onCancelOrderClick={handleOpenCancelOrder}
                onPrivacyClick={handleOpenPrivacy}
                onOpenSplitNewArrivals={handleOpenSplitNewArrivals}
                onOpenSinglePosters={handleOpenSinglePosters}
                onCategoryClick={handleCategorySelect}
              />
            </div>
          </div>
        )}

        {/* Dedicated Privacy Policy Page View */}
        {activeTab === 'privacy' && (
          <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 animate-in fade-in duration-300">
            <PrivacyPolicyPage 
              onNavigateHome={() => {
                setActiveTab('home');
                setSelectedCategory(null);
                setSelectedProduct(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreProducts={() => {
                setActiveTab('home');
                setSelectedCategory(null);
                setSelectedProduct(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            {/* Brand Footer */}
            <div className="border-t border-zinc-900">
              <Footer 
                onAboutClick={handleOpenAbout}
                onTermsClick={handleOpenTerms}
                onShippingClick={handleOpenShipping}
                onRefundClick={handleOpenRefund}
                onCancelOrderClick={handleOpenCancelOrder}
                onPrivacyClick={handleOpenPrivacy}
                onOpenSplitNewArrivals={handleOpenSplitNewArrivals}
                onOpenSinglePosters={handleOpenSinglePosters}
                onCategoryClick={handleCategorySelect}
              />
            </div>
          </div>
        )}

        {/* Search Tab View */}
        {activeTab === 'search' && (
          <div className="animate-in fade-in duration-200">
            <h2 className="text-xl font-display font-black mb-4">Discovery</h2>
            <div className="relative mb-6">
              <input
                type="text"
                autoFocus
                placeholder="Search premium posters, wall art, fine art frames..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-250 text-xs font-medium px-4 py-3 rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-450 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {productsList.length === 0 && loadingMore ? (
              <div className="py-16">
                <BrandBuffer size="md" message="Searching PrintOkiyo posters..." />
              </div>
            ) : productsList.length === 0 && !loadingMore ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
                <p className="text-xs text-gray-555 font-semibold">No results match your search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {productsList.map((product) => (
                  <ProductCard
                    key={product.id || product._id || product.slug}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onAddToWishlist={handleAddToWishlist}
                    onViewDetails={openProductDetails}
                    onQuickAdd={setQuickAddProduct}
                    isWishlisted={wishlist.some((p) => (p.id || p._id) === (product.id || product._id))}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist View */}
        {activeTab === 'wishlist' && (
          <div className="animate-in fade-in duration-200">
            <h2 className="text-xl font-display font-black mb-4">Your Wishlist</h2>
            {wishlist.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-150">
                <Heart size={28} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs text-gray-500 font-semibold">Your wishlist is empty. Tap the heart icon on creations to add them.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {wishlist.map((product) => (
                  <ProductCard
                    key={product.id || product._id || product.slug}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onAddToWishlist={handleAddToWishlist}
                    onViewDetails={openProductDetails}
                    onQuickAdd={setQuickAddProduct}
                    isWishlisted={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Shopping Cart View */}
        {activeTab === 'cart' && (() => {
          const calculatedCart = calculateCartItems(cart);
          const groupedCart = groupCalculatedCartItems(calculatedCart);
          const cartSubtotal = calculatedCart.reduce((sum, item) => sum + item.final_price, 0);

          return (
            <div className="animate-in fade-in duration-200">
              <h2 className="text-xl font-display font-black mb-4 text-left">Shopping Cart</h2>
              
              {cart.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-150">
                  <ShoppingBag size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs text-gray-500 font-semibold">Your shopping cart is empty.</p>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  {/* Cart Items List */}
                  <div className="flex-1 w-full flex flex-col gap-3">
                    {groupedCart.map((group) => (
                      <div key={group.group_id} className="flex items-center gap-3 sm:gap-4 bg-white border border-gray-150 p-3.5 sm:p-4 rounded-2xl shadow-2xs hover:border-gray-250 transition-all">
                        <img src={getImageUrl(group.thumbnail)} alt={group.title} className="w-14 h-14 sm:w-16 sm:h-16 object-contain bg-gray-50 p-1.5 rounded-xl shrink-0" />
                        <div className="flex-grow min-w-0 text-left">
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">{group.title}</h4>
                          {group.selected_size && (
                            <span className="text-[10px] font-semibold text-gray-500 block mt-0.5">Size: {group.selected_size}</span>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            {group.is_free ? (
                              <>
                                <span className="text-xs text-gray-400 line-through">₹{group.original_unit_price.toLocaleString('en-IN')}</span>
                                <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                  ₹0 FREE ({group.offer_applied || 'Offer Applied'})
                                </span>
                              </>
                            ) : (
                              <span className="text-xs text-brand-600 font-bold">₹{group.total_final_price.toLocaleString('en-IN')}</span>
                            )}
                          </div>
                        </div>

                        {/* Interactive Quantity Controls (- QTY +) */}
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDecreaseGroupQuantity(group)}
                            className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 hover:text-black transition-colors font-bold text-xs sm:text-sm cursor-pointer select-none"
                            title="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-2 py-1 text-xs font-black text-gray-900 min-w-[20px] text-center select-none">
                            {group.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncreaseGroupQuantity(group)}
                            className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 hover:text-black transition-colors font-bold text-xs sm:text-sm cursor-pointer select-none"
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button 
                          type="button"
                          onClick={() => handleRemoveGroup(group)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 shrink-0 cursor-pointer"
                          title="Remove item group"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Summary Sidebar */}
                  <div className="w-full lg:w-80 shrink-0 bg-gray-50 border border-gray-200 p-5 rounded-2xl flex flex-col gap-3 text-left">
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2">Order Summary</h3>
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-gray-500">Subtotal ({cart.length} items)</span>
                      <span className="text-gray-955 font-bold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-emerald-700 font-bold">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-sm font-black">
                      <span className="text-gray-900">Total</span>
                      <span className="text-brand-600">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <button 
                      onClick={handleCheckout}
                      className="w-full py-3 bg-[#041E42] text-white rounded-xl text-xs font-black tracking-wider uppercase mt-2 hover:bg-[#082a56] transition-all shadow-md cursor-pointer"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Profile / Account Details Dashboard */}
        {activeTab === 'profile' && isLoggedIn && userProfile && (
          <div className="animate-in fade-in duration-200 text-left">
            <h2 className="text-xl font-display font-black mb-4">
              Profile
            </h2>

            <div className="flex flex-col gap-5">
              
              {/* Profile Header */}
              <div className="bg-[#faf9f6] p-6 rounded-3xl flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-gray-900 border border-gray-100">
                  <span className="font-display font-black text-sm select-none">
                    {(userProfile.name?.trim() || 'Guest').substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-tight">{userProfile.name?.trim() || 'Guest'}</h3>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mt-0.5">
                    {userProfile.name?.trim() ? 'Premium Member' : 'Guest Member'}
                  </span>
                </div>
              </div>

              {/* Editing Form */}
              {isEditingProfile ? (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!token) return;
                    try {
                      const updatedUser = await updateUserProfile(token, { name: editName, email: editEmail });
                      setUserProfile(updatedUser);
                      setIsEditingProfile(false);
                      localStorage.setItem('mwm_user', JSON.stringify(updatedUser));
                      showToast("🎉 Profile updated successfully!");
                    } catch (err: any) {
                      showToast(err.message || "Failed to update profile", "info");
                    }
                  }}
                  className="bg-[#faf9f6] p-6 rounded-3xl flex flex-col gap-4 animate-in fade-in duration-200"
                >
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold text-gray-400">Name</label>
                    <input 
                      type="text" 
                      required 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold text-gray-400">Email</label>
                    <input 
                      type="email" 
                      required 
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2.5 mt-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditName(userProfile.name || '');
                        setEditEmail(userProfile.email || '');
                        setIsEditingProfile(false);
                      }}
                      className="flex-1 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-2.5 bg-gray-950 hover:bg-gray-855 text-white rounded-xl text-xs font-bold"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-[#faf9f6] p-6 rounded-3xl flex flex-col gap-4">
                  {userProfile.email && (
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-gray-400">Email Address</span>
                      <span className="text-xs font-semibold text-gray-900">{userProfile.email}</span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-gray-400">Phone Number</span>
                    <span className="text-xs font-semibold text-gray-900">{userProfile.phone}</span>
                  </div>

                  <div className="flex gap-2.5 pt-2 mt-1">
                    <button 
                      onClick={() => {
                        setIsEditingProfile(true);
                      }}
                      className="flex-1 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-650 hover:bg-gray-50 text-center"
                    >
                      Edit Details
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-50 text-center"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}

              {/* Order History */}
              <div className="mt-2 text-left">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 select-none">Order History</h3>
                {orderHistory.length === 0 ? (
                  <div className="bg-[#faf9f6] p-6 rounded-3xl text-center border border-dashed border-gray-200">
                    <span className="text-xs text-gray-500 font-semibold">No previous orders found.</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {orderHistory.map((order, idx) => (
                      <div key={idx} className="bg-white border border-gray-150 p-4.5 rounded-3xl flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0 flex-grow text-left">
                            <span className="text-[9px] font-black text-black uppercase block">Order #{order.orderId}</span>
                            <h4 className="text-xs font-black text-black mt-1 truncate pr-2">
                              {order.items.map((it: any) => it.title).join(', ')}
                            </h4>
                            <span className="text-[8px] font-semibold text-gray-500 block mt-0.5">{order.date}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-black block">₹{order.grandTotal.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {/* Customer phone and address details */}
                        {(order.phone || order.address || order.tracking_id) && (
                          <div className="text-[9.5px] border-t border-gray-100 pt-2 flex flex-col gap-1 text-black font-semibold">
                            {order.tracking_id && (
                              <div className="flex items-center gap-1.5 text-blue-900 bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg">
                                <span>🚚 Tracking ID:</span>
                                <span className="font-mono font-bold">{order.tracking_id}</span>
                              </div>
                            )}
                            {order.phone && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-gray-500 font-bold">Mobile:</span>
                                <span>{order.phone}</span>
                              </div>
                            )}
                            {order.address && (
                              <div className="flex items-start gap-1.5">
                                <span className="text-gray-500 font-bold">Address:</span>
                                <span className="leading-normal">{order.address}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Status notification & Continue Payment option */}
                        <div className="border-t border-gray-100 pt-2.5 flex flex-wrap items-center justify-between gap-2">
                          {(order.payment_status === 'pending' || order.status === 'Pending Payment') ? (
                            <>
                              <span className="text-[9.5px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                                <span>⏳</span>
                                <span>Payment Pending</span>
                              </span>
                              <button
                                type="button"
                                onClick={async () => {
                                  const redirectUrl = order.short_url || order.payment_url;
                                  if (redirectUrl) {
                                    window.location.href = redirectUrl;
                                    return;
                                  }
                                  if (token) {
                                    try {
                                      showToast("Redirecting to Razorpay payment gateway...");
                                      const { createRazorpayPaymentLink } = await import('./api/payment');
                                      const linkRes = await createRazorpayPaymentLink(token, {
                                        amount: order.grandTotal,
                                        receipt: order.orderId,
                                        name: userProfile?.name || 'Customer',
                                        email: userProfile?.email || '',
                                        phone: userProfile?.phone || order.phone || '',
                                        callback_url: window.location.origin,
                                        address: order.address || 'Address',
                                        items: order.items || []
                                      });
                                      if (linkRes?.short_url) {
                                        window.location.href = linkRes.short_url;
                                      }
                                    } catch (e: any) {
                                      alert(e.message || "Failed to generate payment link.");
                                    }
                                  }
                                }}
                                className="text-[10.5px] font-black text-white bg-[#041E42] hover:bg-[#082a56] px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                              >
                                <span>💳 Continue Payment</span>
                              </button>
                            </>
                          ) : order.status === 'Processing' ? (
                            <span className="text-[9px] font-black text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                              <span>💬</span>
                              <span>Tracking details will be shared on WhatsApp</span>
                            </span>
                          ) : (
                            <span className="text-[9px] font-black text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full uppercase">
                              {order.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Checkout Delivery details view */}
        {activeTab === 'checkout' && isLoggedIn && (
          <CheckoutForm
            cart={buyNowItems ? buyNowItems : cart}
            token={token}
            initialName={userProfile?.name || ''}
            initialEmail={userProfile?.email || ''}
            initialPhone={userProfile?.phone || ''}
            onBack={() => {
              const wasBuyNow = !!buyNowItems;
              setBuyNowItems(null);
              setActiveTab(wasBuyNow ? 'home' : 'cart');
            }}
            onRemoveItem={handleRemoveFromCheckout}
            onSyncCart={(newCart) => syncCartChanges(newCart)}
            storeSettings={storeSettings || undefined}
            onSubmit={async (details) => {
              // Automatically update user profile name if profile name is missing or Guest
              if (token && details.name && details.name.trim()) {
                const currentName = userProfile?.name?.trim();
                if (!currentName || currentName === 'Guest' || currentName.toLowerCase() === 'guest') {
                  try {
                    const updatedUser = await updateUserProfile(token, {
                      name: details.name.trim(),
                      email: details.email?.trim() || userProfile?.email || undefined
                    });
                    if (updatedUser) {
                      setUserProfile(updatedUser);
                      localStorage.setItem('mwm_user', JSON.stringify(updatedUser));
                    }
                  } catch (e) {
                    console.error("Auto update user profile name from checkout failed:", e);
                  }
                }
              }

              const checkoutCart = buyNowItems ? buyNowItems : cart;
              const calculatedCheckoutCart = calculateCartItems(checkoutCart);
              const orderId = details.paymentDetails?.order_id || `MWM-${Math.floor(100000 + Math.random() * 900000)}`;
              const subtotal = calculatedCheckoutCart.reduce((sum, item) => sum + item.final_price, 0);
              const threshold = storeSettings?.delivery_charge_threshold ?? 999;
              const charge = storeSettings?.delivery_charge ?? 70;
              const codFee = storeSettings?.cod_fee ?? 40;
              const shippingCost = subtotal > threshold ? 0 : charge;
              const codFeeCost = details.paymentMethod === 'Cash on Delivery' ? codFee : 0;
              const grandTotal = subtotal + shippingCost + codFeeCost;
              const orderStatus = details.paymentDetails?.status || 'Processing';
              const paymentStatus = details.paymentDetails?.payment_status || (details.paymentMethod === 'Cash on Delivery' ? 'pending' : 'pending');

              const mappedItems = calculatedCheckoutCart.map((it) => ({
                product_id: it.id || (it as any)._id,
                sku: it.SKU || (it as any).sku || '',
                title: it.title,
                price: it.final_price,
                thumbnail: it.thumbnail,
                custom_photo: it.custom_photo,
                selected_size: it.selected_size
              }));

              const orderPayload = {
                order_id: orderId,
                name: details.name,
                email: details.email,
                phone: details.phone,
                address: details.address,
                payment_method: details.paymentMethod,
                items: mappedItems,
                grand_total: grandTotal,
                status: orderStatus,
                payment_status: paymentStatus
              };

              // Save order to MongoDB database
              if (token) {
                try {
                  await createOrder(token, orderPayload);
                } catch (e) {
                  console.error("Order database persistence failed:", e);
                }
              }

              // Trigger Success Confirmation Popup Modal ONLY for Cash on Delivery immediately
              if (details.paymentMethod === 'Cash on Delivery') {
                setCompletedOrder(orderPayload);

                if (!buyNowItems) {
                  await syncCartChanges([]);
                }
                setBuyNowItems(null);
                setActiveTab('home');
                showToast("🎉 Order placed successfully!");
              }
            }}
          />
        )}

        {/* Order Confirmation receipt view */}
        {activeTab === 'confirmation' && placedOrder && (
          <OrderConfirmation
            orderId={placedOrder.orderId}
            name={placedOrder.name}
            phone={placedOrder.phone}
            address={placedOrder.address}
            paymentMethod={placedOrder.paymentMethod}
            cart={placedOrder.cart}
            grandTotal={placedOrder.grandTotal}
            onContinue={() => {
              setPlacedOrder(null);
              setSelectedCategory(null);
              setSelectedProduct(null);
              setSearchQuery('');
              setActiveTab('home');
            }}
          />
        )}
      </main>

      {/* 5. Floating Capsule Navigation Bar (Mobile Only - Hidden on Desktop) */}
      <div className="fixed bottom-6 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none select-none md:hidden">
        <nav className="pointer-events-auto w-full max-w-sm bg-gray-950/95 backdrop-blur-xl border border-gray-800/80 px-6 py-2.5 rounded-full flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all">
          
          <button 
            onClick={() => { 
              setActiveTab('home'); 
              setSelectedCategory(null);
              setSelectedProduct(null); 
              setSearchQuery('');
            }}
            className={`relative flex flex-col items-center justify-center p-2 rounded-full transition-all ${
              isTabActive('home') ? 'text-white scale-110' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Home size={19} strokeWidth={isTabActive('home') ? 2.5 : 2} />
            {isTabActive('home') && (
              <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-white animate-in zoom-in duration-200" />
            )}
          </button>

          <button 
            onClick={() => { 
              setActiveTab('search'); 
              setSelectedProduct(null); 
            }}
            className={`relative flex flex-col items-center justify-center p-2 rounded-full transition-all ${
              isTabActive('search') ? 'text-white scale-110' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Search size={19} strokeWidth={isTabActive('search') ? 2.5 : 2} />
            {isTabActive('search') && (
              <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-white animate-in zoom-in duration-200" />
            )}
          </button>

          <button 
            onClick={() => { 
              setActiveTab('wishlist'); 
              setSelectedProduct(null); 
            }}
            className={`relative flex flex-col items-center justify-center p-2 rounded-full transition-all ${
              isTabActive('wishlist') ? 'text-white scale-110' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Heart size={19} strokeWidth={isTabActive('wishlist') ? 2.5 : 2} />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-gray-950" />
            )}
            {isTabActive('wishlist') && (
              <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-white animate-in zoom-in duration-200" />
            )}
          </button>

          <button 
            onClick={() => { 
              setActiveTab('cart'); 
              setSelectedProduct(null); 
            }}
            className={`relative flex flex-col items-center justify-center p-2 rounded-full transition-all ${
              isTabActive('cart') ? 'text-white scale-110' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <ShoppingBag size={19} strokeWidth={isTabActive('cart') ? 2.5 : 2} />
            {cart.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-white text-gray-950 rounded-full text-[8px] font-black shadow-sm ring-2 ring-gray-950">
                {cart.length}
              </span>
            )}
            {isTabActive('cart') && (
              <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-white animate-in zoom-in duration-200" />
            )}
          </button>

          <button 
            onClick={handleProfileClick}
            className={`relative flex flex-col items-center justify-center p-2 rounded-full transition-all ${
              isTabActive('profile') ? 'text-white scale-110' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <User size={19} strokeWidth={isTabActive('profile') ? 2.5 : 2} />
            {isTabActive('profile') && (
              <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-white animate-in zoom-in duration-200" />
            )}
          </button>

        </nav>
      </div>

      {/* Auth Modal drawer */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setIntendedAction(null);
        }}
        onSuccess={handleAuthSuccess}
      />

      {/* Toast Notification Container */}
      <div className="fixed bottom-20 right-4 left-4 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-4 px-4 py-3 rounded-xl shadow-xl border border-green-100 bg-white text-gray-900 text-[11px] font-semibold animate-in slide-in-from-bottom-5 duration-300"
          >
            <div className="flex items-center gap-2">
              <Check size={14} className="text-green-500" />
              <span>{toast.message}</span>
            </div>
            <button 
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="p-1 text-gray-400 hover:text-gray-655 pointer-events-auto"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Order Confirmation Success Modal Popup */}
      {completedOrder && (
        <OrderSuccessModal 
          order={completedOrder} 
          onClose={() => setCompletedOrder(null)} 
        />
      )}

      {/* Quick Add Variant Popup Modal (FrameKro style) */}
      {quickAddProduct && (
        <QuickAddModal
          product={quickAddProduct}
          onClose={() => setQuickAddProduct(null)}
          onAddToCart={handleQuickAddBatch}
          onViewDetails={openProductDetails}
        />
      )}
    </div>
  );
}

export default App;
