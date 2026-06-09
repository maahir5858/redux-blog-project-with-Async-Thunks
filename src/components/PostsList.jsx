import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectAllPosts, getPostsStatus, getPostsError, fetchPosts } from '../features/posts/postsSlice';
import { useEffect } from 'react';
import PostsExcerpt from './PostsExcerpt';

function PostsList() {
    const dispatch = useDispatch()
    
    const posts = useSelector(selectAllPosts);
    const postsStatus = useSelector(getPostsStatus);
    const postsError = useSelector(getPostsError);

    useEffect(() => {
        if (postsStatus === 'idle') {
            dispatch(fetchPosts())
        }
    }, [postsStatus, dispatch])
    
    // const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));

    // const renderedPosts = orderedPosts.map(post => (
    //     <PostsExcerpt key={post.id} post={post} />
    // ));

    let content;
    if (postsStatus === 'loading') {
        content = <p>Loading...</p>
    } else if (postsStatus === 'succeeded') {
        const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
        content = orderedPosts.map(post => <PostsExcerpt key={post.id} post={post} /> );
    } else if (postsStatus === 'failed') {
        content = <p>{postsError}</p>
    }

    return (
        <section>
            <h2>Posts</h2>
            {content}
        </section>
    )
}

export default PostsList