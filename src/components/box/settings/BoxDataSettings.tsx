
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Building2, 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  Globe,
  Calendar,
  Hash,
  Loader2,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const BoxDataSettings: React.FC = () => {
  const { company, isLoading, updateCompany, isUpdating } = useCompanySettings();
  
  const [boxData, setBoxData] = useState({
    name: '',
    logo_url: '',
    slogan: '',
    business_type: 'CrossFit',
    nif: '',
    phone: '',
    email: '',
    website: '',
    instagram: '',
    founded_date: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'Portugal',
    gps_coordinates: '',
    capacity: 30,
    description: ''
  });

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    if (company) {
      setBoxData({
        name: company.name || '',
        logo_url: company.logo_url || '',
        slogan: company.slogan || '',
        business_type: company.business_type || 'CrossFit',
        nif: company.nif || '',
        phone: company.phone || '',
        email: company.email || '',
        website: company.website || '',
        instagram: company.instagram || '',
        founded_date: company.founded_date || '',
        address: company.address || '',
        city: company.city || '',
        postal_code: company.postal_code || '',
        country: company.country || 'Portugal',
        gps_coordinates: company.gps_coordinates || '',
        capacity: company.capacity || 30,
        description: company.description || ''
      });
    }
  }, [company]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company?.id) return;

    // Validar dimensões da imagem
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      
      if (img.width > 512 || img.height > 512) {
        toast.error('A imagem deve ter no máximo 512x512 pixels');
        return;
      }

      setIsUploadingLogo(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${company.id}/logo.${fileExt}`;

        // Delete old logo if exists
        if (boxData.logo_url) {
          const oldPath = boxData.logo_url.split('/').pop();
          await supabase.storage
            .from('company-logos')
            .remove([`${company.id}/${oldPath}`]);
        }

        const { error: uploadError } = await supabase.storage
          .from('company-logos')
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('company-logos')
          .getPublicUrl(fileName);

        const newLogoUrl = urlData.publicUrl;
        
        await updateCompany({ 
          logo_url: newLogoUrl
        });

        setBoxData({ ...boxData, logo_url: newLogoUrl });
        toast.success('Logo atualizado com sucesso!');
      } catch (error) {
        console.error('Error uploading logo:', error);
        toast.error('Erro ao fazer upload do logo');
      } finally {
        setIsUploadingLogo(false);
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      toast.error('Erro ao validar a imagem');
    };
    
    img.src = objectUrl;
  };

  const handleSave = () => {
    if (!boxData.name.trim()) {
      toast.error('O nome da empresa é obrigatório');
      return;
    }
    
    // Converter strings vazias para null nas datas
    const dataToSave = {
      ...boxData,
      founded_date: boxData.founded_date?.trim() || null,
    };
    
    updateCompany(dataToSave);
  };

  const handleRemoveLogo = async () => {
    if (!company?.id) return;
    
    try {
      // Remove logo from storage if exists
      if (boxData.logo_url && !boxData.logo_url.includes('lovable-uploads')) {
        const oldPath = boxData.logo_url.split('/').pop();
        await supabase.storage
          .from('company-logos')
          .remove([`${company.id}/${oldPath}`]);
      }

      await updateCompany({ 
        logo_url: null
      });

      setBoxData({ ...boxData, logo_url: '' });
      toast.success('Logo removido com sucesso!');
    } catch (error) {
      console.error('Error removing logo:', error);
      toast.error('Erro ao remover logo');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const businessTypes = [
    { value: 'crossfit', label: 'CrossFit' },
    { value: 'functional', label: 'Treino Funcional' },
    { value: 'yoga', label: 'Yoga' },
    { value: 'pilates', label: 'Pilates' },
    { value: 'boxing', label: 'Boxing / MMA' },
    { value: 'gym', label: 'Ginásio Tradicional' },
    { value: 'studio', label: 'Studio Boutique' },
    { value: 'cycling', label: 'Cycling / Spinning' },
    { value: 'dance', label: 'Dança' },
    { value: 'martial_arts', label: 'Artes Marciais' },
    { value: 'swimming', label: 'Natação' },
    { value: 'wellness', label: 'Wellness & SPA' },
    { value: 'multi', label: 'Multi-modalidades' }
  ];

  return (
    <div className="space-y-6">
      {/* Logo da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Logo da Empresa
          </CardTitle>
          <CardDescription>
            Faça upload do logo que aparecerá em emails e documentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 rounded-lg">
              <AvatarImage src={boxData.logo_url} alt={boxData.name} />
              <AvatarFallback className="rounded-lg bg-primary/10">
                <ImageIcon className="h-12 w-12 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="logo-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Upload className="h-4 w-4" />
                  <span>PNG, JPG, SVG (máx. 512x512px)</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploadingLogo}
                    onClick={() => document.getElementById('logo-upload')?.click()}
                  >
                    {isUploadingLogo ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Escolher Logo
                      </>
                    )}
                  </Button>
                  {boxData.logo_url && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleRemoveLogo}
                    >
                      Remover Logo
                    </Button>
                  )}
                </div>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações Básicas da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="name">Nome da Empresa *</Label>
              <Input
                id="name"
                value={boxData.name}
                onChange={(e) => setBoxData({ ...boxData, name: e.target.value })}
                placeholder="Nome da sua empresa"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="slogan">Slogan/Tagline</Label>
              <Input
                id="slogan"
                value={boxData.slogan}
                onChange={(e) => setBoxData({ ...boxData, slogan: e.target.value })}
                placeholder="Slogan da sua BOX"
              />
            </div>

            <div>
              <Label htmlFor="businessType">Ramo de Fitness</Label>
              <Select value={boxData.business_type} onValueChange={(value) => setBoxData({ ...boxData, business_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ramo" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nif" className="flex items-center space-x-1">
                <Hash className="h-4 w-4" />
                <span>NIF</span>
              </Label>
              <Input
                id="nif"
                value={boxData.nif}
                onChange={(e) => setBoxData({ ...boxData, nif: e.target.value })}
                placeholder="123456789"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>Telefone</span>
              </Label>
              <Input
                id="phone"
                value={boxData.phone}
                onChange={(e) => setBoxData({ ...boxData, phone: e.target.value })}
                placeholder="+351 912 345 678"
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={boxData.email}
                onChange={(e) => setBoxData({ ...boxData, email: e.target.value })}
                placeholder="info@suabox.com"
              />
            </div>

            <div>
              <Label htmlFor="website" className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <span>Website</span>
              </Label>
              <Input
                id="website"
                value={boxData.website}
                onChange={(e) => setBoxData({ ...boxData, website: e.target.value })}
                placeholder="https://suabox.com"
              />
            </div>

            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={boxData.instagram}
                onChange={(e) => setBoxData({ ...boxData, instagram: e.target.value })}
                placeholder="@suabox"
              />
            </div>

            <div>
              <Label htmlFor="foundedDate" className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Data de Fundação</span>
              </Label>
              <Input
                id="foundedDate"
                type="date"
                value={boxData.founded_date}
                onChange={(e) => setBoxData({ ...boxData, founded_date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="capacity">Capacidade Máxima</Label>
              <Input
                id="capacity"
                type="number"
                value={boxData.capacity}
                onChange={(e) => setBoxData({ ...boxData, capacity: parseInt(e.target.value) })}
                placeholder="30"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição da Empresa</Label>
            <Textarea
              id="description"
              value={boxData.description}
              onChange={(e) => setBoxData({ ...boxData, description: e.target.value })}
              rows={3}
              placeholder="Descreva sua empresa, diferenciais, filosofia..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Endereço</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="street">Rua e Número</Label>
              <Input
                id="street"
                value={boxData.address}
                onChange={(e) => setBoxData({ ...boxData, address: e.target.value })}
                placeholder="Rua do Exemplo, 123"
              />
            </div>

            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={boxData.city}
                onChange={(e) => setBoxData({ ...boxData, city: e.target.value })}
                placeholder="Lisboa"
              />
            </div>

            <div>
              <Label htmlFor="postalCode">Código Postal</Label>
              <Input
                id="postalCode"
                value={boxData.postal_code}
                onChange={(e) => setBoxData({ ...boxData, postal_code: e.target.value })}
                placeholder="1000-001"
              />
            </div>

            <div>
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={boxData.country}
                onChange={(e) => setBoxData({ ...boxData, country: e.target.value })}
                placeholder="Portugal"
                disabled
              />
            </div>

            <div>
              <Label htmlFor="gps">Coordenadas GPS (opcional)</Label>
              <Input
                id="gps"
                value={boxData.gps_coordinates}
                onChange={(e) => setBoxData({ ...boxData, gps_coordinates: e.target.value })}
                placeholder="38.7223, -9.1393"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg" disabled={isUpdating}>
        {isUpdating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Salvar Dados da Empresa
          </>
        )}
      </Button>
    </div>
  );
};
