// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { pokeRouter } from "./pokeRouter";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("pokemon.", pokeRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
