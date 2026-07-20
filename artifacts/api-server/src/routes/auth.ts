import { Router, type IRouter } from "express";
import {
  LoginBody,
  LoginResponse,
  LogoutResponse,
  GetMeResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

declare module "express-session" {
  interface SessionData {
    loggedIn: boolean;
  }
}

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const adminUsername = process.env["ADMIN_USERNAME"];
  const adminPassword = process.env["ADMIN_PASSWORD"];

  if (!adminUsername || !adminPassword) {
    req.log.error("ADMIN_USERNAME or ADMIN_PASSWORD env vars not set");
    res.status(500).json({ error: "Server misconfigured" });
    return;
  }

  if (
    parsed.data.username === adminUsername &&
    parsed.data.password === adminPassword
  ) {
    req.session.loggedIn = true;
    res.json(LoginResponse.parse({ loggedIn: true }));
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  req.session.destroy(() => {
    res.json(LogoutResponse.parse({ loggedIn: false }));
  });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  res.json(GetMeResponse.parse({ loggedIn: !!req.session.loggedIn }));
});

export default router;
