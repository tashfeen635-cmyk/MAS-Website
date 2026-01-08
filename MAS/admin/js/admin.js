// Admin Panel JavaScript

let teamData = [];
let deleteIndex = null;
let editModal = null;
let deleteModal = null;
let toast = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  checkAuth();

  // Load admin info
  loadAdminInfo();

  // Initialize Bootstrap modals and toast
  editModal = new bootstrap.Modal(document.getElementById('editModal'));
  deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  toast = new bootstrap.Toast(document.getElementById('toast'));

  // Load team data
  teamData = getTeamData();
  renderTeamGrid();
});

// Check if user is authenticated
function checkAuth() {
  const loggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';

  if (!loggedIn) {
    window.location.href = 'login.html';
  }
}

// Load admin info in the top bar
function loadAdminInfo() {
  const adminName = sessionStorage.getItem('adminName');

  if (adminName) {
    document.getElementById('adminName').innerHTML = `<i class="bi bi-person-circle"></i> ${adminName}`;
  }
}

// Logout function
function logout() {
  sessionStorage.removeItem('adminLoggedIn');
  sessionStorage.removeItem('adminName');
  window.location.href = 'login.html';
}

// Toggle sidebar
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
  document.querySelector('.main-content').classList.toggle('expanded');
}

// Render team members grid
function renderTeamGrid() {
  const grid = document.getElementById('teamGrid');
  grid.innerHTML = '';

  teamData.forEach((member, index) => {
    const card = createTeamCard(member, index);
    grid.innerHTML += card;
  });
}

