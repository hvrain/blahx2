import * as admin from 'firebase-admin';
// import serviceLayout from '../firebase-admin.json';

interface Config {
  credential: {
    type: string;
    projectId: string;
    privateKeyId: string;
    privateKey: string;
    clientEmail: string;
    clientId: string;
    clientX509CertUrl: string;
  };
}

export default class FirebaseAdmin {
  private static instance: FirebaseAdmin;

  private init = false;

  public static getInstance(): FirebaseAdmin {
    if (FirebaseAdmin.instance === undefined || FirebaseAdmin.instance === null) {
      FirebaseAdmin.instance = new FirebaseAdmin();
      FirebaseAdmin.instance.bootstrap();
    }
    return FirebaseAdmin.instance;
  }

  private bootstrap(): void {
    const haveApp = admin.apps.length !== 0;
    if (haveApp) {
      this.init = true;
      return;
    }

    const config: Config = {
      credential: {
        type: process.env.type || '',
        projectId: process.env.projectId || '',
        privateKeyId: process.env.privateKeyId || '',
        privateKey: (process.env.privateKey || '').replace(/\\n/g, '\n'),
        clientEmail: process.env.clientEmail || '',
        clientId: process.env.clientId || '',
        clientX509CertUrl: process.env.clientX509CertUrl || '',
      },
    };
    /**  배포 시 환경변수를 사용해야 한다.*/
    admin.initializeApp({
      credential: admin.credential.cert(config.credential),
    });
  }

  public get firestore(): FirebaseFirestore.Firestore {
    if (this.init === false) {
      this.bootstrap();
    }
    return admin.firestore();
  }

  public get auth(): admin.auth.Auth {
    if (this.init === false) {
      this.bootstrap();
    }
    return admin.auth();
  }
}
