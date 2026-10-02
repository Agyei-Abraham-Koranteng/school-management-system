import React from 'react';
import { GraduationCap } from 'lucide-react';

interface UniversityCrestProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark' | 'auto';
  universityName?: string;
  subtext?: string;
}

export const UniversityCrest: React.FC<UniversityCrestProps> = ({
  className = '',
  size = 'md',
  theme = 'auto',
  universityName = 'Premier University',
  subtext = 'Est. 1962 · Accra, Ghana',
}) => {
  const sizeConfig = {
    sm: {
      box: 'w-8 h-8 rounded-lg',
      icon: 'w-4 h-4',
      title: 'text-sm font-extrabold',
      sub: 'text-[9px]',
    },
    md: {
      box: 'w-9 h-9 rounded-xl',
      icon: 'w-5 h-5',
      title: 'text-base font-extrabold',
      sub: 'text-[10px]',
    },
    lg: {
      box: 'w-11 h-11 rounded-2xl',
      icon: 'w-6 h-6',
      title: 'text-xl font-extrabold',
      sub: 'text-xs',
    },
  }[size];

  const textColor =
    theme === 'light'
      ? 'text-neutral-900'
      : theme === 'dark'
      ? 'text-white'
      : 'text-neutral-900 dark:text-white';

  const subColor =
    theme === 'light'
      ? 'text-neutral-500'
      : theme === 'dark'
      ? 'text-indigo-300'
      : 'text-neutral-500 dark:text-neutral-400';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Original Project Logo: Indigo/Violet Gradient with Graduation Cap */}
      <div
        className={`${sizeConfig.box} bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/30 shrink-0 group-hover:scale-105 transition-transform`}
      >
        <GraduationCap className={`${sizeConfig.icon} text-white`} />
      </div>

      <div className="leading-tight flex flex-col">
        <span className={`${sizeConfig.title} tracking-tight ${textColor} transition-colors`}>
          {universityName}
        </span>
        <p className={`${sizeConfig.sub} font-medium ${subColor} transition-colors`}>
          {subtext}
        </p>
      </div>
    </div>
  );
};
