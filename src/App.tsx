/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';

function Counter({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    const controls = animate(count, value, { duration: 2.5, ease: "easeOut" });
    return () => controls.stop();
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

import { 
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Instagram,
  Facebook,
  Youtube,
  Zap,
  X,
  ExternalLink
} from 'lucide-react';

const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('drive.google.com')) {
    let id = '';
    if (url.includes('/d/')) {
      id = url.split('/d/')[1].split('/')[0];
    } else if (url.includes('id=')) {
      id = url.split('id=')[1].split('&')[0];
    }
    return id ? `https://drive.google.com/uc?export=view&id=${id}` : url;
  }
  return url;
};

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 299));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-[#ffc145] text-black py-1.5 overflow-hidden border-b border-black/10 shadow-[0_4px_20px_rgba(255,193,69,0.3)] sticky top-0 z-[60]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3 md:gap-6">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Zap className="w-3 h-3 md:w-4 md:h-4 fill-black" />
          </motion.div>
          <span className="text-[9px] md:text-xs font-black tracking-widest uppercase italic font-display">
            ¡ULTIMOS CUPOS DISPONIBLES! CIERRE DE PROMOCIÓN EN:
          </span>
        </div>
        
        <div className="flex items-center gap-1 font-mono font-black text-sm md:text-lg">
          <span className="bg-black text-[#ffc145] px-2 py-0.5 rounded-md min-w-[32px] md:min-w-[40px] text-center">
            {minutes.toString().padStart(2, '0')}
          </span>
          <span className="animate-pulse text-black">:</span>
          <span className="bg-black text-[#ffc145] px-2 py-0.5 rounded-md min-w-[32px] md:min-w-[40px] text-center">
            {seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}

const FAQItem = ({ question, answer, emoji }: { question: string, answer: string, emoji: string, key?: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#111318] hover:bg-[#161a22] transition-colors p-4 md:p-5 rounded-xl border border-white/5 flex items-start gap-3 text-left group"
      >
        <span className="shrink-0 text-white mt-1 group-hover:rotate-12 transition-transform duration-300">
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </span>
        <div className="flex-grow">
          <h4 className="text-sm md:text-base font-black text-white flex items-center gap-2">
            <span>{emoji}</span> {question}
          </h4>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="mt-3 text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                  {answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    </div>
  );
};

function ProductCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative group mb-5 rounded-xl overflow-hidden aspect-video bg-black/40 border border-white/5">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={getImageUrl(images[index])}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
      
      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={prev}
          className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white border border-white/10 hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        <button 
          onClick={next}
          className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white border border-white/10 hover:bg-black/70 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <div 
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-white w-4' : 'bg-white/20'}`} 
          />
        ))}
      </div>
    </div>
  );
}

function DescriptionModal({ title, text, onClose }: { title: string, text: string, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111318] border border-white/10 rounded-2xl w-full max-w-lg p-6 md:p-8 relative shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 rounded-full p-2 transition-colors">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl md:text-2xl font-black text-white mb-6 pr-8 uppercase tracking-wide font-display">{title}</h3>
        <div className="text-slate-300 space-y-3 whitespace-pre-wrap text-sm md:text-base max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {text}
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [category, setCategory] = useState<'apps' | 'tv'>('apps');
  const [activeDescription, setActiveDescription] = useState<{title: string, text: string} | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [social, setSocial] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://127.0.0.1:5001/api' : '/api';
    
    // Fetch all data
    Promise.all([
      fetch(`${apiBase}/products`).then(res => res.json()),
      fetch(`${apiBase}/testimonials`).then(res => res.json()),
      fetch(`${apiBase}/faqs`).then(res => res.json()),
      fetch(`${apiBase}/social`).then(res => res.json())
    ]).then(([productsData, testimonialsData, faqsData, socialData]) => {
      setProducts(productsData);
      setTestimonials(testimonialsData);
      setFaqs(faqsData);
      setSocial(socialData);
      setIsLoading(false);
    }).catch(err => {
      console.error('Error fetching data:', err);
      setIsLoading(false);
    });
  }, []);

  const filteredProducts = products.filter(p => p.category === category);

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-blue-500 selection:text-white">

