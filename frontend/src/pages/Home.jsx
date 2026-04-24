import React from 'react';

const dashboardUi = "https://res.cloudinary.com/dy5jgthmt/image/upload/v1777024288/Financial_Dashboard_Preview_f9kjzf.png";
const growthCoins = "https://res.cloudinary.com/dy5jgthmt/image/upload/v1777024553/Financial_Growth_Concept_6_oksbgn.png";

import { 
  BellIcon, 
  UserIcon, 
  CheckIcon, 
  ExpenseIcon, 
  InsightsIcon, 
  InvestingIcon 
} from './assets/Icons';

import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-background font-sans text-navy selection:bg-primary/30 relative">
      
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/5 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-emerald-400/5 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 glass border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center group cursor-pointer">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform">
                <span className="text-white font-black text-xl italic">F</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-navy group-hover:text-primary transition-colors">
                FinGrow
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-10">
              <a href="#" className="text-primary font-bold text-sm uppercase tracking-widest">Home</a>
              <a href="#" className="text-gray-500 hover:text-navy transition-colors font-semibold text-sm uppercase tracking-widest">Features</a>
              <a href="#" className="text-gray-500 hover:text-navy transition-colors font-semibold text-sm uppercase tracking-widest">Investing</a>
              <a href="#" className="text-gray-500 hover:text-navy transition-colors font-semibold text-sm uppercase tracking-widest">Pricing</a>
            </div>

            <div className="flex items-center space-x-5">
              <button className="text-gray-400 hover:text-navy transition-all hover:scale-110">
                <BellIcon />
              </button>
              <button className="w-10 h-10 rounded-xl bg-gray-100/50 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-md transition-all border border-gray-100/50">
                <UserIcon />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 lg:pt-32 lg:pb-40 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-16 lg:mb-0 fade-up">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black tracking-widest uppercase mb-8 border border-primary/20 animate-pulse">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                Simple Wealth Building
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-navy leading-[1.05] mb-8 tracking-tighter text-gradient">
                Track your money. <br />
                <span className="text-primary italic">Start investing</span> confidently.
              </h1>
              <p className="text-xl text-gray-500 mb-12 max-w-lg leading-relaxed font-medium">
                The simple, stress-free way to manage your finances. No jargon, just results.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/login" className="group px-10 py-5 bg-primary text-white font-black rounded-2xl hover:bg-green-600 transition-all shadow-xl shadow-green-200 flex items-center justify-center transform hover:-translate-y-1">
                  Get Started
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </Link>
                <button className="px-10 py-5 bg-white border-2 border-gray-100 text-navy font-bold rounded-2xl hover:border-primary/50 hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm">
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="relative fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="absolute -inset-10 bg-gradient-to-tr from-primary/20 via-blue-400/10 to-transparent rounded-[100px] blur-3xl -z-10 animate-blob"></div>
              <div className="relative group perspective-1000">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-[40px] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                <div className="relative bg-navy-dark rounded-[32px] p-2 shadow-2xl overflow-hidden ring-1 ring-white/20 transform group-hover:rotate-1 transition-transform duration-700">
                  <img 
                    src={dashboardUi} 
                    alt="FinGrow Dashboard" 
                    className="w-full rounded-[24px] shadow-2xl brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/40 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-32 bg-white/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6">
            The Platform
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-navy mb-6 tracking-tight">
            Everything you need, <br /><span className="text-primary">nothing you don’t</span>
          </h2>
          <p className="text-lg text-gray-500 mb-20 max-w-2xl mx-auto font-medium">
            We’ve stripped away the complexity of traditional finance to give you the tools that actually matter.
          </p>
          
          <div className="grid md:grid-cols-3 gap-10 text-left">
            {[
              { 
                icon: <ExpenseIcon />, 
                bg: "bg-green-50", 
                title: "Easy Expense Tracking", 
                desc: "Automatically categorize your spending and see exactly where your money goes without lifting a finger.",
                tags: ["Groceries", "Rent", "Travel"]
              },
              { 
                icon: <InsightsIcon />, 
                bg: "bg-blue-50", 
                title: "Smart Insights", 
                desc: "Personalized tips to help you save $200+ more every month based on your habits.",
                delay: "0.1s"
              },
              { 
                icon: <InvestingIcon />, 
                bg: "bg-emerald-50", 
                title: "Beginner Investing", 
                desc: "Start small with curated portfolios that match your risk level.",
                delay: "0.2s"
              }
            ].map((f, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm p-10 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all group fade-up" style={{ animationDelay: f.delay || '0s' }}>
                <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-sm`}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black text-navy mb-4 tracking-tight">{f.title}</h3>
                <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                  {f.desc}
                </p>
                {f.tags && (
                  <div className="flex flex-wrap gap-2">
                    {f.tags.map(t => (
                      <span key={t} className="px-4 py-1.5 bg-gray-50 rounded-lg text-xs font-bold text-gray-600 border border-gray-100">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MID CTA SECTION */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-[56px] overflow-hidden flex flex-col lg:flex-row shadow-2xl shadow-primary/20 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="p-12 lg:p-24 lg:w-1/2 flex flex-col justify-center items-start text-white relative z-10 fade-up">
              <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-[1.1] tracking-tighter">
                Financial freedom is a marathon, <span className="text-navy">not a sprint.</span>
              </h2>
              <p className="text-green-50 text-xl mb-12 leading-relaxed opacity-90 font-medium">
                We provide the roadmap. You provide the goals. Together, we’ll build a future you’re excited about.
              </p>
              <button className="px-10 py-5 bg-navy text-white font-black rounded-2xl hover:bg-navy-dark transition-all shadow-2xl hover:scale-105 active:scale-95">
                Start Your Journey
              </button>
            </div>
            <div className="lg:w-1/2 bg-navy relative overflow-hidden flex items-center justify-center p-12">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-10"></div>
              <img 
                src={growthCoins} 
                alt="Growth curve with coins" 
                className="w-full h-auto object-cover transform scale-110 hover:scale-125 transition-transform duration-1000 brightness-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PROGRESS SECTION */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-32 items-center">
            <div className="space-y-10 mb-20 lg:mb-0 fade-up">
              {[
                { label: "New Home Fund", val: 75, color: "bg-primary" },
                { label: "European Vacation", val: 40, color: "bg-blue-500" },
                { label: "Emergency Buffer", val: 90, color: "bg-emerald-500" }
              ].map((p, i) => (
                <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex justify-between mb-4">
                    <span className="font-black text-navy uppercase tracking-widest text-xs">{p.label}</span>
                    <span className={`font-black ${p.color.replace('bg-', 'text-')} text-sm`}>{p.val}%</span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden p-1">
                    <div className={`h-full ${p.color} rounded-full transition-all duration-1000 relative`} style={{ width: `${p.val}%` }}>
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-1.5 bg-primary mb-8 rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-black text-navy mb-8 tracking-tight">
                Visualise your progress.
              </h2>
              <p className="text-xl text-gray-500 mb-12 leading-relaxed font-medium">
                Seeing your progress makes it real. Our thick, friendly progress bars give you a tactile sense of how close you are to your dreams. No complicated spreadsheets—just clarity.
              </p>
              <ul className="space-y-6">
                {[
                  "Unlimited custom goals",
                  "Automatic round-ups from transactions",
                  "Shared goals with partners"
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-4 text-navy font-bold group cursor-default">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:rotate-12 transition-all">
                      <CheckIcon />
                    </div>
                    <span className="text-lg group-hover:text-primary transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-navy via-navy-light to-navy rounded-[64px] p-16 lg:p-32 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] -mr-48 -mt-48 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[120px] -ml-48 -mb-48 animate-blob animation-delay-2000"></div>
            
            <div className="relative z-10 fade-up">
              <h2 className="text-5xl lg:text-7xl font-black mb-8 tracking-tighter">
                Ready to grow <br />your future?
              </h2>
              <p className="text-xl lg:text-2xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed font-medium italic">
                Join over 50,000 beginners who have taken control of their financial life with FinGrow.
              </p>
              <button className="px-12 py-6 bg-primary text-white font-black text-lg rounded-[24px] hover:bg-green-600 transition-all shadow-2xl shadow-green-900/40 transform hover:scale-110 active:scale-95">
                Create Your Free Account
              </button>
              <div className="mt-12 flex justify-center items-center space-x-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                <span>No credit card required</span>
                <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 pt-32 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center mb-8">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-black text-sm italic">F</span>
                </div>
                <span className="text-2xl font-black text-navy tracking-tight">FinGrow</span>
              </div>
              <p className="text-gray-500 leading-relaxed font-medium mb-8">
                Making finance accessible, empathetic, and stress-free for everyone.
              </p>
              <div className="flex space-x-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 bg-gray-50 rounded-xl hover:bg-primary/10 cursor-pointer transition-colors border border-gray-100"></div>
                ))}
              </div>
            </div>
            
            {[
              { 
                title: "Platform", 
                links: ["How it Works", "Investing 101", "Security"] 
              },
              { 
                title: "Company", 
                links: ["About Us", "Careers", "Blog"] 
              },
              { 
                title: "Legal", 
                links: ["Privacy Policy", "Terms of Service", "Disclosures"] 
              }
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-black text-navy mb-8 uppercase tracking-widest text-xs">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-gray-500 hover:text-primary transition-colors font-bold text-sm tracking-tight">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <p>© 2024 FinGrow. All rights reserved.</p>
            <div className="flex space-x-10 mt-8 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
