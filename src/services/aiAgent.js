/**
 * src/services/aiAgent.js
 * ─────────────────────────────────────────────────────────────
 * Aero-Sea Nexus AI Agent — Groq-powered (FREE, no credit card)
 *
 * Architecture:
 *  ┌─────────────┐   ┌───────────────┐   ┌──────────────────┐
 *  │  analyzeCtx │──▶│ generatePlan  │──▶│  validateOutput  │──▶ END
 *  └─────────────┘   └───────────────┘   └──────────────────┘
 *
 * Each node is a pure async function that receives the shared
 * LangGraph state object and returns a partial state update.
 *
 * Model: llama-3.3-70b-versatile (Groq free tier — no billing needed)
 * Rate limits: 6,000 req/day | 30 req/min — well within normal use
 */

import Groq from 'groq-sdk'
import { StateGraph, Annotation, END } from '@langchain/langgraph'

// ── Groq client ─────────────────────────────────────────────────
// dangerouslyAllowBrowser: true is required for Vite/browser builds.
// The key is read-only for inference — no write operations possible.
const groq = new Groq({
  apiKey:                 import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
})

const MODEL = 'llama-3.3-70b-versatile'

// ── Page-aware system prompts ────────────────────────────────────
// Maps each dashboard section to a contextual system prompt so
// the AI knows which live data is relevant to the conversation.
export const PAGE_CONTEXT = {
  ingestion: {
    name: 'Data Ingestion & Integration — The Global Eyes',
    data: `LIVE DASHBOARD METRICS:
- 47 active API feeds | 2,847 endpoints | avg latency 47ms
- Maritime AIS: 24,218 rec/hr (+18% baseline) | MarineTraffic + ExactEarth
- METAR Weather: 16,840 rec/hr | NOAA + ECMWF + MetOffice
- Airline ACARS: 8,920 rec/hr (WARNING — 140ms latency) | SITA/ARINC
- Port Authority: 5,312 rec/hr | IMO GISIS + PortNet
- Quantum Gravity Sensor: STANDBY (GPS nominal) — sub-8cm accuracy, 147-layer gravity model, 99.97% confidence
- 10,000+ dataset archive available (ports + airlines, 14 fields, CSV)`,
  },
  simulation: {
    name: 'Simulation & Analytics — The Virtual Earth',
    data: `LIVE DASHBOARD METRICS:
- 1,247 disruption scenarios | AI routing gain: +14.8% | model confidence: 91.2%
- Quantum Swarm: evaluating ~847K of 1,000,000 routes simultaneously
- Active jet streams: FL380 N.Pacific +185kt, FL400 polar SHA→LAX (14.2% fuel / $38K), Atlantic LHR→JFK (38min + 2.1t fuel)
- Ocean current: +2.1kt Kuroshio on SIN→RTM = $12,400 bunker saving/voyage
- Eagle Eye MARITIME: Bioluminescence radar — Cat-2 sea state at 042°, 5 plume events, 8° starboard deviation recommended
- Eagle Eye AVIATION LiDAR: CAT at FL360, 22nm ahead of SQ322 — EDR 0.35 m²/³s⁻¹ MODERATE, autopilot climbing to FL380
- Suez closure scenario: 8.2d delay / AI optimised = 3.1d / saves $2.4M per voyage`,
  },
  operations: {
    name: 'Automated Operations — The AI Negotiator',
    data: `LIVE DASHBOARD METRICS:
- 23 active contracts | 847 emails processed today | 94.2% auto-resolved | AI savings: $340K
- Maersk Line C-001 ($12.4M Trans-Pacific Charter): expires in 14 DAYS — URGENT RENEWAL, +12% rate clause needs human review
- MSC Mediterranean C-002 ($8.7M Asia-Europe Loop): active, 45 days remaining
- CMA CGM C-003 ($6.2M Red Sea Corridor): active, 90 days remaining
- Hapag-Lloyd C-004 ($3.1M Trans-Pacific Spot): NEGOTIATE — opportunity slot available, est. $340K savings vs spot
- COSCO Shipping C-005 ($4.8M Intra-Asia): renew, 28 days remaining
- Pending emails: ops@maersk.com rate update (HIGH), legal@hapag-lloyd.com amendment (HIGH)`,
  },
  sales: {
    name: 'Enterprise Sales & DaaS — The Data Goldmine',
    data: `LIVE DASHBOARD METRICS:
- Total ARR: $4.2M (+34% YoY) | 127 active clients | DaaS uptime: 99.7% | retention: 96.4%
- Revenue: DaaS APIs $1.8M (43%), Enterprise Contracts $1.2M (29%), Ops Automation $0.8M (19%), Consumer B2C $0.4M (9%)
- Q1 $980K | Q2 $1.10M | Q3 $1.05M | Q4 $1.07M | Gross margin: 68% | Net: ~33% ($1.4M)
- Top clients: Pacific Basin ($48K MRR +12%), Cargill ($42K +8%), Koch Industries ($28K +23%), Glencore ($35K +5%), Trafigura ($22K +16%)
- BDI up 41% YTD | Pipeline: $2.1M qualified | 2026 trajectory: $5.8M ARR`,
  },
  consumer: {
    name: 'Consumer Products (B2C) — Personal Hub',
    data: `LIVE DASHBOARD METRICS:
- Flight SQ322 Singapore → London Heathrow CONFIRMED: departs 23:55 Changi T3 Gate B14, arrives 06:00 LHR T2, 14h 05m A350-900ULR
- Seat 11A Window | Business Class | Asian vegetarian meal | 2×23kg bags
- Eagle Eye LiDAR: CAT at FL360 en route — autopilot climbing to FL380 ~3h into flight, ETA +3min only
- Return BA308 LHR→CDG April 4: 08:30→11:45, 1h 15m
- Package ASN-7743921 (consumer electronics, 2.4kg, Shanghai→London): IN TRANSIT
  Collected CNSHA Mar 18, departed Shanghai Mar 19, cleared Dubai Mar 20
  Next: Frankfurt cargo hub Est. Mar 23 | Delivery London EC1A Est. Mar 25 — ON SCHEDULE`,
  },
}

