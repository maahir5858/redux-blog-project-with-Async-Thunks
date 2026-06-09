import { useDispatch } from "react-redux";
import { addReaction } from "../features/posts/postsSlice";

const reactionEmoji = {
    thumbsUp: '👍',
    heart: '❤️',
    laughing: '😂',
    wow: '😮',
    prayingHands: '🙏'
}

function ReactionButtons({ post }) {
    const dispatch = useDispatch();

    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => (
        <button
            key={name}
            className="reactionButton"
            onClick={() => dispatch(addReaction({ postId: post.id, reaction: name }))}
            >
            {emoji}{post.reactions[name]}
        </button>
    ))

    return <div>{reactionButtons}</div>
}

export default ReactionButtons