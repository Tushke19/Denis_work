// Portfolio state is stored in localStorage so the owner can update content without a backend.
const ADMIN_EMAIL = "denismuturi34@gmail.com";
const STORAGE_KEY = "denis_portfolio_state_v1";
const ADMIN_KEY = "denis_portfolio_admin_v1";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

// Fixed UUIDs for default items ensure stable IDs across sessions
const defaultMedia = [
  {
    id: "default-media-1",
    type: "image",
    category: "Vehicle branding",
    caption: "Vehicle wrap design concept",
    src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "default-media-2",
    type: "image",
    category: "Daily use branding",
    caption: "Custom cups and merchandise branding",
    src: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "default-media-3",
    type: "image",
    category: "Billboard & banners",
    caption: "Large-format banner campaign",
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "default-media-4",
    type: "image",
    category: "Print production",
    caption: "Packaging label and print design",
    src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "default-media-5",
    type: "image",
    category: "Apparel & textiles",
    caption: "Textile and clothing branding",
    src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"
  }
];

// Fixed UUIDs for default projects ensure stable structure across sessions
const defaultProjects = [
  {
    id: "default-project-1",
    title: "Brand identity refresh",
    summary: "A full rebrand for a growing retail business focused on premium product presentation.",
    category: "Branding"
  },
  {
    id: "default-project-2",
    title: "Fleet signage package",
    summary: "High-visibility vehicle graphics with bold color contrast and clear branding messaging.",
    category: "Vehicle graphics"
  },
  {
    id: "default-project-3",
    title: "Event banner campaign",
    summary: "Large-format banner and print design for publicity, onboarding, and event visibility.",
    category: "Print"
  },
  {
    id: "default-project-4",
    title: "Portfolio dashboard UI",
    summary: "A clean digital portfolio concept supporting case studies, project uploads, and client communication.",
    category: "Web"
  }
];

const defaultRequests = [
  {
    id: 1,
    clientName: "Grace Njeri",
    serviceType: "Branding package",
    projectDetails: "Need an updated corporate identity and product packaging for our new beverages brand.",
    clientEmail: "grace@example.com"
  }
];

const defaultState = {
  media: defaultMedia,
  projects: defaultProjects,
  requests: defaultRequests,
  clientCounter: 2
};

const adminPanel = document.getElementById("adminPanel");
const adminAuthSection = document.getElementById("adminAuthSection");
const adminEditorSection = document.getElementById("adminEditorSection");
const adminMessage = document.getElementById("adminMessage");
const ownerEmailInput = document.getElementById("ownerEmailInput");
const portfolioGrid = document.getElementById("portfolioGrid");
const projectGrid = document.getElementById("projectGrid");
const clientRequestList = document.getElementById("clientRequestList");
const clientRequestForm = document.getElementById("clientRequestForm");
const requestCounter = document.getElementById("requestCounter");
const requestCountValue = document.getElementById("requestCountValue");
const mediaUploadForm = document.getElementById("mediaUploadForm");
const projectForm = document.getElementById("projectForm");
const adminTrigger = document.getElementById("adminTrigger");
const closeAdmin = document.getElementById("closeAdmin");

const state = loadState();

