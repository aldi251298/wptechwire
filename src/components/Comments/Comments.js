// src/components/Comments/Comments.js

import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import styles from './Comments.module.css';

const SUBMIT_COMMENT_MUTATION = gql`
  mutation SubmitComment($author: String!, $commentOn: Int!, $content: String!, $authorEmail: String!) {
    createComment(
      input: {
        author: $author, 
        commentOn: $commentOn, 
        content: $content, 
        authorEmail: $authorEmail
      }
    ) {
      success
      comment {
        id
        content
      }
    }
  }
`;

export default function Comments({ comments = [], postId }) {
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    comment: '',
  });
  
  const [submitComment, { loading, error, data }] = useMutation(SUBMIT_COMMENT_MUTATION);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    submitComment({
      variables: {
        commentOn: postId,
        content: formData.comment,
        author: formData.author,
        authorEmail: formData.email,
      },
    }).then((response) => {
      if (response.data?.createComment?.success) {
        setFormData({ author: '', email: '', comment: '' });
      }
    });
  };

  if (!postId) {
    return <p>Could not load comments section.</p>
  }

  return (
    <section className={styles.commentsSection}>
      <h2 className={styles.sectionTitle}>Comments ({comments.length})</h2>

      <div className={styles.commentList}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <img src={comment.author.node.avatar.url} alt={comment.author.node.name} className={styles.avatar} />
              <div className={styles.commentBody}>
                <div className={styles.commentHeader}>
                  <strong className={styles.authorName}>{comment.author.node.name}</strong>
                  <span className={styles.commentDate}>
                    {new Date(comment.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className={styles.commentContent} dangerouslySetInnerHTML={{ __html: comment.content }} />
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>

      <div className={styles.commentForm}>
        <h3 className={styles.formTitle}>Leave a Comment</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="comment">Comment *</label>
            <textarea
              id="comment"
              name="comment"
              placeholder="Your comment... *"
              value={formData.comment}
              onChange={handleInputChange}
              required
              rows="6"
            ></textarea>
          </div>
          <div className={styles.userInfo}>
            <div className={styles.formGroup}>
              <label htmlFor="author">Name *</label>
              <input
                id="author"
                type="text"
                name="author"
                placeholder="Name *"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'Submitting...' : 'Post Comment'}
          </button>
          {error && <p className={styles.errorMessage}>Error: Could not submit your comment. Please try again.</p>}
          {data?.createComment?.success && <p className={styles.successMessage}>Thank you! Your comment is awaiting moderation.</p>}
        </form>
      </div>
    </section>
  );
}