// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';
// import { createClient } from '@supabase/supabase-js';

// // ---------- OpenRouter Client ----------
// const openai = new OpenAI({
//   baseURL: 'https://openrouter.ai/api/v1',
//   apiKey: process.env.OPENROUTER_API_KEY,
// });

// // ---------- Supabase Client ----------
// const supabaseUrl = process.env.SUPABASE_URL!;
// const supabaseKey =
//   process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;

// const supabase = createClient(supabaseUrl, supabaseKey);

// // ---------- CORS HANDLER ----------
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
//       'Access-Control-Max-Age': '86400',
//     },
//   });
// }

// // ---------- MAIN RAG ENDPOINT ----------
// export async function POST(req: Request) {
//   console.log('=== /api/rag HIT ===', new Date().toISOString());

//   try {
//     const body = await req.json();
//     const { query } = body as { query?: string };

//     if (!query || typeof query !== 'string') {
//       return NextResponse.json(
//         { error: 'Query is required and must be a string' },
//         {
//           status: 400,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//             'Access-Control-Allow-Headers': 'Content-Type, Accept',
//           },
//         }
//       );
//     }

//     console.log('User query:', query);

//     // 1) Create embedding for the query
//     console.log('Creating embedding...');
//     const embRes = await openai.embeddings.create({
//       model: 'openai/text-embedding-3-small', // 1536-dim, matches vector(1536)
//       input: query,
//     });

//     const queryEmbedding = embRes.data[0].embedding;

//     // 2) Vector search in Supabase
//     console.log('Calling Supabase.match_documents...');
//     const { data: matches, error: matchError } = await supabase.rpc(
//       'match_documents',
//       {
//         query_embedding: queryEmbedding,
//         match_count: 3, // top 3 chunks
//       }
//     );

//     if (matchError) {
//       console.error('Supabase match_documents error:', matchError);
//       throw new Error('Failed to retrieve context from Supabase');
//     }

//     const contextText =
//       (matches || [])
//         .map((m: any) => m.content as string)
//         .filter(Boolean)
//         .join('\n\n') || '';

//     console.log(
//       'Retrieved context length:',
//       contextText ? contextText.length : 0
//     );

//     // 3) Build final system prompt with context
//     const systemPrompt = `
// You are the CLUMOSS AI Assistant.

// Your role:
// - Use ONLY the context provided below to answer the user.
// - If the context is not sufficient, say you don't have enough information from CLUMOSS docs and answer only with what is available.
// - Be concise (3–5 lines), professional, and clear.
// - Respond in the same language as the user if possible.

// Context:
// ${contextText || '[No relevant context retrieved]'}
// `.trim();

//     // 4) Call OpenRouter chat completion
//     console.log('Calling OpenRouter chat completion...');
//     const chatRes = await openai.chat.completions.create({
//       model: 'nvidia/nemotron-nano-9b-v2:free',
//       messages: [
//         { role: 'system', content: systemPrompt },
//         { role: 'user', content: query },
//       ],
//       temperature: 0.2,
//       max_tokens: 500,
//     });

//     const aiResponse =
//       chatRes.choices?.[0]?.message?.content?.trim() ||
//       'No response generated';

//     console.log('AI response (preview):', aiResponse.slice(0, 120) + '...');

//     return NextResponse.json(
//       { response: aiResponse },
//       {
//         status: 200,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//           'Access-Control-Allow-Headers': 'Content-Type, Accept',
//         },
//       }
//     );
//   } catch (error) {
//     console.error('=== /api/rag ERROR ===');

//     const message = error instanceof Error ? error.message : 'Unknown error';
//     const stack = error instanceof Error ? error.stack : undefined;

//     console.error('Message:', message);
//     if (stack) console.error('Stack:', stack);

//     return NextResponse.json(
//       { error: 'Internal server error', details: message },
//       {
//         status: 500,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//           'Access-Control-Allow-Headers': 'Content-Type, Accept',
//         },
//       }
//     );
//   }
// }

// export async function GET() {
//   return NextResponse.json(
//     { error: 'Method not allowed. Use POST.' },
//     {
//       status: 405,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//         'Access-Control-Allow-Headers': 'Content-Type, Accept',
//       },
//     }
//   );
// }


// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';
// import { createClient } from '@supabase/supabase-js';

