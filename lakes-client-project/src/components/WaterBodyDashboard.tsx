'use client';

import { useEffect, useMemo, useState } from 'react';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '@/lib/api';
import { Measurement, MetricOption, NumericMeasurementKey, WaterBody } from '@/types';
import { formatDate, formatNumber } from '@/utils/format';
import { KpiCard } from './KpiCard';

const metricOptions: MetricOption[] = [
  { key: 'ph', label: 'pH' },
  { key: 'turbidity', label: 'Мутность' },
  { key: 'permanganateOxid', label: 'Перманганатная окисляемость' },
  { key: 'mineralization', label: 'Минерализация' },
  { key: 'salinity', label: 'Солёность' },
  { key: 'hardness', label: 'Жёсткость' },
  { key: 'calcium', label: 'Кальций' },
  { key: 'magnesium', label: 'Магний' },
  { key: 'chlorides', label: 'Хлориды' },
  { key: 'sulfates', label: 'Сульфаты' },
  { key: 'hydrocarbonates', label: 'Гидрокарбонаты' },
  { key: 'potassiumSodium', label: 'Калий/Натрий' },
  { key: 'overgrowthPercent', label: 'Зарастание, %', unit: '%' },
];

function getNumericValue(measurement: Measurement, key: NumericMeasurementKey): number | null {
  const value = measurement[key];
  return typeof value === 'number' && !Number.isNaN(value) ? value : null;
}

