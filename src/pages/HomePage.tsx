import React from 'react';
import { Activity, Shield, Zap, Heart } from 'lucide-react';

import { Link } from "wouter";
import { useLabTests } from '@/services/labs.service';

const HomePage: React.FC = () => {
  const { data: tests, isLoading, error } = useLabTests();

  return (
    <div className="pt-[60px]">
      <section className="text-center max-w-[800px] mx-auto mb-20">
        <h1 className="text-[2.5rem] md:text-[3.5rem] font-extrabold mb-6 leading-[1.1]">
          Transform Your Health with <span className="bg-primary-gradient bg-clip-text text-transparent">AI-Driven Insights</span>
        </h1>
        <p className="text-text-grey text-lg md:text-xl mb-10">
          Unlock the secrets of your biomarkers and optimize your wellness journey with our advanced health portal.
        </p>
        <div className="flex justify-center gap-5">
          <button className="premium-gradient-btn px-4 py-2 text-[0.75rem] md:px-6 md:py-2.5 md:text-[0.85rem]">Get Started</button>

        </div>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-20">
        <div className="feature-card glass-card hover:-translate-y-2.5 transition-transform duration-300 text-center flex flex-col items-center gap-4 px-6 py-10">
          <Activity className="text-primary-teal" size={32} />
          <h3 className="text-[1.25rem] font-bold">Real-time Tracking</h3>
          <p className="text-text-grey text-[0.95rem]">Monitor your vitals and health metrics with seamless integration.</p>
        </div>
        <div className="feature-card glass-card hover:-translate-y-2.5 transition-transform duration-300 text-center flex flex-col items-center gap-4 px-6 py-10">
          <Shield className="text-primary-teal" size={32} />
          <h3 className="text-[1.25rem] font-bold">Secure Data</h3>
          <p className="text-text-grey text-[0.95rem]">Your health data is encrypted and kept private under strict protocols.</p>
        </div>
        <div className="feature-card glass-card hover:-translate-y-2.5 transition-transform duration-300 text-center flex flex-col items-center gap-4 px-6 py-10">
          <Zap className="text-primary-teal" size={32} />
          <h3 className="text-[1.25rem] font-bold">Instant Analysis</h3>
          <p className="text-text-grey text-[0.95rem]">Get AI-powered insights from your lab results within minutes.</p>
        </div>
        <div className="feature-card glass-card hover:-translate-y-2.5 transition-transform duration-300 text-center flex flex-col items-center gap-4 px-6 py-10">
          <Heart className="text-primary-teal" size={32} />
          <h3 className="text-[1.25rem] font-bold">Customized Plans</h3>
          <p className="text-text-grey text-[0.95rem]">Receive nutrition and lifestyle recommendations tailored to your DNA.</p>
        </div>
      </section>

      {/* Available Tests Section */}
      <section className="mb-20">
        <h2 className="text-[2rem] font-bold mb-10 text-center">Available <span className="text-accent-teal">Lab Profiles</span></h2>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-teal"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-400 bg-red-400/10 rounded-xl border border-red-400/20">
            Failed to load tests. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests?.map((test) => (
              <div key={test.id} className="glass-card hover:shadow-premium transition-all duration-300 flex flex-col items-start gap-4 hover:-translate-y-1">
                <div className="flex justify-between w-full items-start">
                  <span className="px-3 py-1 bg-accent-teal/10 text-accent-teal text-[0.7rem] font-bold uppercase tracking-wider rounded-full border border-accent-teal/20">
                    {test.type}
                  </span>
                  {test.gender && (
                    <span className="text-xs text-text-grey font-medium uppercase tracking-wide">
                      {test.gender}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">{test.name}</h3>
                  <p className="text-text-grey text-sm line-clamp-2">{test.description}</p>
                </div>

                <div className="mt-auto pt-4 w-full flex items-center justify-between border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-bold uppercase">Code</span>
                    <span className="text-sm font-mono text-slate-300">{test.code}</span>
                  </div>
                  <Link href={`/book?id=${test.id}`} className="text-accent-teal text-sm font-bold hover:text-white transition-colors flex items-center gap-1">
                    Book Now <Zap size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
