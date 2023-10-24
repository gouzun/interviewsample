
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { signInWithEmailAndPassword, getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import {
    getFirestore,
    doc,
    getDoc,
    getDocs,
    setDoc,
    collection,
    updateDoc,
    query, where, deleteDoc
} from 'firebase/firestore';
import 'firebase/storage';

import { sendEmailVerification, getIdTokenResult  } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
    //defix
    apiKey: "AIzaSyBZ7LLDN8gMx-c0jV1gcgRyvWs3oK3gFIs",
  authDomain: "testproject-8d7b3.firebaseapp.com",
  projectId: "testproject-8d7b3",
  storageBucket: "testproject-8d7b3.appspot.com",
  messagingSenderId: "753975905811",
  appId: "1:753975905811:web:87c093688b445ac8faf9e6" 
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: "select_account"
});


export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);
export const db = getFirestore();


const updateUser = async (email) => {
    try {
        
        const dbPL = db;
        //create new doc with custom id;
        const docRef = doc(dbPL, "USERS", email);
        const docSnap = await getDoc(docRef);
        let newData = {};

        if (docSnap.exists()) {
            const existingData = docSnap.data();
            newData = {
                ...existingData, verifiedstatus: 'VERIFIED',
                verifiedDate: new Date(),
            }
            await updateDoc(docRef, newData);
            console.log(`User with email ${email} updated successfully.`);

        } else {            // If no document with the matching email found, handle this case
            console.log(`No user found with email: ${email}`);

        }

    } catch (e) {
        console.log(e);

    }
}

export const verifyEmail = async () => {
    let verifiedstatus = false;
    try {
        const user = auth.currentUser;
                    
        if (user.emailVerified) {
          
            await updateUser(user.email);
            verifiedstatus = true;
            return verifiedstatus;
        } else {
         
            verifiedstatus = false;
            return verifiedstatus;
        }


    } catch (e) {
        console.log(e);
        return false;
    }
}

export const sendVerifyEmail = async () => {
    await sendEmailVerification(auth.currentUser);
}


export const createUserDocumentFromAuth = async (userAuth, contactnumber) => {
    if (!userAuth) return;
    const userDocRef = doc(db, 'USERS', userAuth.email);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
        const { email } = userAuth;
        const createAt = new Date();
        const contact = contactnumber;

        try {
            await setDoc(userDocRef, { email, createAt, contact })
        } catch (error) {
            console.log('error creating user', error.message);
        }
    }
    return userDocRef;

};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;
    return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;
    return await signInWithEmailAndPassword(auth, email, password);
}

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);


///////////for defix
export async function addProject(propertyName, ownerName, propertyAddress, user) {
    const dbPL = db;
    try {
        //create new doc with custom id;
        const docRef = doc(dbPL, "ProjectList", `${propertyName}-${ownerName}-${user}`);

        let newData = {};

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            const existingData = docSnap.data();
            newData = {
                ...existingData, propertyAddress: propertyAddress,
            }

            await updateDoc(docRef, newData);
        } else {

            newData = {
                propertyName: propertyName,
                ownerName: ownerName,
                propertyAddress: propertyAddress,
                defectlist: [],
                user: user,
            }
            await setDoc(docRef, newData, { merge: true });
        }

    } catch (error) {
        console.log(`Error :${error.code},${error.message}`);
    };
}



export async function addDefect(project, floor, area, element, defectCount, defectDesc, defectxpos, defectypos, urldefect, user) {
    const dbPL = db;
    try {

        //create new doc with custom id;
        const docRef = doc(dbPL, `${project}-${user}`, `${project}-${user}-${defectCount}`);

        const newData = {
            project: project + '-' + user,
            defectName: project + '-' + user + '-' + defectCount,
            floor: floor,
            area: area,
            element: element,
            defectDesc: defectDesc,
            defectxpos: defectxpos,
            defectypos: defectypos,
            url: urldefect,
            user: user,
            status: 'PENDING',
        }

        await setDoc(docRef, newData);


    } catch (error) {
        console.log(`Error :${error.code},${error.message}`);
    };
}

