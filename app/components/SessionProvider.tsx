"use client";
// SessionProvider is not client side originally, so we need to make it client side, then use it in layout to wrap all page with SessionProvider, according to : https://www.youtube.com/watch?v=md65iBX5Gxg
import { SessionProvider } from "next-auth/react";
export default SessionProvider;
