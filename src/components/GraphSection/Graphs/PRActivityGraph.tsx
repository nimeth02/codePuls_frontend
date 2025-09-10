import React, { useEffect, useState } from 'react';
import './GraphStyles.scss';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getprActivityData, getUserPRActivityData, prActivityData, UserPRActivityData } from '../../../services/PRActivityService';
import GraphLoading from '../Components/GraphLoading';
import GraphError from '../Components/GraphError';
import { TeamData } from '../../../services/ProjectTeams';  
interface PRActivityGraphProps {
  selectedTeam: TeamData;
  projectId: string;
  year: number;
}


const COLORS = ['#2979FF', '#00E6C3', '#FFC400'];

const renderCustomizedLabel = ({ cx, cy }: any) => {
  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="middle"
      style={{ fontSize: 24, fontWeight: 700, fill: '#4636FF' }}
    >
      Team PR Activity
    </text>
  );
};

const CustomLegend = () => (
  <div className="pr-activity-legend">
    <div className="pr-activity-legend-row">
      <span className="pr-activity-legend-dot" style={{ background: COLORS[0] }} />
      <span>Merged</span>
    </div>
    <div className="pr-activity-legend-row">
      <span className="pr-activity-legend-dot" style={{ background: COLORS[1] }} />
      <span>closed without Merged</span>
    </div>
  </div>
);

const getMergedColor = (value: number) => {
  if (value >= 90) return '#008000'; // dark green
  return '#7CFF7C'; // light green
};
const getNotMergedColor = (value: number) => {
  if (value >= 30) return '#D32F2F'; // lighter red
  return '#B71C1C'; // dark red
};


const PRActivityGraph: React.FC<PRActivityGraphProps> = ({ selectedTeam,projectId,year }) => {
  console.log("PR Activity Graph")
  const [data, setData] = useState<prActivityData[]>([]);
  const [devTableData, setDevTableData] = useState<UserPRActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getprActivityData(projectId,selectedTeam.teamId, year);
        const userresponse=await getUserPRActivityData(projectId,selectedTeam.teamId, year)
        setData(response);
        setDevTableData(userresponse)
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
    <div className="pr-activity-graph scrollable-graph-section">
      <div className="pr-activity-flex">
        <div className="pr-activity-pie-container">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={150}
                innerRadius={100}
                dataKey="count"
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <CustomLegend />
      </div>
      <div className="pr-activity-table-container">
        <table className="pr-activity-table">
          <thead>
            <tr>
              <th></th>
              <th>Merged</th>
              <th>Not Merged</th>
              <th>Total Commits</th>
              <th>Total Changed lines</th>
              {/* <th>Locked</th> */}
            </tr>
          </thead>
          <tbody>
            {devTableData.map((dev, idx) => (
              <tr key={dev.name}>
                <td className='name'>{dev.name}</td>
                <td className="merged" style={{ background: '#2979FF' }}>{dev.mergedCount} </td>
                <td className="not-merged" style={{ background: '#00E6C3' }}>{dev.notMergedCount} </td>
                <td className="Total Commits" style={{ background: '#FFC400' }}>{dev.totalCommits} </td>
                <td className='changed lines'>
                <div className="Additions" style={{ background: getMergedColor(dev.mergedCount) }}>+{dev.totalAdditions} </div>
                <div className="Deletions" style={{ background: getNotMergedColor(dev.mergedCount) }}>-{dev.totalDeletions} </div>
                </td>
                {/* <td className="locked" style={{ background: getLockedColor() }}>{dev.locked} %</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PRActivityGraph; 