import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  RotateCcw, 
  MessageCircle, 
  Clock, 
  ShieldAlert, 
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  id: string;
  question: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    score: number;
    icon: string;
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'deadline',
    question: 'When is your planned flight departure date?',
    subtitle: 'Deadline pressure is the #1 cause of lost ticket fares.',
    options: [
      { label: 'Under 14 Days!', description: 'Full panic mode. Flights are non-refundable.', score: 35, icon: '🚨' },
      { label: '2 to 4 Weeks', description: 'Sweating a bit. Embassy turnaround times are tight.', score: 20, icon: '⏳' },
      { label: '1 to 3 Months', description: 'Reasonable window if slots are open.', score: 10, icon: '🗓️' },
      { label: '3+ Months Away', description: 'Totally zen. Plenty of preparation runway.', score: 0, icon: '🌴' }
    ]
  },
  {
    id: 'appointment',
    question: 'Do you have a confirmed Embassy or VFS appointment slot?',
    subtitle: 'European & US slots frequently sell out for months in advance.',
    options: [
      { label: 'Zero Slots Available!', description: 'Portal permanently displays "No slots available".', score: 35, icon: '🛑' },
      { label: 'Waking up at 3:00 AM', description: 'Refreshing the portal obsessively hoping for cancellations.', score: 25, icon: '🧟' },
      { label: 'Yes, Confirmed Slot', description: 'Date and time locked in and paid.', score: 0, icon: '✅' }
    ]
  },
  {
    id: 'history',
    question: 'Have you had any previous visa rejections or refusals?',
    subtitle: 'Prior refusals trigger manual secondary officer scrutiny.',
    options: [
      { label: 'Yes, Rejected in Last 2 Years', description: 'High scrutiny risk. Need strong justification letter.', score: 30, icon: '⚠️' },
      { label: 'Once a Long Time Ago', description: 'Old refusal stamped over 3 years ago.', score: 15, icon: '📜' },
      { label: 'Clean Track Record', description: 'Never had a visa refusal.', score: 0, icon: '✨' }
    ]
  },
  {
    id: 'documents',
    question: 'What is the current status of your documents & bank statements?',
    subtitle: 'Financial inconsistencies cause 60% of Schengen visa rejections.',
    options: [
      { label: 'Total Shambles', description: 'Haven’t requested company NOC or stamped bank statements.', score: 25, icon: '🌪️' },
      { label: 'Halfway Ready', description: 'Have online statements, still missing employer stamps or insurance.', score: 15, icon: '📄' },
      { label: 'Binder Organized', description: 'Stamped 6-month statements, valid NOC, insurance in order.', score: 0, icon: '📁' }
    ]
  },
  {
    id: 'itinerary',
    question: 'How complex is your travel route?',
    subtitle: 'Multi-country border crossings require matching flight proof.',
    options: [
      { label: 'Multi-Country Hop (3+ Borders)', description: 'Crossing multiple European or Asian borders.', score: 20, icon: '🗺️' },
      { label: 'Dual Destination Trip', description: 'Visiting two countries on one round-trip ticket.', score: 10, icon: '✈️' },
      { label: 'Single City Vacation', description: 'One destination, simple hotel and return flight.', score: 0, icon: '📍' }
    ]
  }
];

