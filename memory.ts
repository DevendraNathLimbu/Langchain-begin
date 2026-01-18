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

  const memory = new MemorySaver();

  const agent = createReactAgent({
    llm: model,
    tools: [],
    checkpointSaver: memory,
  });

  // 1️ First message
  const res1 = await agent.invoke(
    {
      messages: [new HumanMessage("My name is Dev.")],
    },
    {
      configurable: { thread_id: "user-1" },
    }
  );

  console.log(
    res1.messages[res1.messages.length - 1].content
  );

  // 2️ Second message (same thread = memory works)
  const res2 = await agent.invoke(
    {
      messages: [new HumanMessage("What is my name?")],
    },
    {
      configurable: { thread_id: "user-1" },
    }
  );

  console.log(
    res2.messages[res2.messages.length - 1].content
  );
}

main();
