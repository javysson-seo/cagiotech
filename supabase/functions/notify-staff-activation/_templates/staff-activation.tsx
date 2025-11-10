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

interface StaffActivationEmailProps {
  staffName: string;
  staffEmail: string;
  staffPosition: string;
  companyName: string;
  activationDate: string;
}

export const StaffActivationEmail = ({
  staffName,
  staffEmail,
  staffPosition,
  companyName,
  activationDate,
}: StaffActivationEmailProps) => (
  <Html>
    <Head />
    <Preview>Funcionário {staffName} ativou sua conta no sistema</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>✅ Conta de Funcionário Ativada</Heading>
        
        <Text style={text}>
          Olá!
        </Text>

        <Text style={text}>
          O funcionário <strong>{staffName}</strong> completou a ativação da conta e alterou a senha padrão com sucesso.
        </Text>

        <Section style={informationBox}>
          <Text style={informationTitle}>Informações do Funcionário:</Text>
          <Text style={informationItem}>
            <strong>Nome:</strong> {staffName}
          </Text>
          <Text style={informationItem}>
            <strong>Email:</strong> {staffEmail}
          </Text>
          <Text style={informationItem}>
            <strong>Cargo:</strong> {staffPosition}
          </Text>
          <Text style={informationItem}>
            <strong>Data de Ativação:</strong> {activationDate}
          </Text>
        </Section>

        <Text style={text}>
          A conta agora está totalmente ativa e o funcionário pode acessar o sistema com as permissões atribuídas ao seu cargo.
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          <strong>{companyName}</strong><br />
          Sistema de Gestão Cagio
        </Text>
        
        <Text style={footerNote}>
          Este é um email automático. Por favor, não responda a esta mensagem.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default StaffActivationEmail;

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
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
};

const h1 = {
  color: '#10b981',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0 40px',
  lineHeight: '1.4',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 40px',
};

const informationBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  margin: '24px 40px',
  padding: '20px',
};

const informationTitle = {
  color: '#10b981',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const informationItem = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 40px',
};

const footer = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '16px 40px 8px',
};

const footerNote = {
  color: '#94a3b8',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '8px 40px',
  fontStyle: 'italic',
};
