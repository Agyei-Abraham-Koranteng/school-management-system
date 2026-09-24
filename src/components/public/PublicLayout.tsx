import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <PublicNavbar onLoginClick={() => navigate('/login')} />
      <Outlet />
      <PublicFooter />
    </div>
  );
};
