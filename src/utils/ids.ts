let runningId = 0;

export function createId(prefix: string): string {
  runningId += 1;
  return `${prefix}-${runningId.toString(36)}-${Date.now().toString(36)}`;
}
