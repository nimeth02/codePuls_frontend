import React, { useEffect, useState } from "react";
import "./GraphStyles.scss";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import GraphLoading from "../Components/GraphLoading";
import GraphError from "../Components/GraphError";
import { GraphProps } from "../Types/GraphType";
import { PRActivityGraph_Legend } from "../Constants/graphLegends";
import CustomGraphLegend from "../Components/CustomGraphLegend";
import { usePRActivityData } from "../hooks/usePRActivityData";
import { useProject } from "../../../context/ProjectContext";
import PRActivityMonthSelector from "../Selectors/PRActivityMonthSelector";


const renderCustomizedLabel = ({ cx, cy }: any) => {


  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="middle"
      style={{ fontSize: 24, fontWeight: 700, fill: "#4636FF" }}
    >
      Team PR Activity
    </text>
  );
};

const PRActivityGraph: React.FC<GraphProps> = ({
  selectedTeam,
  year,
}) => {
  console.log("PR Activity Graph");
  
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const {project}=useProject()

  const { error, loading, data, devTableData } = usePRActivityData(
    selectedTeam.teamId,
    year,
    selectedMonth
  );

  if (loading) {
    return <GraphLoading />;
  }

  if (error) {
    return <GraphError />;
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
                {data.map((entry, index) => {
                  const legendItem = PRActivityGraph_Legend.find(
                    (item) =>
                      item.value === entry.name || item.dataKey === entry.name
                  );
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={legendItem ? legendItem.color : "#ccc"}
                    />
                  );
                })}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <CustomGraphLegend colors={PRActivityGraph_Legend} />
        <PRActivityMonthSelector selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
      </div>
      <div className="pr-activity-table-container">
        <table className="pr-activity-table">
          <thead>
            <tr>
              <th></th>
              <th>Merged</th>
              <th>Abondened</th>
              {project?.providerType == "github" && (
                <>
                  <th>Total Commits</th>
                  <th>Total Changed lines</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {devTableData.map((dev, idx) => (
              <tr key={dev.name}>
                <td className="name">{dev.name}</td>
                <td className="merged" style={{ background: "#2979FF" }}>
                  {dev.mergedCount}{" "}
                </td>
                <td className="not-merged" style={{ background: "#00E6C3" }}>
                  {dev.notMergedCount}{" "}
                </td>
                {project?.providerType == "github" && (
                  <>
                    <td
                      className="Total Commits"
                      style={{ background: "#FFC400" }}
                    >
                      {dev.totalCommits}{" "}
                    </td>
                    <td className="changed lines">
                      <div
                        className="additions"
                        style={{ background: "#2CBA3C" }}
                      >
                        +{dev.totalAdditions}{" "}
                      </div>
                      <div
                        className="deletions"
                        style={{ background: "#B71C1C" }}
                      >
                        -{dev.totalDeletions}{" "}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PRActivityGraph;