// // ---------- TYPES ----------
// interface MatchResult {
//   id: number;
//   content: string;
//   similarity: number;
// }

// // ---------- OpenRouter Client ----------
// const openai = new OpenAI({
//   baseURL: 'https://openrouter.ai/api/v1',
//   apiKey: process.env.OPENROUTER_API_KEY,
// });

// // ---------- Supabase Client ----------
// const supabaseUrl = process.env.SUPABASE_URL!;
// const supabaseKey =
//   process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;

// const supabase = createClient(supabaseUrl, supabaseKey);

// // ---------- CORS HANDLER ----------
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
//       'Access-Control-Max-Age': '86400',
//     },
//   });
// }

// // ---------- MAIN RAG ENDPOINT ----------
// export async function POST(req: Request) {
//   console.log('=== /api/rag HIT ===', new Date().toISOString());

//   try {
//     const body = await req.json();
//     const { query } = body as { query?: string };

//     if (!query || typeof query !== 'string') {
//       return NextResponse.json(
//         { error: 'Query is required and must be a string' },
//         {
//           status: 400,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//             'Access-Control-Allow-Headers': 'Content-Type, Accept',
//           },
//         }
//       );
//     }

//     console.log('User query:', query);

//     // 1) Create embedding for the query
//     console.log('Creating embedding...');
//     const embRes = await openai.embeddings.create({
//       model: 'openai/text-embedding-3-small', // 1536 dimensions
//       input: query,
//     });

//     const queryEmbedding = embRes.data[0].embedding;

//     // 2) Vector search in Supabase
//     console.log('Calling Supabase.match_documents...');
//     const { data: matches, error: matchError } = await supabase.rpc(
//       'match_documents',
//       {
//         query_embedding: queryEmbedding,
//         match_count: 3,
//       }
//     );

//     if (matchError) {
//       console.error('Supabase match_documents error:', matchError);
//       throw new Error('Failed to retrieve context from Supabase');
//     }

//     const castMatches = (matches as MatchResult[]) || [];

//     const contextText =
//       castMatches
//         .map((m) => m.content)
//         .filter(Boolean)
//         .join('\n\n') || '';

//     console.log(
//       'Retrieved context length:',
//       contextText ? contextText.length : 0
//     );

//     // 3) Build final system prompt with context
//     const systemPrompt = `
// You are the CLUMOSS AI Assistant.

// Your job:
// - Use ONLY the context provided below to answer the user.
// - If the context is insufficient, say you lack enough information from CLUMOSS docs.
// - Keep responses clear, concise, professional (3–5 lines).
// - Respond in user's input language.

// Context:
// ${contextText || '[No relevant context retrieved]'}
// `.trim();

//     // 4) Call LLM (OpenRouter)
//     console.log('Calling OpenRouter chat completion...');
//     const chatRes = await openai.chat.completions.create({
//       model: 'nvidia/nemotron-nano-9b-v2:free',
//       messages: [
//         { role: 'system', content: systemPrompt },
//         { role: 'user', content: query },
//       ],
//       temperature: 0.2,
//       max_tokens: 500,
//     });

//     const aiResponse =
//       chatRes.choices?.[0]?.message?.content?.trim() ||
//       'No response generated';

//     console.log('AI response preview:', aiResponse.slice(0, 100) + '...');

//     return NextResponse.json(
//       { response: aiResponse },
//       {
//         status: 200,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//           'Access-Control-Allow-Headers': 'Content-Type, Accept',
//         },
//       }
//     );
//   } catch (error) {
//     console.error('=== /api/rag ERROR ===');

//     const message = error instanceof Error ? error.message : 'Unknown error';
//     const stack = error instanceof Error ? error.stack : undefined;

//     console.error('Message:', message);
//     if (stack) console.error('Stack:', stack);

//     return NextResponse.json(
//       { error: 'Internal server error', details: message },
//       {
//         status: 500,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//           'Access-Control-Allow-Headers': 'Content-Type, Accept',
//         },
//       }
//     );
//   }
// }

// export async function GET() {
//   return NextResponse.json(
//     { error: 'Method not allowed. Use POST.' },
//     {
//       status: 405,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//         'Access-Control-Allow-Headers': 'Content-Type, Accept',
//       },
//     }
//   );
// }


// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// // ---------- TYPES ----------
// interface MatchResult {
//   id: number;
//   content: string;
//   similarity: number;
// }

// // ---------- Supabase Client ----------
// const supabaseUrl = process.env.SUPABASE_URL!;
// const supabaseKey =
//   process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;

// const supabase = createClient(supabaseUrl, supabaseKey);

// // ---------- CORS ----------
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
//       "Access-Control-Max-Age": "86400",
//     },
//   });
// }

// // ---------- MAIN POST HANDLER ----------
// export async function POST(req: Request) {
//   console.log("=== /api/rag HIT ===", new Date().toISOString());

//   try {
//     const body = await req.json();
//     const { query } = body as { query?: string };

//     if (!query || typeof query !== "string") {
//       return NextResponse.json(
//         { error: "Query is required and must be a string" },
//         {
//           status: 400,
//           headers: {
//             "Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//             "Access-Control-Allow-Headers": "Content-Type, Accept",
//           },
//         }
//       );
//     }

//     console.log("User query:", query);

//     // ----------------------------
//     // STEP 1: Create Embedding
//     // ----------------------------
//     console.log("Creating query embedding...");

//     const embeddingRes = await fetch(
//       "https://openrouter.ai/api/v1/embeddings",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "HTTP-Referer": "https://clumoss.com",
//           "X-Title": "CLUMOSS AI Assistant",
//         },
//         body: JSON.stringify({
//           model: "openai/text-embedding-3-small", // 1536-dim
//           input: query,
//         }),
//       }
//     );

//     if (!embeddingRes.ok) {
//       console.error("Embedding error:", await embeddingRes.text());
//       throw new Error("Failed to generate embedding");
//     }

//     const embeddingJson = await embeddingRes.json();
//     const queryEmbedding = embeddingJson.data[0].embedding;

//     // ----------------------------
//     // STEP 2: Vector Search
//     // ----------------------------
//     console.log("Running match_documents RPC...");

//     const { data: matches, error: matchError } = await supabase.rpc(
//       "match_documents",
//       {
//         query_embedding: queryEmbedding,
//         match_count: 3,
//       }
//     );

//     if (matchError) {
//       console.error("Supabase error:", matchError);
//       throw new Error("match_documents failed");
//     }

//     const castMatches = (matches as MatchResult[]) || [];
//     const contextText =
//       castMatches.map((m) => m.content).filter(Boolean).join("\n\n") || "";

//     console.log("Retrieved context length:", contextText.length);

//     // ----------------------------
//     // STEP 3: Build Prompt
//     // ----------------------------
//     const systemPrompt = `
// You are the CLUMOSS AI Assistant.

// Rules:
// - Use ONLY the context below.
// - If missing info, say the docs do not have enough details.
// - Keep responses 3–5 lines, clear & professional.
// - Respond in the same language as the user.

// Context:
// ${contextText || "[No relevant context retrieved]"}
// `.trim();

//     // ----------------------------
//     // STEP 4: OpenRouter Chat Completion (FETCH-BASED)
//     // ----------------------------
//     console.log("Calling OpenRouter Chat API...");

//     const completionResponse = await fetch(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "HTTP-Referer": "https://clumoss.com",
//           "X-Title": "CLUMOSS AI Assistant",
//         },
//         body: JSON.stringify({
//           model: "nvidia/nemotron-nano-9b-v2:free",
//           messages: [
//             { role: "system", content: systemPrompt },
//             { role: "user", content: query },
//           ],
//           temperature: 0.15,
//           max_tokens: 500,
//         }),
//       }
//     );

//     if (!completionResponse.ok) {
//       console.error(
//         "Chat API Error:",
//         completionResponse.status,
//         await completionResponse.text()
//       );
//       throw new Error("OpenRouter chat completion failed");
//     }

//     const completionJson = await completionResponse.json();

//     const aiResponse =
//       completionJson?.choices?.[0]?.message?.content?.trim() ||
//       "No response generated";

//     console.log("AI Response preview:", aiResponse.slice(0, 120), "...");

//     return NextResponse.json(
//       { response: aiResponse },
//       {
//         status: 200,
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//           "Access-Control-Allow-Headers": "Content-Type, Accept",
//         },
//       }
//     );
//   } catch (error) {
//     console.error("=== /api/rag ERROR ===");

