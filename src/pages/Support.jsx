import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Plus, Send, ArrowLeft, Clock, CheckCircle, AlertCircle, Loader2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api from '../services/api';

const STATUS_COLORS = {
  open: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Open' },
  'in-progress': { bg: 'bg-amber-50', text: 'text-amber-600', label: 'In Progress' },
  resolved: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Resolved' },
  closed: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Closed' },
};

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-50 text-blue-600',
  high: 'bg-amber-50 text-amber-600',
  urgent: 'bg-red-50 text-red-600',
};

const CATEGORIES = ['account', 'listing', 'payment', 'chat', 'report', 'bug', 'other'];

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState('');
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ subject: '', description: '', category: 'other', priority: 'medium' });
  const [creating, setCreating] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchTickets = () => {
    api.get('/tickets').then((r) => setTickets(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchTickets(); }, []);

  const openTicket = async (ticket) => {
    setActiveTicket(ticket);
    try {
      const r = await api.get(`/tickets/${ticket._id}`);
      setMessages(r.data.data.messages || []);
      setActiveTicket(r.data.data.ticket);
    } catch { toast.error('Failed to load ticket'); }
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.description.trim()) return toast.error('Fill in subject and description');
    setCreating(true);
    try {
      await api.post('/tickets', form);
      toast.success('Ticket created! Our team will respond shortly.');
      setShowCreate(false);
      setForm({ subject: '', description: '', category: 'other', priority: 'medium' });
      fetchTickets();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setCreating(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    setSending(true);
    try {
      const r = await api.post(`/tickets/${activeTicket._id}/messages`, { text: msgText.trim() });
      setMessages((p) => [...p, r.data.data]);
      setMsgText('');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSending(false);
  };

  const isClosed = activeTicket?.status === 'resolved' || activeTicket?.status === 'closed';

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-dark">Help & Support</h1>
            <p className="text-sm text-muted mt-0.5">Get help from our team</p>
          </div>
          {!activeTicket && (
            <Button size="sm" onClick={() => setShowCreate(true)} className="rounded-xl gap-1.5">
              <Plus size={15} /> New Ticket
            </Button>
          )}
        </div>

        {/* Active ticket chat view */}
        {activeTicket ? (
          <div>
            <button onClick={() => { setActiveTicket(null); setMessages([]); fetchTickets(); }}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-dark mb-4 cursor-pointer">
              <ArrowLeft size={16} /> Back to tickets
            </button>

            {/* Ticket info */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-dark">{activeTicket.subject}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[activeTicket.status]?.bg} ${STATUS_COLORS[activeTicket.status]?.text}`}>
                      {STATUS_COLORS[activeTicket.status]?.label}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PRIORITY_COLORS[activeTicket.priority]}`}>
                      {activeTicket.priority}
                    </span>
                    <span className="text-[10px] text-muted capitalize bg-surface px-2 py-0.5 rounded-full">{activeTicket.category}</span>
                  </div>
                </div>
                <span className="text-[10px] text-muted">{timeAgo(activeTicket.createdAt)}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto p-4 space-y-3 bg-surface/50">
                {messages.map((msg) => {
                  const isAdmin = msg.senderRole === 'admin';
                  return (
                    <div key={msg._id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${isAdmin ? 'bg-white border border-gray-100 rounded-bl-sm' : 'bg-primary text-white rounded-br-sm'}`}>
                        <p className={`text-[10px] font-semibold mb-1 ${isAdmin ? 'text-primary' : 'text-white/60'}`}>
                          {isAdmin ? '🛡️ Support Team' : 'You'}
                        </p>
                        <p className={`text-sm leading-relaxed ${isAdmin ? 'text-dark' : 'text-white'}`}>{msg.text}</p>
                        <p className={`text-[9px] mt-1 ${isAdmin ? 'text-muted' : 'text-white/50'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {isClosed ? (
                <div className="px-4 py-3 border-t border-gray-100 text-center">
                  <p className="text-sm text-muted flex items-center justify-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-500" /> This ticket has been {activeTicket.status}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-gray-100">
                  <input value={msgText} onChange={(e) => setMsgText(e.target.value)} placeholder="Type your message..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-surface border-0 text-sm outline-none focus:ring-2 focus:ring-primary/10" />
                  <button type="submit" disabled={!msgText.trim() || sending}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all ${msgText.trim() ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-100 text-muted'}`}>
                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Ticket list */}
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />)}
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-16">
                <HelpCircle size={48} className="mx-auto text-muted/20 mb-4" />
                <h3 className="font-bold text-dark mb-1">No tickets yet</h3>
                <p className="text-sm text-muted mb-4">Having an issue? Create a support ticket and our team will help you.</p>
                <Button size="sm" onClick={() => setShowCreate(true)} className="rounded-xl gap-1.5">
                  <Plus size={15} /> Create Ticket
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <motion.button key={t._id} whileHover={{ y: -2 }} onClick={() => openTicket(t)}
                    className="w-full bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-all text-left cursor-pointer flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${t.status === 'resolved' ? 'bg-emerald-50' : t.status === 'in-progress' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                      {t.status === 'resolved' ? <CheckCircle size={18} className="text-emerald-500" /> :
                       t.status === 'in-progress' ? <Clock size={18} className="text-amber-500" /> :
                       <MessageCircle size={18} className="text-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-dark text-sm truncate">{t.subject}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[t.status]?.bg} ${STATUS_COLORS[t.status]?.text}`}>
                          {STATUS_COLORS[t.status]?.label}
                        </span>
                        <span className="text-[9px] text-muted capitalize">{t.category}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted flex-shrink-0">{timeAgo(t.createdAt)}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Create ticket modal */}
        <AnimatePresence>
          {showCreate && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowCreate(false)} />
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                className="fixed inset-x-4 bottom-4 top-auto sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-white rounded-2xl p-6 z-50 shadow-2xl">
                <h3 className="text-lg font-bold text-dark mb-4">Create Support Ticket</h3>
                <form onSubmit={handleCreate} className="space-y-4">
                  <Input label="Subject" placeholder="Brief description of your issue" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-dark">Description</label>
                    <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Explain your issue in detail..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-dark">Category</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none capitalize">
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-dark">Priority</label>
                      <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                        className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none capitalize">
                        {['low', 'medium', 'high', 'urgent'].map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowCreate(false)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-muted cursor-pointer hover:bg-gray-50">Cancel</button>
                    <Button type="submit" size="lg" className="flex-1 rounded-xl" loading={creating}>Submit Ticket</Button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
