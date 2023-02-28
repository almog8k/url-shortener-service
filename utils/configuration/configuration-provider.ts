import convict, { Path } from "convict";
import { ConfigSchema } from "./configuration-schema";

let convictConfigurationProvider: convict.Config<ConfigSchema> | undefined;

export function initialize(schema: ConfigSchema) {
  convictConfigurationProvider = convict<ConfigSchema>(schema);
  convictConfigurationProvider.validate();
}

export function reset() {
  convictConfigurationProvider = undefined;
}

export function getValue<T>(keyName: Path<ConfigSchema>): T {
  if (convictConfigurationProvider === undefined) {
    throw new Error("Configuration has not been initialized yet");
  }
  return convictConfigurationProvider.get(keyName) as T;
}
