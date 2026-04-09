import userData from "../../chat/user_data.json";

type IncomingMessage = {
    role: "user" | "assistant";
    content: string;
};

type ChatRequestBody = {
    messages?: IncomingMessage[];
};

type LangdockResponse = {
    choices?: Array<{
        message?: {
            content?: string | null;
        };
    }>;
};

const USER_DATA_CONTEXT = JSON.stringify(userData);

const BASE_SYSTEM_PROMPT =
    "You are a helpful health assistant demo. Be concise, calm, and practical. Keep responses short and user-friendly.";

const USER_CONTEXT_SYSTEM_PROMPT =
    "Use the following user profile as factual context for this conversation. Prioritize it over assumptions, and if asked about unavailable details, say they are not present in the profile.\n\n" +
    USER_DATA_CONTEXT;

export async function POST(request: Request) {
    try {
        const apiKey = process.env.LANGDOCK_API_KEY;
        const region = process.env.LANGDOCK_REGION ?? "eu";
        const model = process.env.LANGDOCK_MODEL ?? "gpt-5-mini";

        if (!apiKey) {
            return Response.json({ error: "LANGDOCK_API_KEY is not configured." }, { status: 500 });
        }

        const body = (await request.json()) as ChatRequestBody;
        const messages = body.messages ?? [];

        if (messages.length === 0) {
            return Response.json({ error: "At least one message is required." }, { status: 400 });
        }

        const upstreamResponse = await fetch(
            `https://api.langdock.com/openai/${region}/v1/chat/completions`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: "system",
                            content: BASE_SYSTEM_PROMPT,
                        },
                        {
                            role: "system",
                            content: USER_CONTEXT_SYSTEM_PROMPT,
                        },
                        ...messages,
                    ],
                }),
            }
        );

        if (!upstreamResponse.ok) {
            const errorText = await upstreamResponse.text();
            return Response.json(
                { error: `Langdock error (${upstreamResponse.status}): ${errorText}` },
                { status: upstreamResponse.status }
            );
        }

        const data = (await upstreamResponse.json()) as LangdockResponse;
        const content = data.choices?.[0]?.message?.content ?? "No response received.";

        return Response.json({ content });
    } catch (error) {
        console.error("Chat route error", error);
        return Response.json({ error: "Unexpected server error." }, { status: 500 });
    }
}
