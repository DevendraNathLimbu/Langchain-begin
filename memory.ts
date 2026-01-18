import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";

async function main() {
  const model = new ChatGroq({
    model: "llama-3.1-8b-instant",
    temperature: 0,
  });

  // Memory store
  const memory = new MemorySaver();

  const agent = createReactAgent({
    llm: model,
    tools: [],
    checkpointSaver: memory, // MEMORY ENABLED
  });

  // First message
  const res1 = await agent.invoke({
    messages: [new HumanMessage("My name is Dev.")],
    configurable: { thread_id: "user-1" },
  });

  console.log(res1.messages.at(-1)?.content);

  // Second message (same thread!)
  const res2 = await agent.invoke({
    messages: [new HumanMessage("What is my name?")],
    configurable: { thread_id: "user-1" },
  });

  console.log(res2.messages.at(-1)?.content);
}

main();
