export function createPromise<T>(executor: (resolve: (value: T) => void, reject: (reason?: any) => void) => void): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  });
}

