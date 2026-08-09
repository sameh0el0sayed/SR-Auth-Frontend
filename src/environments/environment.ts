export const environment = {
  production: false,
  // Point this at your running SR Auth API instance.
  // The dev proxy (proxy.conf.json) forwards /sr and /health here to dodge CORS.
  apiUrl: 'http://localhost:8000'
};
