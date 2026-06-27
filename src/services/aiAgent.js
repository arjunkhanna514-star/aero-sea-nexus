import Groq from 'groq-sdk';
import { StateGraph, Annotation, END } from '@langchain/langgraph';

// Retrieve API key from environment variable
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

// Initialize Groq client
const groq = new Groq({
  apiKey: groqApiKey,
  dangerouslyAllowBrowser: true, // Required for running in the browser
});

const MODEL = 'llama-3.3-70b-versatile';

const State = Annotation.Root({
  messages: Annotation({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  context: Annotation({
    reducer: (x, y) => y,
    default: () => ({}),
  }),
  plan: Annotation({
    reducer: (x, y) => y,
    default: () => "",
  }),
  validatedPlan: Annotation({
    reducer: (x, y) => y,
    default: () => "",
  }),
});

const buildDynamicContext = (page, alertText) => {
  let ctx = `Current page: ${page}. `;
  if (alertText) ctx += `Active Alert: ${alertText}. `;
  
  if (page === 'ingestion') {
    ctx += "Vessel tracks are showing minor delays in the Suez Canal region.";
  } else if (page === 'simulation') {
    ctx += "Risk models indicate a 40% chance of port congestion in Rotterdam over the next 48 hours.";
  }
  
  return ctx;
};

// Node: Analyze Context
async function analyzeContext(state) {
  const lastMsg = state.messages[state.messages.length - 1];
  const response = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: `You are Aero-Sea Nexus AI, a highly advanced maritime and aviation intelligence assistant. 
Analyze the user request given the context: ${JSON.stringify(state.context)}
Provide a brief analysis of the core problem.` },
      { role: 'user', content: lastMsg.content },
    ],
    model: MODEL,
    temperature: 0.2,
  });

  return { plan: response.choices[0]?.message?.content || "Analysis failed." };
}

// Node: Generate Plan
async function generateReroutingPlan(state) {
  const response = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: `Based on the analysis: ${state.plan}. Generate a detailed actionable plan. Use markdown headers, bullet points, and bold text. Suggest specific tool calls if needed.` },
    ],
    model: MODEL,
    temperature: 0.4,
  });

  return { validatedPlan: response.choices[0]?.message?.content || "Plan generation failed." };
}

// Node: Validate Output
async function validateOutput(state) {
  return { 
    messages: [{ role: 'assistant', content: state.validatedPlan }]
  };
}

const graphBuilder = new StateGraph(State)
  .addNode("analyzeContext", analyzeContext)
  .addNode("generateReroutingPlan", generateReroutingPlan)
  .addNode("validateOutput", validateOutput)
  .addEdge("__start__", "analyzeContext")
  .addEdge("analyzeContext", "generateReroutingPlan")
  .addEdge("generateReroutingPlan", "validateOutput")
  .addEdge("validateOutput", END);

const app = graphBuilder.compile();

export async function callAI(messages, pageContext, alertText) {
  try {
    const initialState = {
      messages: messages,
      context: buildDynamicContext(pageContext, alertText),
    };
    
    const finalState = await app.invoke(initialState);
    return finalState.messages[finalState.messages.length - 1].content;
  } catch (error) {
    console.error("AI Agent Error:", error);
    return "The intelligence node encountered a disruption. Please try again.";
  }
}

export async function callAIStreaming(messages, pageContext, alertText, onChunk) {
  try {
    const systemPrompt = `You are Aero-Sea Nexus AI, a highly advanced maritime and aviation intelligence assistant.
Current Context: ${buildDynamicContext(pageContext, alertText)}

TOOLS AVAILABLE:
- /weather [port] — Get live weather for any port
- /route [origin] [destination] — Calculate optimal route
- /risk [region] — Check risk assessment for a region
- /fleet — Show all tracked vessels
- /flights — Show active flight data
- /contracts — Show contract status
- /savings — Calculate AI optimization savings

Format responses with markdown (headers, bold, bullet points, code blocks).
Provide actionable recommendations. Use emojis strategically.`;

    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const stream = await groq.chat.completions.create({
      messages: fullMessages,
      model: MODEL,
      temperature: 0.4,
      stream: true,
    });

    let fullText = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullText += content;
      if (onChunk) onChunk(content);
    }
    
    return fullText;
  } catch (error) {
    console.error("AI Agent Streaming Error:", error);
    throw error;
  }
}
