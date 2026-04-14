'use client';

import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Measurement } from '@/types';

type MetricOption = {
  key:
    | 'ph'
    | 'turbidity'
    | 'permanganateOxid'
    | 'mineralization'
    | 'salinity'
    | 'hardness'
    | 'calcium'
    | 'magnesium'
    | 'chlorides'
    | 'sulfates'
    | 'hydrocarbonates'
    | 'potassiumSodium'
    | 'overgrowthPercent';
  label: string;
};

const metricOptions: MetricOption[] = [
  { key: 'ph', label: 'pH' },
  { key: 'turbidity', label: 'turbidity' },
  { key: 'permanganateOxid', label: 'Permanganate oxidation' },
  { key: 'mineralization', label: 'Mineralization' },
  { key: 'salinity', label: 'Salinity' },
  { key: 'hardness', label: 'Hardness' },
  { key: 'calcium', label: 'Calcium' },
  { key: 'magnesium', label: 'Magnesium' },
  { key: 'chlorides', label: 'Chlorides' },
  { key: 'sulfates', label: 'Sulfates' },
  { key: 'hydrocarbonates', label: 'Hydrocarbonates' },
  { key: 'potassiumSodium', label: 'Potassium + Sodium' },
  { key: 'overgrowthPercent', label: 'Overgrowth percent' },
];

type Props = {
  measurements: Measurement[];
};

function getColorByPercent(percent: number) {
  if (percent >= 80) return '#22c55e'; // red
  if (percent >= 50) return '#f59e0b'; // yellow
  return '#ef4444'; // green
}

export function WaterQualityChart({ measurements }: Props) {
  const [selectedMetric, setSelectedMetric] =
    useState<MetricOption['key']>('ph');

  const currentMetric = useMemo(
    () => metricOptions.find((m) => m.key === selectedMetric) ?? metricOptions[0],
    [selectedMetric],
  );

  const data = useMemo(() => {
    const prepared = [...measurements]
      .filter((item) => item.recordDate)
      .sort(
        (a, b) =>
          new Date(a.recordDate ?? '').getTime() -
          new Date(b.recordDate ?? '').getTime(),
      )
      .map((item) => ({
        date: item.recordDate
          ? new Date(item.recordDate).toLocaleDateString('ru-RU')
          : '—',
        value: item[selectedMetric] ?? null,
      }))
      .filter(
        (item): item is { date: string; value: number } =>
          item.value !== null && typeof item.value === 'number',
      );

    if (!prepared.length) return [];

    const maxValue = Math.max(...prepared.map((item) => item.value), 1);

    return prepared.map((item) => ({
      ...item,
      percent: (item.value / maxValue) * 100,
    }));
  }, [measurements, selectedMetric]);

  if (!measurements.length) {
    return <div className="muted">Нет данных для графика.</div>;
  }

  return (
    <div className="stack">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 12,
          flexWrap: 'wrap',
        }}
      >
        <strong>Chart parameter:</strong>

        <select
          value={selectedMetric}
          onChange={(e) =>
            setSelectedMetric(e.target.value as MetricOption['key'])
          }
          style={{
            minWidth: 240,
            height: 40,
            padding: '0 12px',
            borderRadius: 10,
            border: '1px solid #cbd5e1',
            background: 'white',
          }}
        >
          {metricOptions.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {!data.length ? (
        <div className="muted">
          Нет числовых данных для параметра: {currentMetric.label}
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: 10,
              fontSize: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 14,
                  height: 14,
                  display: 'inline-block',
                  background: '#ef4444',
                  borderRadius: 4,
                }}
              />
              <span>Below 50%</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 14,
                  height: 14,
                  display: 'inline-block',
                  background: '#f59e0b',
                  borderRadius: 4,
                }}
              />
              <span>50–79.99%</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 14,
                  height: 14,
                  display: 'inline-block',
                  background: '#22c55e',
                  borderRadius: 4,
                }}
              />
              <span>80–100%</span>
            </div>
          </div>

          <div style={{ width: '100%', height: 360 }}>
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number, _name, props) => {
                    const payload = props?.payload as
                      | { percent?: number }
                      | undefined;

                    return [
                      `${value} (${payload?.percent?.toFixed(1) ?? '0'}%)`,
                      currentMetric.label,
                    ];
                  }}
                />
                <Legend />
                <Bar dataKey="value" name={currentMetric.label}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getColorByPercent(entry.percent)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}