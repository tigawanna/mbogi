// import { getRandomValues } from 'expo-crypto'
import EventSource from "react-native-sse";
import "react-native-random-uuid";
// globalThis.crypto = globalThis?.crypto ?? {}

// globalThis.crypto.getRandomValues = (arr) => getRandomValues(arr as any)
// globalThis?.crypto?.getRandomValues = (arr: any) => getRandomValues(arr)

globalThis.performance.mark = globalThis?.performance.mark ?? (() => {})
globalThis.performance.measure = globalThis?.performance.measure ?? (() => {})
globalThis.EventSource = globalThis?.EventSource ?? EventSource;
(global as any).EventSource = (global as any)?.EventSource ?? EventSource;

// Fix for TanStack DB / Zod instanceof checks on web
if (typeof window !== 'undefined') {
  // Ensure constructor functions have proper name properties for Zod instanceof checks
  const constructors: any[] = [Date, Array, Object, Function, RegExp, URL];
  
  if (typeof File !== 'undefined') {
    constructors.push(File);
  }
  
  constructors.forEach(constructor => {
    if (!constructor.name) {
      Object.defineProperty(constructor, 'name', { 
        value: constructor.toString().match(/function\s*([^(]*)/)?.[1] || 'Constructor',
        configurable: true 
      });
    }
  });
}
