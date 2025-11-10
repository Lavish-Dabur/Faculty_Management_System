import React from 'react';

const PageContainer = ({ 
  title, 
  subtitle, 
  icon, 
  children, 
  actions 
}) => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon && <div className="text-4xl">{icon}</div>}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      </div>
      
      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
};

export default PageContainer;
