import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, ArrowDownLeft, ArrowUpRight, Coins, Calendar, Loader2, Zap, Shield, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import EmptyState from '../components/ui/EmptyState';
import { fetchBalance } from '../redux/slices/walletSlice';
import api from '../services/api';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function Wallet() {
  const dispatch = useDispatch();
  const { balance } = useSelector((s) => s.wallet);
  const { user } = useSelector((s) => s.auth);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [recharging, setRecharging] = useState(false);
  const sentinelRef = useRef(null);

  const fetchTxns = async (page = 1, append = false) => {
    if (page === 1) setLoading(true); else setLoadingMore(true);
    try {
      const params = { page, limit: 15 };
      if (typeFilter !== 'all') params.type = typeFilter;
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;
      const r = await api.get('/wallet/transactions', { params });
      const data = r.data.data;
      if (append) {
        setTransactions((prev) => {
          const ids = new Set(prev.map((t) => t._id));
          return [...prev, ...(data.transactions || []).filter((t) => !ids.has(t._id))];
        });
      } else {
        setTransactions(data.transactions || []);
      }
      setPagination(data.pagination || null);
    } catch { if (!append) setTransactions([]); }
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => { fetchTxns(); }, [typeFilter, dateFrom, dateTo]);

  const hasMore = pagination ? pagination.page < pagination.pages : false;

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    fetchTxns(pagination.page + 1, true);
  }, [hasMore, loadingMore, pagination]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !loadingMore && hasMore) loadMore(); },
      { rootMargin: '200px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, hasMore, loadingMore]);

  // ── Razorpay recharge ──
  const handleRecharge = async () => {
    setRecharging(true);
    try {
      const { data } = await api.post('/wallet/recharge');
      const order = data.data;

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'FlatMate',
        description: `Wallet Recharge — ${order.tokens} tokens`,
        order_id: order.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/wallet/recharge/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success(verifyRes.data.data.message);
            dispatch(fetchBalance());
            fetchTxns();
          } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed');
          }
        },
        prefill: { name: user?.name || '', contact: user?.phone || '' },
        theme: { color: '#FF1351' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => toast.error('Payment failed. Please try again.'));
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate recharge');
    }
    setRecharging(false);
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Balance Card ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-6 text-white shadow-2xl mb-8">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-xl" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-white/40 text-[10px] font-semibold uppercase tracking-[0.2em]">Available Balance</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-extrabold tracking-tight">{balance}</span>
                  <span className="text-white/40 text-sm font-medium">tokens</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <Coins size={24} className="text-primary" />
              </div>
            </div>

            {/* Recharge CTA */}
            <button onClick={handleRecharge} disabled={recharging}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-60 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]">
              {recharging ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Zap size={18} />
              )}
              Add 20 Tokens for ₹19
            </button>
          </div>
        </motion.div>

        {/* ── How it works ── */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Zap, title: 'Recharge', desc: '₹19 = 20 tokens' },
            { icon: Shield, title: 'Unlock', desc: '19 tokens / listing' },
            { icon: Sparkles, title: 'Connect', desc: 'Chat & call freely' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="bg-white rounded-xl p-3.5 border border-dark/5 text-center shadow-sm">
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <item.icon size={16} className="text-primary" />
              </div>
              <p className="text-xs font-bold text-dark">{item.title}</p>
              <p className="text-[10px] text-muted mt-0.5">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Transaction History ── */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-dark text-lg">Transactions</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-0.5 bg-white rounded-xl border border-dark/6 p-0.5">
            {['all', 'recharge', 'debit'].map((t) => (
              <button key={t} onClick={() => { setTransactions([]); setTypeFilter(t); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  typeFilter === t ? 'bg-primary text-white shadow-sm' : 'text-muted hover:bg-surface'
                }`}>
                {t === 'all' ? 'All' : t === 'recharge' ? 'Recharges' : 'Unlocks'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <Calendar size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
              <input type="date" value={dateFrom} onChange={(e) => { setTransactions([]); setDateFrom(e.target.value); }}
                className="pl-7 pr-2 py-1.5 text-xs rounded-lg border border-dark/8 bg-white outline-none focus:border-primary/30" />
            </div>
            <span className="text-muted text-xs">to</span>
            <input type="date" value={dateTo} onChange={(e) => { setTransactions([]); setDateTo(e.target.value); }}
              className="px-2 py-1.5 text-xs rounded-lg border border-dark/8 bg-white outline-none focus:border-primary/30" />
            {(dateFrom || dateTo) && (
              <button onClick={() => { setDateFrom(''); setDateTo(''); setTransactions([]); }}
                className="text-[10px] text-primary font-semibold cursor-pointer hover:underline">Clear</button>
            )}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[0,1,2,3].map((i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState icon={WalletIcon} title="No transactions yet" description="Recharge your wallet to unlock listings and start connecting with flatmates." />
        ) : (
          <div className="space-y-2">
            {transactions.map((txn) => (
              <motion.div key={txn._id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-white rounded-xl border border-dark/5 p-3.5 hover:shadow-sm transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  txn.type === 'recharge' ? 'bg-emerald-50 text-emerald-600' : 'bg-primary/10 text-primary'
                }`}>
                  {txn.type === 'recharge' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-dark line-clamp-1">{txn.description?.replace(/Admin bonus credit/i, 'Platform bonus')}</p>
                  <p className="text-[10px] text-muted">{formatDate(txn.createdAt)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${txn.type === 'recharge' ? 'text-emerald-600' : 'text-primary'}`}>
                    {txn.type === 'recharge' ? '+' : '-'}{txn.tokens}
                  </p>
                  {txn.type === 'recharge' && (
                    <p className="text-[10px] text-muted">₹{txn.amount}</p>
                  )}
                </div>
              </motion.div>
            ))}
            {hasMore && (
              <div ref={sentinelRef} className="flex justify-center py-4">
                {loadingMore && <Loader2 size={20} className="text-primary animate-spin" />}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
