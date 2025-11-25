import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Company {
  id: string;
  name: string;
  owner_id: string;
  slug: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  logo_url: string | null;
  slogan: string | null;
  business_type: string | null;
  nif: string | null;
  website: string | null;
  instagram: string | null;
  founded_date: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  gps_coordinates: string | null;
  capacity: number | null;
  description: string | null;
  operating_hours: any | null;
  subscription_plan: string | null;
  subscription_status: string | null;
  trial_start_date: string | null;
  trial_end_date: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  created_at: string;
  updated_at: string;
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
      setIsLoading(true);
      setError(null);

      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          setError('Não autenticado');
          navigate('/auth/login');
          return;
        }

        // Get companyId from URL or user context
        let targetCompanyId = companyId;

        // If no companyId in URL, get from user's boxId
        if (!targetCompanyId || targetCompanyId === ':companyId') {
          // This is a placeholder in the route, need to correct the URL
          const { data: userRole } = await supabase
            .from('user_roles')
            .select(`
              company_id,
              companies (
                id,
                slug
              )
            `)
            .eq('user_id', authUser.id)
            .eq('role', 'box_owner')
            .single();

          if (userRole?.company_id) {
            // SEMPRE usar o ID da company na URL
            navigate(`/${userRole.company_id}/dashboard`, { replace: true });
            return;
          }
        }

        // Fetch company data - support both ID and slug
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .or(`id.eq.${targetCompanyId},slug.eq.${targetCompanyId}`)
          .single();

        if (companyError || !company) {
          console.error('Company not found:', companyError);
          setError('Box não encontrado');
          navigate('/auth/login');
          return;
        }

        // Verify user access to this company
        const hasAccess = await checkUserAccess(company.id, authUser.id);
        
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
      // Verificar se usuário tem permissão via user_roles (mais seguro e principal)
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .or(`role.eq.cagio_admin,and(role.in.(box_owner,personal_trainer,staff_member),company_id.eq.${companyId})`)
        .maybeSingle();

      if (userRole) return true;

      // Fallback: Verificar se é o dono direto da empresa
      const { data: company } = await supabase
        .from('companies')
        .select('owner_id')
        .eq('id', companyId)
        .eq('owner_id', userId)
        .single();

      if (company) return true;

      // Fallback: Verificar se é um trainer da empresa
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