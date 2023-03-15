import { Auth, getAuth } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import getConfig from 'next/config';

interface Config {
  apiKey: string;
  authDomain: string;
  projectId: string;
  // storageBucket: string;
  // messagingSenderId: string;
  // appId: string;
}

/**
 * client Side에서는 환경변수를 저장할 때 서버와 다르게 작동함
 * ex) server side: .env파일에 환경변수 저장
 *     client side: 사용자의 pc환경이 모두 다르므로 next.config.js에 저장장
 */

const { publicRuntimeConfig } = getConfig();
const config: Config = {
  apiKey: publicRuntimeConfig.apiKey,
  authDomain: publicRuntimeConfig.authDomain,
  projectId: publicRuntimeConfig.projectId,
  // storageBucket: publicRuntimeConfig.storageBucket,
  // messagingSenderId: publicRuntimeConfig.messagingSenderId,
  // appId: publicRuntimeConfig.appId,
};

export default class FirebaseClient {
  private static instance: FirebaseClient;

  private auth: Auth;

  public constructor() {
    const apps = getApps();
    if (apps.length === 0) {
      initializeApp(config);
    }
    this.auth = getAuth();
  }

  public static getInstance(): FirebaseClient {
    if (FirebaseClient.instance === undefined || FirebaseClient.instance === null) {
      FirebaseClient.instance = new FirebaseClient();
    }
    return FirebaseClient.instance;
  }

  public get Auth(): Auth {
    return this.auth;
  }
}