//     const message = error instanceof Error ? error.message : "Unknown error";
//     console.error("Error:", message);

//     return NextResponse.json(
//       { error: "Internal server error", details: message },
//       {
//         status: 500,
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//           "Access-Control-Allow-Headers": "Content-Type, Accept",
//         },
//       }
//     );
//   }
// }

// // ---------- GET handler ----------
// export async function GET() {
//   return NextResponse.json(
//     { error: "Method not allowed. Use POST." },
//     {
//       status: 405,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//         "Access-Control-Allow-Headers": "Content-Type, Accept",
//       },
//     }
//   );
// }







// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// interface MatchResult {
//   id: number;
//   content: string;
//   similarity: number;
// }

// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// // -------------------- CORS --------------------
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
//     },
//   });
// }

// // -------------------- POST --------------------
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const query = body?.query;

//     if (!query || typeof query !== "string") {
//       return NextResponse.json(
//         { error: "Query must be a string" },
//         { status: 400 }
//       );
//     }

//     // 1️⃣ Create embedding
//     const embedRes = await fetch("https://openrouter.ai/api/v1/embeddings", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "HTTP-Referer": "https://clumoss.com",
//         "X-Title": "CLUMOSS AI Assistant",
//       },
//       body: JSON.stringify({
//         model: "openai/text-embedding-3-small",
//         input: query,
//       }),
//     });

//     if (!embedRes.ok) {
//       console.error(await embedRes.text());
//       throw new Error("Embedding generation failed");
//     }

//     const embedJson = await embedRes.json();
//     const queryEmbedding = embedJson.data[0].embedding;

//     // 2️⃣ Vector search (Top-8 for best accuracy)
//     const { data: matchesRaw, error } = await supabase.rpc("match_documents", {
//       query_embedding: queryEmbedding,
//       match_count: 8,
//     });

//     if (error) throw new Error(error.message);

//     const matches = (matchesRaw as MatchResult[]).filter(
//       (m) => m.similarity >= 0.75
//     );

//     let context = matches.map((m) => m.content).join("\n\n");

//     // 3️⃣ If no valid context → return graceful fallback
//     if (!context.trim()) {
//       return NextResponse.json({
//         response:
//           "Sorry, the CLUMOSS knowledge base does not contain an answer for this query.",
//       });
//     }

//     // 4️⃣ Build system prompt
//     const systemPrompt = `
// You are the official CLUMOSS AI Assistant.

// STRICT RULES:
// - Use ONLY the context provided below.
// - Do NOT guess. Do NOT hallucinate.
// - If the answer is NOT in the context, say:
//   "The CLUMOSS knowledge base does not contain this information."
// - Keep answers short (3–5 lines), accurate, and professional.
// - Always follow the user's language.

// CONTEXT:
// ${context}
//     `.trim();

//     // 5️⃣ Generate response
//     const completion = await fetch(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "HTTP-Referer": "https://clumoss.com",
//           "X-Title": "CLUMOSS AI Assistant",
//         },
//         body: JSON.stringify({
//           model: "nvidia/nemotron-nano-9b-v2:free",
//           messages: [
//             { role: "system", content: systemPrompt },
//             { role: "user", content: query },
//           ],
//           temperature: 0.15,
//           max_tokens: 500,
//         }),
//       }
//     );

//     if (!completion.ok) {
//       console.error(await completion.text());
//       throw new Error("Completion failed");
//     }

//     const json = await completion.json();
//     const answer =
//       json.choices?.[0]?.message?.content?.trim() || "No response generated.";

//     return NextResponse.json({ response: answer });
//   } catch (err: any) {
//     console.error("RAG ERROR =>", err);
//     return NextResponse.json(
//       { error: "Internal server error", details: err.message },
//       { status: 500 }
//     );
//   }
// }

// // -------------------- GET --------------------
// export async function GET() {
//   return NextResponse.json(
//     { error: "Use POST instead" },
//     { status: 405 }
//   );
// }

// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// interface MatchResult {
//   id: number;
//   content: string;
//   similarity: number;
// }

// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// // -------------------- CORS --------------------
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
//     },
//   });
// }

// // -------------------- POST --------------------
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const query = body?.query;

