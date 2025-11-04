declare module 'three/examples/jsm/controls/OrbitControls' {
  const OrbitControls: any;
  export { OrbitControls };
}

declare module 'three/examples/jsm/loaders/GLTFLoader' {
  const GLTFLoader: any;
  export { GLTFLoader };
}

// También declarar variantes que incluyen la extensión .js para compatibilidad
declare module 'three/examples/jsm/controls/OrbitControls.js' {
  const OrbitControls: any;
  export { OrbitControls };
}

declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  const GLTFLoader: any;
  export { GLTFLoader };
}
