import { INestApplication } from '@nestjs/common';

// import { initializeApp, credential, ServiceAccount } from 'firebase-admin';
// import * as serviceAccount from '../../firebase.json';

// const fbCert: ServiceAccount = {
//   projectId: serviceAccount.project_id,
//   clientEmail: serviceAccount.client_email,
//   privateKey: serviceAccount.private_key,
// }


export function setupFirebase(app: INestApplication) {
    // initializeApp({
    //   credential: credential.cert(fbCert as ServiceAccount),
    //   databaseURL: "https://helper-1e401.firebaseio.com"
    // });
}
