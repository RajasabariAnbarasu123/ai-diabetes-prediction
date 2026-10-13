import Card from '../common/Card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const RISK_COLORS = {
  Low: '#4caf50',
  Moderate: '#ff9800',
  High: '#f44336',
  Critical: '#9c27b0',
};

const RiskDistributionChart = ({ title, data }) => {
  // data expected: [{ name: 'Low', value: 10 }, ...]
  const getColor = (name) => RISK_COLORS[name] || '#ccc';

  return (
    <Card title={title || 'Risk Distribution'}>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={45}
            paddingAngle={2}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RiskDistributionChart;