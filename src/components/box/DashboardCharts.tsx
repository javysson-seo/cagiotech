
import React from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DashboardCharts: React.FC = () => {
  // Mock data para os gráficos
  const evolucaoMembros = [
    { mes: 'Jan', membros: 120 },
    { mes: 'Fev', membros: 125 },
    { mes: 'Mar', membros: 135 },
    { mes: 'Abr', membros: 140 },
    { mes: 'Mai', membros: 147 },
  ];

  const receitasDespesas = [
    { mes: 'Jan', receitas: 8200, despesas: 4500 },
    { mes: 'Fev', receitas: 8400, despesas: 4600 },
    { mes: 'Mar', receitas: 8600, despesas: 4400 },
    { mes: 'Abr', receitas: 8300, despesas: 4700 },
    { mes: 'Mai', receitas: 8750, despesas: 4800 },
  ];

  const ocupacaoSalas = [
    { name: 'Sala 1', value: 85, color: '#3b82f6' },
    { name: 'Sala 2', value: 72, color: '#8b5cf6' },
    { name: 'Sala 3', value: 68, color: '#06b6d4' },
    { name: 'Livre', value: 25, color: '#e5e7eb' },
  ];

  const topModalidades = [
    { modalidade: 'CrossFit', participantes: 95 },
    { modalidade: 'Funcional', participantes: 67 },
    { modalidade: 'Yoga', participantes: 42 },
    { modalidade: 'HIIT', participantes: 38 },
    { modalidade: 'Mobilidade', participantes: 28 },
  ];

  return (
    <>
      {/* Evolução de Membros */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Evolução de Membros</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={evolucaoMembros}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="membros" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Receitas vs Despesas */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Receitas vs Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={receitasDespesas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`€${value}`, '']}
              />
              <Legend />
              <Bar dataKey="receitas" fill="#10b981" name="Receitas" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesas" fill="#ef4444" name="Despesas" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Ocupação de Salas */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Ocupação de Salas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={ocupacaoSalas}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {ocupacaoSalas.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}%`, 'Ocupação']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Modalidades */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top Modalidades</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={topModalidades}
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#666" fontSize={12} />
              <YAxis 
                dataKey="modalidade" 
                type="category" 
                stroke="#666" 
                fontSize={12}
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value} participantes`, '']}
              />
              <Bar 
                dataKey="participantes" 
                fill="#8b5cf6" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
};
