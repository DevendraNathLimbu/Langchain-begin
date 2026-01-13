import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, AIMessage, SystemMessage } from "langchain";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Example usage of ChatGroq with a prompt template

async function main() {
    const groq = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY || "",
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
    });
const response = await groq.invoke("who is balen shah? Explain shortly.");

const conversation = ([
    new SystemMessage("You are a helpful assistant that translates English to Nepali."),
    new HumanMessage("Translate the following sentence to Nepali: 'Hello, how are you?'"),
    new AIMessage("नमस्ते, तपाईंलाई कस्तो छ?"),
    new HumanMessage(`Translate the following sentence to Nepali: 'Neapl is a beautiful country with diverse culture.'`),
]);

const prompt = ChatPromptTemplate.fromMessages(conversation);

// const chain = prompt.pipe(groq);
// const response2 = await chain.invoke('');
//     console.log("Response2:", response2.content);
const template = ChatPromptTemplate.fromTemplate(
    "Translate the following sentence to Nepali: '{text}'"
);
const chain = template.pipe(groq);

const res = await chain.invoke({ text: "Neapl is a beautiful country with diverse culture." });
console.log(res.content);
}

main();