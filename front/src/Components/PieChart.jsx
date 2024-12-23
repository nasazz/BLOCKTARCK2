import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

// Utility function to format numbers with the euro sign at the end
const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal', // Use decimal format for number
  }).format(value) + ' €'; // Append euro sign
};

const PieChart = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsivePie
      data={data}
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
      margin={{ top: 40, right: 100, bottom: 80, left: 140 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      enableArcLabels={true} // Enable arc labels
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', 9]],
      }}
      arcLabel={(datum) => formatNumber(datum.value)} // Format the arc label
      arcLabelsSkipAngle={10}
      
      // Custom tooltip to display formatted value
      tooltip={({ datum }) => (
        <div
          style={{
            padding: '5px 10px',
            background: '#fff',
            border: `1px solid ${datum.color}`,
          }}
        >
          <strong>{datum.label}</strong>: {formatNumber(datum.value)}
        </div>
      )}
      
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
    />
  );
};

export default PieChart;
