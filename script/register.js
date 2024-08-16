import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth, db, storage } from "./config.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
import { collection , addDoc} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const from_dt = document.querySelector('#from_dt')
const Frist_Name = document.querySelector('#Frist_Name')
const Last_Name = document.querySelector('#Last_Name')
const Email_dt = document.querySelector('#Email_dt')
const password_dt = document.querySelector('#password_dt')
const profile_pic = document.querySelector('#profile_pic')

alertify.set('notifier', 'position', 'top-center');


// register btn loader
const registerBtn = document.querySelector('#register-btn');
const registerText = document.querySelector('#register-text');
const loadingSpinner = document.querySelector('#loading-spinner');

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// const passwordRegex = /^.{6,}$/;

// const nameRegex = /^.{3,}$/;


from_dt.addEventListener('submit', async (e) => {
    e.preventDefault()
    registerText.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');
    registerBtn.disabled = true;

    let urlCreated = null;

    // if (!nameRegex.test(Frist_Name.value)) {
    //     console.error('First name must be at least 3 characters long');
    //     alertify.error('First name must be at least 3 characters long');

    //     resetButton()
    //     return;
    // }
    // if (!nameRegex.test(Last_Name.value)) {
    //     console.error('Last name must be at least 3 characters long');
    //     alertify.error('Last name must be at least 3 characters long');

    //     resetButton()
    //     return;
    // }
    // if (!emailRegex.test(Email_dt.value)) {
    //     console.error('Invalid email format');
    //     alertify.error('Invalid email format');

    //     resetButton()
    //     return;
    // }
    // if (!passwordRegex.test(password_dt.value)) {
    //     console.error('Password must be at least 6 characters long');
    //     alertify.error('Password must be at least 6 characters long');

    //     resetButton()
    //     return;
    // }

    if (profile_pic.files.length > 0) {
        const file = profile_pic.files[0];
        try {
            urlCreated = await UploadFileLink(file);
            console.log('File uploaded successfully:', urlCreated);
        } catch (error) {
            console.error('File upload failed:', error);
        }
    } else {
        console.log('No file selected');
        alertify.error('No file selected');

        resetButton()
        return;
    }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, Email_dt.value, password_dt.value);
        const user = userCredential.user;
        console.log(user);

        const docRef = await addDoc(collection(db, "users"), {
            FristName: Frist_Name.value,
            LastName: Last_Name.value,
            email: Email_dt.value,
            imgUrl: urlCreated,
            uid: user.uid
        });
        console.log("Document written with ID: ", docRef.id);
        alertify.success('Successfully register');
        setTimeout(function() {
            window.location = 'login.html';
        }, 1000);
       
        from_dt.reset();
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alertify.error(errorMessage);
        resetButton()
      } finally{
        resetButton()
       
      }
    
    
})


async function UploadFileLink(files) {
    const storageRef = ref(storage, Email_dt.value)
    try {
        const uploadImg = await uploadBytes(storageRef, files)
        const url = await getDownloadURL(storageRef)
        return url
    } catch (error) {
        return error
    }
}
function resetButton() {
    registerText.classList.remove('hidden');
    loadingSpinner.classList.add('hidden');
    registerBtn.disabled = false;
}