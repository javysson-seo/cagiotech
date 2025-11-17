import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Company {
  id: string;
  name: string;
  owner_id: string;
}

interface CompanyContextType {
  currentCompany: Company | null;
  isLoading: boolean;
  error: string | null;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const { companyId } = useParams<{ companyId: string }>();
const { user } = useAuth();
const navigate = useNavigate();
const location = useLocation();

useEffect(() => {
  const loadCompany = async () => {
    // Sanitize param: ignore placeholder like ":companyId"
    const paramCompanyId = companyId && !companyId.startsWith(':') ? companyId : undefined;
    const resolvedCompanyId = paramCompanyId || user?.boxId;

    // If URL contains the placeholder and we know the user's box, fix the URL
    if (companyId && companyId.startsWith(':') && user?.boxId) {
      const correctedPath = location.pathname.replace(`/${companyId}`, `/${user.boxId}`);
      navigate(correctedPath, { replace: true });
    }

    if (!resolvedCompanyId || !user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Buscar empresa pelo ID
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', resolvedCompanyId)
        .single();

        if (companyError || !company) {
          setError('Empresa não encontrada');
          navigate('/auth/login');
          return;
        }

        // Verificar se o usuário tem acesso a esta empresa
        const hasAccess = await checkUserAccess(company.id, user.id);
        
        if (!hasAccess) {
          setError('Acesso não autorizado a esta empresa');
          navigate('/auth/login');
          return;
        }

        setCurrentCompany(company);

      } catch (err) {
        console.error('Error loading company:', err);
        setError('Erro ao carregar empresa');
        navigate('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadCompany();
  }, [companyId, user, user?.boxId, navigate, location.pathname]);

  const checkUserAccess = async (companyId: string, userId: string): Promise<boolean> => {
    try {
      // Verificar se é o dono da empresa
      const { data: company } = await supabase
        .from('companies')
        .select('owner_id')
        .eq('id', companyId)
        .eq('owner_id', userId)
        .single();

      if (company) return true;

      // Verificar se é um trainer da empresa
      const { data: trainer } = await supabase
        .from('trainers')
        .select('id')
        .eq('company_id', companyId)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      return !!trainer;
    } catch (error) {
      console.error('Error checking user access:', error);
      return false;
    }
  };

  return (
    <CompanyContext.Provider value={{ 
      currentCompany, 
      isLoading, 
      error 
    }}>
      {children}
    </CompanyContext.Provider>
  );
};