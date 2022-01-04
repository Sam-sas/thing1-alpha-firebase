import React, { useState, useEffect } from 'react'
import firebase from 'firebase/compat/app';
import { Card, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { db, storage } from '../firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setLogLevel } from 'firebase/firestore'

export default function Dashboard() {
    const [error, setError] = useState('');
    const { currentUser, logout } = useAuth();
    const [experts, setExperts] = useState([]);
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    // const 
    const expertsCollectionRef = collection(db, 'experts');
    const history = useHistory();
    //get work
    const [items, setItems] = useState("");

    //CRUD WORK
    const createExpert = async () => {
        await addDoc(expertsCollectionRef, { firstName: newFirstName, lastName: newLastName })
    }

    const updateExpert = async (userId, firstName, lastName) => {
        const userDoc = doc(db, "experts", userId);
        const newFields = {
            firstName: firstName,
            lastName: lastName,
        }
        await updateDoc(userDoc, newFields)
    }

    const removeExpert = async (userId) => {
        const userDoc = doc(db, "experts", userId);
        await deleteDoc(userDoc)
    }


    async function handleLogout() {
        setError('');
        try {
            await logout();
            history.push('/login');
        } catch {
            setError('Failed to log out');
        }
    }

    useEffect(() => {
        const getExperts = async () => {
            const expertData = await getDocs(expertsCollectionRef);
            setExperts(expertData.docs.map((doc) => ({
                ...doc.data(), id: doc.id
            })));
        }

        getExperts();
    }, []);


    //STORAGE FILE UPLOAD
    const [images, setImages] = useState([]);
    const [urls, setUrls] = useState([]);
    const[progress, setProgress] = useState(0);

    // const addFiles = e => {
    //     if (e.target.files[0]) {
    //         setImages(e.target.files[0]);
    //     }
    // };

    // const uploadFiles = () => {
    //     const uploadTask = storage.ref(`staticFiles/${image.name}`).put(image);
    //     uploadTask.on(
    //         "state_changed",
    //         snapshot => {
    //             const progress = Math.round(
    //                 (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //             );
    //             setProgress(progress);
    //         },
    //         error => {
    //             console.log(error);
    //         },
    //         () => {
    //             storage.ref('staticFiles').child(image.name).getDownloadURL().then(url => {
    //                 setUrl(url);
    //             });
    //         }
    //     );
    // };

    const addFiles = e => {
        for(let i=0; i<e.target.files.length; i++) {
            const newImage = e.target.files[i];
            newImage["id"] = Math.random();
            setImages((prevState) => [...prevState, newImage]);
        }
    };

    const uploadFiles = () => {
        const promises = [];
        images.map((image) => {
            // test was not in storage originally and it was added later
            const uploadTask = storage.ref(`test/${image.name}`).put(image);
            promises.push(uploadTask);
            uploadTask.on(
                "state_changed",
                snapshot => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                error => {
                    console.log(error);
                },
                async () => {
                    await storage.ref('test').child(image.name).getDownloadURL().then(urls => {
                        setUrls((prevState => [...prevState, urls]));
                    });
                }
            );
        })
        Promise.all(promises).then(() => alert("all images uploaded")).catch((err) => console.log(err));
    };

    //getting data based on X
   const sortExample = () => {
        // setLoading(true);
        console.log(expertsCollectionRef);
        console.log(currentUser.uid);
        const sortMe = []
        //you can append multiple where methods to narrow down search
        //.limit(3) means it limits how many options come back from the query
        firebase.firestore().collection('experts').where('isExpert', '==', true).orderBy('expertCost', 'asc').onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                sortMe.push(doc.data());
            });
        });
        console.log(sortMe);
        // setLoading(false);
   } 

   const getExample = () => {
    // setLoading(true);
    const tempItems = []
    //you can append multiple where methods to narrow down search
    firebase.firestore().collection('experts').where('uid', '==', currentUser.uid).onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            tempItems.push(doc.data());
        });
    });
    setItems(tempItems);
    console.log(items);
    // setLoading(false);
}

const returnData = (exp) => {
    if(exp) {
        return (
            <>
            <Card>
               <Card.Body>
                  <input placeholder='first name'  onChange={(event) => {
                      setNewFirstName(event.target.value);
                  }} />
                  <input placeholder='last name' onChange={(event) => {
                      setNewLastName(event.target.value);
                  }} />
                  <Button onClick={createExpert}>Add Expert</Button>
               </Card.Body>
           </Card>
           <Card>
               <Card.Body>
                   <h2 className='text-center mb-4'>Profile</h2>
                   {error && <Alert variant='danger'>{error}</Alert>}
                   <strong>Email: </strong> {currentUser.email}
                   <strong>Email: </strong> {currentUser.uid}

                   {experts.map((expert) => {
                       return (
                           <div>
                               <h1>Expert: {expert.firstName} {expert.lastName}</h1>
                               <Button onClick={() => {updateExpert(expert.id, "Barnaby", "Barnacle")}}>Change firist Name</Button>
                               <Button onClick={() => {removeExpert(expert.id)}}>Remove Expert</Button>
                           </div>
                       )
                   })}
                   <Link to="/update-profile" className='btn btn-primary w-100 mt-3'>Update Profile</Link>
               </Card.Body>
           </Card>
           <Card>
               <Card.Body>
                  <input type="file" multiple onChange={addFiles} />
                  <Button onClick={uploadFiles}>Upload</Button>
                  <progress value={progress} max="100" />
                  {urls.map((url, i) => {
                      <div key={i}>
                          {url}
                      </div>
                  })};
               </Card.Body>
           </Card>

           <div className="w-100 text-center mt-2">
               <Button variant='link' onClick={handleLogout} >Log out</Button>                
               <Button onClick={getExample} >get</Button>
               <Button onClick={sortExample} >sort</Button>
           </div>
       </> 
        )
    }
}

    return (
        <>
            {returnData(experts)}
        </>
    )
}
