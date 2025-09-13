// Comment Section + Scroll Animations
document.addEventListener("DOMContentLoaded", function() {
  // Comments
  const form = document.getElementById("commentForm");
  const commentsList = document.getElementById("commentsList");

  function updatePlaceholder() {
    if (!commentsList.hasChildNodes()) {
      commentsList.innerHTML = '<div class="comment-placeholder">No comments yet. Be the first to share your thoughts!</div>';
    }
  }
  updatePlaceholder();

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const comment = document.getElementById("comment").value.trim();
    if(name && comment){
      const now = new Date();
      const timeString = now.toLocaleString();
      const commentDiv = document.createElement("div");
      commentDiv.className = "comment-card";
      const initials = name.charAt(0).toUpperCase();
      commentDiv.innerHTML = `
        <span class="comment-avatar">${initials}</span>
        <strong>${name}</strong>
        <span class="comment-time">${timeString}</span>
        <p>${comment}</p>
      `;
      if(commentsList.querySelector('.comment-placeholder')) commentsList.innerHTML = '';
      commentsList.prepend(commentDiv);
      form.reset();
    }
  });

  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
});
