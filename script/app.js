import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, query, where, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const nav_option_show = document.querySelector('#nav_option_show');
const main_card_container = document.querySelector('#main_card_container');
alertify.set('notifier', 'position', 'top-center');

let logout_btn;

function check_onAuthStateChanged() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const uid = user.uid;
            try {
                const q = query(collection(db, "users"), where("uid", "==", uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const item = doc.data();
                    nav_option_show.innerHTML = `
                        <div class="dropdown dropdown-end">
                          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                            <div class="w-10 rounded-full">
                              <img alt="User Profile Image" src="${item.imgUrl}" />
                            </div>
                          </div>
                          <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li><a href="addPost.html" class="justify-between">Add post</a></li>
                            <li><a>Settings</a></li>
                            <li id="logout_btn"><a>Logout</a></li>
                          </ul>
                        </div>
                    `;
                    logout_btn = document.querySelector('#logout_btn');
                    logout_btn.addEventListener('click', () => {
                        signOut(auth).then(() => {
                            check_onAuthStateChanged();
                        }).catch((error) => {
                            console.error("Sign Out Error: ", error);
                        });
                    });
                });
                // Display blog posts after user data is fetched
                displayBlogPosts(uid);
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        } else {
            nav_option_show.innerHTML = `<a href="./login.html" class="btn bg-green-500 btn-ghost rounded-btn">Login</a>`;
        }
    });
}

check_onAuthStateChanged();

// Function to display blog posts
async function displayBlogPosts(userId) {
    main_card_container.innerHTML = ''; // Clear the container

    try {
        const q = query(collection(db, "blogs"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            main_card_container.innerHTML = '<div class="text-center"><h1>No data Found</h1></div>';
            return;
        }

        querySnapshot.forEach((doc, index) => {
            const blog = doc.data();
            const blogId = doc.id;
            main_card_container.innerHTML += `
                <div class="card bg-base-100 shadow-xl">
                    <figure>
                        <img class="object-cover w-full h-48 object-top rounded-[10px]" src="${blog.productImgUrl || 'https://via.placeholder.com/150'}" alt="" />
                    </figure>
                    <div class="card-body h-100 flex flex-col justify-between">
                        <div>
                            <h2 class="card-title">${blog.blogTitle}</h2>
                            <p class="text-sm overflow-hidden text-ellipsis">${blog.blogBody || 'No content available'}</p>
                        </div>
                        <div class="card-actions flex justify-between items-center">
                            <span class="text-lg font-semibold text-gray-700">Posted on ${new Date(blog.createdAt.seconds * 1000).toDateString()}</span>
                            <div>
                                <button class="btn btn-sm btn-primary edit-btn" data-id="${blogId}">Edit</button>
                                <button class="btn btn-sm btn-error delete-btn" data-id="${blogId}">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        // Add event listeners for edit and delete buttons
        const editButtons = document.querySelectorAll('.edit-btn');
        const deleteButtons = document.querySelectorAll('.delete-btn');

        editButtons.forEach(btn => {
            btn.addEventListener('click', handleEditBlog);
        });

        deleteButtons.forEach(btn => {
            btn.addEventListener('click', handleDeleteBlog);
        });

    } catch (error) {
        console.error("Error fetching blog posts: ", error);
        alertify.error("Failed to load blogs.");
    }
}

// Function to handle blog editing
async function handleEditBlog(event) {
    const blogId = event.target.getAttribute('data-id');
    // Redirect to the addPost page with the blogId in the URL or localStorage for editing
    localStorage.setItem('editingBlogId', blogId);
    window.location.href = 'addPost.html'; // Assuming this page will handle the editing logic
}

// Function to handle blog deletion
async function handleDeleteBlog(event) {
    const blogId = event.target.getAttribute('data-id');
    
    try {
        await deleteDoc(doc(db, "blogs", blogId));
        alertify.success('Blog deleted successfully!');
        // Reload the blog list after deletion
        check_onAuthStateChanged();
    } catch (error) {
        console.error("Error deleting blog: ", error);
        alertify.error('Failed to delete blog.');
    }
}
