import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { fetchApi } from "~/app/lib/fetch";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const message = formData.get("message") as string;

  if (!message) {
    return json({ error: "Message is required" }, { status: 400 });
  }

  const apiResponse = await fetchApi("/api/enhancer", {
    method: "POST",
    body: {
      message,
    },
  });

  if (!apiResponse.ok) {
    console.error("API failed", await apiResponse.text());
    return json({ error: "API Error" }, { status: 500 });
  }

  const response = await apiResponse.json();

  return json(response, { status: 200 });
}
