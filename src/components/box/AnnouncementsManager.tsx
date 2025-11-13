import React, { useState } from 'react';
import { useCompanyAnnouncements } from '@/hooks/useCompanyAnnouncements';
import { useCompany } from '@/contexts/CompanyContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AnnouncementFormData {
  title: string;
  content: string;
  image_url: string;
  link_url: string;
  background_color: string;
  text_color: string;
  is_active: boolean;
  display_order: number;
  start_date: string;
  end_date: string;
}

export const AnnouncementsManager: React.FC = () => {
  const { currentCompany } = useCompany();
  const { allAnnouncements, isLoadingAll, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useCompanyAnnouncements(currentCompany?.id || '');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    content: '',
    image_url: '',
    link_url: '',
    background_color: '#000000',
    text_color: '#FFFFFF',
    is_active: true,
    display_order: 0,
    start_date: '',
    end_date: '',
  });

  const handleOpenDialog = (announcementId?: string) => {
    if (announcementId) {
      const announcement = allAnnouncements.find(a => a.id === announcementId);
      if (announcement) {
        setEditingId(announcementId);
        setFormData({
          title: announcement.title,
          content: announcement.content || '',
          image_url: announcement.image_url || '',
          link_url: announcement.link_url || '',
          background_color: announcement.background_color,
          text_color: announcement.text_color,
          is_active: announcement.is_active,
          display_order: announcement.display_order,
          start_date: announcement.start_date ? announcement.start_date.split('T')[0] : '',
          end_date: announcement.end_date ? announcement.end_date.split('T')[0] : '',
        });
      }
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        content: '',
        image_url: '',
        link_url: '',
        background_color: '#000000',
        text_color: '#FFFFFF',
        is_active: true,
        display_order: allAnnouncements.length,
        start_date: '',
        end_date: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      company_id: currentCompany?.id || '',
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined,
    };

    if (editingId) {
      await updateAnnouncement.mutateAsync({ id: editingId, ...data });
    } else {
      await createAnnouncement.mutateAsync(data);
    }
    
    handleCloseDialog();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este anúncio?')) {
      await deleteAnnouncement.mutateAsync(id);
    }
  };

  if (isLoadingAll) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Anúncios</h2>
          <p className="text-muted-foreground">Crie anúncios que aparecem no sidebar</p>
        </div>
        <Button onClick={() => handleOpenDialog()} style={{ backgroundColor: '#aeca12' }} className="text-white">
          <Plus className="mr-2 h-4 w-4" />
          Novo Anúncio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allAnnouncements.map((announcement) => (
          <Card key={announcement.id} className="p-4">
            <div 
              className="mb-3 p-3 rounded-md"
              style={{
                backgroundColor: announcement.background_color,
                color: announcement.text_color,
              }}
            >
              {announcement.image_url && (
                <img 
                  src={announcement.image_url} 
                  alt={announcement.title}
                  className="w-full h-24 object-contain mb-2"
                />
              )}
              <h3 className="font-semibold text-sm">{announcement.title}</h3>
              {announcement.content && (
                <p className="text-xs mt-1 line-clamp-2">{announcement.content}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status:</span>
                <Badge variant={announcement.is_active ? 'default' : 'secondary'}>
                  {announcement.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>

              {announcement.start_date && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Início:</span>
                  <span className="text-xs">{format(new Date(announcement.start_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                </div>
              )}

              {announcement.end_date && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Fim:</span>
                  <span className="text-xs">{format(new Date(announcement.end_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                </div>
              )}

              {announcement.link_url && (
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">{announcement.link_url}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDialog(announcement.id)}
                  className="flex-1"
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(announcement.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {allAnnouncements.length === 0 && (
          <Card className="p-8 col-span-full text-center">
            <p className="text-muted-foreground mb-4">Nenhum anúncio criado ainda</p>
            <Button onClick={() => handleOpenDialog()} style={{ backgroundColor: '#aeca12' }} className="text-white">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Anúncio
            </Button>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Anúncio' : 'Novo Anúncio'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="image_url">URL da Imagem</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div>
              <Label htmlFor="link_url">Link (URL)</Label>
              <Input
                id="link_url"
                type="url"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                placeholder="https://exemplo.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="background_color">Cor de Fundo</Label>
                <div className="flex gap-2">
                  <Input
                    id="background_color"
                    type="color"
                    value={formData.background_color}
                    onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.background_color}
                    onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="text_color">Cor do Texto</Label>
                <div className="flex gap-2">
                  <Input
                    id="text_color"
                    type="color"
                    value={formData.text_color}
                    onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.text_color}
                    onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Data de Início</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="end_date">Data de Fim</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Anúncio Ativo</Label>
              </div>

              <div className="flex-1">
                <Label htmlFor="display_order">Ordem de Exibição</Label>
                <Input
                  id="display_order"
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div 
              className="p-4 rounded-md border"
              style={{
                backgroundColor: formData.background_color,
                color: formData.text_color,
              }}
            >
              <p className="text-xs mb-2 opacity-75">Preview:</p>
              {formData.image_url && (
                <img 
                  src={formData.image_url} 
                  alt="Preview"
                  className="w-full h-20 object-contain mb-2"
                />
              )}
              <h4 className="font-semibold text-sm">{formData.title || 'Título do anúncio'}</h4>
              {formData.content && (
                <p className="text-xs mt-1">{formData.content}</p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit" style={{ backgroundColor: '#aeca12' }} className="text-white">
                {editingId ? 'Atualizar' : 'Criar'} Anúncio
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
