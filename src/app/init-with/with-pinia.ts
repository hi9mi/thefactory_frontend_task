import { createPinia } from "pinia";
import { PiniaLogger } from "pinia-logger";
import type { App } from "vue";

export function withPinia(app: App) {
  const pinia = createPinia();
  const { PROD } = import.meta.env;

  pinia.use(
    PiniaLogger({
      disabled: PROD,
    }),
  );
  app.use(pinia);
}