//     if (!query || typeof query !== "string") {
//       return NextResponse.json({ error: "Query must be a string" }, { status: 400 });
//     }

//     // 1️⃣ Create embedding
//     const embedRes = await fetch("https://openrouter.ai/api/v1/embeddings", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "HTTP-Referer": "https://clumoss.com",
//         "X-Title": "CLUMOSS AI Assistant",
//       },
//       body: JSON.stringify({
//         model: "openai/text-embedding-3-small",
//         input: query,
//       }),
//     });

//     if (!embedRes.ok) throw new Error("Embedding generation failed");

//     const embedJson = await embedRes.json();
//     const queryEmbedding = embedJson.data[0].embedding;

//     // 2️⃣ Vector search (Top-20 for accuracy)
//     const { data: matchesRaw, error: matchError } = await supabase.rpc(
//       "match_documents",
//       {
//         query_embedding: queryEmbedding,
//         match_count: 20,
//       }
//     );

//     if (matchError) throw new Error(matchError.message);

//     const matches = (matchesRaw as MatchResult[]) || [];

//     // select best similar (first top-20)
//     let context = matches.map((m) => m.content).join("\n\n");

//     const bestMatch = matches.length > 0 ? matches[0] : null;
//     const isRelevant = bestMatch && bestMatch.similarity >= 0.60;

//     // -------------------------------
//     // HYBRID LOGIC:
//     // If NOT relevant → general LLM answer
//     // If relevant → use KB context
//     // -------------------------------
//     let systemPrompt = "";

//     if (isRelevant) {
//       systemPrompt = `
// You are the official CLUMOSS AI Assistant.

// Use ONLY the context below to answer.
// Do NOT guess. Do NOT invent facts.
// Keep answer short (3–5 lines), professional, and helpful.

// CONTEXT:
// ${context}
//         `.trim();
//     } else {
//       systemPrompt = `
// You are the CLUMOSS AI Assistant.

// The user's question is NOT answered in the knowledge base.
// In this case:
// - DO NOT mention the knowledge base.
// - Give a helpful, friendly, normal LLM response.
// - You may answer creatively and conversationally.
// - DO NOT generate false company details.

// Respond in the same language as the user.
//         `.trim();
//     }

//     // 3️⃣ Generate LLM answer
//     const completion = await fetch(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "HTTP-Referer": "https://clumoss.com",
//           "X-Title": "CLUMOSS AI Assistant",
//         },
//         body: JSON.stringify({
//           model: "nvidia/nemotron-nano-9b-v2:free",
//           messages: [
//             { role: "system", content: systemPrompt },
//             { role: "user", content: query },
//           ],
//           temperature: isRelevant ? 0.15 : 0.6,
//           max_tokens: 500,
//         }),
//       }
//     );

//     if (!completion.ok) throw new Error("Completion failed");

//     const json = await completion.json();
//     const answer =
//       json.choices?.[0]?.message?.content?.trim() || "No response generated.";

//     return NextResponse.json({ response: answer });
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: "Internal server error", details: err.message },
//       { status: 500 }
//     );
//   }
// }

// // -------------------- GET --------------------
// export async function GET() {
//   return NextResponse.json(
//     { error: "Use POST instead" },
//     { status: 405 }
//   );
// }







// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// interface MatchResult {
//   id: number;
//   content: string;
//   similarity: number;
// }

// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// // -------------------- CORS --------------------
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
//     },
//   });
// }

// // -------------------- POST --------------------
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const query = body?.query;

//     if (!query || typeof query !== "string") {
//       return NextResponse.json(
//         { error: "Query must be a string" },
//         { status: 400 }
//       );
//     }

//     // 1️⃣ FAST EMBEDDING (384-dim, optimal for RAG)
//     const embedRes = await fetch(`https://openrouter.ai/api/v1/embeddings`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "BAAI/bge-small-en-v1.5",
//         input: query,
//       }),
//     });

//     const embedJson = await embedRes.json();
//     const queryEmbedding = embedJson.data[0].embedding;

//     // 2️⃣ VECTOR SEARCH (top 5)
//     const { data: matches, error } = await supabase.rpc("match_documents", {
//       query_embedding: queryEmbedding,
//       match_count: 5,
//     });

