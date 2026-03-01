function getEnvVar(name, defaultValue) {
  const value = process.env[name];
  // console.log(process.env);
  // console.log(value);
  if (value) return value;

  if (defaultValue) return defaultValue;

  throw new Error(`Missing process.env.${name}`);
}

export { getEnvVar };