export const generateProjectList = async (user) => {
    let result = [];
    let rowcount = 1;
    try {
        const dbPL = db;
        //get records for projectlist and generate select option
        const dbProjectList = collection(dbPL, 'ProjectList');
        const q = query(dbProjectList, where("user", "==", user));
        const dbProjectDocs = await getDocs(q);



        dbProjectDocs.docs.map((doc) => {
            let record = {
                rowcount: rowcount,
                propertyName: doc.get('propertyName'),
                ownerName: doc.get('ownerName'),
                propertyAddress: doc.get('propertyAddress'),
                defectlist: doc.get('defectlist'),
                groundfloor: doc.get('GROUNDFLOOR'),
                firstfloor: doc.get('FIRSTFLOOR'),
                secondfloor: doc.get('SECONDFLOOR'),
                thirdfloor: doc.get('THIRDFLOOR'),
                rooffloor: doc.get('ROOFFLOOR'),
            }
            rowcount++;
            return result.push(record);

        });
    } catch (error) {
        console.log(`Error :${error.code},${error.message}`);
    } finally {
        return result;
    }
}


export const retrieveDefectListForProject = async (project, user) => {

    try {

        const docRef = doc(db, "ProjectList", project + '-' + user);
        const docSnap = await getDoc(docRef);

        return docSnap.data().defectlist;
    } catch (error) {
        console.log(`Error :${error.code},${error.message}`);
    }
}

export const retrieveUserStatus = async (user) => {

    try {
        let status = false;
        const usersCollectionRef = collection(db, 'USERS');

        const q = query(usersCollectionRef, where('email', '==', user));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            // console.log('.substatus',data.substatus);
            if (data.substatus) {
                status = true;
            } else {
                status = false;
            }

        });
        return status;
    } catch (error) {
        console.log(`Error :${error.code},${error.message}`);
    }
}

export const updateDefectListForProject = async (project, user, count) => {
    let arr = [];
    try {
        const docRef = doc(db, "ProjectList", project + '-' + user);
        const docSnap = await getDoc(docRef);

        const newArrDefect = docSnap.data().defectlist;

        newArrDefect.push(project + '-' + user + '-' + count);

        arr = await updateDoc(docRef, { defectlist: newArrDefect })
            .then(() => {
                return retrieveDefectListForProject(project, user);
            });
    } catch (error) {
        console.log(`Error :${error.code},${error.message}`);
    } finally {
        return arr;
    }
}

export const storeImg = async (file, project, user, floor) => {
    let url = '';
    let filename = project + '-' + user + '-' + floor;
    let folderName = project + '-' + user;

    const storage = getStorage();
    const storageRef = ref(storage, folderName + '/' + filename);

    try {
        await uploadBytes(storageRef, file);

    } catch (error) {
        console.log(`Error :${error.code},${error.message}`);
    } finally {
        // url = await getDownloadURL(ref(storage, filename));
        url = await getDownloadURL(storageRef);
        return url;
    }

}

export const addProjectFlrUrl = async (project, floor, url, user) => {
    try {
        const docRef = doc(db, "ProjectList", project + '-' + user);
        let data = '';
        if (floor === 'GROUND FLOOR') {
            data = {
                GROUNDFLOOR: url
            }
        }
        if (floor === 'FIRST FLOOR') {
            data = {
                FIRSTFLOOR: url
            }
        }
        if (floor === 'SECOND FLOOR') {
            data = {
                SECONDFLOOR: url
            }
        }
        if (floor === 'THIRD FLOOR') {
            data = {
                THIRDFLOOR: url
            }
        }
        if (floor === 'ROOF') {
            data = {
                ROOF: url
            }
        }
        //put javascrip switch case ehre

        await updateDoc(docRef, data);
    } catch (error) {
        console.log(`Error :${error.code},${error.message}`);
    }
}

