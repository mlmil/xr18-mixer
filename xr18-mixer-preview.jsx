import React, { useState, useEffect } from 'react';

const defaultChannel = {
  name: '',
  source: '',
  gain: 0,
  phantom: false,
  lowCut: false,
  gate: false,
  comp: false,
  eq: false,
  pan: 'C',
  fader: 0,
  mute: false,
  solo: false,
  muteGroups: [false, false, false, false, false, false],
  auxSends: [0, 0, 0, 0, 0, 0],
  fxSends: [0, 0, 0, 0],
  notes: ''
};

const defaultFxSlot = {
  type: 'None',
  preset: '',
  notes: ''
};

const defaultAuxBus = {
  name: '',
  purpose: '',
  preFader: false,
  notes: ''
};

const defaultMuteGroup = {
  name: '',
  purpose: ''
};

const fxTypes = [
  'None', 'Hall Reverb', 'Plate Reverb', 'Room Reverb', 'Chamber Reverb',
  'Ambience', 'Gated Reverb', 'Delay', 'Stereo Delay', 'Ping Pong Delay',
  'Tape Delay', 'Chorus', 'Flanger', 'Phaser', 'Tremolo', 'Rotary',
  'Pitch Shifter', 'Enhancer', 'Graphic EQ', 'TruEQ', 'DeEsser',
  'Xtec EQ1', 'Xtec EQ5', 'Wave Designer', 'Precision Limiter',
  'Combinator', 'Fair Compressor', 'Leisure Compressor', 'Ultimo Compressor',
  'Stereo Imager', 'Edison EX1', 'Sound Maxer', 'Dual/Stereo GEQ'
];

