import React from 'react';
import { motion } from 'motion/react';
import { Check, Award, ArrowRight, ShieldCheck, BookOpen, Clock } from 'lucide-react';
import { AcademicLevel } from '../../types';

interface AcademicJourneyProps {
  currentLevel: AcademicLevel;
  cgpa: number;
  creditsEarned: number;
  requiredCredits: number;
  onSelectLevel?: (level: AcademicLevel) => void;
}

interface StepInfo {
  level: AcademicLevel;
  title: string;
  badge: string;
  description: string;
  creditsExpected: number;
  status: 'completed' | 'current' | 'upcoming';
}

export const AcademicJourney: React.FC<AcademicJourneyProps> = ({
  currentLevel,
  cgpa,
  creditsEarned,
  requiredCredits,
  onSelectLevel
}) => {
  const levelOrder: AcademicLevel[] = ['100', '200', '300', '400'];
  const currentIndex = levelOrder.indexOf(currentLevel);

  const steps: StepInfo[] = [
    {
      level: '100',
      title: 'Level 100 · Foundation',
      badge: 'Completed',
      description: 'Computing primitives, discrete mathematics, OOP in Java, and academic logic.',
      creditsExpected: 36,
      status: currentIndex > 0 ? 'completed' : currentIndex === 0 ? 'current' : 'upcoming'
    },
    {
      level: '200',
      title: 'Level 200 · Intermediate',
      badge: 'Completed',
      description: 'Data structures, networking, web architectures, software design and statistics.',
      creditsExpected: 72,
      status: currentIndex > 1 ? 'completed' : currentIndex === 1 ? 'current' : 'upcoming'
    },
    {
      level: '300',
      title: 'Level 300 · Advanced Core',
      badge: 'Current Level',
      description: 'Database engines, cloud infrastructure, cryptography, OS internals & research.',
      creditsExpected: 108,
      status: currentIndex > 2 ? 'completed' : currentIndex === 2 ? 'current' : 'upcoming'
    },
    {
      level: '400',
      title: 'Level 400 · Capstone & Graduation',
      badge: 'Upcoming',
      description: 'Industry internship, distributed systems, AI applications & final thesis defense.',
      creditsExpected: 132,
      status: currentIndex === 3 ? 'current' : 'upcoming'
    }
  ];

  return (
    <div id="academic-journey-card" className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 md:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-100 dark:border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              <BookOpen className="w-3.5 h-3.5" />
              Academic Progression Engine
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">•</span>
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              4-Year Degree Track
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mt-2">
            Student Academic Journey
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Audited semester progression and required milestone completion matrix.
          </p>
        </div>

        {/* Milestone Quick Summary */}
        <div className="flex items-center gap-3 self-start md:self-auto bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60">
          <div className="text-right">
            <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Completion Status</div>
            <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {Math.round((creditsEarned / requiredCredits) * 100)}% to Degree
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {creditsEarned}/{requiredCredits}
          </div>
        </div>
      </div>

      {/* Interactive Timeline */}
      <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:left-3.5 md:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isUpcoming = step.status === 'upcoming';

          return (
            <motion.div
              key={step.level}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.12, duration: 0.3 }}
              className={`relative group ${onSelectLevel ? 'cursor-pointer' : ''}`}
              onClick={() => onSelectLevel && onSelectLevel(step.level)}
            >
              {/* Node Icon on vertical spine */}
              <div 
                className={`absolute -left-6 md:-left-8 top-1 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-110 ${
                  isCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                    : isCurrent
                    ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950/60 shadow-xs animate-pulse'
                    : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : isCurrent ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                )}
              </div>

              {/* Step Card Container */}
              <div 
                className={`rounded-xl border p-4 md:p-5 transition-all ${
                  isCurrent
                    ? 'border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-xs'
                    : isCompleted
                    ? 'border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700'
                    : 'border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/30 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100">
                      {step.title}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : isCurrent
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 ring-1 ring-indigo-500/20'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}
                    >
                      {step.badge}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Target: {step.creditsExpected} Credits Cumulative
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                  {step.description}
                </p>

                {/* Additional contextual row for current level */}
                {isCurrent && (
                  <div className="mt-4 pt-3 border-t border-indigo-100/80 dark:border-indigo-900/40 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-indigo-900 dark:text-indigo-200">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Academic Standing: Good Standing (CGPA: {cgpa.toFixed(2)})
                    </div>
                    <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1">
                      Active Semester: First Semester <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Final Graduation node */}
        <div className="relative">
          <div className="absolute -left-6 md:-left-8 top-1 w-7 h-7 rounded-full flex items-center justify-center border-2 bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-600 dark:text-amber-400 shadow-xs">
            <Award className="w-4 h-4" />
          </div>
          <div className="rounded-xl border border-dashed border-amber-300 dark:border-amber-800/80 p-4 bg-amber-50/30 dark:bg-amber-950/10">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
                Degree Conferment & Graduation
              </span>
              <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                132 Total Credits Required
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Final-year cumulative clearance, thesis evaluation, and Senate graduation recommendation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
