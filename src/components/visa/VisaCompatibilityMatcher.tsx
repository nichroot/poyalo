import React, { useState, useMemo } from 'react';
import { 
  Globe2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  ExternalLink, 
  MessageCircle, 
  ChevronRight, 
  Search,
  Flame,
  Award
} from 'lucide-react';
import { 
  DESTINATION_VISA_RULES, 
  UAE_RESIDENCY_TIERS, 
  DestinationVisaRule 
} from '../../data/visaMatcherData';
import { COUNTRY_VISA_MATRIX } from '../../data/passportRules';

export const VisaCompatibilityMatcher: React.FC = () => {
  const [nationality, setNationality] = useState<string>('IN');
  const [residencyTier, setResidencyTier] = useState<string>('resident');
  const [activeFilter, setActiveFilter] = useState<'all' | 'easy' | 'evisa' | 'concierge'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedInquiryCountry, setSelectedInquiryCountry] = useState<DestinationVisaRule | null>(null);

  const filteredRules = useMemo(() => {
    return DESTINATION_VISA_RULES.filter(rule => {
      const matchesFilter = activeFilter === 'all' || rule.tier === activeFilter;
      const matchesSearch = 
        searchQuery.trim() === '' || 
        rule.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.continent.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const easyCount = DESTINATION_VISA_RULES.filter(r => r.tier === 'easy').length;
  const evisaCount = DESTINATION_VISA_RULES.filter(r => r.tier === 'evisa').length;
  const conciergeCount = DESTINATION_VISA_RULES.filter(r => r.tier === 'concierge').length;

  const currentNationalityName = COUNTRY_VISA_MATRIX[nationality]?.countryName || nationality;
  const currentTierObj = UAE_RESIDENCY_TIERS.find(t => t.id === residencyTier);

  const handleOpenWhatsApp = (country: DestinationVisaRule) => {
    const text = encodeURIComponent(
      `Hello POYALO Visa Concierge! ✈️ I am checking visa compatibility for ${country.countryName}.\n` +
      `• Nationality: ${currentNationalityName} (${nationality})\n` +
      `• Residency: ${currentTierObj?.label}\n` +
      `• Target Destination: ${country.countryName}\n\n` +
      `I would like to inquire about your VIP Concierge support, slot locking, and document pre-audit.`
    );
    window.open(`https://wa.me/971500000000?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Explainer Header */}
      <div className="bg-[#FFFFFF] border-[2.5px] border-[#111827] rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_#111827] relative overflow-hidden">
        <div className="flex items-center space-x-2">
          <span className="bg-[#1B3FFF] text-white px-2.5 py-0.5 rounded font-mono font-black text-xs uppercase border border-[#111827]">
            THE VISA GUY • SMART TRAVEL MATCHER
          </span>
          <span className="text-xs font-mono font-bold text-gray-500">
            UAE Residency + Passport Cross-Match
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-black text-[#111827] mt-1 tracking-tight">
          Where Can You Travel Right Now?
        </h2>
        <p className="text-xs sm:text-sm font-mono text-gray-700 mt-1 max-w-2xl">
          Enter your passport nationality and UAE residency status. We match you with instant visa-free getaways, 
          simple eVisas, and high-demand destinations where <strong>The Visa Guy</strong> handles your appointment locks and filings.
        </p>

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t-2 border-gray-100">
          <div>
            <label className="block text-[11px] font-mono font-black text-gray-700 uppercase mb-1">
              Your Passport Nationality:
            </label>
            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FDFBF7] border-2 border-[#111827] rounded-xl font-mono text-xs font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1B3FFF] shadow-inner"
            >
              {Object.values(COUNTRY_VISA_MATRIX).map(c => (
                <option key={c.code} value={c.code}>
                  {c.countryName} ({c.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-black text-gray-700 uppercase mb-1">
              Your UAE Residency Status:
            </label>
            <select
              value={residencyTier}
              onChange={(e) => setResidencyTier(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FDFBF7] border-2 border-[#111827] rounded-xl font-mono text-xs font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1B3FFF] shadow-inner"
            >
              {UAE_RESIDENCY_TIERS.map(t => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Residency Perk Badge */}
        {currentTierObj && (
          <div className="mt-3 p-2.5 bg-amber-50 border-2 border-[#111827] rounded-xl text-xs font-mono font-bold text-gray-800 flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span><strong>Residency Power:</strong> {currentTierObj.perk}</span>
          </div>
        )}
      </div>

      {/* Cross-Sell Callout Ribbon */}
      <div className="bg-[#FEF3C7] border-[2.5px] border-[#111827] rounded-2xl p-4 shadow-[4px_4px_0px_#111827] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono font-black uppercase text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded border border-[#111827]">
            INSIDER TRAVEL HACK • CROSS-SELL ALERT
          </span>
          <h4 className="font-display font-black text-base text-[#111827]">
            Weekend in Georgia? European Summer in France?
          </h4>
          <p className="text-xs font-mono text-gray-700">
            While you take an instant flight to Georgia or Oman this weekend, <strong>Schengen and US appointment slots fill up 60–90 days in advance</strong>. Don't get stuck!
          </p>
        </div>
        <button
          onClick={() => setActiveFilter('concierge')}
          className="px-4 py-2 bg-[#111827] hover:bg-gray-800 text-white font-mono font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#111827] shadow-[2px_2px_0px_#FF5722] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center space-x-1.5 self-start sm:self-center whitespace-nowrap"
        >
          <span>VIEW CONCIERGE DESTINATIONS</span>
          <ChevronRight className="w-4 h-4 text-[#FF5722]" />
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        
        {/* Tier Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl border-2 border-[#111827] text-xs font-mono font-black whitespace-nowrap transition-all ${
              activeFilter === 'all'
                ? 'bg-[#111827] text-white shadow-[2px_2px_0px_#1B3FFF]'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Destinations ({DESTINATION_VISA_RULES.length})
          </button>

          <button
            onClick={() => setActiveFilter('easy')}
            className={`px-3 py-1.5 rounded-xl border-2 border-[#111827] text-xs font-mono font-black whitespace-nowrap transition-all ${
              activeFilter === 'easy'
                ? 'bg-emerald-600 text-white shadow-[2px_2px_0px_#111827]'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            🟢 Instant VOA ({easyCount})
          </button>

          <button
            onClick={() => setActiveFilter('evisa')}
            className={`px-3 py-1.5 rounded-xl border-2 border-[#111827] text-xs font-mono font-black whitespace-nowrap transition-all ${
              activeFilter === 'evisa'
                ? 'bg-amber-500 text-white shadow-[2px_2px_0px_#111827]'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            🟡 Fast eVisa ({evisaCount})
          </button>

          <button
            onClick={() => setActiveFilter('concierge')}
            className={`px-3 py-1.5 rounded-xl border-2 border-[#111827] text-xs font-mono font-black whitespace-nowrap transition-all ${
              activeFilter === 'concierge'
                ? 'bg-[#FF5722] text-white shadow-[2px_2px_0px_#111827]'
                : 'bg-red-50 text-red-900 hover:bg-red-100'
            }`}
          >
            🔴 Visa Guy Concierge ({conciergeCount})
          </button>
        </div>

        {/* Quick Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search country (e.g. France, Oman)..."
            className="w-full sm:w-60 pl-8 pr-3 py-1.5 bg-white border-2 border-[#111827] rounded-xl font-mono text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1B3FFF] shadow-[2px_2px_0px_#111827]"
          />
        </div>

      </div>

      {/* Destination Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => {
          const isConcierge = rule.tier === 'concierge';
          const isEasy = rule.tier === 'easy';

          return (
            <div
              key={rule.id}
              className={`bg-white border-[2.5px] border-[#111827] rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#111827] flex flex-col justify-between transition-all ${
                isConcierge ? 'ring-2 ring-[#FF5722]/30' : ''
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{rule.flag}</span>
                    <div>
                      <h3 className="font-display font-black text-base text-[#111827] leading-tight">
                        {rule.countryName}
                      </h3>
                      <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">
                        {rule.continent}
                      </span>
                    </div>
                  </div>

                  {/* Tier Badge */}
                  <span className={`px-2 py-0.5 rounded-lg border border-[#111827] font-mono font-black text-[10px] uppercase shadow-[1px_1px_0px_#111827] ${
                    isEasy ? 'bg-emerald-100 text-emerald-900' :
                    rule.tier === 'evisa' ? 'bg-amber-100 text-amber-900' :
                    'bg-red-100 text-red-900 font-black'
                  }`}>
                    {rule.tierLabel}
                  </span>
                </div>

                {/* Specific Rule Details for User */}
                <div className="space-y-2 mt-3">
                  <div className="p-2.5 bg-[#FDFBF7] rounded-xl border border-gray-200 text-xs font-mono text-gray-800 leading-relaxed">
                    <strong className="text-[#111827] block mb-0.5">🇦🇪 For UAE Residents:</strong>
                    {rule.uaeResidentRule}
                  </div>

                  <p className="text-[11px] font-mono text-gray-600 px-1">
                    📌 <strong>Passport Note:</strong> {rule.passportNotes}
                  </p>

                  {/* The Visa Guy Concierge Perks (if applicable) */}
                  {isConcierge && (
                    <div className="mt-3 p-3 bg-red-50/80 border-2 border-red-400/80 rounded-xl space-y-1.5">
                      <span className="text-[10px] font-mono font-black text-red-900 uppercase flex items-center space-x-1">
                        <Flame className="w-3 h-3 text-[#FF5722]" />
                        <span>THE VISA GUY CONCIERGE ADVANTAGE:</span>
                      </span>
                      <ul className="space-y-1 text-[11px] font-mono text-red-950">
                        {rule.visaGuyPerks.slice(0, 3).map((perk, i) => (
                          <li key={i} className="flex items-start space-x-1.5">
                            <span className="text-emerald-700 font-black">✓</span>
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="text-[10px] font-mono text-gray-500 font-bold flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {rule.processingTimeDays === 0 ? 'Instant Entry' : `~${rule.processingTimeDays} Days Processing`}
                  </span>
                </div>

                {isConcierge ? (
                  <button
                    onClick={() => handleOpenWhatsApp(rule)}
                    className="px-3 py-1.5 bg-[#FF5722] hover:bg-[#E64A19] text-white border border-[#111827] rounded-xl font-mono font-black text-xs uppercase shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 flex items-center space-x-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>INQUIRE CONCIERGE</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenWhatsApp(rule)}
                    className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#111827] border border-[#111827] rounded-xl font-mono font-bold text-xs uppercase shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 flex items-center space-x-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-gray-700" />
                    <span>CHECK REQUIREMENTS</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