const buildSystemPrompt = (page) => {
  const ctx = PAGE_CONTEXT[page] || PAGE_CONTEXT.ingestion
  return `You are the Aero-Sea Nexus AI Agent — an elite maritime and aviation logistics intelligence assistant.
You are currently active on the "${ctx.name}" dashboard.

LIVE PLATFORM DATA:
${ctx.data}

INSTRUCTIONS:
- Answer with specific numbers and data from the context above
- Keep responses concise but data-rich — use bullet points where helpful
- Never say you lack access to data — you have it all above
- Format numbers clearly: $ signs, %, M/K suffixes
- You are powered by Groq llama-3.3-70b-versatile — acknowledge if asked`
}

// ── LangGraph State Schema ───────────────────────────────────────
// Annotation.Root defines the typed channels of the shared state.
const AgentState = Annotation.Root({
  /** Conversation history: array of {r: 'user'|'ai', t: string} */
  messages:  Annotation({ reducer: (a, b) => b ?? a }),
  /** Which dashboard page the user is on */
  page:      Annotation({ reducer: (a, b) => b ?? a }),
  /** Optional alert context for rerouting plans (e.g. "Suez closure") */
  alert:     Annotation({ reducer: (a, b) => b ?? a }),
  /** Raw AI analysis from node 1 */
  analysis:  Annotation({ reducer: (a, b) => b ?? a }),
  /** Final rerouting plan from node 2 */
  plan:      Annotation({ reducer: (a, b) => b ?? a }),
  /** Validated, cleaned output from node 3 */
  result:    Annotation({ reducer: (a, b) => b ?? a }),
})

// ── Graph Node 1: Analyse context & generate primary response ────
async function analyzeContext(state) {
  const { messages, page } = state

  const completion = await groq.chat.completions.create({
    model:      MODEL,
    max_tokens: 1024,
    temperature: 0.7,
    messages: [
      { role: 'system', content: buildSystemPrompt(page) },
      // Replay conversation history so the model has full context
      ...messages.map(m => ({
        role:    m.r === 'ai' ? 'assistant' : 'user',
        content: m.t,
      })),
    ],
  })

  return {
    analysis: completion.choices[0]?.message?.content ?? '[No analysis generated]',
  }
}

// ── Graph Node 2: Generate logistics rerouting plan ──────────────
// Only activates when an explicit alert is present (e.g. live weather
// disruption, port closure). Otherwise, passes analysis through.
async function generateReroutingPlan(state) {
  // If no alert, the analysis IS the final answer — skip extra call
  if (!state.alert) {
    return { plan: state.analysis }
  }

  const completion = await groq.chat.completions.create({
    model:      MODEL,
    max_tokens: 512,
    temperature: 0.4, // Lower temp for precise operational plans
    messages: [
      {
        role:    'system',
        content: 'You are a maritime/aviation logistics rerouting specialist. Provide concise, actionable rerouting plans with specific waypoints, time deltas, and cost impacts.',
      },
      {
        role:    'user',
        content: `ALERT: ${state.alert}\n\nCONTEXT:\n${state.analysis}\n\nProvide a specific rerouting plan.`,
      },
    ],
  })

  return {
    plan: completion.choices[0]?.message?.content ?? state.analysis,
  }
}

// ── Graph Node 3: Validate & clean the output ────────────────────
// Ensures the response is non-empty and strips any artifacts.
async function validateOutput(state) {
  const raw = state.plan ?? state.analysis ?? ''

  // Remove any accidental prompt-bleed or system-tag artifacts
  const cleaned = raw
    .replace(/\[INST\].*?\[\/INST\]/gs, '')
    .replace(/<\|.*?\|>/g, '')
    .trim()

  return {
    result: cleaned || '⚠ Agent returned an empty response. Please retry.',
  }
}

// ── Assemble the LangGraph StateGraph ───────────────────────────
const builder = new StateGraph(AgentState)

builder
  .addNode('analyzeContext',       analyzeContext)
  .addNode('generateReroutingPlan', generateReroutingPlan)
  .addNode('validateOutput',       validateOutput)
  .addEdge('__start__',            'analyzeContext')
  .addEdge('analyzeContext',       'generateReroutingPlan')
  .addEdge('generateReroutingPlan', 'validateOutput')
  .addEdge('validateOutput',       '__end__')

// Compiled runnable — call .invoke() to run the full graph
const agentGraph = builder.compile()

/**
 * callAI — public interface used by the Chat component.
 *
 * @param {Array}  messages - Chat history [{r:'user'|'ai', t:string}]
 * @param {string} page     - Active dashboard page key
 * @param {string|null} alert - Optional disruption alert for rerouting mode
 * @returns {Promise<string>} The AI's response text
 */
export async function callAI(messages, page, alert = null) {
  try {
    const finalState = await agentGraph.invoke({
      messages,
      page,
      alert,
      analysis: null,
      plan:     null,
      result:   null,
    })

    return finalState.result ?? '[Agent graph returned no result]'
  } catch (error) {
    // Surface a readable error rather than crashing the UI
    console.error('[aiAgent] Graph execution error:', error)
    throw new Error(
      error?.message?.includes('rate_limit')
        ? '⏱ Groq rate limit reached. Please wait 30 seconds and try again.'
        : `AI Agent error: ${error.message ?? 'Unknown error'}`
    )
  }
}
