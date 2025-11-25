import React from 'react';
import { Link, LinkProps, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps extends LinkProps {
  activeClassName?: string;
  end?: boolean;
}

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, to, end = false, ...props }, ref) => {
    const location = useLocation();
    const toPath = typeof to === 'string' ? to : to.pathname || '';
    
    const isActive = end 
      ? location.pathname === toPath
      : location.pathname.startsWith(toPath);

    return (
      <Link
        ref={ref}
        to={to}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  }
);

NavLink.displayName = 'NavLink';
