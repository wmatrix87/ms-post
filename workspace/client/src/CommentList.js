import React from 'react';

export default ({ comments }) => {

  const renderedComments = comments.map(comment => {
    let content;
    if (comment.status === 'approved') {
    content = comment.content;
    } else if (comment.status === 'rejected') {
      content = 'comment rejected ';
    } else if (comment.status === 'pending') {
      content = 'comment waiting moderation';
    }
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};