//     if (error) throw new Error(error.message);

//     const results = (matches as MatchResult[]) || [];

//     // BEST MATCH CHECK
//     const best = results[0];
//     const threshold = 0.75;

//     if (!best || best.similarity < threshold) {
//       return NextResponse.json({
//         response:
//           "I’m sorry, the CLUMOSS knowledge base does not contain information related to your question.",
//       });
//     }

//     // Merge top documents
//     const context = results.map((r) => r.content).join("\n\n");

//     // 3️⃣ CALL LLM ONLY WITH CONTEXT (no external knowledge)
//     const completion = await fetch(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "nvidia/nemotron-nano-9b-v2:free",
//           messages: [
//             {
//               role: "system",
//               content: `
// You are the official CLUMOSS AI Assistant.
// You MUST answer ONLY using the provided context.
// If the answer is not in context, say:
// "The CLUMOSS knowledge base does not contain this information."

// Rules:
// - No hallucination.
// - No guessing.
// - Keep answer 3–4 lines.
// - Same language as user.
// - Very clear and precise.

// CONTEXT:
// ${context}
//               `.trim(),
//             },
//             { role: "user", content: query },
//           ],
//           temperature: 0.1,
//           max_tokens: 300,
//         }),
//       }
//     );

//     const json = await completion.json();
//     const response = json.choices?.[0]?.message?.content;

//     return NextResponse.json({ response });
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: "Internal server error", details: err.message },
//       { status: 500 }
//     );
//   }
// }


// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// interface HybridMatchResult {
//   id: number;
//   content: string;
//   similarity: number;
//   bm25_rank: number;
//   hybrid_score: number;
// }

// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// // ---------- CORS ----------
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type, Authorization",
//     },
//   });
// }

// // ---------- MAIN POST ----------
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const query = body?.query;

//     if (!query || typeof query !== "string") {
//       return NextResponse.json(
//         { error: "Query must be a string" },
//         { status: 400 }
//       );
//     }

//     // 1️⃣ Generate embedding from OpenRouter
//     const embedRes = await fetch("https://openrouter.ai/api/v1/embeddings", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "openai/text-embedding-3-small",
//         input: query,
//       }),
//     });

//     const embedJson = await embedRes.json();
//     console.log("EMBED JSON:", embedJson);

//     if (!embedJson?.data || !embedJson.data[0]?.embedding) {
//       return NextResponse.json(
//         {
//           response:
//             "Embedding generation failed. Please try again in a moment.",
//           details: embedJson,
//         },
//         { status: 500 }
//       );
//     }

//     const queryEmbedding = embedJson.data[0].embedding;

//     // 2️⃣ Hybrid vector + BM25 search
//     const { data: matchesRaw, error: matchError } = await supabase.rpc(
//       "hybrid_match_documents",
//       {
//         query_text: query,
//         query_embedding: queryEmbedding,
//         match_count: 10,
//       }
//     );

//     if (matchError) {
//       console.error("Supabase hybrid_match_documents error:", matchError);
//       return NextResponse.json(
//         { response: "Knowledge base search failed." },
//         { status: 500 }
//       );
//     }

//     const matches = (matchesRaw as HybridMatchResult[]) || [];
//     console.log("Matches:", matches);

//     const best = matches[0];
//     const similarityThreshold = 0.6; // Q&A chunks -> keep moderate
//     const isRelevant = best && best.similarity >= similarityThreshold;

//     // 3️⃣ If nothing relevant in KB → DO NOT CALL LLM, just say "not in KB"
//     if (!isRelevant) {
//       return NextResponse.json({
//         response:
//           "The CLUMOSS knowledge base does not contain an exact answer for this query.",
//       });
//     }

//     // Build context from top few matches
//     const context = matches
//       .slice(0, 6)
//       .map((m) => m.content)
//       .join("\n\n");

//     // 4️⃣ Call LLM STRICTLY with KB context ONLY
//     const systemPrompt = `
// You are the official CLUMOSS AI Assistant.

// You MUST follow these rules:
// - Use ONLY the information in the CONTEXT below.
// - Do NOT guess or invent any facts.
// - If the answer is not clearly present in the context, say:
//   "The CLUMOSS knowledge base does not contain this information."
// - Keep answers short (3–5 lines), clear, and professional.
// - Reply in the same language as the user.

