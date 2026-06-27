/**
 * src/components/GlobeView.jsx
 * ─────────────────────────────────────────────────────────────
 * "Global Eyes" 3D holographic globe showing live ship positions,
 * shipping lanes, flight arcs, and weather data.
 *
 * Upgraded from v3: Added shipping lane visualization, zone buttons,
 * interactive labels, animated counters, and heatmap rings.
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import Globe from 'react-globe.gl'
import { MapPin, Navigation, Plane, Wind, Anchor, Maximize2, Minimize2 } from 'lucide-react'

// ── Constants ────────────────────────────────────────────────
const AISSTREAM_WS  = 'wss://stream.aisstream.io/v0/stream'
const AVIATIONSTACK = `http://api.aviationstack.com/v1/flights?access_key=${import.meta.env.VITE_AVIATIONSTACK_KEY}&flight_status=active&limit=100`
const OPEN_METEO    = 'https://api.open-meteo.com/v1/forecast?latitude=1.35,22.55,51.90,35.68,25.20&longitude=103.82,114.06,4.48,139.69,55.27&current=temperature_2m,wind_speed_10m,weather_code&wind_speed_unit=kn'

// Design tokens
const C = {
  bg:'#020C18', surface:'#060F1E', card:'#091828', elevated:'#0C2038',
  border:'rgba(0,190,255,0.12)', borderHi:'rgba(0,205,255,0.35)',
  cyan:'#00C8FF', orange:'#FF7A2E', green:'#00FF85',
  yellow:'#FFD600', red:'#FF4566', purple:'#A855F7',
  textPrimary:'#C8E4F4', textSecondary:'#3C6882', textMuted:'#1A3550',
}
const mono = { fontFamily: "'JetBrains Mono',monospace" }
const raj  = { fontFamily: "'Rajdhani',sans-serif" }

// Major port locations for weather overlays
const PORT_LOCATIONS = [
  { name: 'Singapore',  lat:  1.35,  lng: 103.82 },
  { name: 'Shanghai',   lat: 31.23,  lng: 121.47 },
  { name: 'Rotterdam',  lat: 51.90,  lng:   4.48 },
  { name: 'Tokyo',      lat: 35.68,  lng: 139.69 },
  { name: 'Dubai',      lat: 25.20,  lng:  55.27 },
]

// Shipping lanes — major global trade routes
const SHIPPING_LANES = [
  // Trans-Pacific
  { startLat: 35.4, startLng: 139.7, endLat: 33.7, endLng: -118.2, label: 'Trans-Pacific', color: 'rgba(0,200,255,0.35)' },
  // Asia-Europe (Suez)
  { startLat: 1.3, startLng: 103.8, endLat: 51.9, endLng: 4.5, label: 'Asia-Europe (Suez)', color: 'rgba(0,255,133,0.3)' },
  // Trans-Atlantic
  { startLat: 51.5, startLng: -0.1, endLat: 40.7, endLng: -74.0, label: 'Trans-Atlantic', color: 'rgba(168,85,247,0.35)' },
  // Intra-Asia
  { startLat: 1.3, startLng: 103.8, endLat: 31.2, endLng: 121.5, label: 'Intra-Asia', color: 'rgba(255,122,46,0.35)' },
  // Middle East - Asia
  { startLat: 25.2, startLng: 55.3, endLat: 22.3, endLng: 114.2, label: 'ME-Asia', color: 'rgba(255,214,0,0.3)' },
  // South America
  { startLat: -23.5, startLng: -46.6, endLat: 51.9, endLng: 4.5, label: 'S.America-Europe', color: 'rgba(0,200,255,0.25)' },
  // Cape route
  { startLat: 1.3, startLng: 103.8, endLat: -33.9, endLng: 18.4, label: 'Cape Route', color: 'rgba(255,69,102,0.25)' },
  // Panama route
  { startLat: 35.4, startLng: 139.7, endLat: 40.7, endLng: -74.0, label: 'Pacific-Atlantic', color: 'rgba(0,200,255,0.2)' },
]

// Port rings — major port markers with activity level
const PORT_RINGS = [
  { lat: 1.35, lng: 103.82, maxR: 3, propagationSpeed: 2, repeatPeriod: 1200, color: () => C.cyan, altitude: 0.001 },
  { lat: 31.23, lng: 121.47, maxR: 4, propagationSpeed: 2, repeatPeriod: 1000, color: () => C.orange, altitude: 0.001 },
  { lat: 51.90, lng: 4.48, maxR: 3, propagationSpeed: 2, repeatPeriod: 1400, color: () => C.green, altitude: 0.001 },
  { lat: 35.68, lng: 139.69, maxR: 2.5, propagationSpeed: 2, repeatPeriod: 1600, color: () => C.purple, altitude: 0.001 },
  { lat: 25.20, lng: 55.27, maxR: 2, propagationSpeed: 2, repeatPeriod: 1800, color: () => C.yellow, altitude: 0.001 },
  { lat: 33.70, lng: -118.25, maxR: 3, propagationSpeed: 2, repeatPeriod: 1100, color: () => C.cyan, altitude: 0.001 },
  { lat: 40.68, lng: -74.04, maxR: 2.5, propagationSpeed: 2, repeatPeriod: 1300, color: () => C.orange, altitude: 0.001 },
  { lat: 22.30, lng: 114.18, maxR: 3.5, propagationSpeed: 2, repeatPeriod: 900, color: () => C.green, altitude: 0.001 },
]

// Zoom presets
const ZONES = [
  { label: 'Global',  lat: 20,   lng: 40,   alt: 2.5 },
  { label: 'Asia',    lat: 15,   lng: 110,  alt: 1.5 },
  { label: 'Europe',  lat: 50,   lng: 10,   alt: 1.5 },
  { label: 'Americas',lat: 25,   lng: -80,  alt: 1.5 },
  { label: 'ME/Africa',lat: 10,  lng: 40,   alt: 1.8 },
]

// Fallback static ship data shown while AISStream connects
const STATIC_SHIPS = [
  { lat:  1.26, lng: 103.82, name: 'MV Singapore Trader',  speed: 14.2 },
  { lat: 22.30, lng: 114.18, name: 'MV Pearl River',        speed: 12.8 },
  { lat: 51.92, lng:   4.10, name: 'MV Rotterdam Star',     speed: 11.4 },
  { lat: 35.45, lng: 139.80, name: 'MV Tokyo Express',      speed: 13.6 },
  { lat: 29.80, lng:  48.30, name: 'MV Gulf Pioneer',       speed:  9.7 },
  { lat:  1.00, lng: 104.00, name: 'MV Malacca Strait',     speed: 15.1 },
  { lat: 31.20, lng: 122.00, name: 'MV Yangtze Queen',      speed: 10.3 },
  { lat:-33.90, lng: 151.20, name: 'MV Sydney Venture',     speed: 12.0 },
  { lat: 37.90, lng:  23.60, name: 'MV Piraeus Link',       speed:  8.9 },
  { lat: 53.50, lng:   0.10, name: 'MV Humber Bridge',      speed: 11.7 },
  { lat: 33.70, lng:-118.25, name: 'MV LA Gateway',         speed: 10.5 },
  { lat: 40.68, lng: -74.04, name: 'MV NY Harbor',          speed:  7.2 },
  { lat:-23.55, lng: -46.64, name: 'MV Santos Express',     speed: 13.1 },
  { lat:  5.60, lng: -0.18,  name: 'MV Accra Trader',       speed:  9.8 },
  { lat:-33.92, lng:  18.42, name: 'MV Cape Runner',        speed: 14.7 },
]

export default function GlobeView({ style = {} }) {
  const globeRef = useRef(null)

  // ── State ──────────────────────────────────────────────────────
  const [ships,      setShips]      = useState(STATIC_SHIPS)
  const [flights,    setFlights]    = useState([])
  const [weather,    setWeather]    = useState([])
  const [wsStatus,   setWsStatus]   = useState('connecting')
  const [shipCount,  setShipCount]  = useState(STATIC_SHIPS.length)
  const [showLanes,  setShowLanes]  = useState(true)
  const [activeZone, setActiveZone] = useState(0)

  // Live ship map — mmsi → point
  const shipMapRef = useRef(new Map())
  const wsRef      = useRef(null)

  // ── Globe initial camera ────────────────────────────────────────
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return

    globe.pointOfView({ lat: 20, lng: 40, altitude: 2.5 }, 0)

    globe.controls().autoRotate      = true
    globe.controls().autoRotateSpeed = 0.3
    globe.controls().enableZoom      = true
  }, [])

  // ── AISStream WebSocket ─────────────────────────────────────────
  useEffect(() => {
    const apiKey = import.meta.env.VITE_AISSTREAM_API_KEY
    if (!apiKey || apiKey === 'REPLACE_WITH_YOUR_AISSTREAM_KEY') {
      console.warn('[GlobeView] AISStream key not configured — using static data')
      setWsStatus('error')
      return
    }

    let reconnectTimer = null
    let lastUpdate = 0

    const connect = () => {
      const ws = new WebSocket(AISSTREAM_WS)
      wsRef.current = ws

      ws.onopen = () => {
        setWsStatus('connecting')
        ws.send(JSON.stringify({
          APIKey:       apiKey,
          BoundingBoxes: [[[-90, -180], [90, 180]]],
          FilterMessageTypes: ['PositionReport'],
        }))
      }

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          if (msg.MessageType !== 'PositionReport') return

          const pos  = msg.Message?.PositionReport
          const meta = msg.MetaData

          if (!pos || pos.Latitude == null || pos.Longitude == null) return

          const mmsi = meta?.MMSI ?? pos.UserID
          const point = {
            lat:  pos.Latitude,
            lng:  pos.Longitude,
            name: meta?.ShipName?.trim() || `MMSI ${mmsi}`,
            speed: pos.Sog ?? 0,
            mmsi,
          }

          shipMapRef.current.set(String(mmsi), point)

          // Throttle React state updates — max once per 800ms
          const now = Date.now()
          if (now - lastUpdate > 800) {
            lastUpdate = now
            setShips(Array.from(shipMapRef.current.values()).slice(0, 500))
            setShipCount(shipMapRef.current.size)
            setWsStatus('live')
          }
        } catch { /* malformed JSON — ignore */ }
      }

      ws.onerror = () => setWsStatus('error')

      ws.onclose = () => {
        setWsStatus('connecting')
        reconnectTimer = setTimeout(connect, Math.min(
          (reconnectTimer?._delay ?? 1000) * 2, 10_000
        ))
      }
    }

    connect()

    return () => {
      clearTimeout(reconnectTimer)
      wsRef.current?.close()
    }
  }, [])

  // ── AviationStack — live flights ────────────────────────────────
  useEffect(() => {
    const key = import.meta.env.VITE_AVIATIONSTACK_KEY
    if (!key || key === 'REPLACE_WITH_YOUR_AVIATIONSTACK_KEY') return

    const fetchFlights = async () => {
      try {
        const res  = await fetch(AVIATIONSTACK)
        const json = await res.json()

        if (!json.data?.length) return

        const arcs = json.data
          .filter(f =>
            f.departure?.latitude  && f.departure?.longitude &&
            f.arrival?.latitude    && f.arrival?.longitude
          )
          .slice(0, 80)
          .map(f => ({
            startLat:  f.departure.latitude,
            startLng:  f.departure.longitude,
            endLat:    f.arrival.latitude,
            endLng:    f.arrival.longitude,
            label:     `${f.flight?.iata ?? '??'} — ${f.airline?.name ?? ''}`,
            airline:   f.airline?.name,
            status:    f.flight_status,
          }))

        setFlights(arcs)
      } catch (e) {
        console.warn('[GlobeView] AviationStack fetch failed:', e.message)
      }
    }

    fetchFlights()
    const interval = setInterval(fetchFlights, 5 * 60_000)
    return () => clearInterval(interval)
  }, [])

  // ── Open-Meteo — weather at major ports ────────────────────────
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res  = await fetch(OPEN_METEO)
        const json = await res.json()

        const results = Array.isArray(json) ? json : [json]
        const points = PORT_LOCATIONS.map((port, i) => ({
          lat:   port.lat,
          lng:   port.lng,
          label: `${port.name}\n${results[i]?.current?.temperature_2m ?? '?'}°C · ${results[i]?.current?.wind_speed_10m ?? '?'}kn`,
          temp:  results[i]?.current?.temperature_2m,
          wind:  results[i]?.current?.wind_speed_10m,
        }))

        setWeather(points)
      } catch (e) {
        console.warn('[GlobeView] Open-Meteo fetch failed:', e.message)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 15 * 60_000)
    return () => clearInterval(interval)
  }, [])

  // ── Point color by ship speed ───────────────────────────────────
  const pointColor = useCallback((d) => {
    if (d.speed > 16) return '#FF7A2E'  // fast — orange
    if (d.speed > 8)  return '#00C8FF'  // normal — cyan
    return '#00FF85'                     // slow/anchored — green
  }, [])

  // ── Zoom to zone ───────────────────────────────────────────────
  const zoomTo = useCallback((idx) => {
    const zone = ZONES[idx]
    setActiveZone(idx)
    globeRef.current?.pointOfView({ lat: zone.lat, lng: zone.lng, altitude: zone.alt }, 1000)
  }, [])

  // ── Combined arcs: shipping lanes + flights ─────────────────────
  const allArcs = useMemo(() => {
    const laneArcs = showLanes ? SHIPPING_LANES.map(l => ({
      ...l,
      isLane: true,
    })) : []
    const flightArcs = flights.map(f => ({
      ...f,
      isLane: false,
    }))
    return [...laneArcs, ...flightArcs]
  }, [showLanes, flights])

  // ── Status badge ───────────────────────────────────────────────
  const statusLabel = {
    connecting: 'CONNECTING…',
    live:       `LIVE · ${shipCount.toLocaleString()} vessels`,
    error:      `STATIC · ${shipCount} vessels`,
  }[wsStatus]

  const statusColor = {
    connecting: C.yellow,
    live:       C.green,
    error:      C.orange,
  }[wsStatus]

  return (
    <div style={{ position: 'relative', ...style }}>
      {/* ── Styles ── */}
      <style>{`
        @keyframes ringPulseGlobe{0%{transform:scale(1);opacity:0.6}100%{transform:scale(2.5);opacity:0}}
      `}</style>

      {/* AIS status badge */}
      <div style={{
        position: 'absolute', top: 12, left: 14, zIndex: 10,
        display: 'flex', alignItems: 'center', gap: 7,
        background: 'rgba(2,12,24,0.9)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${statusColor}33`,
        borderRadius: 6, padding: '5px 12px',
        ...mono, fontSize: 10,
        color: statusColor,
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: statusColor,
          animation: wsStatus === 'live' ? 'pulse 2s infinite' : 'none',
          position: 'relative',
        }}>
          {wsStatus === 'live' && <span style={{
            position: 'absolute', inset: -3, borderRadius: '50%',
            border: `1px solid ${statusColor}`,
            animation: 'ringPulseGlobe 2s ease-out infinite',
          }}/>}
        </span>
        AIS · {statusLabel}
      </div>

      {/* Zone quick buttons */}
      <div style={{
        position: 'absolute', bottom: 14, left: 14, zIndex: 10,
        display: 'flex', gap: 4,
      }}>
        {ZONES.map((z, i) => (
          <button key={z.label} onClick={() => zoomTo(i)} style={{
            ...mono, fontSize: 9, color: activeZone === i ? C.bg : C.textSecondary,
            background: activeZone === i ? C.cyan : 'rgba(2,12,24,0.85)',
            border: `1px solid ${activeZone === i ? C.cyan : 'rgba(0,190,255,0.15)'}`,
            borderRadius: 4, padding: '4px 10px', cursor: 'pointer',
            transition: 'all 0.2s',
            backdropFilter: 'blur(6px)',
          }}>{z.label}</button>
        ))}
      </div>

      {/* Legend + toggles */}
      <div style={{
        position: 'absolute', top: 12, right: 14, zIndex: 10,
        display: 'flex', flexDirection: 'column', gap: 5,
        background: 'rgba(2,12,24,0.9)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0,190,255,0.15)',
        borderRadius: 6, padding: '8px 12px',
        ...mono, fontSize: 9, color: C.textSecondary,
      }}>
        <span><span style={{ color: '#FF7A2E' }}>●</span> &gt;16kt fast</span>
        <span><span style={{ color: '#00C8FF' }}>●</span> 8–16kt normal</span>
        <span><span style={{ color: '#00FF85' }}>●</span> &lt;8kt anchored</span>
        {flights.length > 0 && <span><span style={{ color: '#A855F7' }}>━</span> flights ({flights.length})</span>}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 5, marginTop: 2 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 9 }}>
            <input type="checkbox" checked={showLanes} onChange={e => setShowLanes(e.target.checked)}
              style={{ accentColor: C.cyan, width: 12, height: 12 }}/>
            Trade routes
          </label>
        </div>
      </div>

      {/* Data counters */}
      <div style={{
        position: 'absolute', bottom: 14, right: 14, zIndex: 10,
        display: 'flex', gap: 12,
        background: 'rgba(2,12,24,0.9)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0,190,255,0.15)',
        borderRadius: 6, padding: '6px 12px',
      }}>
        {[
          { label: 'VESSELS', value: shipCount, color: C.cyan, icon: Anchor },
          { label: 'FLIGHTS', value: flights.length, color: C.purple, icon: Plane },
          { label: 'PORTS', value: weather.length, color: C.orange, icon: MapPin },
        ].map(d => (
          <div key={d.label} style={{ textAlign: 'center' }}>
            <div style={{ ...mono, fontSize: 8, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{d.label}</div>
            <div style={{ ...mono, fontSize: 14, fontWeight: 500, color: d.color }}>{d.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <Globe
        ref={globeRef}

        // ── Globe texture ─────────────────────────────────────────
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

        showAtmosphere={true}
        atmosphereColor="rgba(0,200,255,0.15)"
        atmosphereAltitude={0.12}
        backgroundColor="rgba(0,0,0,0)"

        // ── Ship AIS points ───────────────────────────────────────
        pointsData={ships}
        pointLat="lat"
        pointLng="lng"
        pointColor={pointColor}
        pointAltitude={0.005}
        pointRadius={0.22}
        pointLabel={d => `
          <div style="background:rgba(6,15,30,0.95);backdrop-filter:blur(8px);border:1px solid rgba(0,200,255,0.35);padding:8px 12px;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#C8E4F4;box-shadow:0 8px 32px rgba(0,0,0,0.6)">
            <b style="color:#00C8FF;font-family:'Rajdhani',sans-serif;font-size:13px;letter-spacing:0.04em">${d.name}</b><br/>
            <span style="color:#3C6882">Speed:</span> ${d.speed?.toFixed(1) ?? '?'} kn
            ${d.mmsi ? `<br/><span style="color:#3C6882">MMSI:</span> ${d.mmsi}` : ''}
          </div>
        `}

        // ── Arcs: Shipping lanes + flights ─────────────────────────
        arcsData={allArcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor={d => d.isLane
          ? [d.color, d.color]
          : ['rgba(168,85,247,0.6)', 'rgba(168,85,247,0.1)']
        }
        arcAltitudeAutoScale={d => d.isLane ? 0.1 : 0.3}
        arcStroke={d => d.isLane ? 0.3 : 0.4}
        arcDashLength={d => d.isLane ? 0.6 : 0.4}
        arcDashGap={d => d.isLane ? 0.3 : 0.2}
        arcDashAnimateTime={d => d.isLane ? 5000 : 3000}
        arcLabel={d => d.label ? `
          <div style="background:rgba(6,15,30,0.95);backdrop-filter:blur(8px);border:1px solid rgba(0,200,255,0.25);padding:5px 10px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:10px;color:#C8E4F4">
            ${d.label}
          </div>
        ` : ''}

        // ── Port rings ────────────────────────────────────────────
        ringsData={PORT_RINGS}
        ringLat="lat"
        ringLng="lng"
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        ringColor="color"
        ringAltitude="altitude"

        // ── Weather labels (Open-Meteo) ───────────────────────────
        labelsData={weather}
        labelLat="lat"
        labelLng="lng"
        labelText="label"
        labelSize={0.6}
        labelDotRadius={0.3}
        labelColor={() => 'rgba(255,122,46,0.85)'}
        labelResolution={2}

        width={style.width   ?? undefined}
        height={style.height ?? undefined}
      />
    </div>
  )
}
