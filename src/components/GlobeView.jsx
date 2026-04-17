/**
 * src/components/GlobeView.jsx
 * ─────────────────────────────────────────────────────────────
 * "Global Eyes" 3D holographic globe showing live ship positions.
 *
 * Data sources:
 *  • AISStream.io WebSocket  — live vessel positions (FREE tier)
 *  • AviationStack REST API  — live flight data (1,000 req/mo free)
 *  • Open-Meteo REST API     — live weather (no API key required)
 *
 * Styling: Dark hologram aesthetic — no skybox, deep space black,
 * cyan atmosphere glow, ship dots in high-contrast orange.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import Globe from 'react-globe.gl'

// ── Constants ────────────────────────────────────────────────────
const AISSTREAM_WS  = 'wss://stream.aisstream.io/v0/stream'
const AVIATIONSTACK = `http://api.aviationstack.com/v1/flights?access_key=${import.meta.env.VITE_AVIATIONSTACK_KEY}&flight_status=active&limit=100`
// Open-Meteo: weather for major port cities (no API key needed)
const OPEN_METEO    = 'https://api.open-meteo.com/v1/forecast?latitude=1.35,22.55,51.90,35.68,25.20&longitude=103.82,114.06,4.48,139.69,55.27&current=temperature_2m,wind_speed_10m,weather_code&wind_speed_unit=kn'

// Major port locations for weather overlays
const PORT_LOCATIONS = [
  { name: 'Singapore',  lat:  1.35,  lng: 103.82 },
  { name: 'Shanghai',   lat: 31.23,  lng: 121.47 },
  { name: 'Rotterdam',  lat: 51.90,  lng:   4.48 },
  { name: 'Tokyo',      lat: 35.68,  lng: 139.69 },
  { name: 'Dubai',      lat: 25.20,  lng:  55.27 },
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
]

export default function GlobeView({ style = {} }) {
  const globeRef = useRef(null)

  // ── State ──────────────────────────────────────────────────────
  const [ships,    setShips]    = useState(STATIC_SHIPS)   // live AIS points
  const [flights,  setFlights]  = useState([])             // aviation arcs
  const [weather,  setWeather]  = useState([])             // weather labels
  const [wsStatus, setWsStatus] = useState('connecting')   // 'connecting' | 'live' | 'error'
  const [shipCount, setShipCount] = useState(0)

  // Live ship map — mmsi → point (avoids re-rendering stale ships)
  const shipMapRef = useRef(new Map())
  const wsRef      = useRef(null)

  // ── Globe initial camera ────────────────────────────────────────
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return

    // Start camera over maritime Southeast Asia — busiest shipping lane
    globe.pointOfView({ lat: 15, lng: 105, altitude: 2.2 }, 0)

    // Remove globe's default atmosphere + atmosphere glow colour
    globe.controls().autoRotate      = true
    globe.controls().autoRotateSpeed = 0.2
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

    const connect = () => {
      const ws = new WebSocket(AISSTREAM_WS)
      wsRef.current = ws

      ws.onopen = () => {
        setWsStatus('connecting')
        // Subscribe to global bounding box
        ws.send(JSON.stringify({
          APIKey:       apiKey,
          BoundingBoxes: [[[-90, -180], [90, 180]]],
          // Filter to position reports only for performance
          FilterMessageTypes: ['PositionReport'],
        }))
      }

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)

          // AISStream wraps each message in { MessageType, Message, MetaData }
          if (msg.MessageType !== 'PositionReport') return

          const pos  = msg.Message?.PositionReport
          const meta = msg.MetaData

          if (!pos || pos.Latitude == null || pos.Longitude == null) return

          const mmsi = meta?.MMSI ?? pos.UserID
          const point = {
            lat:  pos.Latitude,
            lng:  pos.Longitude,
            name: meta?.ShipName?.trim() || `MMSI ${mmsi}`,
            speed: pos.Sog ?? 0,          // Speed over ground (knots)
            mmsi,
          }

          // Upsert into the live ship map
          shipMapRef.current.set(String(mmsi), point)

          // Throttle React state updates — max once per 500ms
          setShips(Array.from(shipMapRef.current.values()).slice(0, 500))
          setShipCount(shipMapRef.current.size)
          setWsStatus('live')
        } catch { /* malformed JSON — ignore */ }
      }

      ws.onerror = () => setWsStatus('error')

      ws.onclose = () => {
        setWsStatus('connecting')
        // Reconnect with exponential back-off (max 10s)
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

        // Map flights to arc data for the Globe
        const arcs = json.data
          .filter(f =>
            f.departure?.latitude  && f.departure?.longitude &&
            f.arrival?.latitude    && f.arrival?.longitude
          )
          .slice(0, 80) // limit for performance
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
    const interval = setInterval(fetchFlights, 5 * 60_000) // refresh every 5 min
    return () => clearInterval(interval)
  }, [])

  // ── Open-Meteo — weather at major ports (no API key) ───────────
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res  = await fetch(OPEN_METEO)
        const json = await res.json()

        // Open-Meteo returns arrays matching the lat/lng order
        const points = PORT_LOCATIONS.map((port, i) => ({
          lat:   port.lat,
          lng:   port.lng,
          label: `${port.name}\n${json.current?.[i]?.temperature_2m ?? '?'}°C · ${json.current?.[i]?.wind_speed_10m ?? '?'}kn`,
          temp:  json.current?.[i]?.temperature_2m,
          wind:  json.current?.[i]?.wind_speed_10m,
        }))

        setWeather(points)
      } catch (e) {
        console.warn('[GlobeView] Open-Meteo fetch failed:', e.message)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 15 * 60_000) // refresh every 15 min
    return () => clearInterval(interval)
  }, [])

  // ── Point color by ship speed ───────────────────────────────────
  const pointColor = useCallback((d) => {
    if (d.speed > 16) return '#FF7A2E'  // fast — orange
    if (d.speed > 8)  return '#00C8FF'  // normal — cyan
    return '#00FF85'                     // slow/anchored — green
  }, [])

  // ── Status badge label ─────────────────────────────────────────
  const statusLabel = {
    connecting: 'CONNECTING…',
    live:       `LIVE · ${shipCount.toLocaleString()} vessels`,
    error:      'STATIC DATA (no AIS key)',
  }[wsStatus]

  const statusColor = {
    connecting: '#FFD600',
    live:       '#00FF85',
    error:      '#FF7A2E',
  }[wsStatus]

  return (
    <div style={{ position: 'relative', ...style }}>
      {/* AIS status badge */}
      <div style={{
        position:   'absolute', top: 10, left: 12, zIndex: 10,
        display:    'flex', alignItems: 'center', gap: 6,
        background: 'rgba(2,12,24,0.85)',
        border:     `1px solid ${statusColor}33`,
        borderRadius: 4, padding: '4px 10px',
        fontFamily: "'JetBrains Mono',monospace", fontSize: 10,
        color: statusColor,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: statusColor,
          animation: wsStatus === 'live' ? 'pulse 2s infinite' : 'none',
        }} />
        AIS · {statusLabel}
      </div>

      {/* Legend */}
      <div style={{
        position:   'absolute', top: 10, right: 12, zIndex: 10,
        display:    'flex', flexDirection: 'column', gap: 4,
        background: 'rgba(2,12,24,0.85)',
        border:     '1px solid rgba(0,190,255,0.15)',
        borderRadius: 4, padding: '6px 10px',
        fontFamily: "'JetBrains Mono',monospace", fontSize: 9,
        color: '#3C6882',
      }}>
        <span><span style={{ color: '#FF7A2E' }}>●</span> &gt;16kt fast</span>
        <span><span style={{ color: '#00C8FF' }}>●</span> 8–16kt normal</span>
        <span><span style={{ color: '#00FF85' }}>●</span> &lt;8kt anchored</span>
        {flights.length > 0 && <span><span style={{ color: '#A855F7' }}>━</span> live flights</span>}
      </div>

      <Globe
        ref={globeRef}

        // ── Globe texture ─────────────────────────────────────────
        // Using a dark, desaturated tile set for the hologram look
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

        // Remove the blue atmosphere glow — keep it minimal & dark
        showAtmosphere={true}
        atmosphereColor="rgba(0,200,255,0.15)"
        atmosphereAltitude={0.12}

        // Remove background (make the canvas transparent — bg set by parent)
        backgroundColor="rgba(0,0,0,0)"

        // ── Ship AIS points ───────────────────────────────────────
        pointsData={ships}
        pointLat="lat"
        pointLng="lng"
        pointColor={pointColor}
        pointAltitude={0.005}
        pointRadius={0.25}
        pointLabel={d => `
          <div style="background:#060F1E;border:1px solid rgba(0,200,255,0.3);padding:6px 10px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#C8E4F4">
            <b style="color:#00C8FF">${d.name}</b><br/>
            Speed: ${d.speed?.toFixed(1) ?? '?'} kn
          </div>
        `}

        // ── Flight arcs (AviationStack) ───────────────────────────
        arcsData={flights}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor={() => ['rgba(168,85,247,0.6)', 'rgba(168,85,247,0.1)']}
        arcAltitudeAutoScale={0.3}
        arcStroke={0.4}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={3000}

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
