import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { FaCamera, FaCreditCard, FaDollarSign, FaChartLine, FaCaretUp, FaCaretDown } from 'react-icons/fa6';
import { formatSalesNumber } from '../../utils/globalFunction';

// Default configuration for rounded bars
const RoundedBar = memo(({ x, y, width, height, fill, radius = 8, widthRatio = 0.6 }) => {
  const thinnerWidth = width * widthRatio;
  const xAdjusted = x + (width - thinnerWidth) / 2;

  return (
    <rect
      x={xAdjusted}
      y={y}
      width={thinnerWidth}
      height={height}
      fill={fill}
      rx={radius}
      ry={radius}
    />
  );
});

// Predefined icons for different metric types
const METRIC_ICONS = {
  revenue: {
    icon: <FaCamera className="text-[#883DCF] w-6 h-6" />,
    bg: 'bg-purple-100'
  },
  commission: {
    icon: <FaCreditCard className="text-orange-600 w-6 h-6" />,
    bg: 'bg-orange-100'
  },
  profit: {
    icon: <FaDollarSign className="text-[#2BB2FE] text-md w-6 h-6" />,
    bg: 'glassy-card'
  },
  default: {
    icon: <FaChartLine className="glassy-text-secondary w-6 h-6" />,
    bg: 'glassy-card'
  }
};

/**
 * RevenueDashboard - A customizable dashboard component for displaying revenue metrics and charts
 * 
 * @param {Object} props - Component props
 * @param {string} [props.title="Revenue Dashboard"] - Dashboard title
 * @param {string} [props.subtitle="Performance Overview"] - Dashboard subtitle
 * @param {Array} [props.chartData=[]] - Data for the bar chart
 * @param {Array} [props.metrics=[]] - Array of metric objects to display
 * @param {Function} [props.onBarClick] - Callback when a bar is clicked
 * @param {Function} [props.onMetricClick] - Callback when a metric card is clicked
 */
const RevenueDashboard = ({
  title = "Revenue Dashboard",
  subtitle = "Performance Overview",
  className = "",
  chartData = [],
  chartHeight = 250,
  barSize = 24,
  yAxisTicks,
  xAxisKey = "month",
  barColors = ['#883DCF', '#F86624', '#0EA5E9'],
  showGrid = true,
  metrics = [],
  metricLayout = "grid",
  customTooltip,
  currencyFormatter = (value) =>
    formatSalesNumber(value),
  onBarClick,
  onMetricClick,
  emptyState
}) => {
  const renderTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;

    if (customTooltip) {
      return customTooltip({ active, payload, label });
    }

    return (
      <div className="rounded-md shadow-md border border-gray-200">
        <p className="font-medium glassy-text-primary">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center justify-between mt-1">
            <div className="flex items-center">
              <div
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm glassy-text-secondary">{entry.name}:</span>
            </div>
            <span className="text-sm font-medium ml-2">
              {formatSalesNumber(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

 const renderMetricValue = (value, change) => (
  <div className="flex items-center justify-start gap-3">
    <span className="text-2xl font-semibold">
      {formatSalesNumber(value)}
    </span>
    {change !== undefined && (
      <span className={`flex items-center justify-start gap-1 text-sm 
      ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        <span className='font-bold'>{Math.abs(change)}%</span>
        {change >= 0 ? (
          <FaCaretUp className="w-4 h-4" />
        ) : (
          <FaCaretDown className="w-4 h-4" />
        )}
      </span>
    )}
  </div>
);

  return (
    <div className={`p-4 glassy-card/80 rounded-lg shadow-md  ${className}`}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold glassy-text-primary mb-1">{title}</h2>
        {subtitle && <p className="text-sm font-medium text-[#667085]">{subtitle}</p>}
      </div>

      {metrics?.length > 0 && (
        <div className={`mb-8 ${metricLayout === 'grid' ? 'flex md:flex-row flex-col justify-start items-center gap-3 ' : 'flex flex-wrap gap-4'
          }`}>
          {metrics.map((metric, index) => {
            const iconConfig = METRIC_ICONS[metric.key] || METRIC_ICONS.default;

            return (
              <div
                key={`metric-${index}`}
                className={`flex justify-start items-start flex-wrap gap-4 rounded-lg ${onMetricClick ? 'cursor-pointer hover:glassy-card mr-6' : ''
                  }`}
                onClick={() => onMetricClick && onMetricClick(metric)}
              >
                <div className={`${iconConfig.bg} p-2 rounded`}>
                  {iconConfig.icon}
                </div>
                <div>
                  <p className="text-sm glassy-text-secondary mb-1">{metric.name || metric.key}</p>
                  {renderMetricValue(metric.value, metric.change)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {chartData.length > 0 ? (
        <div style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              barSize={barSize}
              onClick={onBarClick}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => currencyFormatter(value).replace(/[^0-9]/g, '')}
                ticks={yAxisTicks}
              />
              <Tooltip content={renderTooltip} />

              {chartData.length > 0 && Object.keys(chartData[0])
                .filter(key => key !== xAxisKey)
                .map((dataKey, index) => (
                  <Bar
                    key={`bar-${dataKey}`}
                    dataKey={dataKey}
                    fill={barColors[index % barColors.length]}
                    shape={<RoundedBar />}
                    name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        emptyState || (
          <div className="flex items-center justify-center h-64 glassy-text-secondary">
            No chart data available
          </div>
        )
      )}
    </div>
  );
};

export default RevenueDashboard;