export const addProjectLock = async (project, floor, user) => {
    try {
        const docRef = doc(db, "ProjectList", project + '-' + user);
        let data = {
            lock: true
        }

        await updateDoc(docRef, data);
    } catch (error) {
        console.log(`Error :${error.code},${error.message}`);
    }
}

export const updateProjectStatus = async (project, def, status, user) => {
    try {
        const docRef = doc(db, project + '-' + user, def);
        let data = {};

        if (status === 'COMPLETED') {

            data = {
                status: 'PENDING'
            }
        } else {

            data = {
                status: 'COMPLETED'
            }
        }

        await updateDoc(docRef, data);
    } catch (error) {
        console.log(`Error :${error.code},${error.message}`);
    }
}

export const retrieveLayoutImg = async (project, user, floor) => {
    try {

        const storage = getStorage();
        const folderPath = project + '-' + user; // Specify the folder path
        const filename = project + '-' + user + '-' + floor;
        const filePath = folderPath + '/' + filename; // Combine folder path and filename

        const refPath = ref(storage, filePath);
        const snapshot = await getDownloadURL(refPath);

        if (snapshot) {
            const url = snapshot;
            return url;
        } else {

            return null; // Or you can return a default URL or handle the case as needed.
        }
    } catch (error) {
        if (error.code === 'storage/object-not-found') {
            // console.log('Snapshot does not exist or is empty.');
        } else {
            console.log(`Error: ${error.code}, ${error.message}`);
        }
        return null; // Return null or handle the error as needed.
    }
}

export const retrieveProjectLock = async (project, user) => {

    const docRef = doc(db, "ProjectList", project + '-' + user);
    const docSnap = await getDoc(docRef);
    const lock = docSnap.data().lock;

    if (lock) {
        return 1;
    } else {
        return 0;
    }

}

export const retrieveDefectSummary = async (project, flr, user) => {

    const docRef = doc(db, "ProjectList", project + '-' + user);
    const docSnap = await getDoc(docRef);
    const arrDefects = docSnap.data().defectlist;

    const newArrDefects = [];
    let rowcount = 0;
    let q = '';
    try {

        if (flr) {
            q = query(collection(db, `${project}-${user}`), where("floor", "==", flr));
        } else {
            q = collection(db, `${project}-${user}`);
        }

        const querySnapshot = await getDocs(q);


        arrDefects.forEach(async (docitem) => {

            rowcount++;
            querySnapshot.forEach((doc) => {

                if (docitem === doc.id) {
                    const data = {
                        rowcount: rowcount,
                        project: doc.get('project'),
                        defectName: doc.get('defectName'),
                        area: doc.get('area'),
                        defectDesc: doc.get('defectDesc'),
                        defectNo: doc.get('defectNo'),
                        defectRemark: doc.get('defectRemark'),
                        defectxpos: doc.get('defectxpos'),
                        defectypos: doc.get('defectypos'),
                        element: doc.get('element'),
                        floor: doc.get('floor'),
                        url: doc.get('url'),
                        status: doc.get('status'),

                    };
                    newArrDefects.push(data);

                }
            })
        });

        return newArrDefects;
    } catch (error) {
        console.log(`Error :${error.code},${error.message}`);
    }
}

