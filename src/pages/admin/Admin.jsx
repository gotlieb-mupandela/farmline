import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Img, Modal, Segmented } from '../../components/ui.jsx';
import { PageHeader, StatCard } from '../../components/web.jsx';
import { useStore } from '../../store/AppStore.jsx';
import { useToast } from '../../components/Toast.jsx';
import { IMAGES } from '../../data/images.js';
import { cx, money } from '../../lib/format.js';

/* 41. Operations overview -------------------------------------------------- */
export function AdminOverview() {
  const toast = useToast();
  const [alerts, setAlerts] = useState([
    { id: 1, text: '2 failed SMS deliveries (retry queued)', warn: true },
    { id: 2, text: '1 payment pending mobile wallet check' },
  ]);
  const { state } = useStore();

  return (
    <>
      <h1 className="font-headline text-headline-lg-mobile sm:text-headline-lg text-primary">Operations overview</h1>
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        <Link to="/admin/farmers" className="press rounded-2xl">
          <StatCard label="Active farmers" value={(1237 + state.adminFarmers.length).toLocaleString('en-US')} />
        </Link>
        <Link to="/admin/agents" className="press rounded-2xl">
          <StatCard label="Active agents" value="32" />
        </Link>
        <StatCard label="Orders this week" value="186" />
        <StatCard label="Payments sent" value={money(412000)} tone="text-on-accent-container" />
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="font-title text-title-lg text-primary">Namibia farmer clusters</h2>
          <Img src={IMAGES.routeMap} alt="Namibia farmer clusters map" className="w-full h-64 object-cover rounded-xl" fallbackIcon="map" />
        </section>
        <section className="lg:col-span-5 flex flex-col gap-5">
          <div className="clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-3">
            <h2 className="font-title text-title-lg text-primary">Load matching</h2>
            <LoadRow truck="#NA-402 · Omusati" load={1.8} cap={2.0} />
            <LoadRow truck="#NA-118 · Oshana" load={0.9} cap={1.5} />
          </div>
          <div className="clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-3">
            <h2 className="font-title text-title-lg text-primary">Alerts</h2>
            {alerts.length === 0 && <p className="font-body text-body-md text-on-surface-variant">All clear.</p>}
            {alerts.map((a) => (
              <div key={a.id} className={cx('rounded-xl p-3 font-label text-label-md flex items-center justify-between gap-3', a.warn ? 'bg-accent-container text-on-accent-container' : 'bg-surface-elevated')}>
                <span>{a.text}</span>
                <button
                  type="button"
                  className="underline shrink-0"
                  onClick={() => {
                    setAlerts((x) => x.filter((y) => y.id !== a.id));
                    toast('Alert resolved');
                  }}
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function LoadRow({ truck, load, cap }) {
  const pct = Math.round((load / cap) * 100);
  return (
    <div className="bg-surface-elevated rounded-xl p-3 flex flex-col gap-2">
      <div className="flex justify-between gap-2">
        <span>Truck {truck}</span>
        <span className={cx('font-label tabular-nums', pct >= 80 ? 'text-primary' : 'text-on-accent-container')}>
          {load}t / {cap.toFixed(1)}t
        </span>
      </div>
      <div className="h-2 bg-surface rounded-full">
        <div className={cx('h-full rounded-full', pct >= 80 ? 'bg-primary' : 'bg-accent')} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* 42. Farmers & agents ----------------------------------------------------- */
export function AdminPeople({ initialTab = 'Farmers' }) {
  const { state, actions } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(state.adminFarmers[0]?.id);
  const [reassign, setReassign] = useState(false);
  const tab = initialTab;
  const selected = state.adminFarmers.find((f) => f.id === selectedId) ?? state.adminFarmers[0];

  return (
    <>
      <PageHeader title="Farmers & agents">
        <Segmented options={['Farmers', 'Agents']} value={tab} onChange={(t) => navigate(t === 'Farmers' ? '/admin/farmers' : '/admin/agents')} size="sm" className="p-1" label="Directory" />
      </PageHeader>
      {tab === 'Farmers' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-8 clay-card bg-surface-card rounded-2xl p-6 overflow-x-auto">
            <table className="clay-table min-w-[560px]">
              <thead>
                <tr>
                  <th className="pl-2">Name</th>
                  <th>Village / Region</th>
                  <th>Agent</th>
                  <th>Sales</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.adminFarmers.map((f) => (
                  <tr
                    key={f.id}
                    onClick={() => setSelectedId(f.id)}
                    aria-selected={f.id === selected?.id}
                    className={cx('cursor-pointer', f.id === selected?.id ? 'bg-surface-elevated' : 'hover:bg-surface-elevated/60')}
                  >
                    <td className="pl-2">
                      <button type="button" className={cx('font-title text-left', f.id === selected?.id && 'text-primary')} onClick={() => setSelectedId(f.id)}>
                        {f.name}
                      </button>
                    </td>
                    <td>
                      {f.village}, {f.region}
                    </td>
                    <td>{f.agent}</td>
                    <td>{money(f.sales)}</td>
                    <td>
                      <Badge tone={f.status === 'Verified' ? 'primary' : 'accent'}>{f.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          {selected && (
            <aside className="lg:col-span-4 clay-card bg-surface-card rounded-2xl p-6 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <Img src={selected.image} alt={selected.name} className="w-14 h-14 rounded-full object-cover" fallbackIcon="person" />
                <div>
                  <h2 className="font-title text-title-lg">{selected.name}</h2>
                  <p className="font-label text-label-sm text-on-surface-variant tabular-nums">
                    {selected.phone} · {selected.village}
                  </p>
                </div>
              </div>
              <div className="bg-surface-elevated rounded-xl p-4 flex justify-between font-label text-label-md">
                <span>Consent status</span>
                <span className="text-primary">{selected.consent}</span>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  disabled={selected.status === 'Verified'}
                  onClick={() => {
                    actions.updateFarmerRecord(selected.id, { status: 'Verified' });
                    toast(`${selected.name} verified`, { icon: 'verified' });
                  }}
                  className="btn-primary py-2.5 text-label-md"
                >
                  {selected.status === 'Verified' ? 'Verified' : 'Verify'}
                </button>
                <button type="button" onClick={() => setReassign(true)} className="btn-ghost py-2.5 text-label-md">
                  Reassign agent
                </button>
                <button type="button" onClick={() => toast(`SMS sent to ${selected.name}`, { icon: 'sms' })} className="press bg-accent text-on-accent rounded-full py-2.5 font-label text-label-md">
                  Message by SMS
                </button>
              </div>
            </aside>
          )}
        </div>
      ) : (
        <section className="clay-card bg-surface-card rounded-2xl p-6 overflow-x-auto">
          <table className="clay-table min-w-[560px]">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Area</th>
                <th>Farmers</th>
                <th>Collections this week</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {state.adminAgents.map((a) => (
                <tr key={a.id}>
                  <td className="font-title">{a.name}</td>
                  <td>{a.area}</td>
                  <td>{a.farmers}</td>
                  <td>{a.collections}</td>
                  <td>
                    <Badge tone={a.status === 'Active' ? 'primary' : 'ghost'}>{a.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      <Modal open={reassign} onClose={() => setReassign(false)} title="Reassign agent">
        <div className="flex flex-col gap-2">
          {state.adminAgents.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                actions.updateFarmerRecord(selected.id, { agent: a.name });
                toast(`${selected.name} assigned to ${a.name}`, { icon: 'support_agent' });
                setReassign(false);
              }}
              className={cx('press rounded-xl p-4 flex justify-between text-left', selected?.agent === a.name ? 'bg-primary-container' : 'bg-surface-elevated')}
            >
              <span className="font-title text-title-md">{a.name}</span>
              <span className="font-label text-label-sm text-on-surface-variant">{a.area}</span>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
