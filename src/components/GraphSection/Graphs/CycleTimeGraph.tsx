import React from "react";
import "./GraphStyles.scss";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";
import GraphError from "../Components/GraphError";
import GraphLoading from "../Components/GraphLoading";
import { GraphProps } from "../Types/GraphType";
import { useCycleTimeData } from "../hooks/useCycleTimeData";
import CustomGraphLegend from "../Components/CustomGraphLegend";
import { CycleaTimeGraph_Legend } from "../Constants/graphLegends";

const CycleTimeGraph: React.FC<GraphProps> = ({
  selectedTeam,
  year,
}) => {
  console.log("Cycle Time Graph");
  const { error, loading, data } = useCycleTimeData(
    selectedTeam.teamId,
    year
  );

  if (loading) {
    return <GraphLoading />;
  }
  if (error) {
    return <GraphError />;
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
          <YAxis tick={{ fontSize: 16 }} />
          <Tooltip />
          <Bar
            type="monotone"
            dataKey="count"
            fill={CycleaTimeGraph_Legend[1].color}
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="averageCycleTimeInDays"
            stroke={CycleaTimeGraph_Legend[0].color}
            strokeWidth={3}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <CustomGraphLegend colors={CycleaTimeGraph_Legend} />
      <div className="cycle-time-description-container">
        <h3>What is Cycle Time?</h3>
        <p>
          <b>Cycle Time</b> for a pull request is the total time taken from when
          the PR is opened until it is merged or closed. It helps teams measure
          development efficiency and identify bottlenecks in the review process.
        </p>
        <div className="cycle-time-formula-box">
          <span className="formula-label">Formula:</span>
          <span className="formula-content">
            Cycle Time = <b>PR Closed Date</b> − <b>PR Opened Date</b>
          </span>
        </div>
        <ul className="cycle-time-tips">
          <li>
            Shorter cycle times indicate faster delivery and review processes.
          </li>
          <li>Track trends to spot process improvements or slowdowns.</li>
        </ul>
      </div>
    </div>
  );
};

export default CycleTimeGraph;