export function WaterBodyDashboard({ id }: { id: string }) {
  const [waterBody, setWaterBody] = useState<WaterBody | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState<NumericMeasurementKey>('ph');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    void Promise.all([api.getWaterBodyById(id), api.getWaterBodyMeasurements(id)])
      .then(([body, bodyMeasurements]) => {
        setWaterBody(body);
        const sorted = [...bodyMeasurements].sort((a, b) => {
          const left = a.recordDate ? new Date(a.recordDate).getTime() : 0;
          const right = b.recordDate ? new Date(b.recordDate).getTime() : 0;
          return left - right;
        });
        setMeasurements(sorted);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить данные водоёма');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const availableYears = useMemo(() => {
    const years = Array.from(
      new Set(
        measurements
          .map((item) => (item.recordDate ? new Date(item.recordDate).getFullYear() : null))
          .filter((year): year is number => typeof year === 'number' && !Number.isNaN(year)),
      ),
    ).sort((a, b) => b - a);

    return years;
  }, [measurements]);

  const filteredMeasurements = useMemo(() => {
    return measurements.filter((item) => {
      if (selectedYear === 'all') return true;
      if (!item.recordDate) return false;
      return String(new Date(item.recordDate).getFullYear()) === selectedYear;
    });
  }, [measurements, selectedYear]);

  const chartMetric = metricOptions.find((metric) => metric.key === selectedMetric) || metricOptions[0];

  const chartData = useMemo(() => {
    return filteredMeasurements
      .map((item) => ({
        id: item.id,
        date: formatDate(item.recordDate),
        isoDate: item.recordDate || '',
        value: getNumericValue(item, selectedMetric),
      }))
      .filter((item) => item.value != null);
  }, [filteredMeasurements, selectedMetric]);

  const latestMeasurement = measurements[measurements.length - 1] || null;

  if (loading) {
    return <div className="card">Загрузка дашборда...</div>;
  }

  if (error) {
    return <div className="card">{error}</div>;
  }

  if (!waterBody) {
    return <div className="card">Водоём не найден.</div>;
  }

  return (
    <div className="stack">
      <section className="card stack">
        <div className="page-header align-start">
          <div>
            <h2 className="section-title">{waterBody.name}</h2>
            <p className="page-description">Полная карточка водоёма и графики по всем записям за выбранный год.</p>
          </div>
          <span className="badge">{waterBody.district || 'Без района'}</span>
        </div>

        <div className="grid cards-3">
          <KpiCard title="Всего измерений" value={measurements.length} />
          <KpiCard title="Последняя запись" value={latestMeasurement?.recordDate ? formatDate(latestMeasurement.recordDate) : '—'} />
          <KpiCard title="Доступных годов" value={availableYears.length} />
        </div>
      </section>

      <section className="card stack">
        <h3>Паспорт водоёма</h3>
        <div className="details-grid">
          <div><strong>Район:</strong> {waterBody.district || '—'}</div>
          <div><strong>Локация:</strong> {waterBody.locationDesc || '—'}</div>
          <div><strong>Широта:</strong> {waterBody.latitude ?? '—'}</div>
          <div><strong>Долгота:</strong> {waterBody.longitude ?? '—'}</div>
          <div><strong>Кадастровый номер:</strong> {waterBody.cadastralNumber || '—'}</div>
          <div><strong>Площадь:</strong> {formatNumber(waterBody.passport?.area)}</div>
          <div><strong>Макс. глубина:</strong> {formatNumber(waterBody.passport?.maxDepth)}</div>
          <div><strong>Средняя глубина:</strong> {formatNumber(waterBody.passport?.avgDepth)}</div>
          <div><strong>Длина:</strong> {formatNumber(waterBody.passport?.length)}</div>
          <div><strong>Макс. ширина:</strong> {formatNumber(waterBody.passport?.maxWidth)}</div>
          <div><strong>Объём:</strong> {formatNumber(waterBody.passport?.volume)}</div>
          <div><strong>Рыбохозяйственный тип:</strong> {waterBody.passport?.fisheryType || '—'}</div>
          <div><strong>Ихтиофауна:</strong> {waterBody.passport?.ichthyofauna || '—'}</div>
          <div><strong>Млекопитающие:</strong> {waterBody.passport?.mammals || '—'}</div>
          <div><strong>Беспозвоночные:</strong> {waterBody.passport?.invertebrates || '—'}</div>
          <div><strong>Хоз. описание:</strong> {waterBody.passport?.economicDesc || '—'}</div>
        </div>
      </section>

      <section className="card stack">
        <div className="filters-row">
          <label className="field">
            <span>Год</span>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="all">Все годы</option>
              {availableYears.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Параметр</span>
            <select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value as NumericMeasurementKey)}>
              {metricOptions.map((metric) => (
                <option key={metric.key} value={metric.key}>
                  {metric.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <h3>График измерений</h3>
          <p className="muted">На графике показаны все записи по выбранному параметру за выбранный период.</p>
        </div>

        {chartData.length ? (
          <div className="chart-box">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" minTickGap={24} />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value}${chartMetric.unit ? ` ${chartMetric.unit}` : ''}`, chartMetric.label]}
                  labelFormatter={(label: string) => `Дата: ${label}`}
                />
                <Line type="monotone" dataKey="value" stroke="#1f6feb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty-state">Для выбранных фильтров нет числовых данных.</div>
        )}
      </section>

      <section className="card stack">
        <h3>Все записи</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>pH</th>
                <th>Мутность</th>
                <th>Минерализация</th>
                <th>Солёность</th>
                <th>Жёсткость</th>
                <th>Зарастание %</th>
                <th>Трофический статус</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeasurements.map((item) => (
                <tr key={item.id}>
                  <td>{formatDate(item.recordDate)}</td>
                  <td>{formatNumber(item.ph)}</td>
                  <td>{formatNumber(item.turbidity)}</td>
                  <td>{formatNumber(item.mineralization)}</td>
                  <td>{formatNumber(item.salinity)}</td>
                  <td>{formatNumber(item.hardness)}</td>
                  <td>{formatNumber(item.overgrowthPercent)}</td>
                  <td>{item.trophicStatus || '—'}</td>
                </tr>
              ))}
              {!filteredMeasurements.length ? (
                <tr>
                  <td colSpan={8}>Записи отсутствуют.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
