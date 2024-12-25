import { api } from "~/app/utils/api";
import { toast } from "../stores/toast";

export async function authenticateWebcontainer() {
  try {
    const data = await api.post("/api/auth/webcontainer");
    if (!data.ok) {
      console.error(
        "Webcontainer authentication failed, the API returned:",
        await data.text()
      );
      toast.error("Failed to authenticate webcontainer");
      return;
    }
    const authData = await data.json();
    return authData.token;
  } catch (e) {
    console.error("Webcontainer authentication failed with error:", e);
    toast.error("Failed to authenticate webcontainer");
  }
}
