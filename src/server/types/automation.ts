import type { inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "../api/root";

export type RouterOutput = inferRouterOutputs<AppRouter>;

export type AutomationType = RouterOutput["automation"]["createAutomation"];
