import { ReactNode } from 'react';

export function PageHeader({ 
  title, 
  description, 
  action 
}: { 
  title: string; 
  description?: string; // Добавили типизацию для description
  action?: ReactNode; 
}) {
  return (
    <div className="topbar">
      <div>
        <h1 className="page-title">{title}</h1>
        {/* Рендерим description, если он передан */}
        {description && (
          <p className="page-description" style={{ color: 'gray', marginTop: '4px' }}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}