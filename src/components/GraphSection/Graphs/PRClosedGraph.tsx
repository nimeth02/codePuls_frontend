import React, { useEffect, useState } from "react";
import "./GraphStyles.scss";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ClosedGraph_Legend } from "../Constants/graphLegends";
import CustomGraphLegend from "../Components/CustomGraphLegend";
import GraphLoading from "../Components/GraphLoading";
import GraphError from "../Components/GraphError";
import { usePRClosedData } from "../hooks/usePRClosedData";
import { GraphProps } from "../Types/GraphType";

const ClosedGraph: React.FC<GraphProps> = ({ selectedTeam, year }) => {
  console.log("Closed Graph");
  const { error, loading, data } = usePRClosedData(selectedTeam.teamId, year);

  if (loading) {
    return <GraphLoading />;
  }

  if (error) {
    return <GraphError />;
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
          {ClosedGraph_Legend.map((col) => (
            <Bar
              dataKey={col.dataKey}
              fill={col.color}
              barSize={18}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <CustomGraphLegend colors={ClosedGraph_Legend} />
      <div className="pr-status-description-container">
        <h3>What does this graph show?</h3>
        <p>
          This graph visualizes the lifecycle of pull requests based on their{" "}
          <b>created date</b>. It categorizes PRs into different outcomes to
          help teams understand development flow and identify areas for
          improvement.
        </p>
        <div className="pr-status-categories-box">
          <span className="formula-label">Categories:</span>
          <ul className="pr-status-categories">
            <li>
              <b>Merged</b> – PRs that were successfully merged and then closed.
            </li>
            <li>
              <b>Abandoned</b> – PRs that were closed without being merged.
            </li>
            <li>
              <b>Not Updated</b> – PRs that remain open and have not been
              updated in over <b>3 months</b>.
            </li>
          </ul>
        </div>
        <ul className="pr-status-tips">
          <li>
            Tracking merged PRs shows successful contributions reaching the
            codebase.
          </li>
          <li>
            Abandoned PRs may indicate outdated work, shifting priorities, or
            review challenges.
          </li>
          <li>
            Not updated PRs highlight long-stalled contributions that may need
            follow-up.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default React.memo(ClosedGraph);
