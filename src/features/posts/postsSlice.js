import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from 'date-fns';
const POSTS_API_URL = 'https://jsonplaceholder.typicode.com/posts';

const initialState = {
    posts: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

//  Async API call - by thunk
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, thunkAPI) => {
    try {
        const response = await fetch(POSTS_API_URL);
        
        if (!response.ok) {
            throw new Error("Failed to fetch posts...! Please try again later...!");
        }

        const data = await response.json();        
        return data;
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost, thunkAPI) => {
    try {
        const response = await fetch(POSTS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(initialPost)
        });

        const data = await response.json();
        return data;
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addPost: {
            reducer(state, action) {
                state.posts.push(action.payload);
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        date: new Date().toISOString(),
                        userId,
                        reactions: {
                            thumbsUp: 0,
                            heart: 0,
                            laughing: 0,
                            wow: 0,
                            prayingHands: 0
                        }
                    }
                }
            }
        },
        removePost: (state, action) => {
            state.posts = state.posts.filter((post) => post.id !== action.payload) 
        },
        addReaction: (state, action) => {
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find((post) => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = "loading"
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "succeeded"

                // Adding date and reactions
                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString()
                    post.reactions = {
                        thumbsUp: 0,
                        heart: 0,
                        laughing: 0,
                        wow: 0,
                        prayingHands: 0
                    }
                    return post;
                })

                // Add any fetched posts to the state array
                state.posts = loadedPosts;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                const newPost = action.payload;
                newPost.date = new Date().toISOString();
                newPost.reactions = {
                    thumbsUp: 0,
                    heart: 0,
                    laughing: 0,
                    wow: 0,
                    prayingHands: 0
                }
                console.log(newPost);
                state.posts.push(newPost);
            })
    }
})

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

export const { addPost, removePost, addReaction } = postsSlice.actions;

export default postsSlice.reducer;