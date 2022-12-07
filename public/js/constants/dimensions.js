export const screenSize = (globalThis.innerWidth >= 1024) ? 'lg' : 'sm';
export const dimensions = (screenSize === 'lg') ? { x: 1920, y: 1080 } : { x: 900, y: 1420 };
