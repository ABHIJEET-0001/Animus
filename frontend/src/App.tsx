import { useState } from 'react';
import { Activity, AlertTriangle, Camera, BarChart2, ShieldAlert, Navigation } from 'lucide-react';

function App() {
  const [demoActive, setDemoActive] = useState(false);

  return (
    <div className="min-h-screen bg-eco-light flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-lg p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 text-eco-green">
          <Activity size={32} />
          <h1 className="text-2xl font-bold">EcoWild AI</h1>
        </div>
        <nav className="flex flex-col gap-4 text-gray-600 font-medium">
          <a href="#" className="flex items-center gap-3 p-2 rounded-lg bg-eco-emerald/10 text-eco-green">
            <Activity size={20} /> Live Monitoring
          </a>
          <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
            <AlertTriangle size={20} /> Driver Alerts
          </a>
          <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
            <Navigation size={20} /> Risk Map
          </a>
          <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
            <BarChart2 size={20} /> Analytics
          </a>
          <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
            <Camera size={20} /> Cameras
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-eco-dark">Live Control Center</h2>
            <p className="text-gray-500">AI-Powered Wildlife-Safe Smart Highway</p>
          </div>
          <button 
            onClick={() => setDemoActive(!demoActive)}
            className={`px-6 py-3 rounded-full font-bold text-white transition-colors shadow-md ${demoActive ? 'bg-eco-red hover:bg-red-700' : 'bg-eco-green hover:bg-green-800'}`}
          >
            {demoActive ? 'STOP DEMO' : 'START LIVE MONITORING'}
          </button>
        </header>

        {demoActive && (
          <div className="mb-8 p-4 bg-eco-amber/20 border border-eco-amber rounded-lg flex items-center gap-4 text-eco-amber">
            <ShieldAlert size={28} />
            <div>
              <p className="font-bold">DEMO MODE — SIMULATED DATA</p>
              <p className="text-sm">Simulating CCTV detection events and alerts...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Wildlife Events" value={demoActive ? "248" : "0"} trend="+12%" />
          <StatCard title="Drivers Alerted" value={demoActive ? "1,842" : "0"} trend="+5%" />
          <StatCard title="High-Risk Events" value={demoActive ? "37" : "0"} trend="-2%" />
          <StatCard title="Avg Alert Time" value={demoActive ? "2.4s" : "-"} trend="0.1s" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Camera className="text-eco-emerald" /> CCTV Feed: CAM-07 (Zone 4)
            </h3>
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              {!demoActive ? (
                <p className="text-gray-500">Monitoring Inactive</p>
              ) : (
                <>
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549473889-14f410d83298?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-80 mix-blend-luminosity"></div>
                  <div className="absolute top-1/2 left-1/3 w-32 h-32 border-2 border-eco-amber rounded bg-eco-amber/20 flex flex-col items-start justify-start p-1">
                    <span className="bg-eco-amber text-xs text-white px-1 font-bold">Deer: 94%</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 text-xs rounded font-bold animate-pulse">
                    REC
                  </div>
                </>
              )}
            </div>
            {demoActive && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                <p className="font-bold">⚠️ HIGH RISK EVENT DETECTED</p>
                <p className="text-sm">Deer detected 18m from road. Vehicle approaching rapidly.</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="text-eco-amber" /> Recent Alerts
            </h3>
            <div className="flex flex-col gap-4">
              <AlertItem animal="Deer" conf="94%" risk="HIGH" cam="CAM-07" time="18:42:13" active={demoActive} />
              <AlertItem animal="Wild Boar" conf="88%" risk="MEDIUM" cam="CAM-02" time="18:15:02" active={demoActive} />
              <AlertItem animal="Cow" conf="99%" risk="LOW" cam="CAM-11" time="17:50:44" active={demoActive} />
              <AlertItem animal="Monkey" conf="82%" risk="LOW" cam="CAM-04" time="16:22:10" active={demoActive} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend }: { title: string, value: string, trend: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
      <p className="text-gray-500 font-medium">{title}</p>
      <div className="flex justify-between items-end">
        <p className="text-3xl font-bold text-eco-green">{value}</p>
        <span className="text-sm font-bold text-eco-emerald">{trend}</span>
      </div>
    </div>
  );
}

function AlertItem({ animal, conf, risk, cam, time, active }: any) {
  if (!active) return <div className="text-gray-400 border-l-4 border-gray-200 pl-4 py-2">No data</div>;
  
  const colors = {
    'HIGH': 'border-eco-red text-eco-red',
    'MEDIUM': 'border-eco-amber text-eco-amber',
    'LOW': 'border-eco-emerald text-eco-emerald'
  };

  return (
    <div className={`border-l-4 ${colors[risk as keyof typeof colors]} pl-4 py-2 bg-gray-50 rounded-r-lg flex justify-between items-center`}>
      <div>
        <p className="font-bold text-gray-800">{animal} <span className="text-xs text-gray-500 font-normal">({conf})</span></p>
        <p className="text-xs text-gray-500">{cam} • Risk: {risk}</p>
      </div>
      <p className="text-sm font-mono text-gray-500">{time}</p>
    </div>
  );
}

export default App;
