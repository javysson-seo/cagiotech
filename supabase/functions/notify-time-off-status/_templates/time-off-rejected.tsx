import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface TimeOffRejectedEmailProps {
  staffName: string;
  companyName: string;
  requestType: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason?: string;
  rejectionReason?: string;
}

export const TimeOffRejectedEmail = ({
  staffName,
  companyName,
  requestType,
  startDate,
  endDate,
  daysCount,
  reason,
  rejectionReason,
}: TimeOffRejectedEmailProps) => {
  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      vacation: 'Férias',
      sick_leave: 'Licença Médica',
      personal: 'Licença Pessoal',
      other: 'Outro'
    };
    return labels[type] || type;
  };

  return (
    <Html>
      <Head />
      <Preview>Seu pedido de {getTypeLabel(requestType)} foi rejeitado</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>❌ Pedido Rejeitado</Heading>
          
          <Text style={text}>
            Olá <strong>{staffName}</strong>,
          </Text>
          
          <Text style={text}>
            Infelizmente, seu pedido de <strong>{getTypeLabel(requestType)}</strong> foi rejeitado.
          </Text>

          <Section style={detailsBox}>
            <Text style={detailsTitle}>Detalhes do Pedido:</Text>
            <Text style={detailsText}>
              <strong>Tipo:</strong> {getTypeLabel(requestType)}
            </Text>
            <Text style={detailsText}>
              <strong>Período:</strong> {new Date(startDate).toLocaleDateString('pt-BR')} até {new Date(endDate).toLocaleDateString('pt-BR')}
            </Text>
            <Text style={detailsText}>
              <strong>Duração:</strong> {daysCount} {daysCount === 1 ? 'dia' : 'dias'}
            </Text>
            {reason && (
              <Text style={detailsText}>
                <strong>Seu motivo:</strong> {reason}
              </Text>
            )}
          </Section>

          {rejectionReason && (
            <Section style={rejectionBox}>
              <Text style={rejectionTitle}>Motivo da Rejeição:</Text>
              <Text style={rejectionText}>{rejectionReason}</Text>
            </Section>
          )}

          <Text style={text}>
            Entre em contato com seu gestor para mais informações ou para discutir outras datas.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Este é um email automático de <strong>{companyName}</strong>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default TimeOffRejectedEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#dc2626',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 24px',
};

const detailsBox = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px',
};

const detailsTitle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const detailsText = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
};

const rejectionBox = {
  backgroundColor: '#fef2f2',
  borderRadius: '8px',
  borderLeft: '4px solid #dc2626',
  padding: '24px',
  margin: '24px',
};

const rejectionTitle = {
  color: '#991b1b',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const rejectionText = {
  color: '#7f1d1d',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 24px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  margin: '24px',
};
