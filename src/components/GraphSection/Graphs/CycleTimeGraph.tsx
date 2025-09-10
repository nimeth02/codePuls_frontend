import React, { useEffect, useState } from 'react';
import './GraphStyles.scss';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar
} from 'recharts';
import { CycleTimeData, getCycleTimeData } from '../../../services/CycleTimeService';
import GraphError from '../Components/GraphError';
import GraphLoading from '../Components/GraphLoading';
import { TeamData } from '../../../services/ProjectTeams';
interface CycleTimeGraphProps {
  selectedTeam: TeamData;
  projectId: string;
  year: number;
}



const COLORS = {
  Organization: '#2979FF',
  Count:'#FFC400'
};

const CustomLegend = () => (
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', marginRight: 24 }}>
      <span style={{ width: 16, height: 16, background: COLORS.Organization, borderRadius: '50%', display: 'inline-block', marginRight: 8 }} />
      <span style={{ color: '#222', fontWeight: 500 }}>Organization</span>
    </div>
  </div>
);

const CycleTimeGraph: React.FC<CycleTimeGraphProps> = ({ selectedTeam,projectId, year  }) => {
  console.log("Cycle Time Graph")
  const [data, setData] = useState<CycleTimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getCycleTimeData(projectId,selectedTeam.teamId, year);
        setData(response);
        setError(null);
      } catch (err) {
        setError('Failed to fetch PR data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId,selectedTeam, year]);

  if (loading) {
    return <GraphLoading />
  }

  if (error) {
    return <GraphError />
  }
  
  return (
    <div className="cycle-time-graph">
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={data}
          margin={{ top: 40, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 16 }} />
          <YAxis tick={{ fontSize: 16 }}  />
          <Tooltip />
          
          <Bar type="monotone" dataKey="count" fill={COLORS.Count} strokeWidth={3}  />
          <Line type="monotone" dataKey="averageCycleTimeInDays" stroke={COLORS.Organization} strokeWidth={3} dot={false}/>
       </ComposedChart>
      </ResponsiveContainer>
      <CustomLegend />
    </div>
  );
};

export default CycleTimeGraph; 