export default function XR18MixerMatrix() {
  const [channels, setChannels] = useState([]);
  const [auxBuses, setAuxBuses] = useState([]);
  const [fxSlots, setFxSlots] = useState([]);
  const [muteGroups, setMuteGroups] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [engineer, setEngineer] = useState('');
  const [activeTab, setActiveTab] = useState('channels');
  const [lastSaved, setLastSaved] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [snapshotName, setSnapshotName] = useState('');

  // Initialize from localStorage or defaults
  useEffect(() => {
    const saved = localStorage.getItem('xr18-mixer-settings');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setChannels(data.channels || Array(18).fill(null).map(() => ({...defaultChannel})));
        setAuxBuses(data.auxBuses || Array(6).fill(null).map(() => ({...defaultAuxBus})));
        setFxSlots(data.fxSlots || Array(4).fill(null).map(() => ({...defaultFxSlot})));
        setMuteGroups(data.muteGroups || Array(6).fill(null).map(() => ({...defaultMuteGroup})));
        setProjectName(data.projectName || '');
        setVenue(data.venue || '');
        setDate(data.date || '');
        setEngineer(data.engineer || '');
        setLastSaved(data.lastSaved || null);
      } catch(e) {
        initializeDefaults();
      }
    } else {
      initializeDefaults();
    }
    
    // Load history
    const savedHistory = localStorage.getItem('xr18-mixer-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch(e) {
        // Ignore invalid history
      }
    }
  }, []);

  const initializeDefaults = () => {
    setChannels(Array(18).fill(null).map(() => ({...defaultChannel})));
    setAuxBuses(Array(6).fill(null).map(() => ({...defaultAuxBus})));
    setFxSlots(Array(4).fill(null).map(() => ({...defaultFxSlot})));
    setMuteGroups(Array(6).fill(null).map(() => ({...defaultMuteGroup})));
  };

  // Auto-save to localStorage
  useEffect(() => {
    if (channels.length > 0) {
      const data = {
        channels,
        auxBuses,
        fxSlots,
        muteGroups,
        projectName,
        venue,
        date,
        engineer,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem('xr18-mixer-settings', JSON.stringify(data));
      setLastSaved(data.lastSaved);
    }
  }, [channels, auxBuses, fxSlots, muteGroups, projectName, venue, date, engineer]);

  // Save history to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('xr18-mixer-history', JSON.stringify(history));
    }
  }, [history]);

  const saveToHistory = () => {
    const name = snapshotName.trim() || `${projectName || 'Untitled'} - ${venue || 'No Venue'}`;
    const snapshot = {
      id: Date.now(),
      name,
      savedAt: new Date().toISOString(),
      channels: JSON.parse(JSON.stringify(channels)),
      auxBuses: JSON.parse(JSON.stringify(auxBuses)),
      fxSlots: JSON.parse(JSON.stringify(fxSlots)),
      muteGroups: JSON.parse(JSON.stringify(muteGroups)),
      projectName,
      venue,
      date,
      engineer
    };
    setHistory(prev => [snapshot, ...prev]);
    setSnapshotName('');
    alert(`Saved "${name}" to history`);
  };

  const loadFromHistory = (snapshot) => {
    if (confirm(`Load "${snapshot.name}"? This will replace your current settings.`)) {
      setChannels(JSON.parse(JSON.stringify(snapshot.channels)));
      setAuxBuses(JSON.parse(JSON.stringify(snapshot.auxBuses)));
      setFxSlots(JSON.parse(JSON.stringify(snapshot.fxSlots)));
      setMuteGroups(JSON.parse(JSON.stringify(snapshot.muteGroups)));
      setProjectName(snapshot.projectName || '');
      setVenue(snapshot.venue || '');
      setDate(snapshot.date || '');
      setEngineer(snapshot.engineer || '');
      setShowHistory(false);
    }
  };

  const deleteFromHistory = (id) => {
    if (confirm('Delete this snapshot from history?')) {
      setHistory(prev => prev.filter(s => s.id !== id));
    }
  };

  const clearHistory = () => {
    if (confirm('Delete ALL history snapshots? This cannot be undone.')) {
      setHistory([]);
      localStorage.removeItem('xr18-mixer-history');
    }
  };

  const updateChannel = (index, field, value) => {
    const updated = [...channels];
    updated[index] = { ...updated[index], [field]: value };
    setChannels(updated);
  };

  const updateChannelArray = (chIndex, arrayName, arrIndex, value) => {
    const updated = [...channels];
    const newArr = [...updated[chIndex][arrayName]];
    newArr[arrIndex] = value;
    updated[chIndex] = { ...updated[chIndex], [arrayName]: newArr };
    setChannels(updated);
  };

  const updateAuxBus = (index, field, value) => {
    const updated = [...auxBuses];
    updated[index] = { ...updated[index], [field]: value };
    setAuxBuses(updated);
  };

  const updateFxSlot = (index, field, value) => {
    const updated = [...fxSlots];
    updated[index] = { ...updated[index], [field]: value };
    setFxSlots(updated);
  };

  const updateMuteGroup = (index, field, value) => {
    const updated = [...muteGroups];
    updated[index] = { ...updated[index], [field]: value };
    setMuteGroups(updated);
  };

  const clearAll = () => {
    if (confirm('Clear all mixer settings? This cannot be undone.')) {
      initializeDefaults();
      setProjectName('');
      setVenue('');
      setDate('');
      setEngineer('');
    }
  };

  const exportSettings = () => {
    const data = {
      channels,
      auxBuses,
      fxSlots,
      muteGroups,
      projectName,
      venue,
      date,
      engineer,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `XR18-${projectName || 'mixer'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importSettings = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);
          setChannels(data.channels);
          setAuxBuses(data.auxBuses);
          setFxSlots(data.fxSlots);
          setMuteGroups(data.muteGroups);
          setProjectName(data.projectName || '');
          setVenue(data.venue || '');
          setDate(data.date || '');
          setEngineer(data.engineer || '');
        } catch (err) {
          alert('Error importing file: ' + err.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const dbToFader = (db) => {
    if (db <= -90) return 0.0;
    if (db >= 10) return 1.0;
    if (db >= 0) {
      return 0.75 + (db / 10) * 0.25;
    } else {
      const normalized = (db + 90) / 90;
      return normalized * 0.75;
    }
  };

  const panToValue = (pan) => {
    const panMap = {
      'L100': 0.0, 'L75': 0.125, 'L50': 0.25, 'L25': 0.375,
      'C': 0.5,
      'R25': 0.625, 'R50': 0.75, 'R75': 0.875, 'R100': 1.0
    };
    return panMap[pan] ?? 0.5;
  };

  const fxTypeToNumber = (type) => {
    const fxMap = {
      'None': 0, 'Hall Reverb': 1, 'Plate Reverb': 2, 'Room Reverb': 3,
      'Chamber Reverb': 4, 'Ambience': 5, 'Gated Reverb': 6, 'Delay': 7,
      'Stereo Delay': 8, 'Ping Pong Delay': 9, 'Tape Delay': 10,
      'Chorus': 11, 'Flanger': 12, 'Phaser': 13, 'Tremolo': 14,
      'Rotary': 15, 'Pitch Shifter': 16, 'Enhancer': 17, 'Graphic EQ': 18,
      'TruEQ': 19, 'DeEsser': 20, 'Xtec EQ1': 21, 'Xtec EQ5': 22,
      'Wave Designer': 23, 'Precision Limiter': 24, 'Combinator': 25,
      'Fair Compressor': 26, 'Leisure Compressor': 27, 'Ultimo Compressor': 28,
      'Stereo Imager': 29, 'Edison EX1': 30, 'Sound Maxer': 31, 'Dual/Stereo GEQ': 32
    };
    return fxMap[type] ?? 0;
  };

  const exportScene = () => {
    let scn = '#2.1# "' + (projectName || 'Untitled') + '"\n\n';
    
    for (let i = 0; i < 16; i++) {
      const ch = channels[i];
      const chNum = String(i + 1).padStart(2, '0');
      const prefix = `/ch/${chNum}`;
      
      if (ch.name) scn += `${prefix}/config/name "${ch.name}"\n`;
      scn += `${prefix}/preamp/hpon ${ch.phantom ? 'ON' : 'OFF'}\n`;
      scn += `${prefix}/preamp/hpf ${ch.lowCut ? 'ON' : 'OFF'}\n`;
      scn += `${prefix}/gate/on ${ch.gate ? 'ON' : 'OFF'}\n`;
      scn += `${prefix}/dyn/on ${ch.comp ? 'ON' : 'OFF'}\n`;
      scn += `${prefix}/eq/on ${ch.eq ? 'ON' : 'OFF'}\n`;
      scn += `${prefix}/mix/on ${ch.mute ? 'OFF' : 'ON'}\n`;
      scn += `${prefix}/mix/fader ${dbToFader(ch.fader).toFixed(5)}\n`;
      scn += `${prefix}/mix/pan ${panToValue(ch.pan).toFixed(5)}\n`;
      
      for (let aux = 0; aux < 6; aux++) {
        const auxNum = String(aux + 1).padStart(2, '0');
        scn += `${prefix}/mix/${auxNum}/level ${dbToFader(ch.auxSends[aux]).toFixed(5)}\n`;
      }
      
      for (let fx = 0; fx < 4; fx++) {
        const fxBus = String(fx + 9).padStart(2, '0');
        scn += `${prefix}/mix/${fxBus}/level ${dbToFader(ch.fxSends[fx]).toFixed(5)}\n`;
      }
      
      for (let mg = 0; mg < 6; mg++) {
        if (ch.muteGroups[mg]) {
          scn += `${prefix}/grp/mute ${mg + 1}\n`;
        }
      }
      scn += '\n';
    }
    
    for (let i = 16; i < 18; i++) {
      const ch = channels[i];
      const prefix = `/auxin/0${i - 15}`;
      if (ch.name) scn += `${prefix}/config/name "${ch.name}"\n`;
      scn += `${prefix}/eq/on ${ch.eq ? 'ON' : 'OFF'}\n`;
      scn += `${prefix}/mix/on ${ch.mute ? 'OFF' : 'ON'}\n`;
      scn += `${prefix}/mix/fader ${dbToFader(ch.fader).toFixed(5)}\n`;
      scn += `${prefix}/mix/pan ${panToValue(ch.pan).toFixed(5)}\n\n`;
    }
    
    scn += '# AUX BUSES\n';
    for (let i = 0; i < 6; i++) {
      const aux = auxBuses[i];
      const busNum = String(i + 1).padStart(2, '0');
      const prefix = `/bus/${busNum}`;
      if (aux.name) scn += `${prefix}/config/name "${aux.name}"\n\n`;
    }
    
    scn += '# FX SLOTS\n';
    for (let i = 0; i < 4; i++) {
      const fx = fxSlots[i];
      scn += `/fx/${i + 1}/type ${fxTypeToNumber(fx.type)}\n\n`;
    }
    
    scn += '# MUTE GROUPS\n';
    for (let i = 0; i < 6; i++) {
      const mg = muteGroups[i];
      if (mg.name) scn += `/config/mute/${i + 1}/name "${mg.name}"\n`;
    }
    
    scn += `\n# NOTES\n# Project: ${projectName || 'N/A'}\n# Venue: ${venue || 'N/A'}\n`;
    scn += `# Date: ${date || 'N/A'}\n# Engineer: ${engineer || 'N/A'}\n`;
    scn += `# Exported: ${new Date().toISOString()}\n`;
    
    const blob = new Blob([scn], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName || 'XR18'}-${new Date().toISOString().split('T')[0]}.scn`;
    a.click();
  };

  const getChannelLabel = (i) => {
    if (i < 16) return `Ch ${i + 1}`;
    if (i === 16) return 'Aux In L';
    return 'Aux In R';
  };

  const tabColors = {
    channels: { active: 'bg-indigo-600', hover: 'hover:bg-indigo-800' },
    routing: { active: 'bg-orange-600', hover: 'hover:bg-orange-800' },
    fx: { active: 'bg-purple-600', hover: 'hover:bg-purple-800' },
    mutegroups: { active: 'bg-red-600', hover: 'hover:bg-red-800' },
    overview: { active: 'bg-emerald-600', hover: 'hover:bg-emerald-800' }
  };

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
        activeTab === id
          ? `${tabColors[id].active} text-white`
          : `bg-gray-700 text-gray-300 ${tabColors[id].hover}`
      }`}
    >
      {label}
    </button>
  );

  if (channels.length === 0) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-gray-100 p-4">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg">
              XR
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Behringer XR18 Mixer Matrix</h1>
              <p className="text-xs text-gray-400">
                {lastSaved ? `Auto-saved: ${new Date(lastSaved).toLocaleString()}` : 'Settings persist automatically'}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`px-3 py-1.5 rounded text-sm font-medium ${showHistory ? 'bg-cyan-500 text-white' : 'bg-cyan-700 hover:bg-cyan-600'}`}
            >
              History ({history.length})
            </button>
            <button
              onClick={exportScene}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 rounded text-sm font-medium"
            >
              Export .scn
            </button>
            <button
              onClick={exportSettings}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm font-medium"
            >
              Export JSON
            </button>
            <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium cursor-pointer">
              Import
              <input type="file" accept=".json" onChange={importSettings} className="hidden" />
            </label>
            <button
              onClick={clearAll}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm font-medium"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Project/Band Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
              placeholder="neon blonde"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Venue</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
              placeholder="Venue name"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Engineer</label>
            <input
              type="text"
              value={engineer}
              onChange={(e) => setEngineer(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
              placeholder="Engineer name"
            />
          </div>
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-cyan-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-cyan-400">Saved Snapshots</h3>
            <div className="flex gap-2">
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="px-2 py-1 bg-red-700 hover:bg-red-600 rounded text-xs"
                >
                  Clear All History
                </button>
              )}
              <button
                onClick={() => setShowHistory(false)}
                className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-xs"
              >
                Close
              </button>
            </div>
          </div>
          
          <div className="flex gap-2 mb-4 p-3 bg-gray-700 rounded-lg">
            <input
              type="text"
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              className="flex-1 bg-gray-600 border border-gray-500 rounded px-3 py-2 text-sm"
              placeholder="Snapshot name (optional - defaults to Project/Venue)"
            />
            <button
              onClick={saveToHistory}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-sm font-medium"
            >
              Save Current Settings
            </button>
          </div>
          
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No snapshots saved yet. Save your current settings to create a snapshot.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.map((snapshot) => (
                <div key={snapshot.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <div className="flex-1">
                    <div className="font-medium text-white">{snapshot.name}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(snapshot.savedAt).toLocaleString()}
                      {snapshot.venue && ` • ${snapshot.venue}`}
                      {snapshot.date && ` • ${snapshot.date}`}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {snapshot.channels.filter(ch => ch.name).length} channels configured
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadFromHistory(snapshot)}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded text-sm"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deleteFromHistory(snapshot.id)}
                      className="px-3 py-1.5 bg-gray-600 hover:bg-red-600 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-0 flex-wrap">
        <TabButton id="channels" label="Channels (1-18)" />
        <TabButton id="routing" label="Aux Routing" />
        <TabButton id="fx" label="FX Slots" />
        <TabButton id="mutegroups" label="Mute Groups" />
        <TabButton id="overview" label="Overview" />
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800 rounded-b-lg rounded-tr-lg p-4">
        {/* Channels Tab */}
        {activeTab === 'channels' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs">
                  <th className="text-left p-2 w-16">CH</th>
                  <th className="text-left p-2 w-40">Name</th>
                  <th className="text-left p-2 w-32">Source</th>
                  <th className="text-center p-2 w-16">48V</th>
                  <th className="text-center p-2 w-16">Low Cut</th>
                  <th className="text-center p-2 w-14">Gate</th>
                  <th className="text-center p-2 w-14">Comp</th>
                  <th className="text-center p-2 w-14">EQ</th>
                  <th className="text-center p-2 w-16">Pan</th>
                  <th className="text-center p-2 w-20">Fader</th>
                  <th className="text-left p-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {channels.map((ch, i) => (
                  <tr key={i} className={`border-t border-gray-700 ${i >= 16 ? 'bg-gray-750' : ''}`}>
                    <td className="p-2">
                      <span className={`inline-block w-12 text-center py-1 rounded text-xs font-bold ${
                        i < 16 ? 'bg-indigo-600' : 'bg-purple-600'
                      }`}>
                        {getChannelLabel(i)}
                      </span>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={ch.name}
                        onChange={(e) => updateChannel(i, 'name', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                        placeholder={i === 0 ? "e.g., Lead Vocals" : ''}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={ch.source}
                        onChange={(e) => updateChannel(i, 'source', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                        placeholder="SM58, DI..."
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={ch.phantom}
                        onChange={(e) => updateChannel(i, 'phantom', e.target.checked)}
                        className="w-4 h-4 accent-red-500"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={ch.lowCut}
                        onChange={(e) => updateChannel(i, 'lowCut', e.target.checked)}
                        className="w-4 h-4 accent-yellow-500"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={ch.gate}
                        onChange={(e) => updateChannel(i, 'gate', e.target.checked)}
                        className="w-4 h-4 accent-green-500"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={ch.comp}
                        onChange={(e) => updateChannel(i, 'comp', e.target.checked)}
                        className="w-4 h-4 accent-blue-500"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={ch.eq}
                        onChange={(e) => updateChannel(i, 'eq', e.target.checked)}
                        className="w-4 h-4 accent-purple-500"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={ch.pan}
                        onChange={(e) => updateChannel(i, 'pan', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-1 py-1 text-xs"
                      >
                        <option value="L100">L100</option>
                        <option value="L75">L75</option>
                        <option value="L50">L50</option>
                        <option value="L25">L25</option>
                        <option value="C">C</option>
                        <option value="R25">R25</option>
                        <option value="R50">R50</option>
                        <option value="R75">R75</option>
                        <option value="R100">R100</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={ch.fader}
                        onChange={(e) => updateChannel(i, 'fader', parseFloat(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-center"
                        min="-90"
                        max="10"
                        step="1"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={ch.notes}
                        onChange={(e) => updateChannel(i, 'notes', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                        placeholder="Notes..."
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Aux Routing Tab */}
        {activeTab === 'routing' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-indigo-400">Aux Bus Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {auxBuses.map((aux, i) => (
                  <div key={i} className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-600 px-2 py-1 rounded text-xs font-bold">AUX {i + 1}</span>
                      <input
                        type="text"
                        value={aux.name}
                        onChange={(e) => updateAuxBus(i, 'name', e.target.value)}
                        className="flex-1 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm"
                        placeholder="Bus Name"
                      />
                    </div>
                    <input
                      type="text"
                      value={aux.purpose}
                      onChange={(e) => updateAuxBus(i, 'purpose', e.target.value)}
                      className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm mb-2"
                      placeholder="Purpose (IEM, Monitor Wedge...)"
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={aux.preFader}
                        onChange={(e) => updateAuxBus(i, 'preFader', e.target.checked)}
                        className="accent-green-500"
                      />
                      Pre-Fader
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3 text-indigo-400">Aux Send Levels (dB)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs">
                    <th className="text-left p-2 w-32">Channel</th>
                    {auxBuses.map((aux, i) => (
                      <th key={i} className="text-center p-2 w-28">
                        <div className="text-green-400">AUX {i + 1}</div>
                        <div className="text-gray-500 truncate text-xs">{aux.name || '—'}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {channels.map((ch, chIdx) => (
                    <tr key={chIdx} className="border-t border-gray-700">
                      <td className="p-2">
                        <span className="text-indigo-400 font-medium">{getChannelLabel(chIdx)}</span>
                        {ch.name && <span className="text-gray-400 ml-2">({ch.name})</span>}
                      </td>
                      {ch.auxSends.map((send, auxIdx) => (
                        <td key={auxIdx} className="p-2 text-center">
                          <input
                            type="number"
                            value={send}
                            onChange={(e) => updateChannelArray(chIdx, 'auxSends', auxIdx, parseFloat(e.target.value) || 0)}
                            className="w-16 bg-gray-700 border border-gray-600 rounded px-1 py-1 text-sm text-center"
                            min="-90"
                            max="10"
                            step="1"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FX Tab */}
        {activeTab === 'fx' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-indigo-400">FX Slot Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fxSlots.map((fx, i) => (
                  <div key={i} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-purple-600 px-3 py-1.5 rounded text-sm font-bold">FX {i + 1}</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Effect Type</label>
                        <select
                          value={fx.type}
                          onChange={(e) => updateFxSlot(i, 'type', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1.5 text-sm"
                        >
                          {fxTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Preset Name</label>
                        <input
                          type="text"
                          value={fx.preset}
                          onChange={(e) => updateFxSlot(i, 'preset', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm"
                          placeholder="Preset name..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Notes/Settings</label>
                        <input
                          type="text"
                          value={fx.notes}
                          onChange={(e) => updateFxSlot(i, 'notes', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm"
                          placeholder="Decay, mix level, etc..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3 text-indigo-400">FX Send Levels (dB)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs">
                    <th className="text-left p-2 w-32">Channel</th>
                    {fxSlots.map((fx, i) => (
                      <th key={i} className="text-center p-2 w-28">
                        <div className="text-purple-400">FX {i + 1}</div>
                        <div className="text-gray-500 truncate text-xs">{fx.type !== 'None' ? fx.type : '—'}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {channels.map((ch, chIdx) => (
                    <tr key={chIdx} className="border-t border-gray-700">
                      <td className="p-2">
                        <span className="text-indigo-400 font-medium">{getChannelLabel(chIdx)}</span>
                        {ch.name && <span className="text-gray-400 ml-2">({ch.name})</span>}
                      </td>
                      {ch.fxSends.map((send, fxIdx) => (
                        <td key={fxIdx} className="p-2 text-center">
                          <input
                            type="number"
                            value={send}
                            onChange={(e) => updateChannelArray(chIdx, 'fxSends', fxIdx, parseFloat(e.target.value) || 0)}
                            className="w-16 bg-gray-700 border border-gray-600 rounded px-1 py-1 text-sm text-center"
                            min="-90"
                            max="10"
                            step="1"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mute Groups Tab */}
        {activeTab === 'mutegroups' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-indigo-400">Mute Group Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {muteGroups.map((mg, i) => (
                  <div key={i} className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-red-600 px-2 py-1 rounded text-xs font-bold">MG {i + 1}</span>
                      <input
                        type="text"
                        value={mg.name}
                        onChange={(e) => updateMuteGroup(i, 'name', e.target.value)}
                        className="flex-1 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm"
                        placeholder="Group Name"
                      />
                    </div>
                    <input
                      type="text"
                      value={mg.purpose}
                      onChange={(e) => updateMuteGroup(i, 'purpose', e.target.value)}
                      className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm"
                      placeholder="Purpose (Drums, Vocals, etc.)"
                    />
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3 text-indigo-400">Channel → Mute Group Assignments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs">
                    <th className="text-left p-2 w-32">Channel</th>
                    {muteGroups.map((mg, i) => (
                      <th key={i} className="text-center p-2 w-24">
                        <div className="text-red-400">MG {i + 1}</div>
                        <div className="text-gray-500 truncate">{mg.name || '—'}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {channels.map((ch, chIdx) => (
                    <tr key={chIdx} className="border-t border-gray-700">
                      <td className="p-2">
                        <span className="text-indigo-400 font-medium">{getChannelLabel(chIdx)}</span>
                        {ch.name && <span className="text-gray-400 ml-2">({ch.name})</span>}
                      </td>
                      {ch.muteGroups.map((assigned, mgIdx) => (
                        <td key={mgIdx} className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={assigned}
                            onChange={(e) => updateChannelArray(chIdx, 'muteGroups', mgIdx, e.target.checked)}
                            className="w-5 h-5 accent-red-500"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-indigo-400">Quick Reference</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-green-400 mb-2">Active Channels</h4>
                  <div className="space-y-1 text-sm">
                    {channels.filter(ch => ch.name).map((ch, i) => {
                      const originalIdx = channels.indexOf(ch);
                      return (
                        <div key={i} className="flex justify-between bg-gray-600 rounded px-2 py-1">
                          <span className="text-indigo-300">{getChannelLabel(originalIdx)}</span>
                          <span>{ch.name}</span>
                          <span className="text-gray-400">{ch.source}</span>
                        </div>
                      );
                    })}
                    {!channels.some(ch => ch.name) && (
                      <p className="text-gray-500 italic">No channels configured yet</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-purple-400 mb-2">FX Configuration</h4>
                  <div className="space-y-1 text-sm">
                    {fxSlots.map((fx, i) => (
                      <div key={i} className="flex justify-between bg-gray-600 rounded px-2 py-1">
                        <span className="text-purple-300">FX {i + 1}</span>
                        <span>{fx.type}</span>
                        <span className="text-gray-400">{fx.preset || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-green-400 mb-2">Aux Bus Configuration</h4>
                  <div className="space-y-1 text-sm">
                    {auxBuses.map((aux, i) => (
                      <div key={i} className="flex justify-between bg-gray-600 rounded px-2 py-1">
                        <span className="text-green-300">AUX {i + 1}</span>
                        <span>{aux.name || '—'}</span>
                        <span className="text-gray-400">{aux.purpose || '—'}</span>
                        {aux.preFader && <span className="text-yellow-400 text-xs">PRE</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-red-400 mb-2">Mute Groups</h4>
                  <div className="space-y-1 text-sm">
                    {muteGroups.map((mg, i) => {
                      const assignedChannels = channels
                        .map((ch, idx) => ch.muteGroups[i] ? (ch.name || getChannelLabel(idx)) : null)
                        .filter(Boolean);
                      return (
                        <div key={i} className="bg-gray-600 rounded px-2 py-1">
                          <div className="flex justify-between">
                            <span className="text-red-300">MG {i + 1}: {mg.name || '—'}</span>
                          </div>
                          {assignedChannels.length > 0 && (
                            <div className="text-gray-400 text-xs mt-1">
                              {assignedChannels.join(', ')}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 text-indigo-400">Session Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div><span className="text-gray-400">Project:</span> {projectName || '—'}</div>
                <div><span className="text-gray-400">Venue:</span> {venue || '—'}</div>
                <div><span className="text-gray-400">Date:</span> {date || '—'}</div>
                <div><span className="text-gray-400">Engineer:</span> {engineer || '—'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        Behringer XR18 Mixer Routing Matrix • Settings auto-save to browser storage
      </div>
    </div>
  );
}
