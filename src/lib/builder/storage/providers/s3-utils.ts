export function sanitizeS3Etag(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }
  const normalized = value.replaceAll('"', '').trim();
  return normalized.length > 0 ? normalized : undefined;
}
