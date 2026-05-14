import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface LatencyData {
  time: string;
  api: number;
  fraud: number;
  payment: number;
}

interface LatencyChartProps {
  data: LatencyData[];
}

export function LatencyChart({ data }: LatencyChartProps) {
  const gradients = [
    { id: "apiGrad", color: "#3b82f6" },
    { id: "fraudGrad", color: "#10b981" },
    { id: "payGrad", color: "#f59e0b" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-1">Service Latency — Today</h3>
      <p className="text-xs text-gray-400 mb-4 font-medium">Average response times (ms)</p>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {gradients.map((grad) => (
              <linearGradient key={grad.id} id={grad.id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={grad.color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={grad.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 500 }} 
            axisLine={false} 
            tickLine={false} 
            dy={10}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 500 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <Tooltip 
            contentStyle={{ 
              fontSize: 11, 
              borderRadius: 12, 
              border: "none", 
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" 
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="api" 
            name="API Gateway" 
            stroke="#3b82f6" 
            fill="url(#apiGrad)" 
            strokeWidth={2.5} 
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="fraud" 
            name="Fraud Engine" 
            stroke="#10b981" 
            fill="url(#fraudGrad)" 
            strokeWidth={2.5} 
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="payment" 
            name="Payment" 
            stroke="#f59e0b" 
            fill="url(#payGrad)" 
            strokeWidth={2.5} 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
