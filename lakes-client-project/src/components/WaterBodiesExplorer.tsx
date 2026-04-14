'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { WaterBody } from '@/types';
import { MapSelector } from './MapSelector';

export function WaterBodiesExplorer() {
  const [waterBodies, setWaterBodies] = useState<WaterBody[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void api
      .getWaterBodies()
      .then((items) => {
        setWaterBodies(items);
        if (items[0]?.id) {
          setSelectedId(items[0].id);
        }
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить список озёр');
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedWaterBody = useMemo(
    () => waterBodies.find((item) => item.id === selectedId) ?? null,
    [selectedId, waterBodies],
  );

  if (loading) {
    return <div className="card">Загрузка карты и списка озёр...</div>;
  }

  if (error) {
    return <div className="card">{error}</div>;
  }

  return (
    <div className="grid explorer-grid">
      <div className="card stack">
        <div>
          <h3>Карта водоёмов</h3>
          <p className="muted">Выберите водоём на карте MapLibre или через выпадающий список.</p>
        </div>

        <label className="field">
          <span>Выбор озера</span>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            {waterBodies.map((waterBody) => (
              <option key={waterBody.id} value={waterBody.id}>
                {waterBody.name}
              </option>
            ))}
          </select>
        </label>

        <MapSelector waterBodies={waterBodies} selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      <aside className="card stack explorer-side">
        <h3>Выбранный водоём</h3>

        {selectedWaterBody ? (
          <>
            <div className="stack compact-stack">
              <div>
                <div className="muted small-text">Название</div>
                <div className="stat-value">{selectedWaterBody.name}</div>
              </div>
              <div>
                <div className="muted small-text">Район</div>
                <div>{selectedWaterBody.district || '—'}</div>
              </div>
              <div>
                <div className="muted small-text">Описание</div>
                <div>{selectedWaterBody.locationDesc || '—'}</div>
              </div>
              <div className="mini-grid">
                <div>
                  <div className="muted small-text">Широта</div>
                  <div>{selectedWaterBody.latitude ?? '—'}</div>
                </div>
                <div>
                  <div className="muted small-text">Долгота</div>
                  <div>{selectedWaterBody.longitude ?? '—'}</div>
                </div>
              </div>
            </div>

            <Link className="btn" href={`/water-bodies/${selectedWaterBody.id}`}>
              Перейти к дашборду водоёма
            </Link>
          </>
        ) : (
          <div className="muted">Выберите водоём.</div>
        )}
      </aside>
    </div>
  );
}
