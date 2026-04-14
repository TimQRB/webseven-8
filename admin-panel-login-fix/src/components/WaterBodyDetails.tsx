'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { WaterQualityChart } from './WaterQualityChart';
import { Measurement, WaterBody } from '@/types';

type MeasurementForm = {
  recordDate: string;
  ph: string;
  turbidity:string;
  dissolvedGases: string;
  biogenicCompounds: string;
  permanganateOxid: string;
  mineralization: string;
  salinity: string;
  hardness: string;
  calcium: string;
  magnesium: string;
  chlorides: string;
  sulfates: string;
  hydrocarbonates: string;
  potassiumSodium: string;
  overgrowthPercent: string;
  overgrowthDegree: string;
  phytoplanktonDev: string;
  zooplanktonTaxa: string;
  zooplanktonGroups: string;
  zoobenthosTaxa: string;
  zoobenthosGroups: string;
  trophicStatus: string;
};

const emptyForm: MeasurementForm = {
  recordDate: '',
  ph: '',
  turbidity:'',
  dissolvedGases: '',
  biogenicCompounds: '',
  permanganateOxid: '',
  mineralization: '',
  salinity: '',
  hardness: '',
  calcium: '',
  magnesium: '',
  chlorides: '',
  sulfates: '',
  hydrocarbonates: '',
  potassiumSodium: '',
  overgrowthPercent: '',
  overgrowthDegree: '',
  phytoplanktonDev: '',
  zooplanktonTaxa: '',
  zooplanktonGroups: '',
  zoobenthosTaxa: '',
  zoobenthosGroups: '',
  trophicStatus: '',
};

