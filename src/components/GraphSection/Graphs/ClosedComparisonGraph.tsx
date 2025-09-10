import React, { useEffect, useState } from 'react';
import { BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { Bar } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import { getPRComparisonData, PRComparisonData } from '../../../services/PRClosedComparisonService';
import GraphLoading from '../Components/GraphLoading';
import GraphError from '../Components/GraphError';
import { TeamData } from '../../../services/ProjectTeams';
interface ClosedComparisonGraphProps {
  selectedTeam: TeamData;
  projectId: string;
  year: number;
}

interface graphData {
  name: string;
  
}


const COLORS = {
  Organization: '#2979FF',
  SriLankan: '#00B8D9',
  Sweden: '#FFC400',
};

const CustomLegend = ({ barKeys, data }: { barKeys: any[], data: any[] }) => {
  // Count occurrences of each key in the data
  const getCount = (key: string) => {
    return data.reduce((sum, item) => sum + (item[key] || 0), 0);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
      {barKeys.map((key: string, index: number) => {
        // Clean up the key name for display
        const displayName = key.replace(/_merged$/, '').replace(/_/g, ' ');
        
        return (
          <div 
            key={key}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginRight: 24,
              marginBottom: 8 
            }}
          >
            <span 
              style={{ 
                width: 16, 
                height: 16, 
                background: key.endsWith('_merged') 
                  ? baseColors[index % baseColors.length] 
                  : '#000000',
                borderRadius: '50%', 
                display: 'inline-block', 
                marginRight: 8 
              }} 
            />
            <span style={{ color: '#222', fontWeight: 500 }}>
              {`${displayName}(${getCount(key)})`}
            </span>
          </div>
        );
      })}
    </div>
  );
};

  // Base colors (extendable list)
  const baseColors = [
 
    '#8dd1e1', // Cyan
    '#82ca9d', // Green
    '#ffc658', // Yellow 
    '#8e4585', // Plum
    '#ff4d4f', // Red
    '#83a6ed', // Blue
    '#a4de6c', // Light green
    '#d0ed57', // Lime
    '#8884d8', // Purple
    '#ff7300', // Orange
  ];

 



const ClosedComparisonGraph: React.FC<ClosedComparisonGraphProps> = ({ selectedTeam ,projectId, year}) => {
  console.log("Closed Comparison Graph")
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getPRComparisonData(projectId,year);
    
        // if (!Array.isArray(response)) {
        //   throw new Error('API response is not an array');
        // }
        const transformedData = response?.map(({ month, teams }) => {
          const result: { [key: string]: number | string } = { name: month };
          teams.forEach((team, index) => {
            result[`${team.name}_merged`] = team.merged;
            result[`${team.name}_nonMerged`] = team.nonMerged;
          });
          return result;
        });
        console.log(transformedData);
        
        setData(transformedData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch PR data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, year]);

  const getBarKeys = (data:any) => {
    const keys = new Set();
    data.forEach((item:any) => {
      Object.keys(item).forEach((key) => {
        if (key !== "name" && !keys.has(key)) {
          keys.add(key);
        }
      });
    });
    return Array.from(keys).sort(); // Sort for consistent order
  };


  const colors = [
    "#8884d8",
    "#82ca9d",
  ];
  const barKeys = getBarKeys(data);
  console.log(barKeys);
  

  if (loading) {
    return <GraphLoading />
  }

  if (error) {
    return <GraphError />
  }

  return (
    <div className="non-merged-graph">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 40, right: 30, left: 0, bottom: 0 }}
          barCategoryGap={20}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 16 }} />
          <YAxis tick={{ fontSize: 16 }} />
          <Tooltip />
          {barKeys.map((key:any, index:any) => (
            <Bar
              key={key}
              dataKey={key}
              barSize={18}
              stackId={key.split("_")[0]}
              fill={
                key.endsWith('_merged')
                  ? baseColors[index % baseColors.length]
                  : "#000000"
              }
              name={key} // Display the key (e.g., "team1 merged") in the legend
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <CustomLegend barKeys={barKeys} data={data}/>
    </div>
  );
};

export default ClosedComparisonGraph; 