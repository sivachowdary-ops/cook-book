"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/data/products";
import { useCountry } from "@/context/CountryContext";
import { useProducts } from "@/context/ProductContext";
import { useToast } from "@/context/ToastContext";
import { supabase } from "@/lib/supabase";
import { 
  Settings, 
  Plus, 
  TrendingUp, 
  ShoppingBag, 
  Lock, 
  Trash2, 
  PlusCircle, 
  Database,
  RefreshCw,
  Printer,
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";

interface LeadOrder {
  id: string;
  created_at?: string;
  timestamp?: string;
  customer_name: string;
  customer_phone: string;
  country: string;
  address: string;
  items: string[] | string;
  subtotal: string;
}

export default function AdminDashboard() {
  const { rates, setRates } = useCountry();
  const { showToast } = useToast();
  const { 
    products, 
    loading: loadingProducts, 
    saveProductPrice, 
    toggleStock, 
    addNewProduct, 
    deleteProduct,
    seedDefaultCatalog
  } = useProducts();

  // Authentication State
  const [session, setSession] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<"products" | "rates" | "leads" | "security">("products");

  // Catalog State
  const [searchQuery, setSearchQuery] = useState("");

  // Exchange Rates editing fields
  const [editGbp, setEditGbp] = useState("");
  const [editUsd, setEditUsd] = useState("");

  // Add Product form fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<Product["category"]>("sweets");
  const [formPrice, setFormPrice] = useState("");
  const [formUnit, setFormUnit] = useState<"kg" | "piece">("kg");
  const [formIsVeg, setFormIsVeg] = useState(true);
  const [formDesc, setFormDesc] = useState("");

  // Leads
  const [leads, setLeads] = useState<LeadOrder[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  // Security Form
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingSecurity, setLoadingSecurity] = useState(false);

  // 1. Manage Supabase Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Leads once logged in
  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      setLeads(data || []);
    } catch (err) {
      console.warn("Could not load leads from Supabase, checking local backup:", err);
      const savedLeads = localStorage.getItem("cook_book_leads");
      if (savedLeads) {
        setLeads(JSON.parse(savedLeads));
      }
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchLeads();
    }
  }, [session]);

  // Hydrate rate editing fields
  useEffect(() => {
    setEditGbp(rates.gbp.toString());
    setEditUsd(rates.usd.toString());
  }, [rates]);

  // Auth Operations
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    if (!emailInput.trim() || !passwordInput) {
      setAuthError("Email and Password are required");
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput,
      });

      if (error) {
        setAuthError(error.message);
      } else {
        showToast("Logged in successfully ✓");
      }
    } catch (err) {
      setAuthError("An unexpected error occurred during login");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast("Signed out successfully");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      showToast("Please enter a new password", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    setLoadingSecurity(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      showToast("Admin password changed successfully!", "success");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showToast(err.message || "Failed to update password", "error");
    } finally {
      setLoadingSecurity(false);
    }
  };

  // Product Operations
  const handleSaveProductPrice = async (productId: string, newPrice: number) => {
    await saveProductPrice(productId, newPrice);
    showToast("Product price updated");
  };

  const handleToggleStock = async (productId: string, currentStock: boolean | undefined) => {
    await toggleStock(productId, currentStock);
    showToast(`Stock status toggled`);
  };

  const handleAddNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) {
      showToast("Name and base price are required", "error");
      return;
    }

    const priceNum = parseFloat(formPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast("Enter a valid base price", "error");
      return;
    }

    const newProd: Product = {
      id: `${formCategory}-${Date.now()}`,
      name: formName,
      category: formCategory,
      basePriceINR: priceNum,
      unit: formUnit,
      isVeg: formIsVeg,
      description: formDesc || `Premium authentic ${formName}. Prepared fresh.`,
      inStock: true
    };

    try {
      await addNewProduct(newProd);
      setFormName("");
      setFormPrice("");
      setFormDesc("");
      showToast(`Added ${formName} successfully ✓`);
    } catch (err) {
      showToast("Failed to add product", "error");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product from the database?")) {
      try {
        await deleteProduct(productId);
        showToast("Product deleted successfully");
      } catch (err) {
        showToast("Failed to delete product", "error");
      }
    }
  };

  // Exchange Rates Operations
  const handleSaveRates = async (e: React.FormEvent) => {
    e.preventDefault();
    const gbpVal = parseFloat(editGbp);
    const usdVal = parseFloat(editUsd);

    if (isNaN(gbpVal) || isNaN(usdVal) || gbpVal <= 0 || usdVal <= 0) {
      showToast("Exchange rates must be positive numbers", "error");
      return;
    }

    try {
      await setRates({ gbp: gbpVal, usd: usdVal });
      showToast("Conversion rates updated successfully ✓");
    } catch (err) {
      showToast("Failed to save rates to Supabase", "error");
    }
  };

  // Seed default 75 catalog sheets to Supabase
  const handleSeedCatalog = async () => {
    if (confirm("This will seed the database with the default Cook Book product catalog of 75 products. Proceed?")) {
      try {
        await seedDefaultCatalog();
        showToast("Default catalog seeded to Supabase successfully ✓");
      } catch (err) {
        showToast("Seeding catalog failed", "error");
      }
    }
  };

  // Clear leads from DB
  const handleClearLeads = async () => {
    if (confirm("Clear all recorded checkout leads in the Supabase database? This cannot be undone.")) {
      try {
        const { error } = await supabase.from("leads").delete().neq("id", "");
        if (error) throw error;
        setLeads([]);
        localStorage.removeItem("cook_book_leads");
        showToast("Leads database cleared");
      } catch (err: any) {
        showToast(err.message || "Failed to clear leads from database", "error");
      }
    }
  };

  // KOT printing utility (79mm thermal receipt paper layout)
  const printKOT = (lead: LeadOrder) => {
    const printWindow = window.open("", "_blank", "width=600,height=800");
    if (!printWindow) return;

    // Build items rows
    const itemsList = Array.isArray(lead.items) 
      ? lead.items 
      : typeof lead.items === "string" 
        ? lead.items.split(",") 
        : [];

    const itemsHTML = itemsList.map(item => `
      <tr>
        <td style="padding: 4px 0; font-size: 13px; font-family: monospace;">${item.trim()}</td>
      </tr>
    `).join("");

    const dateStr = new Date(lead.created_at || lead.timestamp || Date.now()).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata"
    });

    printWindow.document.write(`
      <html>
        <head>
          <title>KOT-${lead.id}</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              width: 74mm;
              margin: 3mm;
              font-family: 'Courier New', Courier, monospace;
              font-size: 12px;
              color: #000;
              line-height: 1.4;
            }
            .center {
              text-align: center;
            }
            .bold {
              font-weight: bold;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 6px 0;
            }
            .header-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 2px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            .footer {
              margin-top: 12px;
              font-size: 10px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="center">
            <div class="header-title">COOK BOOK</div>
            <div>TASTE THE MAGIC</div>
            <div class="bold">KITCHEN ORDER TICKET (KOT)</div>
          </div>
          
          <div class="divider"></div>
          
          <div><span class="bold">Order ID:</span> ${lead.id}</div>
          <div><span class="bold">Date:</span> ${dateStr}</div>
          <div><span class="bold">Deliver To:</span> ${lead.country}</div>
          
          <div class="divider"></div>
          
          <div><span class="bold">Customer Name:</span> ${lead.customer_name}</div>
          <div><span class="bold">Phone:</span> ${lead.customer_phone}</div>
          <div style="font-size: 11px;"><span class="bold">Address:</span> ${lead.address}</div>
          
          <div class="divider"></div>
          
          <div class="bold" style="margin-bottom: 4px;">ORDER ITEMS:</div>
          <table>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          
          <div class="divider"></div>
          
          <div class="bold" style="font-size: 14px; text-align: right;">
            SUBTOTAL: ${lead.subtotal}
          </div>
          
          <div class="divider"></div>
          
          <div class="footer">
            * Fresh Homemade Telugu Delicacies *<br>
            Thank you for cooking with us!
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filter products for display in admin table
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Authentication Gating Render
  if (loadingAuth) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-accent border-t-primary rounded-full animate-spin" />
          <p className="text-xs text-text-dark/60 font-semibold tracking-wider uppercase">Checking Session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-bg-cream/40 min-h-[70vh]">
        <form onSubmit={handleLogin} className="max-w-md w-full bg-white border border-border-brand rounded-2xl p-8 shadow-xl space-y-6 ornate-border">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto border border-accent/40">
              <Lock className="w-5 h-5 text-accent" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-primary">Cook Book Admin</h1>
            <p className="text-xs text-text-dark/50">Sign in with Supabase credentials to manage pricing and inventory.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-text-dark/60 uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@cookbook.com"
                className="w-full px-4 py-2.5 rounded-lg border border-border-brand bg-bg-cream/15 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-text-dark/60 uppercase tracking-widest">
                Access Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-border-brand bg-bg-cream/15 text-sm focus:outline-none focus:border-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-text-dark/40 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && <p className="text-red-600 text-xs mt-1.5 font-medium">{authError}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition-all shadow cursor-pointer text-xs"
          >
            Authenticate Admin
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-brand pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">Admin Control Dashboard</h1>
          <p className="text-xs text-text-dark/50 mt-1">Manage catalog base prices, currency conversions, and WhatsApp leads in real-time.</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs bg-bg-cream/80 hover:bg-red-50 hover:text-red-700 text-text-dark/70 border border-border-brand px-4 py-2 rounded-lg font-bold transition-all cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 border-b border-border-brand/40 pb-px overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "products"
              ? "border-primary text-primary font-extrabold"
              : "border-transparent text-text-dark/50 hover:text-primary"
          }`}
        >
          <Database className="w-4 h-4 inline-block mr-1.5 shrink-0" />
          Catalog Management
        </button>
        <button
          onClick={() => setActiveTab("rates")}
          className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "rates"
              ? "border-primary text-primary font-extrabold"
              : "border-transparent text-text-dark/50 hover:text-primary"
          }`}
        >
          <TrendingUp className="w-4 h-4 inline-block mr-1.5 shrink-0" />
          Exchange Rates
        </button>
        <button
          onClick={() => setActiveTab("leads")}
          className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "leads"
              ? "border-primary text-primary font-extrabold"
              : "border-transparent text-text-dark/50 hover:text-primary"
          }`}
        >
          <ShoppingBag className="w-4 h-4 inline-block mr-1.5 shrink-0" />
          Order Leads ({leads.length})
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "security"
              ? "border-primary text-primary font-extrabold"
              : "border-transparent text-text-dark/50 hover:text-primary"
          }`}
        >
          <Settings className="w-4 h-4 inline-block mr-1.5 shrink-0" />
          Security Settings
        </button>
      </div>

      {/* TAB CONTENT: SECURITY SETTINGS */}
      {activeTab === "security" && (
        <div className="max-w-md bg-white border border-border-brand rounded-2xl p-6 shadow-xs space-y-6 ornate-border">
          <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-1.5">
            <Lock className="w-5 h-5 text-accent" />
            Change Admin Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-text-dark/60 uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-border-brand text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-dark/60 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-border-brand text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loadingSecurity}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition-all shadow cursor-pointer text-xs disabled:opacity-50"
            >
              {loadingSecurity ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: EXCHANGE RATES */}
      {activeTab === "rates" && (
        <div className="max-w-md bg-white border border-border-brand rounded-2xl p-6 shadow-xs space-y-6 ornate-border">
          <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-1.5">
            <Settings className="w-5 h-5 text-accent" />
            Conversion Rate Setup
          </h2>
          <form onSubmit={handleSaveRates} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-text-dark/60 uppercase tracking-wider mb-1">
                1 GBP (£) in INR (₹)
              </label>
              <input
                type="number"
                value={editGbp}
                onChange={(e) => setEditGbp(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border-brand text-sm focus:outline-none focus:border-primary font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-dark/60 uppercase tracking-wider mb-1">
                1 USD ($) in INR (₹)
              </label>
              <input
                type="number"
                value={editUsd}
                onChange={(e) => setEditUsd(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border-brand text-sm focus:outline-none focus:border-primary font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition-all shadow cursor-pointer text-xs"
            >
              Update Exchange Rates
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: ORDER LEADS */}
      {activeTab === "leads" && (
        <div className="bg-white border border-border-brand rounded-2xl p-6 shadow-xs space-y-6 ornate-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-brand/40 pb-4">
            <h2 className="font-serif text-lg font-bold text-primary">
              WhatsApp Checkout Leads CRM
            </h2>
            <div className="flex gap-2">
              <button
                onClick={fetchLeads}
                className="text-xs bg-bg-cream hover:bg-border-brand/40 text-text-dark/70 border border-border-brand px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
              {leads.length > 0 && (
                <button
                  onClick={handleClearLeads}
                  className="text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
                >
                  Clear Leads Log
                </button>
              )}
            </div>
          </div>

          {loadingLeads ? (
            <div className="text-center py-12">
              <div className="w-6 h-6 border-2 border-accent border-t-primary rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-text-dark/50">Fetching lead orders from Supabase...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12 text-text-dark/40">
              <ShoppingBag className="w-10 h-10 mx-auto text-text-dark/20 mb-2" />
              <p className="text-xs">No checkout leads recorded yet. Once users submit forms, they log here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-border-brand bg-bg-cream/40 font-bold text-text-dark">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Destination</th>
                    <th className="p-3">Items</th>
                    <th className="p-3 text-right">Subtotal</th>
                    <th className="p-3 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-brand/50">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-bg-cream/20">
                      <td className="p-3 font-mono font-bold text-primary">{lead.id}</td>
                      <td className="p-3 text-text-dark/60">
                        {lead.created_at
                          ? new Date(lead.created_at).toLocaleDateString() + " " + new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : lead.timestamp
                            ? new Date(lead.timestamp).toLocaleDateString() + " " + new Date(lead.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : "N/A"
                        }
                      </td>
                      <td className="p-3">
                        <span className="font-bold block">{lead.customer_name}</span>
                        <span className="text-text-dark/50">{lead.customer_phone}</span>
                      </td>
                      <td className="p-3 text-text-dark/70">
                        <span className="font-bold">{lead.country}</span>
                        <p className="max-w-[200px] truncate" title={lead.address}>{lead.address}</p>
                      </td>
                      <td className="p-3">
                        <ul className="list-disc pl-4 space-y-0.5 max-w-[250px]">
                          {Array.isArray(lead.items) ? (
                            lead.items.map((it, idx) => (
                              <li key={idx} className="truncate">{it}</li>
                            ))
                          ) : typeof lead.items === "string" ? (
                            lead.items.split(",").map((it, idx) => (
                              <li key={idx} className="truncate">{it.trim()}</li>
                            ))
                          ) : (
                            <li>No items list</li>
                          )}
                        </ul>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-primary">{lead.subtotal}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => printKOT(lead)}
                          className="bg-accent hover:bg-accent-hover text-primary p-2 rounded-lg transition-all shadow-xs inline-flex items-center gap-1 cursor-pointer"
                          title="Print Kitchen Order Ticket (79mm)"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>KOT</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: CATALOG MANAGEMENT */}
      {activeTab === "products" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Add product form */}
          <div className="lg:col-span-4 bg-white border border-border-brand rounded-2xl p-5 shadow-xs space-y-4 ornate-border">
            <div className="flex justify-between items-center border-b border-border-brand/40 pb-2">
              <h2 className="font-serif text-base font-bold text-primary flex items-center gap-1">
                <PlusCircle className="w-5 h-5 text-accent" />
                Add Custom Product
              </h2>
            </div>
            
            <form onSubmit={handleAddNewProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-text-dark/60 uppercase tracking-wider mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-brand text-xs focus:outline-none focus:border-primary"
                  placeholder="e.g. Dry Fruit Laddu"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-text-dark/60 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Product["category"])}
                    className="w-full px-2 py-2 rounded-lg border border-border-brand text-xs focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="sweets">Sweets</option>
                    <option value="snacks">Snacks</option>
                    <option value="veg-pickles">Veg Pickles</option>
                    <option value="non-veg-pickles">Non-Veg Pickles</option>
                    <option value="powders">Spice Powders</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-dark/60 uppercase tracking-wider mb-1">
                    Selling Unit
                  </label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value as "kg" | "piece")}
                    className="w-full px-2 py-2 rounded-lg border border-border-brand text-xs focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="kg">Per kg</option>
                    <option value="piece">Per piece</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-text-dark/60 uppercase tracking-wider mb-1">
                    Base Price (INR)
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border-brand text-xs focus:outline-none focus:border-primary font-mono"
                    placeholder="e.g. 600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-dark/60 uppercase tracking-wider mb-1">
                    Food Tag
                  </label>
                  <div className="flex gap-2 mt-1.5">
                    <label className="flex items-center gap-1 font-semibold cursor-pointer">
                      <input
                        type="radio"
                        checked={formIsVeg === true}
                        onChange={() => setFormIsVeg(true)}
                        className="text-primary"
                      />
                      <span>Veg</span>
                    </label>
                    <label className="flex items-center gap-1 font-semibold cursor-pointer">
                      <input
                        type="radio"
                        checked={formIsVeg === false}
                        onChange={() => setFormIsVeg(false)}
                        className="text-primary"
                      />
                      <span>Non-Veg</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-dark/60 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-brand text-xs focus:outline-none focus:border-primary resize-none"
                  placeholder="Ingredients and prep notes..."
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold transition-all shadow cursor-pointer text-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-accent" />
                Add Product to Catalog
              </button>
            </form>
          </div>

          {/* Catalog Listing Table */}
          <div className="lg:col-span-8 bg-white border border-border-brand rounded-2xl p-5 shadow-xs space-y-4 ornate-border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="font-serif text-base font-bold text-primary">
                Product Database
              </h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Filter name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-border-brand text-xs focus:outline-none focus:border-primary w-full sm:max-w-xs"
                />
              </div>
            </div>

            {loadingProducts ? (
              <div className="text-center py-20">
                <div className="w-8 h-8 border-3 border-accent border-t-primary rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-text-dark/50">Loading products database from Supabase...</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-border-brand bg-bg-cream/40 font-bold text-text-dark sticky top-0 z-10">
                      <th className="p-3">Delicacy Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Veg/Non</th>
                      <th className="p-3 text-center">Stock</th>
                      <th className="p-3">Base Price (INR)</th>
                      <th className="p-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-brand/50">
                    {filteredProducts.map((p) => {
                      const isAvailable = p.inStock !== false;
                      return (
                        <tr key={p.id} className="hover:bg-bg-cream/20">
                          <td className="p-3">
                            <span className="font-bold text-text-dark block">{p.name}</span>
                            <span className="text-[10px] text-text-dark/45 font-mono block max-w-[200px] truncate" title={p.description}>
                              {p.description}
                            </span>
                          </td>
                          <td className="p-3 capitalize text-text-dark/75">{p.category.replace("-", " ")}</td>
                          <td className="p-3">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${p.isVeg ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"}`}>
                              {p.isVeg ? "VEG" : "NON-VEG"}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleToggleStock(p.id, p.inStock)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer border ${
                                isAvailable
                                  ? "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                                  : "bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                              }`}
                            >
                              {isAvailable ? "In Stock" : "Out of Stock"}
                            </button>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-text-dark/50">₹</span>
                              <input
                                type="number"
                                defaultValue={p.basePriceINR}
                                onBlur={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val) && val > 0 && val !== p.basePriceINR) {
                                    handleSaveProductPrice(p.id, val);
                                  }
                                }}
                                className="w-16 px-1.5 py-1 border border-border-brand rounded font-mono font-bold text-center focus:outline-none focus:border-primary"
                              />
                              <span className="text-[10px] text-text-dark/45 font-sans">/{p.unit}</span>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="text-text-dark/30 hover:text-red-700 p-1.5 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