<CountdownTimer />

      {/* Hero Section */}
      <section 
        id="inicio" 
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat h-screen min-h-[600px] flex flex-col items-center"
        style={{ backgroundImage: 'url("/images/hero.jpg")' }}
      >
        <div className="absolute inset-0 bg-black/60" />
 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center justify-start lg:justify-between h-full w-full pt-4 md:pt-6 lg:pt-4 pb-4 md:pb-8 lg:pb-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-start flex-grow w-full"
          >
             {/* Logo */}
             <motion.img 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 200 }}
               src="/images/logo.png" 
               alt="Logo" 
               className="h-28 sm:h-32 md:h-24 lg:h-28 w-auto object-contain mb-0 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
             />

            <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-[42px] font-black text-white mb-1 md:mb-2 tracking-tight leading-[1.2] w-full max-w-[95%] md:max-w-5xl mx-auto uppercase drop-shadow-2xl font-display text-balance">
               Desarrollamos tu aplicación reproductor de iptv, 
               <span className="block mt-0 md:mt-1 text-lg sm:text-xl md:text-2xl lg:text-[28px] font-medium text-slate-200">
                 Aplicaciones modernas multi DNS.
               </span>
             </h1>
             
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="relative overflow-hidden bg-[#2a68f5] hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-xs md:text-sm font-black uppercase tracking-widest transition-all shadow-2xl shadow-blue-600/40 mb-2 md:mb-4"
             >
               <span className="relative z-10">Apps personalizadas con tú marca y logotipo</span>
               <motion.div
                 initial={{ x: '-100%', opacity: 0 }}
                 animate={{ x: '200%', opacity: [0, 0.5, 0] }}
                 transition={{
                   repeat: Infinity,
                   duration: 1.5,
                   repeatDelay: 2.5,
                   ease: "easeInOut"
                 }}
                 className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-[20deg]"
               />
             </motion.button>
 
             {/* Stats */}
             <div className="flex flex-wrap justify-center gap-3 mb-2 md:mb-4">
               <div className="bg-[#111111]/15 backdrop-blur-md border border-white/5 rounded-[20px] p-3 md:p-4 min-w-[120px] md:min-w-[140px] shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
                 <div className="text-xl md:text-2xl font-black text-white mb-0.5 tracking-tighter">
                   <Counter value={1381} />
                 </div>
                 <div className="text-[8px] md:text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black">Visitas</div>
               </div>
               <div className="bg-[#111111]/15 backdrop-blur-md border border-white/5 rounded-[20px] p-3 md:p-4 min-w-[120px] md:min-w-[140px] shadow-[0_15px_40_rgba(0,0,0,0.4)]">
                 <div className="text-xl md:text-2xl font-black text-white mb-0.5 tracking-tighter">
                   <Counter value={1656} />
                 </div>
                 <div className="text-[8px] md:text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black">Compras</div>
               </div>
             </div>
 
             {/* Devices Image */}
             <motion.div
               initial={{ opacity: 0, y: 80 }}
               animate={{ 
                 opacity: 1, 
                 y: [0, -15, 0],
               }}
               transition={{ 
                 opacity: { delay: 0.5, duration: 1.2 },
                 y: {
                   duration: 4,
                   repeat: Infinity,
                   ease: "easeInOut"
                 }
               }}
               className="relative w-10/12 max-w-md lg:max-w-2xl mx-auto pointer-events-none mt-1 md:mt-2 mb-1"
             >
               <img 
                 src="/images/img2.png" 
                 alt="Dispositivos" 
                 className="w-full h-auto max-h-[20vh] lg:max-h-[28vh] object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.9)]"
                 referrerPolicy="no-referrer"
               />
             </motion.div>
 
             {/* Payments Brands - Local Banner */}
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 1, duration: 1 }}
               className="-mt-2 md:mt-0 mb-4 px-4 w-full max-w-4xl mx-auto flex justify-center"
             >
               <img 
                 src="/images/pagos3.png" 
                 alt="Métodos de Pago" 
                 className="w-10/12 md:w-full max-w-[280px] md:max-w-md h-auto object-contain drop-shadow-[0_0_20px_rgba(255,193,69,0.2)]"
               />
             </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Products Section */}
      <section className="bg-black py-12 px-4 shadow-inner">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-white/20 rounded-sm border border-white/30" />
              </div>
              <h2 className="text-lg md:text-xl font-black text-white tracking-tight uppercase font-display">NUESTROS SERVICIOS</h2>
            </div>
            
            {/* Category Tabs */}
            <div className="flex p-1 bg-[#111318] rounded-full border border-white/5 w-full max-w-md mx-auto">
              <button 
                onClick={() => setCategory('apps')}
                className={`flex-1 py-3 px-4 rounded-full text-sm font-black uppercase tracking-wider transition-all duration-300 ${category === 'apps' ? 'bg-[#1b5dfc] text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                📱 Aplicaciones
              </button>
              <button 
                onClick={() => setCategory('tv')}
                className={`flex-1 py-3 px-4 rounded-full text-sm font-black uppercase tracking-wider transition-all duration-300 ${category === 'tv' ? 'bg-[#ffc145] text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                📺 TV Digital
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
            >
              {isLoading ? (
                <div className="col-span-full py-20 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Cargando servicios...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-[#111318] rounded-3xl border border-white/5">
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No hay servicios disponibles en esta categoría</p>
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <motion.div 
                    key={p._id}
                    className="bg-[#111318] rounded-[24px] p-4 md:p-5 border border-white/5 shadow-2xl flex flex-col h-full"
                  >
                    <h3 className="text-xl md:text-2xl font-black text-white text-center mb-4 uppercase tracking-normal font-display">{p.title}</h3>
                    <ProductCarousel images={p.images} />
                    <div className="space-y-2.5 mt-auto">
                      {p.demoLink && (
                        <motion.a 
                          href={p.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }} 
                          whileTap={{ scale: 0.98 }} 
                          className="w-full bg-[#1b5dfc] hover:bg-blue-600 text-white font-black py-3 rounded-full uppercase tracking-widest text-[13px] shadow-lg shadow-blue-600/20 flex items-center justify-center"
                        >
                          DEMO APK
                        </motion.a>
                      )}
                      <motion.button 
                        onClick={() => setActiveDescription({ title: p.title, text: p.description })} 
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }} 
                        className="w-full bg-[#1e2128] hover:bg-[#252a33] text-white font-black py-3 rounded-full uppercase tracking-widest text-[13px] border border-white/5"
                      >
                        VER DESCRIPCIÓN
                      </motion.button>
                      <motion.a 
                        href={`https://wa.me/51927752700?text=Hola,%20deseo%20comprar%20${encodeURIComponent(p.title)}%20por%20(${p.priceUSD}$%20-%20S/%20${p.pricePEN})`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }} 
                        className="w-full bg-[#ffc145] hover:bg-[#ffb31c] text-black font-black py-3 rounded-full uppercase tracking-widest text-[13px] shadow-lg shadow-yellow-500/20 flex items-center justify-center"
                      >
                        COMPRAR ({p.priceUSD}$ - S/ {p.pricePEN})
                      </motion.a>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
  
      {/* Testimonials Section */}
      <section className="bg-[#0a0c10] py-12 md:py-20 overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white text-center uppercase tracking-[0.2em] italic drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] font-display">
            TESTIMONIOS
          </h2>
        </div>
        
        <div className="relative flex overflow-hidden group">
          <motion.div 
            className="flex gap-4 md:gap-6 shrink-0 py-4"
            animate={{
              x: ["0%", "-50%"]
            }}
            transition={{
              duration: 25,
              ease: "linear",
              repeat: Infinity
            }}
          >
            {/* Repetimos varias veces para que siempre llene la pantalla aunque sean pocos */}
            {[...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <div key={`${t._id || i}-${i}`} className="w-[130px] md:w-[180px] shrink-0 rounded-[24px] overflow-hidden border border-white/10 shadow-2xl transition-transform hover:scale-105 hover:z-10 group-hover:duration-500">
                 <img 
                   src={getImageUrl(t.imageUrl)} 
                   alt="Testimonio" 
                   className="w-full h-auto object-cover"
                   referrerPolicy="no-referrer"
                 />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#0a0c10] py-12 md:py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-black text-white text-center mb-10 md:mb-16 uppercase tracking-[0.1em] drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] font-display">
            PREGUNTAS FRECUENTES
          </h2>

          <div className="space-y-2">
            {faqs.map((f: any) => (
              <FAQItem 
                key={f._id}
                emoji={f.emoji}
                question={f.question}
                answer={f.answer}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-5">
            <motion.a 
              href={social?.facebook || "#"} 
              target="_blank"
              whileHover={{ y: -3, scale: 1.1 }} 
              className="w-10 h-10 rounded-full bg-[#111318] border border-white/5 flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </motion.a>
            <motion.a 
              href={social?.instagram || "#"} 
              target="_blank"
              whileHover={{ y: -3, scale: 1.1 }} 
              className="w-10 h-10 rounded-full bg-[#111318] border border-white/5 flex items-center justify-center text-slate-400 hover:text-pink-500 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </motion.a>
            <motion.a 
              href={social?.youtube || "#"} 
              target="_blank"
              whileHover={{ y: -3, scale: 1.1 }} 
              className="w-10 h-10 rounded-full bg-[#111318] border border-white/5 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </motion.a>
            <motion.a 
              href={social?.tiktok || "#"} 
              target="_blank"
              whileHover={{ y: -3, scale: 1.1 }} 
              className="w-10 h-10 rounded-full bg-[#111318] border border-white/5 flex items-center justify-center text-slate-400 hover:text-[#00f2ea] transition-colors"
            >
              {/* TikTok Custom SVG */}
              <svg 
                className="w-5 h-5 fill-current" 
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-1.26-.88-2.22-2.19-2.68-3.64-.03 2.53-.01 5.07-.02 7.6-.02 1.5-.18 3.54-2.15 4.63-1.63 1.05-3.83.67-5.18-.75-1.39-1.55-1.12-4.13.56-5.46 1.34-1.09 3.32-1.08 4.67.12.01-1.4.01-2.8 0-4.2-1.84-.57-3.95-.57-5.5.58-2.6 1.83-2.6 6.01.2 8.01 1.72 1.3 4.25 1.15 5.75-.43 1.01-1.01 1.34-2.58 1.31-4.04V.02z" />
              </svg>
            </motion.a>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs md:text-sm text-slate-500 font-medium tracking-wider">
              © 2026 REBRADING-HM Peru · Todos los derechos reservados
            </p>
            <p className="text-slate-400 text-xs font-bold hover:text-white transition-colors">
              rebrandigapk.hm@gmail.com
            </p>
          </div>
        </div>
      </footer>

      <motion.a 
        href="https://wa.me/51927752700?text=Hola,%20me%20interesa%20obtener%20más%20información%20sobre%20el%20servicio%20de%20REBRANDING-HM"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl shadow-green-500/40 z-[100] group flex items-center justify-center"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-slate-900 px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity border border-slate-200 pointer-events-none whitespace-nowrap shadow-xl">
          ¿Necesitas ayuda? ¡Contáctanos!
        </span>
      </motion.a>

      <AnimatePresence>
        {activeDescription && (
          <DescriptionModal 
            title={activeDescription.title} 
            text={activeDescription.text} 
            onClose={() => setActiveDescription(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