function loadState() {
  try {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (savedState) {
      return {
        ...defaultState,
        ...savedState,
        media: savedState.media || defaultState.media,
        projects: savedState.projects || defaultState.projects,
        requests: savedState.requests || defaultState.requests,
        clientCounter: savedState.clientCounter || defaultState.clientCounter
      };
    }
  } catch (error) {
    console.warn("Unable to read portfolio state", error);
  }

  return JSON.parse(JSON.stringify(defaultState));
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setAdminVisible(isVisible) {
  document.body.classList.toggle("admin-mode", isVisible);
  adminPanel.classList.toggle("hidden", !isVisible);
  adminEditorSection.classList.toggle("hidden", !isVisible || localStorage.getItem(ADMIN_KEY) !== "true");
  adminAuthSection.classList.toggle("hidden", !isVisible ? false : localStorage.getItem(ADMIN_KEY) === "true");
  if (localStorage.getItem(ADMIN_KEY) !== "true") {
    adminMessage.textContent = "";
    ownerEmailInput.value = "";
  }
}

function formatRequestId(id) {
  return `REQ-${String(id).padStart(3, "0")}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderPortfolio() {
  if (!state.media || state.media.length === 0) {
    portfolioGrid.innerHTML = "<div class='media-card'><div class='media-body'><h3>No media uploaded yet</h3><p>Uploads will appear here after the owner adds work.</p></div></div>";
    return;
  }

  portfolioGrid.innerHTML = state.media
    .map(
      (item) => `
        <article class="media-card" data-id="${item.id}">
          <div class="media-thumb">
            ${
              item.type === "video"
                ? `<video controls preload="metadata" controlsList="nodownload" disablePictureInPicture playsinline muted>
                    <source src="${item.src}" type="video/mp4" />
                  </video>`
                : `<img src="${item.src}" alt="${escapeHtml(item.caption)}" draggable="false" />`
            }
            ${localStorage.getItem(ADMIN_KEY) === "true" ? `<button class="delete-btn" type="button" data-delete-id="${item.id}">Delete</button>` : ""}
          </div>
          <div class="media-body">
            <span class="media-tag">${escapeHtml(item.category)}</span>
            <h3>${escapeHtml(item.caption)}</h3>
            <p>Portfolio asset prepared for showcasing branding, packaging, and print work.</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderProjects() {
  if (!state.projects || state.projects.length === 0) {
    projectGrid.innerHTML = "<div class='project-card'><div class='project-body'><h3>No coding projects uploaded</h3><p>Owner updates will show here.</p></div></div>";
    return;
  }

  projectGrid.innerHTML = state.projects
    .map(
      (project) => `
        <article class="project-card">
          <div class="project-body">
            <span class="media-tag">${escapeHtml(project.category)}</span>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.summary)}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderRequests() {
  const sortedRequests = [...state.requests].sort((a, b) => b.id - a.id);
  requestCountValue.textContent = String(sortedRequests.length);
  requestCounter.textContent = formatRequestId(state.clientCounter);

  if (!sortedRequests.length) {
    clientRequestList.innerHTML = "<div class='request-item'><p>No client requests yet.</p></div>";
    return;
  }

  clientRequestList.innerHTML = sortedRequests
    .map(
      (request) => `
        <article class="request-item">
          <div class="request-item-head">
            <strong>${escapeHtml(request.clientName)}</strong>
            <span class="request-badge">${formatRequestId(request.id)}</span>
          </div>
          <p><strong>Service:</strong> ${escapeHtml(request.serviceType)}</p>
          <p><strong>Email:</strong> ${escapeHtml(request.clientEmail)}</p>
          <p>${escapeHtml(request.projectDetails)}</p>
        </article>
      `
    )
    .join("");
}

function unlockEditor(event) {
  event.preventDefault();
  const email = ownerEmailInput.value.trim().toLowerCase();

  // Simple constant-time comparison helper for client-side security
  const isValidEmail = email === ADMIN_EMAIL.toLowerCase() && email.length === ADMIN_EMAIL.length;

  if (isValidEmail) {
    localStorage.setItem(ADMIN_KEY, "true");
    adminMessage.style.color = "var(--success)";
    adminMessage.textContent = "Access granted. Editing tools are now available.";
    setAdminVisible(true);
    renderPortfolio();
    return;
  }

  adminMessage.style.color = "var(--danger)";
  adminMessage.textContent = "Unauthorized access. Only the portfolio owner can edit this site.";
}

function handleAdminClose() {
  localStorage.removeItem(ADMIN_KEY);
  setAdminVisible(false);
  adminPanel.classList.add("hidden");
  adminMessage.textContent = "";
}

function handleMediaUpload(event) {
  event.preventDefault();

  if (localStorage.getItem(ADMIN_KEY) !== "true") {
    adminMessage.textContent = "Please unlock editing before uploading media.";
    return;
  }

  const files = Array.from(document.getElementById("mediaUploadInput").files || []);
  const category = document.getElementById("mediaCategory").value;

  if (!files.length) {
    adminMessage.textContent = "Select at least one image or video to add to the portfolio.";
    return;
  }

  // Validate file sizes before processing to prevent localStorage quota issues
  const oversizedFiles = files.filter((f) => f.size > MAX_FILE_SIZE);
  if (oversizedFiles.length > 0) {
    const fileList = oversizedFiles.map((f) => f.name).join(", ");
    adminMessage.textContent = `File size exceeds 5MB limit: ${fileList}. Please optimize and retry.`;
    adminMessage.style.color = "var(--danger)";
    return;
  }

  const readerPromises = files.map(
    (file) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            id: crypto.randomUUID(), // Only user-added items get random UUIDs
            type: file.type.startsWith("video/") ? "video" : "image",
            category,
            caption: file.name.replace(/\.[^.]+$/, "") || "Uploaded portfolio item",
            src: reader.result
          });
        };
        reader.readAsDataURL(file);
      })
  );

  Promise.all(readerPromises).then((newItems) => {
    state.media = [...newItems, ...state.media];
    saveState();
    renderPortfolio();
    mediaUploadForm.reset();
    adminMessage.style.color = "var(--success)";
    adminMessage.textContent = `✓ Successfully uploaded ${newItems.length} media item(s) to portfolio.`;
    // Reset message after 3 seconds
    setTimeout(() => {
      if (adminMessage.textContent.startsWith("✓")) {
        adminMessage.textContent = "";
      }
    }, 3000);
  });
}

function handleProjectSubmit(event) {
  event.preventDefault();

  if (localStorage.getItem(ADMIN_KEY) !== "true") {
    adminMessage.textContent = "Please unlock editing before adding projects.";
    return;
  }

  const title = document.getElementById("projectName").value.trim();
  const summary = document.getElementById("projectSummary").value.trim();

  if (!title || !summary) {
    adminMessage.textContent = "Project name and summary are required.";
    return;
  }

  state.projects.unshift({
    id: crypto.randomUUID(),
    title,
    summary,
    category: "Programming"
  });

  saveState();
  renderProjects();
  projectForm.reset();
  adminMessage.style.color = "var(--success)";
  adminMessage.textContent = "Programming project added.";
}

function handleDelete(event) {
  const deleteButton = event.target.closest("[data-delete-id]");
  if (!deleteButton || localStorage.getItem(ADMIN_KEY) !== "true") {
    return;
  }

  const itemId = deleteButton.dataset.deleteId;
  state.media = state.media.filter((item) => item.id !== itemId);
  saveState();
  renderPortfolio();
  adminMessage.style.color = "var(--success)";
  adminMessage.textContent = "Portfolio item deleted.";
}

function handleRequestSubmit(event) {
  event.preventDefault();
  const formData = new FormData(clientRequestForm);
  const request = {
    id: state.clientCounter,
    clientName: formData.get("clientName").toString().trim(),
    clientEmail: formData.get("clientEmail").toString().trim(),
    serviceType: formData.get("serviceType").toString().trim(),
    projectDetails: formData.get("projectDetails").toString().trim()
  };

  if (!request.clientName || !request.clientEmail || !request.serviceType || !request.projectDetails) {
    return;
  }

  state.requests.unshift(request);
  state.clientCounter += 1;
  saveState();
  renderRequests();
  clientRequestForm.reset();
}

function initSecurityBehavior() {
  document.addEventListener("contextmenu", (event) => {
    if (event.target instanceof HTMLElement && (event.target.matches("img, video") || event.target.closest("img, video"))) {
      event.preventDefault();
    }
  });

  document.addEventListener("dragstart", (event) => {
    if (event.target instanceof HTMLElement && (event.target.matches("img, video") || event.target.closest("img, video"))) {
      event.preventDefault();
    }
  });

  document.addEventListener("keydown", (event) => {
    const isCopyShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c";
    if (isCopyShortcut) {
      event.preventDefault();
    }
  });
}

adminTrigger.addEventListener("click", () => {
  setAdminVisible(true);
});

closeAdmin.addEventListener("click", handleAdminClose);
adminPanel.addEventListener("click", (event) => {
  if (event.target === adminPanel) {
    handleAdminClose();
  }
});

document.getElementById("adminLoginForm").addEventListener("submit", unlockEditor);
mediaUploadForm.addEventListener("submit", handleMediaUpload);
projectForm.addEventListener("submit", handleProjectSubmit);
portfolioGrid.addEventListener("click", handleDelete);
clientRequestForm.addEventListener("submit", handleRequestSubmit);

renderPortfolio();
renderProjects();
renderRequests();
initSecurityBehavior();

if (localStorage.getItem(ADMIN_KEY) === "true") {
  setAdminVisible(true);
} else {
  setAdminVisible(false);
}
