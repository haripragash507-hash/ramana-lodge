import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BookingRecord } from '../../interfaces';

interface AnalyticsLineChartProps {
  bookings: BookingRecord[];
}

const AnalyticsLineChart: React.FC<AnalyticsLineChartProps> = ({ bookings }) => {
  const [graphView, setGraphView] = useState<'weekly' | 'monthly' | 'yearly'>(
    () => (sessionStorage.getItem('analytics_graph_view') as any) || 'monthly'
  );

  const [baseDate, setBaseDate] = useState<Date>(() => {
    const saved = sessionStorage.getItem('analytics_base_date');
    return saved ? new Date(saved) : new Date();
  });

  React.useEffect(() => {
    sessionStorage.setItem('analytics_graph_view', graphView);
  }, [graphView]);

  React.useEffect(() => {
    sessionStorage.setItem('analytics_base_date', baseDate.toISOString());
  }, [baseDate]);

  const handlePrev = () => {
    const nd = new Date(baseDate);
    if (graphView === 'weekly') nd.setMonth(nd.getMonth() - 1);
    else if (graphView === 'monthly') nd.setFullYear(nd.getFullYear() - 1);
    else if (graphView === 'yearly') nd.setFullYear(nd.getFullYear() - 5);
    setBaseDate(nd);
  };

  const handleNext = () => {
    const nd = new Date(baseDate);
    if (graphView === 'weekly') nd.setMonth(nd.getMonth() + 1);
    else if (graphView === 'monthly') nd.setFullYear(nd.getFullYear() + 1);
    else if (graphView === 'yearly') nd.setFullYear(nd.getFullYear() + 5);
    setBaseDate(nd);
  };

  const getLabel = () => {
    if (graphView === 'weekly') return baseDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (graphView === 'monthly') return `Year ${baseDate.getFullYear()}`;
    const by = baseDate.getFullYear();
    return `${by - 2} - ${by + 2}`;
  };

  const graphData = React.useMemo(() => {
    if (graphView === 'weekly') {
       // Filter to current baseDate month/year
       const buckets = [0, 0, 0, 0, 0];
       bookings.forEach(b => {
         const d = new Date(b.dateBooked);
         if (d.getMonth() === baseDate.getMonth() && d.getFullYear() === baseDate.getFullYear()) {
           let w = Math.ceil(d.getDate() / 7) - 1;
           if (w > 4) w = 4; // cap at 5
           buckets[w]++;
         }
       });
       return buckets.map((v, i) => ({ name: `Week ${i + 1}`, total: v }));
    }
    else if (graphView === 'monthly') {
       const buckets = Array(12).fill(0);
       bookings.forEach(b => {
         const d = new Date(b.dateBooked);
         if (d.getFullYear() === baseDate.getFullYear()) {
           buckets[d.getMonth()]++;
         }
       });
       const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
       return buckets.map((v, i) => ({ name: monthNames[i], total: v }));
    }
    else {
       // Yearly
       const by = baseDate.getFullYear();
       const buckets = [0, 0, 0, 0, 0];
       bookings.forEach(b => {
         const d = new Date(b.dateBooked);
         const y = d.getFullYear();
         const diff = y - (by - 2);
         if (diff >= 0 && diff < 5) {
           buckets[diff]++;
         }
       });
       return buckets.map((v, i) => ({ name: `${(by - 2) + i}`, total: v }));
    }
  }, [bookings, graphView, baseDate]);

  return (
    <section className="manage-section">
      <div className="section-header" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h2>Analytics Graph</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px 8px' }}>
            <button onClick={handlePrev} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', color: '#475569' }}><ChevronLeft size={20} /></button>
            <span style={{ fontWeight: 600, minWidth: '120px', textAlign: 'center', color: '#1e293b' }}>{getLabel()}</span>
            <button onClick={handleNext} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', color: '#475569' }}><ChevronRight size={20} /></button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="add-new-btn" 
            style={{ background: graphView === 'weekly' ? '#10b981' : '#e2e8f0', color: graphView === 'weekly' ? '#fff' : '#475569' }} 
            onClick={() => setGraphView('weekly')}>Weekly</button>
          <button 
            className="add-new-btn" 
            style={{ background: graphView === 'monthly' ? '#10b981' : '#e2e8f0', color: graphView === 'monthly' ? '#fff' : '#475569' }} 
            onClick={() => setGraphView('monthly')}>Monthly</button>
          <button 
            className="add-new-btn" 
            style={{ background: graphView === 'yearly' ? '#10b981' : '#e2e8f0', color: graphView === 'yearly' ? '#fff' : '#475569' }} 
            onClick={() => setGraphView('yearly')}>Yearly</button>
        </div>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              stroke="#475569" 
              label={{ value: graphView === 'weekly' ? 'Weeks' : graphView === 'monthly' ? 'Months' : 'Years', position: 'insideBottom', offset: -10 }} 
            />
            <YAxis 
              stroke="#475569" 
              allowDecimals={false} 
              label={{ value: 'Bookings', angle: -90, position: 'insideLeft', offset: 0 }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line type="linear" dataKey="total" name="Total Bookings" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default AnalyticsLineChart;
