import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';

interface AthleteImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; error: string }>;
}

export const AthleteImportDialog: React.FC<AthleteImportDialogProps> = ({
  open,
  onOpenChange,
  onImportComplete,
}) => {
  const { currentCompany } = useCompany();
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const template = [
      {
        'Nome *': 'João Silva',
        'Email *': 'joao@exemplo.com',
        'Telefone': '+351 912 345 678',
        'Data Nascimento (YYYY-MM-DD)': '1990-05-15',
        'Género (male/female/other)': 'male',
        'Morada': 'Rua Principal, 123, Lisboa',
        'NIF': '123456789',
        'NISS': '12345678901',
        'Cartão Cidadão': '000000000ZZ0',
        'Validade CC (YYYY-MM-DD)': '2030-12-31',
        'Contacto Emergência Nome': 'Maria Silva',
        'Contacto Emergência Telefone': '+351 913 456 789',
        'Plano': 'unlimited',
        'Personal Trainer': '',
        'Mensalidade (€)': '75',
        'Status (active/inactive/frozen/pending)': 'active',
        'Notas Médicas': '',
        'Objetivos (separados por vírgula)': 'Perder peso, Ganhar massa muscular',
        'Tags (separados por vírgula)': 'VIP, Iniciante',
        'Notas': 'Observações adicionais',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Atletas');

    // Ajustar largura das colunas
    const colWidths = Object.keys(template[0]).map((key) => ({
      wch: Math.max(key.length, 20),
    }));
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, 'modelo_importacao_atletas.xlsx');
    toast.success('Modelo descarregado com sucesso!');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!currentCompany?.id) {
      toast.error('Empresa não selecionada');
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const results: ImportResult = {
        success: 0,
        failed: 0,
        errors: [],
      };

      for (let i = 0; i < jsonData.length; i++) {
        const row: any = jsonData[i];
        const rowNumber = i + 2; // +2 porque: linha 1 é cabeçalho, índice começa em 0

        try {
          // Validar campos obrigatórios
          if (!row['Nome *'] || !row['Email *']) {
            throw new Error('Nome e Email são obrigatórios');
          }

          // Preparar dados para inserção
          const athleteData = {
            company_id: currentCompany.id,
            name: row['Nome *'],
            email: row['Email *'],
            phone: row['Telefone'] || null,
            birth_date: row['Data Nascimento (YYYY-MM-DD)'] || null,
            gender: row['Género (male/female/other)'] || null,
            address: row['Morada'] || null,
            nif: row['NIF'] || null,
            niss: row['NISS'] || null,
            cc_number: row['Cartão Cidadão'] || null,
            cc_expiry_date: row['Validade CC (YYYY-MM-DD)'] || null,
            emergency_contact_name: row['Contacto Emergência Nome'] || null,
            emergency_contact_phone: row['Contacto Emergência Telefone'] || null,
            plan: row['Plano'] || null,
            trainer: row['Personal Trainer'] || null,
            monthly_fee: row['Mensalidade (€)'] ? parseFloat(row['Mensalidade (€)']) : 0,
            status: row['Status (active/inactive/frozen/pending)'] || 'active',
            medical_notes: row['Notas Médicas'] || null,
            goals: row['Objetivos (separados por vírgula)']
              ? row['Objetivos (separados por vírgula)'].split(',').map((g: string) => g.trim())
              : [],
            tags: row['Tags (separados por vírgula)']
              ? row['Tags (separados por vírgula)'].split(',').map((t: string) => t.trim())
              : [],
            notes: row['Notas'] || null,
            is_approved: true,
            approved_at: new Date().toISOString(),
          };

          const { error } = await supabase.from('athletes').insert(athleteData);

          if (error) {
            throw error;
          }

          results.success++;
        } catch (error: any) {
          results.failed++;
          results.errors.push({
            row: rowNumber,
            error: error.message || 'Erro desconhecido',
          });
        }
      }

      setResult(results);

      if (results.success > 0) {
        toast.success(`${results.success} atleta(s) importado(s) com sucesso!`);
        onImportComplete();
      }

      if (results.failed > 0) {
        toast.error(`${results.failed} atleta(s) falharam na importação`);
      }
    } catch (error: any) {
      console.error('Erro ao processar arquivo:', error);
      toast.error('Erro ao processar arquivo Excel');
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar Atletas via Excel
          </DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo Excel com os dados dos atletas para importação em massa.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Instruções */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Como usar:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Baixe o modelo Excel clicando no botão abaixo</li>
                  <li>Preencha os dados dos atletas no modelo</li>
                  <li>Certifique-se de que Nome e Email estão preenchidos (obrigatórios)</li>
                  <li>Faça upload do arquivo preenchido</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>

          {/* Botão para baixar modelo */}
          <Button
            onClick={downloadTemplate}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" />
            Descarregar Modelo Excel
          </Button>

          {/* Input de arquivo */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={importing}
              className="hidden"
              id="excel-upload"
            />
            <label
              htmlFor="excel-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="p-4 bg-primary/10 rounded-full">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {importing ? 'A processar...' : 'Clique para selecionar arquivo Excel'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Formatos aceitos: .xlsx, .xls
                </p>
              </div>
            </label>
          </div>

          {/* Resultado da importação */}
          {result && (
            <div className="space-y-3">
              {result.success > 0 && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>{result.success}</strong> atleta(s) importado(s) com sucesso!
                  </AlertDescription>
                </Alert>
              )}

              {result.failed > 0 && (
                <Alert variant="destructive">
                  <X className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p>
                        <strong>{result.failed}</strong> atleta(s) falharam:
                      </p>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {result.errors.map((error, idx) => (
                          <p key={idx} className="text-sm">
                            • Linha {error.row}: {error.error}
                          </p>
                        ))}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Botão fechar */}
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full"
            disabled={importing}
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
