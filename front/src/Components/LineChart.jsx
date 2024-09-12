import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTheme } from '@mui/material';
import { tokens } from '../theme';

const LineChart = ({ data, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveLine
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[900],
            },
          },
          legend: {
            text: {
              fill: colors.grey[900],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[900],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[900],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[900],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={['#ff0000']} // Set a fixed color for the lines
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{
        type: "time",
        format: "%Y-%m-%dT%H:%M:%S.%LZ", // ISO format
        useUTC: false,
        precision: "month", // Display monthly precision
      }}
      yScale={{
        type: "linear",
        min: 0,
        max: "auto",
        stacked: false, // Single line
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom" // Smooth curve
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Month",
        legendOffset: 36,
        legendPosition: "middle",
        format: (value) => new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        }),
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Value",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      lineWidth={2}
      borderColor={{ from: 'color', modifiers: [] }}
    />
  );
};

export default LineChart;
