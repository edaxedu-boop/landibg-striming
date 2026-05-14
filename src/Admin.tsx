import React, { useState } from 'react';
import { 
  Smartphone, 
  Tv, 
  Share2, 
  MessageSquare, 
  HelpCircle, 
  LogOut,
  Upload,
  Plus,
  Save,
  Pencil
} from 'lucide-react';

type Tab = 'apps' | 'tv' | 'social' | 'testimonials' | 'faq';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAdminAuth') === 'true';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState<Tab>('apps');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [priceUSD, setPriceUSD] = useState('');
  const [pricePEN, setPricePEN] = useState('');
  const [description, setDescription] = useState('');
  const [demoLink, setDemoLink] = useState('');
  const [imageUrls, setImageUrls] = useState(['', '']);
  
  // Testimonials and FAQ states
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [testimonialUrl, setTestimonialUrl] = useState('');
  
  const [faqsList, setFaqsList] = useState<any[]>([]);
  const [faqEmoji, setFaqEmoji] = useState('❓');
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Social Media states
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    youtube: '',
    tiktok: ''
  });

  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://127.0.0.1:5001/api' : '/api';

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchTestimonials();
      fetchFAQs();
      fetchSocial();
    }
  }, [isAuthenticated]);

  const fetchSocial = async () => {
    try {
      const res = await fetch(`${API_URL}/social`);
      const data = await res.json();
      setSocialLinks(data);
    } catch (err) {
      console.error('Error fetching social links:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${API_URL}/testimonials`);
      const data = await res.json();
      setTestimonialsList(data);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    }
  };

  const fetchFAQs = async () => {
    try {
      const res = await fetch(`${API_URL}/faqs`);
      const data = await res.json();
      setFaqsList(data);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdminAuth');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('isAdminAuth', 'true');
      } else {
        setLoginError(data.error || 'Correo o contraseña incorrectos.');
      }
    } catch (err) {
      setLoginError('Error de conexión al servidor.');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      title,
      priceUSD: Number(priceUSD),
      pricePEN: Number(pricePEN),
      description,
      demoLink: demoLink.trim() === '' || demoLink === 'https://' ? '' : demoLink.trim(),
      images: imageUrls.filter(url => url !== ''),
      category: activeTab
    };
    
    const url = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      if (res.ok) {
        alert(editingId ? '✅ ¡Servicio actualizado con éxito!' : '✅ ¡Servicio guardado correctamente!');
        fetchProducts();
        handleCancelEdit();
      } else {
        const errorData = await res.json();
        alert('❌ Error: ' + (errorData.error || 'No se pudo guardar'));
      }
    } catch (err) {
      console.error(err);
      alert('❌ Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (p: any) => {
    setEditingId(p._id);
    setTitle(p.title || '');
    setPriceUSD(p.priceUSD ? p.priceUSD.toString() : '');
    setPricePEN(p.pricePEN ? p.pricePEN.toString() : '');
    setDescription(p.description || '');
    setDemoLink(p.demoLink || '');
    setImageUrls(p.images && p.images.length > 0 ? p.images : ['', '']);
    setActiveTab(p.category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle(''); 
    setPriceUSD(''); 
    setPricePEN(''); 
    setDescription(''); 
    setDemoLink(''); 
    setImageUrls(['', '']);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
    
    try {
      const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialUrl) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: testimonialUrl })
      });
      if (res.ok) {
        setTestimonialUrl('');
        fetchTestimonials();
      }
    } catch (err) {
      console.error('Error saving testimonial:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('¿Eliminar testimonio?')) return;
    try {
      await fetch(`${API_URL}/testimonials/${id}`, { method: 'DELETE' });
      fetchTestimonials();
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    }
  };

  const handleSaveFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion || !faqAnswer) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/faqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji: faqEmoji, question: faqQuestion, answer: faqAnswer })
      });
      if (res.ok) {
        setFaqEmoji('❓');
        setFaqQuestion('');
        setFaqAnswer('');
        fetchFAQs();
      }
    } catch (err) {
      console.error('Error saving FAQ:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm('¿Eliminar esta pregunta?')) return;
    try {
      await fetch(`${API_URL}/faqs/${id}`, { method: 'DELETE' });
      fetchFAQs();
    } catch (err) {
      console.error('Error deleting FAQ:', err);
    }
  };

  const handleSaveSocial = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialLinks)
      });
      if (res.ok) {
        alert('Redes sociales actualizadas');
      }
    } catch (err) {
      alert('Error al guardar redes sociales');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-md w-full bg-[#111318]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2 font-display">Acceso Admin</h1>
            <p className="text-slate-400 text-sm">Ingresa tus credenciales para administrar la landing page.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center font-medium">
                {loginError}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1e2128] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="admin@admin.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1e2128] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#1b5dfc] hover:bg-blue-600 text-white font-black py-3.5 rounded-lg uppercase tracking-widest text-sm transition-all shadow-lg shadow-blue-600/30"
            >
              Ingresar al Panel
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="/" className="text-slate-500 hover:text-white text-sm transition-colors">
              ← Volver al inicio
            </a>
          </div>
        </div>
      </div>
    );
  }

  const menuItems: { id: Tab, label: string, icon: React.ReactNode }[] = [
    { id: 'apps', label: 'Subir App', icon: <Smartphone className="w-5 h-5" /> },
    { id: 'tv', label: 'Subir TV Digital', icon: <Tv className="w-5 h-5" /> },
    { id: 'social', label: 'Redes Sociales', icon: <Share2 className="w-5 h-5" /> },
    { id: 'testimonials', label: 'Testimonios', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'faq', label: 'Preguntas Frecuentes', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'apps':
      case 'tv':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="bg-[#1e2128] border border-white/5 p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" />
                {activeTab === 'apps' ? 'Subir Nueva App' : 'Subir Nueva TV Digital'}
              </h2>
              <form onSubmit={handleSaveProduct} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre del Servicio</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-[#111318] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Ej. YOUTIVI PLUSs 4 TEMAS" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Precio ($)</label>
                    <input type="number" value={priceUSD} onChange={(e) => setPriceUSD(e.target.value)} required className="w-full bg-[#111318] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="40" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Precio (S/)</label>
                    <input type="number" value={pricePEN} onChange={(e) => setPricePEN(e.target.value)} required className="w-full bg-[#111318] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="150" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Enlace DEMO APK (Dejar vacío si no tiene)</label>
                    <input type="url" value={demoLink} onChange={(e) => setDemoLink(e.target.value)} className="w-full bg-[#111318] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Descripción (Texto con Emojis)</label>
                    <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full bg-[#111318] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="🚀 NUEVA APP..."></textarea>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Links de Imágenes (Mínimo 1)</label>
                  {imageUrls.map((url, idx) => (
                    <input 
                      key={idx}
                      type="url" 
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...imageUrls];
                        newUrls[idx] = e.target.value;
                        setImageUrls(newUrls);
                      }}
                      className="w-full bg-[#111318] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" 
                      placeholder={`URL Imagen ${idx + 1}`} 
                    />
                  ))}
                  <button 
                    type="button" 
                    onClick={() => setImageUrls([...imageUrls, ''])}
                    className="text-blue-500 text-xs font-bold hover:underline"
                  >
                    + Añadir otro link de imagen
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full ${editingId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-[#1b5dfc] hover:bg-blue-600'} disabled:bg-blue-900 text-white font-black py-4 rounded-lg uppercase tracking-widest text-sm transition-all shadow-lg shadow-blue-600/30`}
                >
                  {loading ? 'Procesando...' : (editingId ? 'Actualizar Servicio' : 'Guardar en Base de Datos')}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-black py-3 rounded-lg uppercase tracking-widest text-xs transition-all mt-2"
                  >
                    Cancelar Edición
                  </button>
                )}
              </form>
            </div>

            {/* List of current products */}
            <div className="bg-[#1e2128] border border-white/5 p-6 rounded-2xl shadow-xl mt-10">
              <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6">Servicios Actuales ({activeTab})</h2>
              <div className="space-y-4">
                {products.filter(p => p.category === activeTab).length === 0 ? (
                  <p className="text-slate-500 text-center py-10">No hay servicios guardados en esta categoría.</p>
                ) : (
                  products.filter(p => p.category === activeTab).map((p) => (
                    <div key={p._id} className="bg-[#111318] p-4 rounded-xl border border-white/5 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <img src={p.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-800" />
                        <div>
                          <h4 className="text-white font-bold">{p.title}</h4>
                          <p className="text-slate-400 text-xs">{p.priceUSD}$ - S/ {p.pricePEN}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditProduct(p)}
                          className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(p._id)}
                          className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <LogOut className="w-5 h-5 rotate-180" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-[#1e2128] border border-white/5 p-6 rounded-2xl">
              <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4">Gestionar Redes Sociales</h2>
              <div className="space-y-4">
                {Object.keys(socialLinks).filter(k => k !== '_id' && k !== '__v' && k !== 'updatedAt').map((red) => (
                  <div key={red}>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Link de {red}</label>
                    <input 
                      type="url" 
                      value={socialLinks[red as keyof typeof socialLinks] || ''}
                      onChange={(e) => setSocialLinks({ ...socialLinks, [red]: e.target.value })}
                      className="w-full bg-[#111318] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors" 
                      placeholder={`https://${red.toLowerCase()}.com/tu-perfil`} 
                    />
                  </div>
                ))}
                <button 
                  onClick={handleSaveSocial}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 text-white font-black py-3.5 rounded-lg uppercase tracking-widest text-sm transition-all shadow-lg shadow-pink-500/30 mt-4 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> {loading ? 'Guardando...' : 'Guardar Enlaces'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#1e2128] border border-white/5 p-6 rounded-2xl">
              <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4">Añadir Nuevo Testimonio</h2>
              <form onSubmit={handleSaveTestimonial} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Link de la Imagen (Captura de WhatsApp)</label>
                  <input 
                    type="url" 
                    value={testimonialUrl}
                    onChange={(e) => setTestimonialUrl(e.target.value)}
                    required
                    className="w-full bg-[#111318] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors" 
                    placeholder="https://imgur.com/tu-testimonio.jpg" 
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-900 text-white font-black py-3.5 rounded-lg uppercase tracking-widest text-sm transition-all shadow-lg shadow-green-600/30">
                  {loading ? 'Añadiendo...' : 'Añadir Testimonio'}
                </button>
              </form>
            </div>

            <div className="bg-[#1e2128] border border-white/5 p-6 rounded-2xl">
              <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6">Testimonios Actuales</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {testimonialsList.length === 0 ? (
                  <p className="col-span-full text-slate-500 text-center py-6">No hay testimonios.</p>
                ) : (
                  testimonialsList.map((t) => (
                    <div key={t._id} className="relative group">
                      <img src={t.imageUrl} alt="" className="w-full aspect-square object-cover rounded-xl border border-white/5" />
                      <button 
                        onClick={() => handleDeleteTestimonial(t._id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <LogOut className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#1e2128] border border-white/5 p-6 rounded-2xl">
              <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4">Añadir Pregunta Frecuente</h2>
              <form onSubmit={handleSaveFAQ} className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-20">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Emoji</label>
                    <div className="relative">
                      <button 
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="w-full bg-[#111318] border border-white/10 rounded-lg px-2 py-3 text-center text-white focus:outline-none focus:border-yellow-500 transition-colors text-xl" 
                      >
                        {faqEmoji}
                      </button>
                      
                      {showEmojiPicker && (
                        <div className="absolute top-full left-0 mt-2 z-50 grid grid-cols-4 gap-1 bg-[#1e2128] p-2 rounded-xl border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200 w-40">
                          {['❓', '📱', '🎨', '🕒', '🌐', '💸', '🎓', '💬', '🚀', '💎', '✅', '🎁'].map(emoji => (
                            <button 
                              key={emoji}
                              type="button"
                              onClick={() => { setFaqEmoji(emoji); setShowEmojiPicker(false); }}
                              className="hover:bg-white/10 p-2 rounded-lg transition-colors text-xl"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pregunta</label>
                    <input 
                      type="text" 
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      required
                      className="w-full bg-[#111318] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" 
                      placeholder="¿Cuánto tarda la entrega?" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Respuesta</label>
                  <textarea 
                    value={faqAnswer}
                    onChange={(e) => setFaqAnswer(e.target.value)}
                    required
                    rows={3} 
                    className="w-full bg-[#111318] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors" 
                    placeholder="La entrega demora entre 2 a 4 horas..."
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-800 text-black font-black py-3.5 rounded-lg uppercase tracking-widest text-sm transition-all shadow-lg shadow-yellow-500/30">
                  {loading ? 'Guardando...' : 'Añadir Pregunta'}
                </button>
              </form>
            </div>

            <div className="bg-[#1e2128] border border-white/5 p-6 rounded-2xl">
              <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6">Preguntas Guardadas</h2>
              <div className="space-y-3">
                {faqsList.length === 0 ? (
                  <p className="text-slate-500 text-center py-6">No hay preguntas.</p>
                ) : (
                  faqsList.map((f) => (
                    <div key={f._id} className="bg-[#111318] p-4 rounded-xl border border-white/5 flex items-start justify-between group">
                      <div className="flex gap-4">
                        <span className="text-2xl">{f.emoji}</span>
                        <div>
                          <h4 className="text-white font-bold">{f.question}</h4>
                          <p className="text-slate-400 text-sm mt-1">{f.answer}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteFAQ(f._id)}
                        className="p-1.5 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <LogOut className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0c10] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111318] border-r border-white/5 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-xl font-black text-white uppercase tracking-wider font-display">Admin Panel</h1>
          <p className="text-xs text-slate-500 mt-1">Rebrand Ecuador</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSelectedFiles([]); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm tracking-wide ${
                activeTab === item.id 
                  ? 'bg-[#1b5dfc] text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-bold text-sm"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen max-w-[100vw] md:max-w-none">
        {/* Mobile Header */}
        <header className="md:hidden bg-[#111318] border-b border-white/5 p-4 flex items-center justify-between sticky top-0 z-50">
          <h1 className="text-lg font-black text-white uppercase tracking-wider font-display">Admin</h1>
          <button onClick={handleLogout} className="text-red-400 p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Mobile Nav Horizontal */}
        <nav className="md:hidden flex overflow-x-auto bg-[#111318] border-b border-white/5 p-2 gap-2 hide-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSelectedFiles([]); }}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-bold text-xs tracking-wide whitespace-nowrap ${
                activeTab === item.id 
                  ? 'bg-[#1b5dfc] text-white' 
                  : 'text-slate-400 bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <header className="mb-8 hidden md:block">
              <h2 className="text-3xl font-black text-white uppercase tracking-wider font-display">
                {menuItems.find(m => m.id === activeTab)?.label}
              </h2>
              <p className="text-slate-400 mt-2">Gestiona el contenido de tu landing page desde aquí.</p>
            </header>
            
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
