import React, { useEffect, useState } from 'react';
import './GraphStyles.scss';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ClosedGraph_Legend } from '../Constants/graphLegends';
import CustomGraphLegend from '../Components/CustomGraphLegend';
import GraphLoading from '../Components/GraphLoading';
import GraphError from '../Components/GraphError';
import { usePRData } from '../hooks/usePRData';
import { TeamData } from '../../../services/ProjectTeams';  
interface ClosedGraphProps {
  selectedTeam: TeamData;
  projectId: string;
  year: number;
}


const ClosedGraph: React.FC<ClosedGraphProps> = ({ selectedTeam, projectId, year }) => {
  console.log("Closed Graph")
  const {error,loading,data} =usePRData(selectedTeam.teamId, projectId, year)

  if (loading) {
    return <GraphLoading />
  }

  if (error) {
    return <GraphError />
  }

  return (
    <div className="merged-graph">
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
          {ClosedGraph_Legend.map((col)=>( <Bar dataKey={col.dataKey} fill={col.color} barSize={18} radius={[4, 4, 0, 0]} />))}
          </BarChart>
      </ResponsiveContainer>
      <CustomGraphLegend colors={ClosedGraph_Legend}/>
    </div>
  );
};

export default React.memo(ClosedGraph); 