function toNumber(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

function buildMeasurementPayload(form: MeasurementForm) {
  return {
    recordDate: form.recordDate
      ? new Date(`${form.recordDate}T00:00:00.000Z`).toISOString()
      : undefined,
    ph: toNumber(form.ph),
    turbidity: toNumber(form.turbidity),
    dissolvedGases: form.dissolvedGases.trim() || undefined,
    biogenicCompounds: form.biogenicCompounds.trim() || undefined,
    permanganateOxid: toNumber(form.permanganateOxid),
    mineralization: toNumber(form.mineralization),
    salinity: toNumber(form.salinity),
    hardness: toNumber(form.hardness),
    calcium: toNumber(form.calcium),
    magnesium: toNumber(form.magnesium),
    chlorides: toNumber(form.chlorides),
    sulfates: toNumber(form.sulfates),
    hydrocarbonates: toNumber(form.hydrocarbonates),
    potassiumSodium: toNumber(form.potassiumSodium),
    overgrowthPercent: toNumber(form.overgrowthPercent),
    overgrowthDegree: form.overgrowthDegree.trim() || undefined,
    phytoplanktonDev: form.phytoplanktonDev.trim() || undefined,
    zooplanktonTaxa: form.zooplanktonTaxa.trim() || undefined,
    zooplanktonGroups: form.zooplanktonGroups.trim() || undefined,
    zoobenthosTaxa: form.zoobenthosTaxa.trim() || undefined,
    zoobenthosGroups: form.zoobenthosGroups.trim() || undefined,
    trophicStatus: form.trophicStatus.trim() || undefined,
  };
}

function measurementToForm(m: Measurement): MeasurementForm {
  return {
    recordDate: m.recordDate ? String(m.recordDate).slice(0, 10) : '',
    ph: m.ph != null ? String(m.ph) : '',
    turbidity: m.turbidity != null ? String(m.turbidity) : '',
    dissolvedGases: m.dissolvedGases || '',
    biogenicCompounds: m.biogenicCompounds || '',
    permanganateOxid: m.permanganateOxid != null ? String(m.permanganateOxid) : '',
    mineralization: m.mineralization != null ? String(m.mineralization) : '',
    salinity: m.salinity != null ? String(m.salinity) : '',
    hardness: m.hardness != null ? String(m.hardness) : '',
    calcium: m.calcium != null ? String(m.calcium) : '',
    magnesium: m.magnesium != null ? String(m.magnesium) : '',
    chlorides: m.chlorides != null ? String(m.chlorides) : '',
    sulfates: m.sulfates != null ? String(m.sulfates) : '',
    hydrocarbonates: m.hydrocarbonates != null ? String(m.hydrocarbonates) : '',
    potassiumSodium: m.potassiumSodium != null ? String(m.potassiumSodium) : '',
    overgrowthPercent: m.overgrowthPercent != null ? String(m.overgrowthPercent) : '',
    overgrowthDegree: m.overgrowthDegree || '',
    phytoplanktonDev: m.phytoplanktonDev || '',
    zooplanktonTaxa: m.zooplanktonTaxa || '',
    zooplanktonGroups: m.zooplanktonGroups || '',
    zoobenthosTaxa: m.zoobenthosTaxa || '',
    zoobenthosGroups: m.zoobenthosGroups || '',
    trophicStatus: m.trophicStatus || '',
  };
}

export function WaterBodyDetails({ id }: { id: string }) {
  const [waterBody, setWaterBody] = useState<WaterBody | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [form, setForm] = useState<MeasurementForm>(emptyForm);
  const [editingMeasurementId, setEditingMeasurementId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    try {
      setLoading(true);
      setError('');

      const [bodyData, measurementsData] = await Promise.all([
        api.getWaterBodyById(id),
        api.getWaterBodyMeasurements(id),
      ]);

      setWaterBody(bodyData);
      setMeasurements(measurementsData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load water body');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [id]);

  function startEditMeasurement(m: Measurement) {
    setEditingMeasurementId(m.id);
    setForm(measurementToForm(m));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingMeasurementId(null);
  }

  async function handleSubmit() {
    try {
      setSaving(true);

      const payload = buildMeasurementPayload(form);

      if (editingMeasurementId) {
        await api.updateWaterBodyMeasurement(id, editingMeasurementId, payload);
      } else {
        await api.createWaterBodyMeasurement(id, payload);
      }

      resetForm();
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to save measurement');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteMeasurement(measurementId: string) {
    if (!confirm('Удалить замер?')) return;

    try {
      await api.deleteWaterBodyMeasurement(id, measurementId);

      if (editingMeasurementId === measurementId) {
        resetForm();
      }

      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete measurement');
    }
  }

  if (loading) {
    return <div className="card">Loading...</div>;
  }

  if (error) {
    return <div className="card">{error}</div>;
  }

  if (!waterBody) {
    return <div className="card">Water body not found</div>;
  }

  return (
    <div className="stack">
      <div className="card stack">
        <h3>{waterBody.name}</h3>

        <div className="form-grid">
          <div><strong>District:</strong> {waterBody.district || '—'}</div>
          <div><strong>Location:</strong> {waterBody.locationDesc || '—'}</div>
          <div><strong>Latitude:</strong> {waterBody.latitude ?? '—'}</div>
          <div><strong>Longitude:</strong> {waterBody.longitude ?? '—'}</div>
          <div><strong>Cadastral number:</strong> {waterBody.cadastralNumber || '—'}</div>
        </div>
      </div>

      <div className="card stack">
        <h3>Passport</h3>

        <div className="form-grid">
          <div><strong>Area:</strong> {waterBody.passport?.area ?? '—'}</div>
          <div><strong>Max depth:</strong> {waterBody.passport?.maxDepth ?? '—'}</div>
          <div><strong>Average depth:</strong> {waterBody.passport?.avgDepth ?? '—'}</div>
          <div><strong>Fishery type:</strong> {waterBody.passport?.fisheryType || '—'}</div>
          <div><strong>Ichthyofauna:</strong> {waterBody.passport?.ichthyofauna || '—'}</div>
        </div>
      </div>

      <div className="card stack">
        <h3>{editingMeasurementId ? 'Edit measurement' : 'Add measurement'}</h3>

        <div className="form-grid">
          <label className="field"><span>Record date</span><input type="date" value={form.recordDate} onChange={(e) => setForm({ ...form, recordDate: e.target.value })} /></label>
          <label className="field"><span>pH</span><input value={form.ph} onChange={(e) => setForm({ ...form, ph: e.target.value })} /></label>
          <label className="field"><span>Turbidity</span><input value={form.turbidity} onChange={(e) => setForm({ ...form, turbidity: e.target.value })} /></label>
          <label className="field"><span>Dissolved gases</span><input value={form.dissolvedGases} onChange={(e) => setForm({ ...form, dissolvedGases: e.target.value })} /></label>
          <label className="field"><span>Biogenic compounds</span><input value={form.biogenicCompounds} onChange={(e) => setForm({ ...form, biogenicCompounds: e.target.value })} /></label>
          <label className="field"><span>Permanganate oxid.</span><input value={form.permanganateOxid} onChange={(e) => setForm({ ...form, permanganateOxid: e.target.value })} /></label>
          <label className="field"><span>Mineralization</span><input value={form.mineralization} onChange={(e) => setForm({ ...form, mineralization: e.target.value })} /></label>
          <label className="field"><span>Salinity</span><input value={form.salinity} onChange={(e) => setForm({ ...form, salinity: e.target.value })} /></label>
          <label className="field"><span>Hardness</span><input value={form.hardness} onChange={(e) => setForm({ ...form, hardness: e.target.value })} /></label>
          <label className="field"><span>Calcium</span><input value={form.calcium} onChange={(e) => setForm({ ...form, calcium: e.target.value })} /></label>
          <label className="field"><span>Magnesium</span><input value={form.magnesium} onChange={(e) => setForm({ ...form, magnesium: e.target.value })} /></label>
          <label className="field"><span>Chlorides</span><input value={form.chlorides} onChange={(e) => setForm({ ...form, chlorides: e.target.value })} /></label>
          <label className="field"><span>Sulfates</span><input value={form.sulfates} onChange={(e) => setForm({ ...form, sulfates: e.target.value })} /></label>
          <label className="field"><span>Hydrocarbonates</span><input value={form.hydrocarbonates} onChange={(e) => setForm({ ...form, hydrocarbonates: e.target.value })} /></label>
          <label className="field"><span>Potassium + Sodium</span><input value={form.potassiumSodium} onChange={(e) => setForm({ ...form, potassiumSodium: e.target.value })} /></label>
          <label className="field"><span>Overgrowth percent</span><input value={form.overgrowthPercent} onChange={(e) => setForm({ ...form, overgrowthPercent: e.target.value })} /></label>
          <label className="field"><span>Overgrowth degree</span><input value={form.overgrowthDegree} onChange={(e) => setForm({ ...form, overgrowthDegree: e.target.value })} /></label>
          <label className="field"><span>Phytoplankton development</span><input value={form.phytoplanktonDev} onChange={(e) => setForm({ ...form, phytoplanktonDev: e.target.value })} /></label>
          <label className="field"><span>Zooplankton taxa</span><input value={form.zooplanktonTaxa} onChange={(e) => setForm({ ...form, zooplanktonTaxa: e.target.value })} /></label>
          <label className="field"><span>Zooplankton groups</span><input value={form.zooplanktonGroups} onChange={(e) => setForm({ ...form, zooplanktonGroups: e.target.value })} /></label>
          <label className="field"><span>Zoobenthos taxa</span><input value={form.zoobenthosTaxa} onChange={(e) => setForm({ ...form, zoobenthosTaxa: e.target.value })} /></label>
          <label className="field"><span>Zoobenthos groups</span><input value={form.zoobenthosGroups} onChange={(e) => setForm({ ...form, zoobenthosGroups: e.target.value })} /></label>
          <label className="field"><span>Trophic status</span><input value={form.trophicStatus} onChange={(e) => setForm({ ...form, trophicStatus: e.target.value })} /></label>
        </div>

        <div className="actions">
          <button className="btn" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : editingMeasurementId ? 'Save measurement' : 'Add measurement'}
          </button>
          <button className="btn secondary" onClick={resetForm} disabled={saving}>
            Reset
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Measurements</h3>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>pH</th>
                <th>Turbidity</th>
                <th>Mineralization</th>
                <th>Salinity</th>
                <th>Hardness</th>
                <th>Trophic status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {measurements.map((m) => (
                <tr key={m.id}>
                  <td>{m.recordDate || '—'}</td>
                  <td>{m.ph ?? '—'}</td>
                  <td>{m.turbidity ?? '—'}</td>
                  <td>{m.mineralization ?? '—'}</td>
                  <td>{m.salinity ?? '—'}</td>
                  <td>{m.hardness ?? '—'}</td>
                  <td>{m.trophicStatus || '—'}</td>
                  <td>
                    <div className="actions">
                      <button className="btn secondary" onClick={() => startEditMeasurement(m)}>
                        Edit
                      </button>
                      <button className="btn danger" onClick={() => void handleDeleteMeasurement(m.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {measurements.length === 0 ? (
                <tr>
                  <td colSpan={7}>No measurements</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {measurements.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <WaterQualityChart measurements={measurements} />
          </div>
        )}
      </div>
    </div>
  );
}