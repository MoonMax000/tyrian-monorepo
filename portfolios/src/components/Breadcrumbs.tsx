import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const items: { label: string; to?: string; active?: boolean }[] = [{ label: 'Portfolios', to: '/' }];

  if (path.startsWith('/portfolio/')) {
    items.push({ label: 'My Portfolio', active: true });
  } else if (path.startsWith('/following-portfolios')) {
    items.push({ label: 'Following Portfolios', active: true });
  } else if (path.startsWith('/signals')) {
    items.push({ label: 'Signals', active: true });
  } else if (path !== '/') {
    items.push({ label: path.replace('/', ''), active: true });
  }

  return (
    <div className="flex items-center gap-2 mb-4 sm:mb-6">
      {items.map((it, idx) => (
        <React.Fragment key={idx}>
          {it.to && !it.active ? (
            <Link to={it.to} className="text-tyrian-gray-medium text-sm font-bold font-nunito hover:text-white">
              {it.label}
            </Link>
          ) : (
            <span className={`${it.active ? 'text-white' : 'text-tyrian-gray-medium'} text-sm font-bold font-nunito`}>
              {it.label}
            </span>
          )}
          {idx < items.length - 1 && (
            <span className="text-tyrian-gray-medium text-sm font-bold font-nunito">/</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
