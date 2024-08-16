import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, addDoc, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const blogPostForm = document.querySelector('#blogPostForm');
const nav_option_show = document.querySelector('#nav_option_show');
let logout_btn;
let editingBlogId = localStorage.getItem('editingBlogId');

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        if (editingBlogId) {
            try {
                const blogRef = doc(db, "blogs", editingBlogId);
                const blogDoc = await getDoc(blogRef);
                if (blogDoc.exists()) {
                    const blogData = blogDoc.data();
                    blogPostForm.blogTitle.value = blogData.blogTitle;
                    blogPostForm.blogBody.value = blogData.blogBody;
                }
            } catch (error) {
                console.error("Error loading blog for editing: ", error);
            }
        }
    } else {
        nav_option_show.innerHTML = `<a href="./login.html" class="btn bg-green-500 btn-ghost rounded-btn">Login</a>`;
        window.location = 'index.html';
    }
});

blogPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const blogTitle = blogPostForm.blogTitle.value.trim();
    const blogBody = blogPostForm.blogBody.value.trim();

    if (auth.currentUser) {
        const userId = auth.currentUser.uid;

        try {
            if (editingBlogId) {
                const blogRef = doc(db, "blogs", editingBlogId);
                await updateDoc(blogRef, {
                    blogTitle: blogTitle,
                    blogBody: blogBody
                });
                alertify.success('Blog updated successfully!');
                localStorage.removeItem('editingBlogId'); 
            } else {
                await addDoc(collection(db, "blogs"), {
                    userId: userId,
                    blogTitle: blogTitle,
                    blogBody: blogBody,
                    createdAt: new Date()
                });
                alertify.success('Blog posted successfully!');
            }
            
            blogPostForm.reset();
            window.location.href = 'index.html';
        } catch (error) {
            alertify.error('Error posting blog.');
            console.error("Error posting blog: ", error);
        }
    } else {
        alertify.error('User is not logged in.');
    }
});
