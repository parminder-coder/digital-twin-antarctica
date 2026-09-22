import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as echarts from 'echarts';
import { 
  toggleElementVisibility, 
  setAllElementsVisibility, 
  selectSingleElementOnly 
} from '../../store/telemetrySlice';
import './apacheEChart.css';

export default function ApacheEChart({ dataset }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const dispatch = useDispatch();
  const visibleElements = useSelector((state) => state.telemetry.visibleElements);

  if (!dataset || !dataset.rows || dataset.rows.length === 0) {
    return (
      <div className="chart-card-container empty-state">
        <p>No telemetry records available for this station.</p>
      </div>
    );
  }

  const { columns, rows } = dataset;
  
  // Categorize x-axis key (recorded_at or item_name)
  const isCategoryX = dataset.table === 'inventory';
  const xAxisKey = isCategoryX ? 'item_name' : 'recorded_at';
  const xAxisData = rows.map((r) => r[xAxisKey]);

  // Telemetry metrics available for toggling
  const metricColumns = columns.filter(
    (col) => col.key !== 'recorded_at' && col.key !== 'item_name' && col.key !== 'category'
  );

  // Active series matching user's element selection toggles
  const activeColumns = metricColumns.filter((col) => visibleElements[col.key] !== false);

  // Initialize and update Apache ECharts instance
  useEffect(() => {
    if (!chartRef.current) return;

    // Dispose old chart instance if existing
    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispose();
    }

    const chartInstance = echarts.init(chartRef.current, 'light', {
      renderer: 'canvas'
    });
    chartInstanceRef.current = chartInstance;

    // Determine Y-Axes needed (Primary left axis and Secondary right axis)
    const hasAxis0 = activeColumns.some((col) => col.axis === 0 || col.axis === undefined);
    const hasAxis1 = activeColumns.some((col) => col.axis === 1);

    const yAxes = [];
    if (hasAxis0 || activeColumns.length === 0) {
      yAxes.push({
        type: 'value',
        name: activeColumns.filter(c => c.axis === 0 || c.axis === undefined).map(c => c.unit).filter(Boolean).join(' / ') || 'Value',
        nameTextStyle: { color: '#64748b', fontSize: 11 },
        position: 'left',
        splitLine: { lineStyle: { color: '#f1f5f9' } },
        axisLabel: { color: '#475569', fontSize: 11 }
      });
    }
    if (hasAxis1) {
      yAxes.push({
        type: 'value',
        name: activeColumns.filter(c => c.axis === 1).map(c => c.unit).filter(Boolean).join(' / ') || 'Secondary Metric',
        nameTextStyle: { color: '#64748b', fontSize: 11 },
        position: 'right',
        splitLine: { show: false },
        axisLabel: { color: '#475569', fontSize: 11 }
      });
    }

    // Build series objects for Apache ECharts
    const series = activeColumns.map((col) => {
      const yAxisIndex = (col.axis === 1 && hasAxis0) ? 1 : 0;
      const isBarChart = isCategoryX && col.key === 'quantity';

      return {
        name: col.name,
        type: isBarChart ? 'bar' : 'line',
        yAxisIndex: yAxisIndex,
        smooth: true,
        showSymbol: rows.length <= 15,
        symbolSize: 6,
        data: rows.map((r) => r[col.key]),
        itemStyle: { color: col.color || '#2563eb' },
        lineStyle: { width: 2.5 },
        areaStyle: isBarChart ? null : {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: (col.color || '#2563eb') + '33' },
            { offset: 1, color: (col.color || '#2563eb') + '00' }
          ])
        }
      };
    });

    const option = {
      backgroundColor: '#ffffff',
      title: {
        text: `${dataset.table.toUpperCase()} TELEMETRY PLOT`,
        subtext: `Station: ${dataset.station_code} • Showing ${activeColumns.length} of ${metricColumns.length} metrics`,
        left: 'left',
        textStyle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
        subtextStyle: { fontSize: 11, color: '#64748b' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross', label: { backgroundColor: '#334155' } },
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderColor: '#334155',
        textStyle: { color: '#ffffff', fontSize: 12 },
        formatter: (params) => {
          if (!params || params.length === 0) return '';
          let header = `<div style="font-weight:bold;margin-bottom:4px;border-bottom:1px solid #475569;padding-bottom:4px">${params[0].name}</div>`;
          params.forEach((item) => {
            const colDef = metricColumns.find((c) => c.name === item.seriesName);
            const unit = colDef ? colDef.unit : '';
            header += `<div style="display:flex;justify-content:space-between;gap:16px;margin:2px 0">
              <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${item.color};margin-right:6px"></span>${item.seriesName}:</span>
              <strong style="color:#60a5fa">${item.value} ${unit}</strong>
            </div>`;
          });
          return header;
        }
      },
      grid: {
        left: '4%',
        right: hasAxis1 ? '5%' : '3%',
        bottom: isCategoryX ? '12%' : '15%',
        top: '18%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: isCategoryX,
        data: xAxisData,
        axisLabel: {
          color: '#475569',
          fontSize: 10,
          rotate: isCategoryX ? 15 : 0
        },
        axisLine: { lineStyle: { color: '#cbd5e1' } }
      },
      yAxis: yAxes,
      dataZoom: [
        {
          type: 'slider',
          show: !isCategoryX,
          bottom: 4,
          height: 16,
          borderColor: '#e2e8f0',
          fillerColor: 'rgba(37, 99, 235, 0.15)',
          handleStyle: { color: '#2563eb' }
        },
        { type: 'inside' }
      ],
      series: series
    };

    chartInstance.setOption(option);

    const handleResize = () => {
      chartInstance.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.dispose();
    };
  }, [dataset, visibleElements]);

  return (
    <div className="chart-card-container">
      {/* Dynamic Element Visibility Filter Bar */}
      <div className="chart-controls-bar">
        <div className="controls-title-group">
          <span className="controls-label">Toggle Telemetry Metrics:</span>
          <span className="controls-hint">Click elements to view together or separately on this plot</span>
        </div>

        <div className="elements-pill-group">
          <button
            className="pill-action-btn"
            onClick={() => dispatch(setAllElementsVisibility(true))}
            title="Show all metric lines together on plot"
          >
            Show All
          </button>

          {metricColumns.map((col) => {
            const isVisible = visibleElements[col.key] !== false;
            return (
              <div
                key={col.key}
                className={`element-pill ${isVisible ? 'active' : 'inactive'}`}
                style={{
                  '--pill-color': col.color || '#2563eb'
                }}
              >
                <button
                  className="pill-toggle-check"
                  onClick={() => dispatch(toggleElementVisibility(col.key))}
                >
                  <span className="color-dot" style={{ backgroundColor: col.color }}></span>
                  <span className="pill-text">{col.name}</span>
                </button>

                <button
                  className="pill-only-btn"
                  onClick={() => dispatch(selectSingleElementOnly(col.key))}
                  title={`View only ${col.name} on plot`}
                >
                  Only
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Single Apache EChart Plot Box */}
      <div className="echart-wrapper">
        <div ref={chartRef} className="echart-container"></div>
      </div>
    </div>
  );
}