// CONTEXT:
// ${context}
//     `.trim();

//     const chatRes = await fetch(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "nvidia/nemotron-nano-9b-v2:free",
//           messages: [
//             { role: "system", content: systemPrompt },
//             { role: "user", content: query },
//           ],
//           temperature: 0.1,
//           max_tokens: 300,
//         }),
//       }
//     );

//     const chatJson = await chatRes.json();
//     console.log("CHAT JSON:", chatJson);

//     const finalAnswer =
//       chatJson?.choices?.[0]?.message?.content?.trim() ||
//       "No response generated.";

//     return NextResponse.json({ response: finalAnswer });
//   } catch (err: any) {
//     console.error("RAG ERROR:", err);
//     return NextResponse.json(
//       { error: "Internal server error", details: err.message },
//       { status: 500 }
//     );
//   }
// }

// // ---------- GET ----------
// export async function GET() {
//   return NextResponse.json(
//     { error: "Use POST instead." },
//     { status: 405 }
//   );
// }

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface HybridMatchResult {
  id: number;
  content: string;
  similarity: number;
  bm25_rank: number;
  hybrid_score: number;
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---------- CORS ----------
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// ---------- MAIN POST ----------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body?.query;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query must be a string" },
        { status: 400 }
      );
    }

    // 1️⃣ Generate embedding from OpenRouter
    const embedRes = await fetch("https://openrouter.ai/api/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/text-embedding-3-small",
        input: query,
      }),
    });

    const embedJson = await embedRes.json();
    console.log("EMBED JSON:", embedJson);

    if (!embedJson?.data || !embedJson.data[0]?.embedding) {
      return NextResponse.json(
        {
          response:
            "Embedding generation failed. Please try again in a moment.",
          details: embedJson,
        },
        { status: 500 }
      );
    }

    const queryEmbedding = embedJson.data[0].embedding;

    // 2️⃣ Hybrid vector + BM25 search
    const { data: matchesRaw, error: matchError } = await supabase.rpc(
      "hybrid_match_documents",
      {
        query_text: query,
        query_embedding: queryEmbedding,
        match_count: 10,
      }
    );

    if (matchError) {
      console.error("Supabase hybrid_match_documents error:", matchError);
      return NextResponse.json(
        { response: "Knowledge base search failed." },
        { status: 500 }
      );
    }

    const matches = (matchesRaw as HybridMatchResult[]) || [];
    console.log("Matches:", matches);

    const best = matches[0];
    const similarityThreshold = 0.6; // Q&A chunks -> keep moderate
    const isRelevant = best && best.similarity >= similarityThreshold;

    // 3️⃣ If nothing relevant in KB → DO NOT CALL LLM, just say "not in KB"
    if (!isRelevant) {
      return NextResponse.json({
        response:
          "The CLUMOSS knowledge base does not contain an exact answer for this query.",
      });
    }

    // Build context from top few matches
    const context = matches
      .slice(0, 6)
      .map((m) => m.content)
      .join("\n\n");

    // 4️⃣ Call LLM STRICTLY with KB context ONLY
    const systemPrompt = `
You are the official CLUMOSS AI Assistant.

You MUST follow these rules:
- Use ONLY the information in the CONTEXT below.
- Do NOT guess or invent any facts.
- If the answer is not clearly present in the context, say:
  "The CLUMOSS knowledge base does not contain this information."
- Keep answers short (3–5 lines), clear, and professional.
- Reply in the same language as the user.

CONTEXT:
${context}
    `.trim();

    const chatRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-nano-9b-v2:free",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: query },
          ],
          temperature: 0.1,
          max_tokens: 300,
        }),
      }
    );

    const chatJson = await chatRes.json();
    console.log("CHAT JSON:", chatJson);

    const finalAnswer =
      chatJson?.choices?.[0]?.message?.content?.trim() ||
      "No response generated.";

    return NextResponse.json({ response: finalAnswer });
  } catch (err: unknown) {
    console.error("RAG ERROR:", err);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: err instanceof Error ? err.message : String(err) 
      },
      { status: 500 }
    );
  }
}

// ---------- GET ----------
export async function GET() {
  return NextResponse.json(
    { error: "Use POST instead." },
    { status: 405 }
  );
}