export const retrievePDFSummary = async (project, user) => {

    const docRef = doc(db, "ProjectList", project + '-' + user);
    const docSnap = await getDoc(docRef);
    const arrDefects = docSnap.data().defectlist;
    const grdlayout = docSnap.data().GROUNDFLOOR;
    const firstlayout = docSnap.data().FIRSTFLOOR;
    const secondlayout = docSnap.data().SECONDFLOOR;
    const thirdlayout = docSnap.data().THIRDFLOOR;
    const rooflayout = docSnap.data().ROOFFLOOR;

    const newArrDefects = [];
    let rowcount = 0;
    let q = '';
    try {
        q = collection(db, `${project}-${user}`);

        const querySnapshot = await getDocs(q);
        arrDefects.forEach(async (docitem) => {
            rowcount++;
            querySnapshot.forEach((doc) => {

                if (docitem === doc.id) {

                    let layouturl = '';
                    if (doc.get('floor') === 'GROUND FLOOR') {
                        layouturl = grdlayout;
                    }
                    if (doc.get('floor') === 'FIRST FLOOR') {
                        layouturl = firstlayout;
                    }
                    if (doc.get('floor') === 'SECOND FLOOR') {
                        layouturl = secondlayout;
                    }
                    if (doc.get('floor') === 'THIRD FLOOR') {
                        layouturl = thirdlayout;
                    }
                    if (doc.get('floor') === 'ROOF') {
                        layouturl = rooflayout;
                    }


                    const data = {
                        rowcount: rowcount,
                        area: doc.get('area'),
                        defectDesc: doc.get('defectDesc'),
                        // defectNo: doc.get('defectNo'),
                        // defectRemark: doc.get('defectRemark'),
                        defectxpos: doc.get('defectxpos'),
                        defectypos: doc.get('defectypos'),
                        element: doc.get('element'),
                        floor: doc.get('floor'),
                        url: doc.get('url'),
                        layouturl: layouturl,
                        status: doc.get('status'),
                    };
                    newArrDefects.push(data);

                }
            })
        });

        return newArrDefects;
    } catch (error) {
        console.log(`Error :${error.code},${error.message}`);
    }
}

export async function deleteDefect(project, defectName, user) {

    try {

        //delete document
        await deleteDoc(doc(db, project + '-' + user, defectName));

        //delete image
        const storage = getStorage();
        const desertRef = ref(storage, project + '-' + user + '/' + defectName);
        await deleteObject(desertRef);

        //update array to remove deleted defect
        const docRef = doc(db, "ProjectList", project + '-' + user);
        const docSnap = await getDoc(docRef);
        const arrDefects = docSnap.data().defectlist;

        arrDefects.splice(arrDefects.indexOf(defectName), 1);

        await updateDoc(docRef, {
            defectlist: arrDefects
        });

    } catch (error) {
        console.log(`Error :${error.code},${error.message}`);
    };
}

export const getUserNameAddress = async (project, user) => {

    const dbPL = db;

    //get records for projectlist and generate select option
    const dbProjectList = collection(dbPL, 'ProjectList');
    const q = query(dbProjectList, where("user", "==", user));
    const dbProjectDocs = await getDocs(q);

    let result = [];
    let rowcount = 1;
    try {
        dbProjectDocs.docs.map((doc) => {
            if ((doc.get('propertyName') + '-' + doc.get('ownerName')) === project) {
                let record = {
                    ownerName: doc.get('ownerName'),
                    propertyAddress: doc.get('propertyAddress'),
                }
                rowcount++;
                return result.push(record);
            }

        });

        return result;
    } catch (error) {
        console.log(`Error :${error.code},${error.message}`);
    }
}

export const getProjectList = async () => {
    let result = [];
    let rowcount = 1;
    try {
        const dbPL = db; // Ensure dbPL is properly initialized
        const dbProjectList = collection(dbPL, 'PROPERTIES');       
        const dbProjectDocs = await getDocs(dbProjectList);

        result = dbProjectDocs.docs.map((doc) => {
            return {
                row: rowcount++,
                address: doc.get('ADDRESS'),
                area: doc.get('AREA'),
                imglink: doc.get('IMGLINK'),
                name: doc.get('NAME'),
                price: doc.get('PRICE'),
                size: doc.get('SIZE'),               
            };
        });
    } catch (error) {
        console.error(`Error: ${error.code}, ${error.message}`);
        // Handle the error or throw it further if necessary
    }
    
    return result; // Return the result array
};
