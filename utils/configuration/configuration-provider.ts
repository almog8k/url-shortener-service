import convict from "convict";
import { ConfigSchema } from "./configuration-schema";

let convictConfigurationProvider: convict.Config<any> | undefined;

export function initialize(schema: ConfigSchema) {
  convictConfigurationProvider = convict(schema);
  convictConfigurationProvider.validate();
}

export function reset() {
  convictConfigurationProvider = undefined;
}

export function getValue(keyName: string): string {
  if (convictConfigurationProvider === undefined) {
    throw new Error("Configuration has not been initialized yet");
  }
  // @ts-ignore
  return convictConfigurationProvider.get(keyName) as string;
}
