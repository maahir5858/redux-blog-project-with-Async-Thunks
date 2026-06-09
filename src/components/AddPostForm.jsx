import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addNewPost } from "../features/posts/postsSlice";
import { selectAllUsers } from "../features/users/usersSlice";

function AddPostForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');
    const [addRequestStatus, setAddRequestStatus] = useState('idle');

    const users = useSelector(selectAllUsers);
    
    const dispatch = useDispatch();
    
    const onTitleChanged = (e) => setTitle(e.target.value)
    const onContentChanged = (e) => setContent(e.target.value)
    const onAuthorChanged = (e) => setUserId(e.target.value)
    
    const canSave = [title, userId, content].every(Boolean) && addRequestStatus === 'idle';

    const handleAddPost = (e) => {
        e.preventDefault();
        if (canSave) {
            try {
                setAddRequestStatus('pending');
                dispatch( addNewPost({ title, body: content, userId: Number(userId) }) ).unwrap();

                setTitle('');
                setContent('');
                setUserId('');
            } catch (error) {
                console.log('Failed to save the post', error);
            } finally {
                setAddRequestStatus('idle');
            }
        }
    }
 
    const userOptions = users.map((user) => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ));

    return (
        <section>
            <h2>Add a Post</h2>
            <form onSubmit={handleAddPost}>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    // name="title"
                    placeholder='Enter your post title'
                    value={title}
                    onChange={onTitleChanged} />
                <label htmlFor="author">Author</label>
                <select name="author" id="author" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {userOptions}
                </select>
                <label htmlFor="content">Content</label>
                <textarea
                    type="text"
                    id="content"
                    // name="content"
                    placeholder='Enter your post content'
                    value={content}
                    onChange={onContentChanged} />
                <button 
                    type='submit'
                    disabled={!canSave}    
                >Add Post</button>
            </form>
        </section>
    )
}

export default AddPostForm;