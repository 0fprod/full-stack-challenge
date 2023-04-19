export function getEnvPath(): string {
  const env: string | undefined = process.env.NODE_ENV;

  const envMap = {
    development: '.env.development',
    test: '.env.test',
  };

  return envMap[env] || '.env';
}
