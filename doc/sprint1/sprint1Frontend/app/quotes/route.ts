import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";



export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const res = await fetch("https://api.api-ninjas.com/v1/quotes?category=inspirational", {
    headers: {
      "X-Api-Key": process.env.NINJA_API_KEY || "",
    },
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch quote" }), { status: 500 });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data[0]), { status: 200 });
}
