export interface ConfigurationPage {
  categories: Category[];
}

export interface Category {
  id: string;
  title: string;
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  configurations: Configuration[];
}

export type ConfigurationType = "boolean" | "number" | "string" | "select";

export interface Configuration {
  id: string;
  type: ConfigurationType;
  title: string;
  subtitle?: string;
  tip?: string;
  icon?: string;
  value: boolean | number | string;
}

export interface SelectConfiguration
  extends Omit<Configuration, "type" | "value"> {
  type: "select";
  value: string;
  options: { label: string; value: string }[];
}
