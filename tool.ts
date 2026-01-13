import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { tool } from "@langchain/core/tools";
import {
  HumanMessage,
  ToolMessage
} from "@langchain/core/messages";

const getCurrentTime = tool(
  async () => {
    return new Date().toLocaleTimeString();
  },
  {
    name: "get_current_time",
    description: "Returns the current system time",
  }
);

async function main() {
  const model = new ChatGroq({
    model: "llama-3.1-8b-instant",
    temperature: 0,
  }).bindTools([getCurrentTime]);

  // 1️ User asks question
  const aiResponse = await model.invoke([
    new HumanMessage("What is the current time?")
  ]);

  // 2️ AI decides to call a tool
  if (!aiResponse.tool_calls) return;

  const toolCall = aiResponse.tool_calls[0];

  // 3️ Execute tool
  const toolResult = await getCurrentTime.invoke(toolCall.args);

  // 4️ Send tool result BACK to LLM correctly
  const finalResponse = await model.invoke([
    new HumanMessage("What is the current time?"),
    aiResponse,
    new ToolMessage({
      tool_call_id: toolCall.id!,
      content: String(toolResult),
    }),
  ]);

  console.log(finalResponse.content);
}

main();
