
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Palette, 
  Upload, 
  Camera, 
  Eye, 
  Save, 
  RotateCcw,
  Monitor,
  Sun,
  Moon,
  Type,
  Layout
} from 'lucide-react';
import { toast } from 'sonner';

export const VisualCustomizationSettings: React.FC = () => {
  const [colors, setColors] = useState({
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    text: '#1f2937',
    background: '#ffffff',
    muted: '#f3f4f6',
    border: '#e5e7eb'
  });

  const [theme, setTheme] = useState({
    mode: 'light',
    style: 'modern',
    density: 'comfortable',
    borderRadius: 'medium',
    font: 'inter'
  });

  const [logos, setLogos] = useState({
    main: null as File | null,
    horizontal: null as File | null,
    favicon: null as File | null
  });

  const [livePreview, setLivePreview] = useState(true);

  const handleColorChange = (colorKey: string, value: string) => {
    setColors({ ...colors, [colorKey]: value });
    if (livePreview) {
      toast.info('Preview atualizado em tempo real');
    }
  };

  const handleLogoUpload = (type: 'main' | 'horizontal' | 'favicon', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogos({ ...logos, [type]: file });
      toast.success(`${type === 'main' ? 'Logo principal' : type === 'horizontal' ? 'Logo horizontal' : 'Favicon'} carregado!`);
    }
  };

  const resetColors = () => {
    setColors({
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      text: '#1f2937',
      background: '#ffffff',
      muted: '#f3f4f6',
      border: '#e5e7eb'
    });
    toast.success('Cores resetadas para o padrão');
  };

  const handleSave = () => {
    toast.success('Personalização visual salva com sucesso!');
    console.log('Salvando personalização:', { colors, theme, logos });
  };

  const generateHarmony = () => {
    // Gerar paleta harmoniosa baseada na cor primária
    const primaryHsl = hexToHsl(colors.primary);
    const harmonious = {
      ...colors,
      secondary: hslToHex((primaryHsl.h + 120) % 360, primaryHsl.s, primaryHsl.l),
      accent: hslToHex((primaryHsl.h + 30) % 360, Math.min(primaryHsl.s + 20, 100), Math.max(primaryHsl.l - 10, 10)),
    };
    setColors(harmonious);
    toast.success('Paleta harmoniosa gerada!');
  };

  // Funções auxiliares para conversão de cores
  function hexToHsl(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  function hslToHex(h: number, s: number, l: number) {
    h /= 360; s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 1/6) { r = c; g = x; b = 0; }
    else if (1/6 <= h && h < 2/6) { r = x; g = c; b = 0; }
    else if (2/6 <= h && h < 3/6) { r = 0; g = c; b = x; }
    else if (3/6 <= h && h < 4/6) { r = 0; g = x; b = c; }
    else if (4/6 <= h && h < 5/6) { r = x; g = 0; b = c; }
    else if (5/6 <= h && h < 1) { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Palette className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Personalização Visual</h2>
      </div>

      {/* Preview em Tempo Real */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Preview em Tempo Real</span>
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <Switch
                checked={livePreview}
                onCheckedChange={setLivePreview}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="p-6 rounded-lg border-2 border-dashed"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.text
            }}
          >
            <div className="space-y-4">
              <div 
                className="px-4 py-2 rounded-md font-medium"
                style={{ backgroundColor: colors.primary, color: 'white' }}
              >
                Botão Primário
              </div>
              <div 
                className="px-4 py-2 rounded-md font-medium"
                style={{ backgroundColor: colors.secondary, color: 'white' }}
              >
                Botão Secundário
              </div>
              <div 
                className="px-4 py-2 rounded-md font-medium"
                style={{ backgroundColor: colors.accent, color: 'white' }}
              >
                Botão de Destaque
              </div>
              <div 
                className="p-4 rounded-md"
                style={{ backgroundColor: colors.muted }}
              >
                <p style={{ color: colors.text }}>
                  Este é um exemplo de como suas cores ficarão no sistema.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload de Logos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Logos da BOX</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Logo Principal */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Logo Principal (Quadrado)</Label>
              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50">
                <label htmlFor="main-logo" className="flex flex-col items-center justify-center cursor-pointer">
                  <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
                    PNG/SVG<br />200x200px
                  </p>
                  <input 
                    id="main-logo" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleLogoUpload('main', e)}
                  />
                </label>
              </div>
              {logos.main && (
                <p className="text-sm text-green-600">✓ {logos.main.name}</p>
              )}
            </div>

            {/* Logo Horizontal */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Logo Horizontal</Label>
              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50">
                <label htmlFor="horizontal-logo" className="flex flex-col items-center justify-center cursor-pointer">
                  <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
                    PNG/SVG<br />400x100px
                  </p>
                  <input 
                    id="horizontal-logo" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleLogoUpload('horizontal', e)}
                  />
                </label>
              </div>
              {logos.horizontal && (
                <p className="text-sm text-green-600">✓ {logos.horizontal.name}</p>
              )}
            </div>

            {/* Favicon */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Favicon</Label>
              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50">
                <label htmlFor="favicon" className="flex flex-col items-center justify-center cursor-pointer">
                  <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
                    ICO/PNG<br />32x32px
                  </p>
                  <input 
                    id="favicon" 
                    type="file" 
                    className="hidden" 
                    accept="image/*,.ico"
                    onChange={(e) => handleLogoUpload('favicon', e)}
                  />
                </label>
              </div>
              {logos.favicon && (
                <p className="text-sm text-green-600">✓ {logos.favicon.name}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paleta de Cores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Paleta de Cores</span>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={generateHarmony}>
                <Palette className="h-4 w-4 mr-2" />
                Gerar Harmonia
              </Button>
              <Button variant="outline" size="sm" onClick={resetColors}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Resetar
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label className="capitalize">{key === 'primary' ? 'Primária' : key === 'secondary' ? 'Secundária' : key === 'accent' ? 'Destaque' : key === 'text' ? 'Texto' : key === 'background' ? 'Fundo' : key === 'muted' ? 'Neutro' : 'Borda'}</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-12 h-10 rounded border cursor-pointer"
                  />
                  <Input
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="flex-1 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Tema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>Configurações de Tema</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Modo de Cor</Label>
              <Select value={theme.mode} onValueChange={(value) => setTheme({ ...theme, mode: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4" />
                      <span>Claro</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center space-x-2">
                      <Moon className="h-4 w-4" />
                      <span>Escuro</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="auto">
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-4 w-4" />
                      <span>Automático</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estilo Visual</Label>
              <Select value={theme.style} onValueChange={(value) => setTheme({ ...theme, style: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Moderno</SelectItem>
                  <SelectItem value="classic">Clássico</SelectItem>
                  <SelectItem value="minimal">Minimalista</SelectItem>
                  <SelectItem value="bold">Arrojado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Densidade do Layout</Label>
              <Select value={theme.density} onValueChange={(value) => setTheme({ ...theme, density: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compacto</SelectItem>
                  <SelectItem value="comfortable">Confortável</SelectItem>
                  <SelectItem value="spacious">Espaçoso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Raio das Bordas</Label>
              <Select value={theme.borderRadius} onValueChange={(value) => setTheme({ ...theme, borderRadius: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  <SelectItem value="small">Pequeno</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                  <SelectItem value="full">Completo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center space-x-2">
                <Type className="h-4 w-4" />
                <span>Fonte</span>
              </Label>
              <Select value={theme.font} onValueChange={(value) => setTheme({ ...theme, font: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Inter (Padrão)</SelectItem>
                  <SelectItem value="roboto">Roboto</SelectItem>
                  <SelectItem value="opensans">Open Sans</SelectItem>
                  <SelectItem value="poppins">Poppins</SelectItem>
                  <SelectItem value="montserrat">Montserrat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg">
        <Save className="h-4 w-4 mr-2" />
        Salvar Personalização Visual
      </Button>
    </div>
  );
};