// Create team member card HTML
function createTeamCard(member, index) {
  const imagePath = member.image.startsWith('assets/') ? '../' + member.image : member.image;

  return `
    <div class="col-lg-4 col-md-6">
      <div class="team-card">
        <span class="team-card-order">${index + 1}</span>
        <img src="${imagePath}" alt="${member.name}" class="team-card-image"
             onerror="this.src='../assets/img/team/team-placeholder.jpg'">
        <div class="team-card-body">
          <h5>${member.name}</h5>
          <p class="position">${member.position}</p>
          <p class="description">${truncateText(member.description, 100)}</p>
          <div class="social-links-preview">
            <a href="${member.social.twitter}" target="_blank" class="${member.social.twitter === '#' ? 'disabled' : ''}" title="Twitter">
              <i class="bi bi-twitter"></i>
            </a>
            <a href="${member.social.facebook}" target="_blank" class="${member.social.facebook === '#' ? 'disabled' : ''}" title="Facebook">
              <i class="bi bi-facebook"></i>
            </a>
            <a href="${member.social.instagram}" target="_blank" class="${member.social.instagram === '#' ? 'disabled' : ''}" title="Instagram">
              <i class="bi bi-instagram"></i>
            </a>
            <a href="${member.social.linkedin}" target="_blank" class="${member.social.linkedin === '#' ? 'disabled' : ''}" title="LinkedIn">
              <i class="bi bi-linkedin"></i>
            </a>
          </div>
          <div class="team-card-actions">
            <button class="btn btn-primary btn-sm" onclick="openEditModal(${index})">
              <i class="bi bi-pencil"></i> Edit
            </button>
            <button class="btn btn-danger btn-sm" onclick="openDeleteModal(${index})">
              <i class="bi bi-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Truncate text
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Open edit modal
function openEditModal(index) {
  const member = teamData[index];

  document.getElementById('editIndex').value = index;
  document.getElementById('editName').value = member.name;
  document.getElementById('editPosition').value = member.position;
  document.getElementById('editDescription').value = member.description;
  document.getElementById('editImage').value = member.image;
  document.getElementById('editTwitter').value = member.social.twitter === '#' ? '' : member.social.twitter;
  document.getElementById('editFacebook').value = member.social.facebook === '#' ? '' : member.social.facebook;
  document.getElementById('editInstagram').value = member.social.instagram === '#' ? '' : member.social.instagram;
  document.getElementById('editLinkedin').value = member.social.linkedin === '#' ? '' : member.social.linkedin;

  // Show image preview
  updateImagePreview(member.image);

  document.getElementById('editModalLabel').textContent = 'Edit Team Member';
  editModal.show();
}

// Open add modal
function openAddModal() {
  document.getElementById('editIndex').value = '-1';
  document.getElementById('editName').value = '';
  document.getElementById('editPosition').value = '';
  document.getElementById('editDescription').value = '';
  document.getElementById('editImage').value = 'assets/img/team/team-new.jpg';
  document.getElementById('editTwitter').value = '';
  document.getElementById('editFacebook').value = '';
  document.getElementById('editInstagram').value = '';
  document.getElementById('editLinkedin').value = '';

  document.getElementById('imagePreview').innerHTML = '';
  document.getElementById('editModalLabel').textContent = 'Add New Team Member';
  editModal.show();
}

// Update image preview
function updateImagePreview(imagePath) {
  const preview = document.getElementById('imagePreview');
  const fullPath = imagePath.startsWith('assets/') ? '../' + imagePath : imagePath;
  preview.innerHTML = `<img src="${fullPath}" alt="Preview" onerror="this.parentElement.innerHTML='<p class=\\'text-muted\\'>Image not found</p>'">`;
}

// Handle image upload
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      // For demo purposes, store as data URL
      // In production, you would upload to server
      document.getElementById('editImage').value = e.target.result;
      document.getElementById('imagePreview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
  }
}

// Save edit
function saveEdit() {
  const index = parseInt(document.getElementById('editIndex').value);
  const memberData = {
    id: index === -1 ? Date.now() : teamData[index].id,
    name: document.getElementById('editName').value.trim(),
    position: document.getElementById('editPosition').value.trim(),
    description: document.getElementById('editDescription').value.trim(),
    image: document.getElementById('editImage').value.trim(),
    social: {
      twitter: document.getElementById('editTwitter').value.trim() || '#',
      facebook: document.getElementById('editFacebook').value.trim() || '#',
      instagram: document.getElementById('editInstagram').value.trim() || '#',
      linkedin: document.getElementById('editLinkedin').value.trim() || '#'
    }
  };

  // Validate
  if (!memberData.name || !memberData.position || !memberData.description) {
    showToast('Error', 'Please fill in all required fields', 'danger');
    return;
  }

  if (index === -1) {
    // Add new member
    teamData.push(memberData);
    showToast('Success', 'Team member added successfully!', 'success');
  } else {
    // Update existing
    teamData[index] = memberData;
    showToast('Success', 'Team member updated successfully!', 'success');
  }

  editModal.hide();
  renderTeamGrid();
}

// Open delete modal
function openDeleteModal(index) {
  deleteIndex = index;
  document.getElementById('deleteConfirmName').textContent = teamData[index].name;
  deleteModal.show();
}

// Confirm delete
function confirmDelete() {
  if (deleteIndex !== null) {
    teamData.splice(deleteIndex, 1);
    deleteModal.hide();
    renderTeamGrid();
    showToast('Success', 'Team member deleted successfully!', 'success');
    deleteIndex = null;
  }
}

// Save all changes to localStorage
function saveAllChanges() {
  saveTeamData(teamData);
  showToast('Success', 'All changes saved successfully! Changes will reflect on the website.', 'success');

  // Generate HTML code for user to copy
  generateTeamHTML();
}

// Reset to default
function resetToDefault() {
  if (confirm('Are you sure you want to reset all team data to default? This cannot be undone.')) {
    teamData = resetTeamData();
    renderTeamGrid();
    showToast('Success', 'Team data reset to default!', 'success');
  }
}

// Generate HTML for team section
function generateTeamHTML() {
  let html = '<!-- Generated Team Section HTML -->\n';
  html += '<div class="row gy-5">\n';

  teamData.forEach((member, index) => {
    const delay = (index + 1) * 100;
    const specialStyle = index === 1 ? ' style="margin-bottom: 42px;"' : '';
    const imgStyle = index === 1 ? 'style="border-radius: 100%;" ' : '';

    html += `
          <div class="col-lg-4 col-md-6 member" data-aos="fade-up" data-aos-delay="${delay}">
            <div class="member-img"${specialStyle}>
              <img ${imgStyle}src="${member.image}" class="img-fluid" alt="">
              <div class="social">
                <a href="${member.social.twitter}"><i class="bi bi-twitter"></i></a>
                <a href="${member.social.facebook}"><i class="bi bi-facebook"></i></a>
                <a href="${member.social.instagram}"><i class="bi bi-instagram"></i></a>
                <a href="${member.social.linkedin}"><i class="bi bi-linkedin"></i></a>
              </div>
            </div>
            <div class="member-info text-center">
              <h4>${member.name}</h4>
              <span>${member.position}</span>
              <p>${member.description}</p>
            </div>
          </div><!-- End Team Member -->
`;
  });

  html += '</div>\n';

  console.log('Generated HTML:');
  console.log(html);
}

// Export data as JSON
function exportData() {
  const dataStr = JSON.stringify(teamData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'team-data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Success', 'Team data exported successfully!', 'success');
}

// Import data from JSON
function importData(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          teamData = importedData;
          renderTeamGrid();
          showToast('Success', 'Team data imported successfully!', 'success');
        } else {
          throw new Error('Invalid format');
        }
      } catch (error) {
        showToast('Error', 'Invalid JSON file. Please check the format.', 'danger');
      }
    };
    reader.readAsText(file);
  }
  // Reset file input
  event.target.value = '';
}

// Show toast notification
function showToast(title, message, type) {
  const toastEl = document.getElementById('toast');
  const toastTitle = document.getElementById('toastTitle');
  const toastBody = document.getElementById('toastBody');
  const toastIcon = document.getElementById('toastIcon');

  toastTitle.textContent = title;
  toastBody.textContent = message;

  // Update icon based on type
  toastIcon.className = 'bi me-2';
  if (type === 'success') {
    toastIcon.classList.add('bi-check-circle', 'text-success');
  } else if (type === 'danger') {
    toastIcon.classList.add('bi-exclamation-circle', 'text-danger');
  } else {
    toastIcon.classList.add('bi-info-circle', 'text-info');
  }

  toast.show();
}

// ============================================
// CHANGE PASSWORD FUNCTIONALITY
// ============================================

let changePasswordModal = null;

// Initialize change password modal
document.addEventListener('DOMContentLoaded', function() {
  const modalEl = document.getElementById('changePasswordModal');
  if (modalEl) {
    changePasswordModal = new bootstrap.Modal(modalEl);
  }
});

// Open change password modal
function openChangePasswordModal() {
  // Reset form
  document.getElementById('changePasswordForm').reset();
  document.getElementById('passwordError').classList.add('d-none');
  document.getElementById('passwordSuccess').classList.add('d-none');

  // Reset password visibility
  ['currentPassword', 'newPassword', 'confirmPassword'].forEach(id => {
    document.getElementById(id).type = 'password';
  });
  ['toggleIcon1', 'toggleIcon2', 'toggleIcon3'].forEach(id => {
    const icon = document.getElementById(id);
    icon.classList.remove('bi-eye-slash');
    icon.classList.add('bi-eye');
  });

  changePasswordModal.show();
}

// Toggle password visibility
function togglePasswordVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('bi-eye');
    icon.classList.add('bi-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('bi-eye-slash');
    icon.classList.add('bi-eye');
  }
}

// Change password function
function changePassword() {
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const errorDiv = document.getElementById('passwordError');
  const errorText = document.getElementById('passwordErrorText');
  const successDiv = document.getElementById('passwordSuccess');

  // Hide previous messages
  errorDiv.classList.add('d-none');
  successDiv.classList.add('d-none');

  // Get current stored password (from localStorage or default)
  const storedPassword = localStorage.getItem('masAdminPassword') || 'tashu123';

  // Validate current password
  if (currentPassword !== storedPassword) {
    errorText.textContent = 'Current password is incorrect';
    errorDiv.classList.remove('d-none');
    return;
  }

  // Validate new password length
  if (newPassword.length < 4) {
    errorText.textContent = 'New password must be at least 4 characters';
    errorDiv.classList.remove('d-none');
    return;
  }

  // Validate passwords match
  if (newPassword !== confirmPassword) {
    errorText.textContent = 'New passwords do not match';
    errorDiv.classList.remove('d-none');
    return;
  }

  // Validate new password is different from current
  if (newPassword === currentPassword) {
    errorText.textContent = 'New password must be different from current password';
    errorDiv.classList.remove('d-none');
    return;
  }

  // Save new password to localStorage
  localStorage.setItem('masAdminPassword', newPassword);

  // Show success message
  successDiv.classList.remove('d-none');

  // Close modal after 2 seconds
  setTimeout(() => {
    changePasswordModal.hide();
    showToast('Success', 'Password changed successfully!', 'success');
  }, 1500);
}
