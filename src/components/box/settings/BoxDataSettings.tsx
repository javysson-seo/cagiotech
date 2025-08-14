
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Globe,
  Calendar,
  Hash
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const BoxDataSettings: React.FC = () => {
  const { user } = useAuth();
  
  const [boxData, setBoxData] = useState({
    name: user?.boxName || 'CrossFit Benfica',
    slogan: 'Transforme-se através do movimento',
    businessType: 'CrossFit',
    nif: '123456789',
    phone: '+351 912 345 678',
    email: 'info@crossfitbenfica.com',
    website: 'https://crossfitbenfica.com',
    instagram: '@crossfitbenfica',
    foundedDate: '2020-01-15',
    street: 'Rua do Exemplo, 123',
    city: 'Lisboa',
    postalCode: '1000-001',
    country: 'Portugal',
    gpsCoordinates: '38.7223, -9.1393',
    capacity: 30,
    description: 'A melhor BOX de CrossFit de Lisboa com equipamentos de última geração e trainers certificados.'
  });

  const [operatingHours, setOperatingHours] = useState({
    monday: { open: '06:00', close: '22:00', closed: false },
    tuesday: { open: '06:00', close: '22:00', closed: false },
    wednesday: { open: '06:00', close: '22:00', closed: false },
    thursday: { open: '06:00', close: '22:00', closed: false },
    friday: { open: '06:00', close: '22:00', closed: false },
    saturday: { open: '08:00', close: '20:00', closed: false },
    sunday: { open: '08:00', close: '18:00', closed: false }
  });

  const handleSave = () => {
    toast.success('Dados da BOX salvos com sucesso!');
    console.log('Salvando dados da BOX:', { boxData, operatingHours });
  };

  const businessTypes = [
    'CrossFit',
    'Functional Training',
    'Yoga',
    'Pilates',
    'Boxing',
    'Multi-modalidade',
    'Ginásio Tradicional',
    'Studio Boutique'
  ];

  const weekDays = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Building2 className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Dados da BOX</h2>
      </div>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="name">Nome da BOX *</Label>
              <Input
                id="name"
                value={boxData.name}
                onChange={(e) => setBoxData({ ...boxData, name: e.target.value })}
                placeholder="Nome da sua BOX"
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
              <Label htmlFor="businessType">Tipo de Negócio</Label>
              <Select value={boxData.businessType} onValueChange={(value) => setBoxData({ ...boxData, businessType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nif" className="flex items-center space-x-1">
                <Hash className="h-4 w-4" />
                <span>NIF *</span>
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
                value={boxData.foundedDate}
                onChange={(e) => setBoxData({ ...boxData, foundedDate: e.target.value })}
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
            <Label htmlFor="description">Descrição da BOX</Label>
            <Textarea
              id="description"
              value={boxData.description}
              onChange={(e) => setBoxData({ ...boxData, description: e.target.value })}
              rows={3}
              placeholder="Descreva sua BOX, diferenciais, filosofia..."
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
                value={boxData.street}
                onChange={(e) => setBoxData({ ...boxData, street: e.target.value })}
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
                value={boxData.postalCode}
                onChange={(e) => setBoxData({ ...boxData, postalCode: e.target.value })}
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
                value={boxData.gpsCoordinates}
                onChange={(e) => setBoxData({ ...boxData, gpsCoordinates: e.target.value })}
                placeholder="38.7223, -9.1393"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horários de Funcionamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Horários de Funcionamento</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {weekDays.map((day) => (
              <div key={day.key} className="grid grid-cols-4 gap-4 items-center">
                <div className="font-medium">{day.label}</div>
                <div>
                  <Input
                    type="time"
                    value={operatingHours[day.key as keyof typeof operatingHours].open}
                    onChange={(e) => setOperatingHours({
                      ...operatingHours,
                      [day.key]: { ...operatingHours[day.key as keyof typeof operatingHours], open: e.target.value }
                    })}
                    disabled={operatingHours[day.key as keyof typeof operatingHours].closed}
                  />
                </div>
                <div>
                  <Input
                    type="time"
                    value={operatingHours[day.key as keyof typeof operatingHours].close}
                    onChange={(e) => setOperatingHours({
                      ...operatingHours,
                      [day.key]: { ...operatingHours[day.key as keyof typeof operatingHours], close: e.target.value }
                    })}
                    disabled={operatingHours[day.key as keyof typeof operatingHours].closed}
                  />
                </div>
                <div>
                  <Button
                    variant={operatingHours[day.key as keyof typeof operatingHours].closed ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => setOperatingHours({
                      ...operatingHours,
                      [day.key]: { 
                        ...operatingHours[day.key as keyof typeof operatingHours], 
                        closed: !operatingHours[day.key as keyof typeof operatingHours].closed 
                      }
                    })}
                  >
                    {operatingHours[day.key as keyof typeof operatingHours].closed ? 'Fechado' : 'Aberto'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg">
        <Save className="h-4 w-4 mr-2" />
        Salvar Dados da BOX
      </Button>
    </div>
  );
};
