import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@emotion/react";
import { tokens } from "../styles/Themes";

const commonProps = {
  labelSkipWidth: 16,
  labelSkipHeight: 16,
};

// eslint-disable-next-line react/prop-types
const BarChart = ({ title, data }) => {
  let dataKeys = Object.keys(data);
  dataKeys = dataKeys.filter((e) => e !== title);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        {...commonProps}
        data={[data]}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
        }}
        keys={dataKeys}
        margin={{ top: 50, right: 200, bottom: 50, left: 60 }}
        padding={0.3}
        groupMode="grouped"
        indexBy={title}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{
          scheme: theme.palette.mode == "dark" ? "green_blue" : "blues",
        }}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={null}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: title,
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            translateX: 83,
            justify: false,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        role="application"
      />
    </div>
  );
};

export default BarChart;
