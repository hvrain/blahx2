module.exports = {
  reactStrictMode: false,
  // client에서 사용할 환경변수 설정
  publicRuntimeConfig: {
    apiKey: process.env.publicApiKey || '',
    authDomain: process.env.FIREBASE_AUTH_HOST || '',
    projectId: process.env.projectId || '',
    storageBucket: process.env.storageBucket || '',
    messagingSenderId: process.env.messagingSenderId || '',
    appId: process.env.appId || '',
  },
  // webpack5: true,
  // webpack: (config) => {
  //   config.resolve.fallback = { fs: false, net: false, tls: false, };

  //   return config;
  // },
}