export const VisaStressScoreQuiz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleSelectOption = (questionId: string, score: number) => {
    const updated = { ...answers, [questionId]: score };
    setAnswers(updated);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
      // Celebrate quiz completion
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  // Calculate total stress score (clamped between 0 and 100)
  const totalScore = Math.min(100, Object.values(answers).reduce((sum, val) => sum + val, 0));

  const stressTier = 
    totalScore >= 70 ? 'critical' :
    totalScore >= 40 ? 'moderate' : 'low';

  const stressBadge = 
    stressTier === 'critical' 
      ? { title: 'DEFCON 1: FLIGHT GROUNDING HAZARD 🚨', color: 'bg-red-600 text-white', desc: 'CRITICAL VISA STRESS DETECTED' } 
      : stressTier === 'moderate'
      ? { title: 'MILD SWEATY PALMS ZONE 😬', color: 'bg-amber-500 text-white', desc: 'MODERATE TIMELINE FRICTION' }
      : { title: 'ZEN EXPLORER KARMA 😌', color: 'bg-emerald-600 text-white', desc: 'SMOOTH SAILING DETECTED' };

  const handleConsultantEscalation = () => {
    const text = encodeURIComponent(
      `🚨 THE VISA GUY EMERGENCY ESCALATION 🚨\n` +
      `My Visa Stress Score is ${totalScore}/100 (${stressBadge.title})!\n\n` +
      `Stress Breakdown:\n` +
      `• Flight deadline pressure: ${answers['deadline'] ?? 0} pts\n` +
      `• Appointment slot status: ${answers['appointment'] ?? 0} pts\n` +
      `• Previous refusal risk: ${answers['history'] ?? 0} pts\n` +
      `• Document readiness: ${answers['documents'] ?? 0} pts\n\n` +
      `I need immediate rapid-response assistance from a senior consultant!`
    );
    window.open(`https://wa.me/971500000000?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Quiz Banner Header */}
      <div className="bg-[#FFFFFF] border-[2.5px] border-[#111827] rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_#111827] relative overflow-hidden">
        <div className="flex items-center space-x-2">
          <span className="bg-[#FF5722] text-white px-2.5 py-0.5 rounded font-mono font-black text-xs uppercase border border-[#111827]">
            30-SECOND TRAVEL DIAGNOSTIC
          </span>
          <span className="text-xs font-mono font-bold text-gray-500">
            Segmented Lead Triage & Risk Audit
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-black text-[#111827] mt-1 tracking-tight">
          Visa Stress Score Meter
        </h2>
        <p className="text-xs sm:text-sm font-mono text-gray-700 mt-1 max-w-xl">
          Answer 5 quick questions about your upcoming trip. We measure your stress level, predict rejection traps, 
          and route critical cases directly to <strong>The Visa Guy Rapid-Response Concierge</strong>.
        </p>

        {/* Progress Bar */}
        {!isCompleted && (
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-gray-600">
              <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
              <span>{Math.round(((currentStep) / QUIZ_QUESTIONS.length) * 100)}% Complete</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full border-2 border-[#111827] overflow-hidden p-0.5">
              <div 
                className="h-full bg-[#1B3FFF] rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Interactive Question Card */}
      {!isCompleted ? (
        <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_#111827] space-y-4">
          <div>
            <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest block">
              DIAGNOSTIC QUESTION #{currentStep + 1}
            </span>
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#111827] mt-1">
              {QUIZ_QUESTIONS[currentStep].question}
            </h3>
            <p className="text-xs font-mono text-gray-600 mt-0.5">
              {QUIZ_QUESTIONS[currentStep].subtitle}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {QUIZ_QUESTIONS[currentStep].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(QUIZ_QUESTIONS[currentStep].id, opt.score)}
                className="p-3.5 bg-[#FDFBF7] hover:bg-amber-50 text-left border-2 border-[#111827] rounded-xl shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-start space-x-3 group"
              >
                <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  {opt.icon}
                </span>
                <div>
                  <h4 className="font-display font-black text-sm text-[#111827]">
                    {opt.label}
                  </h4>
                  <p className="text-[11px] font-mono text-gray-600 mt-0.5 leading-snug">
                    {opt.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Skip / Back Navigation */}
          {currentStep > 0 && (
            <div className="pt-2 flex justify-start">
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="text-xs font-mono font-bold text-gray-500 hover:text-[#111827] underline"
              >
                ← Back to previous question
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Results Breakdown Card */
        <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-5 sm:p-7 shadow-[4px_4px_0px_#111827] space-y-5">
          
          {/* Stress Meter Hero Display */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 border-b-2 border-gray-100 pb-5">
            <div className="space-y-1 text-center sm:text-left">
              <span className={`inline-block px-2.5 py-0.5 rounded font-mono font-black text-[11px] uppercase border border-[#111827] ${stressBadge.color} shadow-[2px_2px_0px_#111827]`}>
                {stressBadge.desc}
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#111827] tracking-tight">
                {stressBadge.title}
              </h3>
              <p className="text-xs font-mono text-gray-600 max-w-md">
                {stressTier === 'critical'
                  ? 'Your trip has extreme bottleneck risk: severe deadline pressure combined with missing appointment slots and strict embassy guidelines.'
                  : stressTier === 'moderate'
                  ? 'Your application is vulnerable to delay or documentation requests. Proactive document perfection is strongly advised.'
                  : 'You have safe margins. Standard submission practices should grant your entry without emergency measures.'}
              </p>
            </div>

            {/* Score Radial Box */}
            <div className={`w-28 h-28 rounded-2xl border-[3px] border-[#111827] ${stressBadge.color} shadow-[4px_4px_0px_#111827] flex flex-col items-center justify-center font-display font-black flex-shrink-0`}>
              <span className="text-4xl leading-none">{totalScore}</span>
              <span className="text-xs font-mono tracking-widest mt-0.5">/ 100 STRESS</span>
            </div>
          </div>

          {/* Action Callout Box */}
          <div className={`p-4 rounded-xl border-2 border-[#111827] space-y-2 ${
            stressTier === 'critical' ? 'bg-red-50' : stressTier === 'moderate' ? 'bg-amber-50' : 'bg-emerald-50'
          }`}>
            <h4 className="font-display font-black text-base text-[#111827] flex items-center space-x-1.5">
              <span>🎯</span>
              <span>POYALO VISA CONCIERGE RECOMMENDATION</span>
            </h4>
            
            <p className="text-xs font-mono text-gray-800 leading-relaxed">
              {stressTier === 'critical'
                ? '⚠️ You have been tagged for EMERGENCY CONCIERGE ESCALATION. Self-filing has an estimated 80%+ failure risk under these tight deadlines. Connect with a senior consultant on WhatsApp now to unlock emergency slot monitoring and expedited filing.'
                : stressTier === 'moderate'
                ? '💡 A professional pre-audit of your employer NOC letter and bank statement attestation will eliminate avoidable rejection causes.'
                : '✅ Download our free Border Verification Checklist below and ensure your passport has 180+ days buffer.'}
            </p>

            {/* Direct Escalation Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleConsultantEscalation}
                className="flex-1 py-3 px-4 bg-[#FF5722] hover:bg-[#E64A19] text-white border-2 border-[#111827] rounded-xl font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {stressTier === 'critical' 
                    ? '🚨 ROUTE TO SENIOR CONSULTANT (WHATSAPP SOS)' 
                    : 'CHAT WITH POYALO VISA CONCIERGE'}
                </span>
              </button>

              <button
                onClick={handleReset}
                className="py-3 px-4 bg-white hover:bg-gray-100 text-[#111827] border-2 border-[#111827] rounded-xl font-mono font-bold text-xs uppercase shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RE-TAKE QUIZ</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
