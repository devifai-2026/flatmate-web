import { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, ArrowLeft, MoreVertical, Image, Mic, Video, Check, CheckCheck, Ban, User, MapPin, Plus, Users, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { fetchConversations, fetchMessages, sendMessage, setActiveConversation, addMessage, markMessagesRead } from '../redux/slices/chatSlice';
import { getAvatar } from '../utils/constants';
import useSocket from '../hooks/useSocket';
import api from '../services/api';

// Tick component
function Ticks({ status, isMe }) {
  if (!isMe) return null;
  if (status === 'read') return <CheckCheck size={14} className="text-blue-500" />;
  if (status === 'delivered') return <CheckCheck size={14} className="text-muted/50" />;
  return <Check size={14} className="text-muted/50" />;
}

// Time formatter
function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Typing dots animation
function TypingIndicator() {
  return (
    <div className="flex justify-start mb-1.5">
      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm border border-dark/5 flex items-center gap-1">
        <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-muted/50 rounded-full" />
        <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }} className="w-1.5 h-1.5 bg-muted/50 rounded-full" />
        <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }} className="w-1.5 h-1.5 bg-muted/50 rounded-full" />
      </div>
    </div>
  );
}

export default function Chat() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const { conversations, messages, messagePagination, activeConversation, loading } = useSelector((s) => s.chat);
  const [text, setText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatSearch, setChatSearch] = useState('');
  const [loadingOlder, setLoadingOlder] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesTopRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [searchParams] = useSearchParams();

  useEffect(() => { dispatch(fetchConversations()); }, [dispatch]);

  // Auto-open conversation from query param (e.g. /chat?conv=abc123)
  useEffect(() => {
    const convId = searchParams.get('conv');
    if (convId && conversations.length > 0 && !activeConversation) {
      const conv = conversations.find((c) => c._id === convId);
      if (conv) {
        selectConversation(conv);
      } else {
        // Conversation exists but not in list yet — set directly
        dispatch(setActiveConversation(convId));
        dispatch(fetchMessages({ conversationId: convId }));
        setMobileShowChat(true);
      }
    }
  }, [searchParams, conversations]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversation]);

  // ── Socket: global listener (doesn't depend on activeConversation) ──
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = ({ conversationId, message }) => {
      // Instantly add to Redux
      dispatch(addMessage({ conversationId, message }));

      // Update conversation list — just re-fetch once (lightweight)
      dispatch(fetchConversations());
    };

    const handleMessagesRead = ({ conversationId }) => {
      // Update tick status — mark all messages in this convo as read
      dispatch(markMessagesRead({ conversationId }));
    };

    const handleMessageStatus = ({ conversationId }) => {
      dispatch(fetchMessages({ conversationId }));
    };

    // When recipient comes online, their pending messages get marked delivered
    const handleMessagesDelivered = ({ conversationId }) => {
      dispatch(fetchMessages({ conversationId }));
      dispatch(fetchConversations());
    };

    const handleSocketError = ({ message }) => {
      toast.error(message || 'Something went wrong');
    };

    const handleProfanityWarning = ({ warning }) => {
      toast(warning, { icon: '⚠️', duration: 5000, style: { background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', fontWeight: 600, fontSize: '13px' } });
    };

    socket.on('new-message', handleNewMessage);
    socket.on('messages-read', handleMessagesRead);
    socket.on('message-status', handleMessageStatus);
    socket.on('messages-delivered', handleMessagesDelivered);
    socket.on('error', handleSocketError);
    socket.on('profanity-warning', handleProfanityWarning);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('messages-read', handleMessagesRead);
      socket.off('message-status', handleMessageStatus);
      socket.off('messages-delivered', handleMessagesDelivered);
      socket.off('error', handleSocketError);
      socket.off('profanity-warning', handleProfanityWarning);
    };
  }, [socket, dispatch]);

  // ── Socket: per-conversation listeners (typing, join/leave room, auto-read) ──
  useEffect(() => {
    if (!socket || !activeConversation) return;

    socket.emit('join-conversation', { conversationId: activeConversation });
    // Immediately mark as read when opening a conversation
    api.put(`/chat/${activeConversation}/read`).catch(() => {});
    socket.emit('mark-read', { conversationId: activeConversation });

    const handleNewMessageAutoRead = ({ conversationId }) => {
      // If message arrives in the conversation we're viewing, mark read instantly
      if (conversationId === activeConversation) {
        api.put(`/chat/${conversationId}/read`).catch(() => {});
        socket.emit('mark-read', { conversationId });
      }
    };

    const handleTyping = ({ conversationId, userId }) => {
      if (conversationId === activeConversation && userId !== user?._id) {
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
      }
    };

    const handleStopTyping = ({ conversationId, userId }) => {
      if (conversationId === activeConversation && userId !== user?._id) {
        setIsTyping(false);
      }
    };

    socket.on('new-message', handleNewMessageAutoRead);
    socket.on('user-typing', handleTyping);
    socket.on('user-stop-typing', handleStopTyping);

    return () => {
      socket.off('new-message', handleNewMessageAutoRead);
      socket.off('user-typing', handleTyping);
      socket.off('user-stop-typing', handleStopTyping);
      socket.emit('leave-conversation', { conversationId: activeConversation });
      setIsTyping(false);
    };
  }, [socket, activeConversation, user?._id]);

  const selectConversation = (conv) => {
    dispatch(setActiveConversation(conv._id));
    dispatch(fetchMessages({ conversationId: conv._id }));
    setMobileShowChat(true);
    setIsTyping(false);
    api.put(`/chat/${conv._id}/read`).catch(() => {});
    if (socket) socket.emit('mark-read', { conversationId: conv._id });
  };

  // ── Typing emission with debounce ──
  const typingEmitRef = useRef(null);
  const handleTextChange = (e) => {
    setText(e.target.value);
    if (!socket || !activeConversation) return;
    // Emit typing, debounced
    if (!typingEmitRef.current) {
      socket.emit('typing', { conversationId: activeConversation });
    }
    clearTimeout(typingEmitRef.current);
    typingEmitRef.current = setTimeout(() => {
      typingEmitRef.current = null;
    }, 1000);
  };

  // ── Send message via socket (instant) with REST fallback ──
  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !activeConversation) return;
    const msgText = text.trim();
    setText('');

    if (socket?.connected) {
      // Send via socket for instant delivery
      socket.emit('send-message', { conversationId: activeConversation, text: msgText });
      socket.emit('stop-typing', { conversationId: activeConversation });
    } else {
      // Fallback to REST
      dispatch(sendMessage({ conversationId: activeConversation, text: msgText }));
    }
  };

  // ── Send live location (GPS) ──
  const handleSendLiveLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    toast.loading('Getting your location...', { id: 'loc' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.dismiss('loc');
        const { latitude, longitude } = pos.coords;
        api.post(`/chat/${activeConversation}/messages`, {
          text: '',
          mediaType: 'location',
          location: { lat: latitude, lng: longitude, label: 'Live Location' },
        }).then(() => {
          dispatch(fetchMessages({ conversationId: activeConversation }));
          toast.success('Live location shared');
        }).catch(() => toast.error('Failed to send location'));
      },
      () => { toast.dismiss('loc'); toast.error('Location access denied'); },
      { enableHighAccuracy: true }
    );
  };

  // ── Share Google Maps link ──
  const handleShareMapLink = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    toast.loading('Getting your location...', { id: 'loc' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.dismiss('loc');
        const { latitude, longitude } = pos.coords;
        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        api.post(`/chat/${activeConversation}/messages`, {
          text: mapUrl,
          mediaType: 'location',
          location: { lat: latitude, lng: longitude, label: 'Google Maps Pin' },
        }).then(() => {
          dispatch(fetchMessages({ conversationId: activeConversation }));
          toast.success('Map link shared');
        }).catch(() => toast.error('Failed to send'));
      },
      () => { toast.dismiss('loc'); toast.error('Location access denied'); },
      { enableHighAccuracy: true }
    );
  };

  // ── Attachment popup + media upload ──
  const [showAttach, setShowAttach] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleMediaUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setShowAttach(false);

    // Convert to base64 data URL for demo (in production use S3/Cloudinary upload)
    const reader = new FileReader();
    reader.onload = () => {
      api.post(`/chat/${activeConversation}/messages`, {
        text: '',
        mediaType: type,
        mediaUrl: reader.result,
      }).then(() => {
        dispatch(fetchMessages({ conversationId: activeConversation }));
      }).catch(() => toast.error(`Failed to send ${type}`));
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // reset input
  };

  const handleVoiceRecord = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => { audioChunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          api.post(`/chat/${activeConversation}/messages`, {
            text: '',
            mediaType: 'audio',
            mediaUrl: reader.result,
          }).then(() => {
            dispatch(fetchMessages({ conversationId: activeConversation }));
            toast.success('Voice sent');
          }).catch(() => toast.error('Failed to send audio'));
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setIsRecording(true);
      toast('Recording... tap mic again to stop', { icon: '🎙️' });
    } catch {
      toast.error('Microphone access denied');
    }
  };

  const handleBlock = async (userId) => {
    try {
      await api.post('/chat/block', { userId });
      toast.success('User blocked');
      setShowMenu(false);
      dispatch(fetchConversations());
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleUnblock = async (userId) => {
    try {
      await api.post('/chat/unblock', { userId });
      toast.success('User unblocked');
      setShowMenu(false);
      dispatch(fetchConversations());
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const activeMessages = messages[activeConversation] || [];
  const activePag = messagePagination[activeConversation];
  const activeConv = conversations.find((c) => c._id === activeConversation);
  const getOther = (conv) => conv?.participants?.find((p) => p._id !== user?._id);
  const isGroupChat = (conv) => conv?.isGroup;

  // Load older messages on scroll up
  const loadOlderMessages = useCallback(() => {
    if (!activeConversation || !activePag || loadingOlder) return;
    if (activePag.page >= activePag.pages) return; // no more pages
    setLoadingOlder(true);
    const nextPage = activePag.page + 1;
    dispatch(fetchMessages({ conversationId: activeConversation, page: nextPage, prepend: true }))
      .finally(() => setLoadingOlder(false));
  }, [activeConversation, activePag, loadingOlder, dispatch]);

  const hasOlderMessages = activePag ? activePag.page < activePag.pages : false;

  // Filter conversations by search
  const filteredConversations = chatSearch.trim()
    ? conversations.filter((conv) => {
        const isGroup = conv?.isGroup;
        const name = isGroup ? (conv.groupName || conv.team?.name || '') : (getOther(conv)?.name || getOther(conv)?.phone || '');
        return name.toLowerCase().includes(chatSearch.toLowerCase());
      })
    : conversations;

  // Group messages by date
  const groupedMessages = activeMessages.reduce((groups, msg) => {
    const date = formatDate(msg.createdAt);
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-0 sm:px-4 lg:px-8 py-0 sm:py-6">
        <div className="bg-white sm:rounded-2xl shadow-sm border-0 sm:border border-dark/6 overflow-hidden" style={{ height: 'calc(100dvh - 64px)' }}>
          <div className="flex h-full">

            {/* ═══ LEFT: Conversation List ═══ */}
            <div className={`w-full sm:w-80 border-r border-dark/6 flex flex-col ${mobileShowChat ? 'hidden sm:flex' : 'flex'}`}>
              <div className="px-4 py-3 border-b border-dark/6 bg-surface space-y-2">
                <h2 className="font-extrabold text-dark text-base">Chats</h2>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input value={chatSearch} onChange={(e) => setChatSearch(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-dark/8 text-xs outline-none focus:border-primary/30 transition-colors" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-4 space-y-3">
                    {[0,1,2,3,4].map((i) => (
                      <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-11 h-11 rounded-full bg-dark/5" />
                        <div className="flex-1 space-y-2 py-1"><div className="h-3.5 bg-dark/5 rounded w-2/3" /><div className="h-3 bg-dark/5 rounded w-1/2" /></div>
                      </div>
                    ))}
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle size={32} className="text-muted/30 mx-auto mb-2" />
                    <p className="text-sm text-muted">{chatSearch ? 'No matches found' : 'No conversations yet'}</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const isGroup = isGroupChat(conv);
                    const other = getOther(conv);
                    const avatar = isGroup ? null : getAvatar(other?._id, other?.profileImage);
                    const displayName = isGroup ? (conv.groupName || conv.team?.name || 'Team') : (other?.name || other?.phone || 'User');
                    const isActive = activeConversation === conv._id;
                    const hasUnread = conv.unreadCount > 0;
                    return (
                      <button key={conv._id} onClick={() => selectConversation(conv)}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer text-left border-b border-dark/3 ${
                          isActive ? 'bg-primary/5' : 'hover:bg-surface'}`}>
                        <div className="relative flex-shrink-0">
                          {isGroup ? (
                            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users size={20} className="text-primary" />
                            </div>
                          ) : (
                            <img src={avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm truncate ${hasUnread ? 'font-bold text-dark' : 'font-medium text-dark'}`}>{displayName}</p>
                            <span className="text-[10px] text-muted flex-shrink-0">{conv.lastMessage?.sentAt ? formatTime(conv.lastMessage.sentAt) : ''}</span>
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <p className={`text-xs truncate ${hasUnread ? 'text-dark font-medium' : 'text-muted'}`}>
                              {conv.lastMessage?.sender?.toString() === user?._id && <span className="text-muted">You: </span>}
                              {conv.lastMessage?.text || 'No messages'}
                            </p>
                            {hasUnread && (
                              <span className="min-w-[18px] h-[18px] bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 flex-shrink-0 ml-1">
                                {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* ═══ RIGHT: Chat Area ═══ */}
            <div className={`flex-1 flex flex-col ${!mobileShowChat ? 'hidden sm:flex' : 'flex'}`}>
              {!activeConversation ? (
                <div className="flex-1 flex items-center justify-center bg-surface/50">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle size={32} className="text-primary/30" />
                    </div>
                    <p className="text-dark font-semibold">Select a conversation</p>
                    <p className="text-xs text-muted mt-1">Choose from your existing chats</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="px-4 py-2.5 border-b border-dark/6 bg-surface flex items-center gap-3">
                    <button onClick={() => setMobileShowChat(false)} className="sm:hidden p-1 cursor-pointer">
                      <ArrowLeft size={20} className="text-dark" />
                    </button>

                    {isGroupChat(activeConv) ? (
                      /* Group chat header */
                      <button onClick={() => navigate('/teams')} className="flex items-center gap-3 flex-1 cursor-pointer">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users size={18} className="text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-dark text-sm">{activeConv?.groupName || activeConv?.team?.name || 'Team'}</p>
                          <p className="text-[10px] text-muted">{activeConv?.participants?.length || 0} members</p>
                        </div>
                      </button>
                    ) : (
                      /* 1-on-1 chat header */
                      <button onClick={() => navigate(`/profile/${getOther(activeConv)?._id}`)} className="flex items-center gap-3 flex-1 cursor-pointer">
                        <img src={getAvatar(getOther(activeConv)?._id, getOther(activeConv)?.profileImage)} alt="" className="w-9 h-9 rounded-full object-cover" />
                        <div className="text-left">
                          <p className="font-semibold text-dark text-sm">{getOther(activeConv)?.name || getOther(activeConv)?.phone}</p>
                          <p className="text-[10px] text-muted">{getOther(activeConv)?.city || 'Tap to view profile'}</p>
                        </div>
                      </button>
                    )}

                    {/* Menu — only for 1-on-1 chats */}
                    {!isGroupChat(activeConv) && (
                      <div className="relative">
                        <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-dark/5 rounded-lg cursor-pointer">
                          <MoreVertical size={18} className="text-muted" />
                        </button>
                        <AnimatePresence>
                          {showMenu && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                                className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-dark/6 py-1 z-50">
                                <button onClick={() => { navigate(`/profile/${getOther(activeConv)?._id}`); setShowMenu(false); }}
                                  className="w-full px-3 py-2 text-left text-sm text-dark hover:bg-surface flex items-center gap-2 cursor-pointer">
                                  <User size={14} /> View Profile
                                </button>
                                {activeConv?.isBlocked ? (
                                  <button onClick={() => handleUnblock(getOther(activeConv)?._id)}
                                    className="w-full px-3 py-2 text-left text-sm text-dark hover:bg-surface flex items-center gap-2 cursor-pointer">
                                    <Ban size={14} /> Unblock
                                  </button>
                                ) : (
                                  <button onClick={() => handleBlock(getOther(activeConv)?._id)}
                                    className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 cursor-pointer">
                                    <Ban size={14} /> Block User
                                  </button>
                                )}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <div ref={scrollContainerRef} data-scroll-container className="flex-1 overflow-y-auto px-4 py-3 bg-[#FDF8F4] relative" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='30' y='35' text-anchor='middle' font-size='10' fill='%23FF1351' opacity='0.03' font-weight='bold' font-family='sans-serif'%3EFM%3C/text%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }}
                    onScroll={(e) => {
                      // Load older messages when scrolled near the top
                      if (e.target.scrollTop < 80 && hasOlderMessages && !loadingOlder) {
                        loadOlderMessages();
                      }
                    }}>
                    {/* Loading older messages indicator */}
                    {loadingOlder && (
                      <div className="flex justify-center py-2">
                        <Loader2 size={18} className="text-primary animate-spin" />
                      </div>
                    )}
                    {hasOlderMessages && !loadingOlder && (
                      <div ref={messagesTopRef} className="flex justify-center py-2">
                        <button onClick={loadOlderMessages} className="text-[10px] text-primary font-medium px-3 py-1 rounded-full bg-white shadow-sm border border-dark/5 cursor-pointer hover:bg-primary/5 transition-colors">
                          Load older messages
                        </button>
                      </div>
                    )}
                    {Object.entries(groupedMessages).map(([date, msgs]) => (
                      <div key={date}>
                        {/* Date separator */}
                        <div className="flex justify-center my-3">
                          <span className="bg-white/80 backdrop-blur-sm text-muted text-[10px] font-medium px-3 py-1 rounded-full shadow-sm border border-dark/5">{date}</span>
                        </div>
                        {msgs.map((msg, i) => {
                          // System messages (join/leave)
                          if (msg.messageType === 'system') {
                            return (
                              <div key={msg._id || i} className="flex justify-center my-2">
                                <span className="bg-white/80 backdrop-blur-sm text-muted text-[10px] font-medium px-3 py-1 rounded-full shadow-sm border border-dark/5">
                                  {msg.text}
                                </span>
                              </div>
                            );
                          }

                          const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                          const isGroup = isGroupChat(activeConv);
                          const senderName = msg.sender?.name || 'User';

                          return (
                            <div key={msg._id || i} className={`flex mb-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                              {/* Avatar for group (not me) */}
                              {isGroup && !isMe && (
                                <img src={getAvatar(msg.sender?._id, msg.sender?.profileImage)} alt="" className="w-6 h-6 rounded-full object-cover mr-1.5 mt-auto mb-0.5 flex-shrink-0" />
                              )}
                              <div className={`max-w-[75%] relative group ${isMe ? 'order-1' : ''}`}>
                                {/* Sender name for group (not me) */}
                                {isGroup && !isMe && (
                                  <p className="text-[10px] font-semibold text-primary mb-0.5 ml-1">{senderName}</p>
                                )}
                                {/* Media */}
                                {msg.mediaType === 'image' && msg.mediaUrl && (
                                  <img src={msg.mediaUrl} alt="" className={`rounded-xl mb-1 max-w-full max-h-60 object-cover ${isMe ? 'rounded-br-sm' : 'rounded-bl-sm'}`} />
                                )}
                                {msg.mediaType === 'audio' && msg.mediaUrl && (
                                  <audio controls src={msg.mediaUrl} className="max-w-full mb-1" />
                                )}
                                {msg.mediaType === 'video' && msg.mediaUrl && (
                                  <video controls src={msg.mediaUrl} className={`rounded-xl mb-1 max-w-full max-h-60 ${isMe ? 'rounded-br-sm' : 'rounded-bl-sm'}`} />
                                )}
                                {msg.mediaType === 'location' && msg.location && (
                                  <a href={`https://www.google.com/maps?q=${msg.location.lat},${msg.location.lng}`} target="_blank" rel="noopener noreferrer"
                                    className={`block rounded-xl mb-1 overflow-hidden ${isMe ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
                                    <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${msg.location.lat},${msg.location.lng}&zoom=15&size=300x150&markers=${msg.location.lat},${msg.location.lng}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
                                      alt="Location" className="w-full h-36 object-cover"
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                    <div className={`px-3 py-2 flex items-center gap-1.5 text-xs ${isMe ? 'bg-primary text-white' : 'bg-white text-dark border border-dark/5'}`}>
                                      <MapPin size={12} /> {msg.location.label || 'Live Location'}
                                    </div>
                                  </a>
                                )}

                                {/* Text bubble */}
                                {(msg.text || msg.mediaType === 'text') && msg.mediaType !== 'location' && (
                                  <div className={`px-3 py-2 text-[13px] leading-relaxed ${
                                    isMe
                                      ? 'bg-primary text-white rounded-2xl rounded-br-sm'
                                      : 'bg-white text-dark rounded-2xl rounded-bl-sm shadow-sm border border-dark/5'
                                  }`}>
                                    {msg.text}
                                    <div className={`flex items-center gap-1 justify-end mt-0.5 ${isMe ? 'text-white/60' : 'text-muted/50'}`}>
                                      <span className="text-[9px]">{formatTime(msg.createdAt)}</span>
                                      <Ticks status={msg.status} isMe={isMe} />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                    {isTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input bar */}
                  {!isGroupChat(activeConv) && activeConv?.isBlocked ? (
                    <div className="px-4 py-3 border-t border-dark/6 bg-surface text-center text-sm text-muted">
                      This user is blocked. <button onClick={() => handleUnblock(getOther(activeConv)?._id)} className="text-primary font-semibold cursor-pointer">Unblock</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSend} className="px-3 py-2 border-t border-dark/6 bg-white flex items-center gap-1.5 relative">
                      {/* + button — opens media popup */}
                      <div className="relative">
                        <button type="button" onClick={() => setShowAttach(!showAttach)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${showAttach ? 'bg-primary text-white rotate-45' : 'bg-surface text-muted hover:bg-dark/5'}`}>
                          <Plus size={20} />
                        </button>
                        <AnimatePresence>
                          {showAttach && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setShowAttach(false)} />
                              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-12 left-0 bg-white rounded-2xl shadow-2xl border border-dark/6 p-2 z-50 w-44">
                                <label className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-surface cursor-pointer transition-colors">
                                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center"><Image size={16} className="text-primary" /></div>
                                  <span className="text-sm text-dark font-medium">Photo</span>
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleMediaUpload(e, 'image')} />
                                </label>
                                <label className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-surface cursor-pointer transition-colors">
                                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center"><Video size={16} className="text-primary" /></div>
                                  <span className="text-sm text-dark font-medium">Video</span>
                                  <input type="file" accept="video/*" className="hidden" onChange={(e) => handleMediaUpload(e, 'video')} />
                                </label>
                                <button type="button" onClick={() => { handleSendLiveLocation(); setShowAttach(false); }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-surface cursor-pointer transition-colors">
                                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center"><MapPin size={16} className="text-primary" /></div>
                                  <span className="text-sm text-dark font-medium">Live Location</span>
                                </button>
                                <button type="button" onClick={() => { handleShareMapLink(); setShowAttach(false); }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-surface cursor-pointer transition-colors">
                                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center"><MapPin size={16} className="text-primary" /></div>
                                  <span className="text-sm text-dark font-medium">Share Map Pin</span>
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Mic button */}
                      <button type="button" onClick={handleVoiceRecord}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${isRecording ? 'bg-primary text-white animate-pulse' : 'bg-surface text-muted hover:bg-dark/5'}`}>
                        <Mic size={18} />
                      </button>

                      {/* Text input */}
                      <input value={text} onChange={handleTextChange}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2.5 rounded-full bg-surface border border-dark/6 text-sm outline-none focus:border-primary/30 transition-colors" />

                      {/* Send button */}
                      <button type="submit" disabled={!text.trim()}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${text.trim() ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-dark/5 text-muted'}`}>
                        <Send size={16} />
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
