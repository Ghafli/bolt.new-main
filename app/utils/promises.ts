export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


export async function withTimeout<T>(promise: Promise<T>, ms: number, message = 'Promise timed out'): Promise<T> {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error(message));
        }, ms);

        promise.then(resolve, reject).finally(() => {
            clearTimeout(timeoutId);
        });
    });
}
