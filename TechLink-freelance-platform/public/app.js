let currentUser = null;

async function init() {
  try {
    const response = await fetch('/api/me');
    if (response.ok) {
      currentUser = await response.json();
      renderNavbar();
      renderDashboard();
    } else {
      renderAuth();
    }
  } catch (error) {
    renderAuth();
  }
}

function renderNavbar() {
  const navLinks = document.getElementById('nav-links');
  if (currentUser) {
    navLinks.innerHTML = `
      <span>Welcome, ${currentUser.name}</span>
      <button onclick="logout()">Logout</button>
    `;
  } else {
    navLinks.innerHTML = '';
  }
}

function renderAuth() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-container">
      <div class="card">
        <div class="tabs">
          <button class="tab active" onclick="showTab('login')">Login</button>
          <button class="tab" onclick="showTab('register')">Register</button>
        </div>
        
        <div id="login-form">
          <h2>Login</h2>
          <form onsubmit="handleLogin(event)">
            <div class="form-group">
              <label>Email</label>
              <input type="email" name="email" required>
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" name="password" required>
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
        
        <div id="register-form" class="hidden">
          <h2>Register</h2>
          <form onsubmit="handleRegister(event)">
            <div class="form-group">
              <label>Name</label>
              <input type="text" name="name" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" name="email" required>
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" name="password" required>
            </div>
            <div class="form-group">
              <label>I am a</label>
              <select name="userType" onchange="toggleSkills(this)" required>
                <option value="">Select...</option>
                <option value="freelancer">Freelancer</option>
                <option value="client">Client</option>
              </select>
            </div>
            <div class="form-group hidden" id="skills-group">
              <label>Skills (comma separated)</label>
              <input type="text" name="skills" placeholder="JavaScript, Python, React">
            </div>
            <div class="form-group">
              <label>Bio</label>
              <textarea name="bio" placeholder="Tell us about yourself"></textarea>
            </div>
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

function showTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  if (tab === 'login') {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
  } else {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
  }
}

function toggleSkills(select) {
  const skillsGroup = document.getElementById('skills-group');
  if (select.value === 'freelancer') {
    skillsGroup.classList.remove('hidden');
  } else {
    skillsGroup.classList.add('hidden');
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData))
    });
    
    if (response.ok) {
      const data = await response.json();
      currentUser = data;
      init();
    } else {
      alert('Invalid credentials');
    }
  } catch (error) {
    alert('Login failed');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData))
    });
    
    if (response.ok) {
      init();
    } else {
      alert('Registration failed');
    }
  } catch (error) {
    alert('Registration failed');
  }
}

async function logout() {
  await fetch('/api/logout', { method: 'POST' });
  currentUser = null;
  renderAuth();
  renderNavbar();
}

function renderDashboard() {
  const app = document.getElementById('app');
  
  if (currentUser.user_type === 'client') {
    app.innerHTML = `
      <div class="card">
        <h2>Post a New Job</h2>
        <form onsubmit="handlePostJob(event)">
          <div class="form-group">
            <label>Job Title</label>
            <input type="text" name="title" required>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea name="description" required></textarea>
          </div>
          <div class="form-group">
            <label>Budget ($)</label>
            <input type="number" name="budget" step="0.01" required>
          </div>
          <button type="submit">Post Job</button>
        </form>
      </div>
      
      <div class="card">
        <h2>My Posted Jobs</h2>
        <div id="my-jobs"></div>
      </div>
    `;
    loadMyJobs();
  } else {
    app.innerHTML = `
      <div class="card">
        <h2>Available Jobs</h2>
        <div id="jobs-list"></div>
      </div>
      
      <div class="card">
        <h2>My Applications</h2>
        <div id="my-applications"></div>
      </div>
    `;
    loadJobs();
    loadMyApplications();
  }
}

async function handlePostJob(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  try {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData))
    });
    
    if (response.ok) {
      event.target.reset();
      loadMyJobs();
      alert('Job posted successfully!');
    }
  } catch (error) {
    alert('Failed to post job');
  }
}

async function loadJobs() {
  try {
    const response = await fetch('/api/jobs');
    const jobs = await response.json();
    
    const jobsList = document.getElementById('jobs-list');
    if (jobs.length === 0) {
      jobsList.innerHTML = '<p>No jobs available</p>';
      return;
    }
    
    jobsList.innerHTML = jobs.map(job => `
      <div class="job-card" onclick="viewJob(${job.id})">
        <h3 class="job-title">${job.title}</h3>
        <div class="job-meta">Posted by ${job.client_name}</div>
        <p class="job-description">${job.description}</p>
        <div class="budget">Budget: $${job.budget}</div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load jobs', error);
  }
}

async function viewJob(jobId) {
  try {
    const response = await fetch(`/api/jobs/${jobId}`);
    const job = await response.json();
    
    const app = document.getElementById('app');
    app.innerHTML = `
      <button onclick="renderDashboard()">← Back</button>
      <div class="card">
        <h2>${job.title}</h2>
        <div class="job-meta">Posted by ${job.client_name}</div>
        <p>${job.description}</p>
        <div class="budget">Budget: $${job.budget}</div>
      </div>
      
      <div class="card">
        <h3>Apply for this Job</h3>
        <form onsubmit="handleApply(event, ${jobId})">
          <div class="form-group">
            <label>Your Proposal</label>
            <textarea name="proposal" required placeholder="Explain why you're a good fit..."></textarea>
          </div>
          <button type="submit">Submit Application</button>
        </form>
      </div>
    `;
  } catch (error) {
    alert('Failed to load job');
  }
}

async function handleApply(event, jobId) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  try {
    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId,
        proposal: formData.get('proposal')
      })
    });
    
    if (response.ok) {
      alert('Application submitted!');
      renderDashboard();
    }
  } catch (error) {
    alert('Failed to submit application');
  }
}

async function loadMyJobs() {
  try {
    const response = await fetch('/api/my-jobs');
    const jobs = await response.json();
    
    const myJobs = document.getElementById('my-jobs');
    if (jobs.length === 0) {
      myJobs.innerHTML = '<p>No jobs posted yet</p>';
      return;
    }
    
    myJobs.innerHTML = jobs.map(job => `
      <div class="job-card" onclick="viewJobApplications(${job.id})">
        <h3 class="job-title">${job.title}</h3>
        <span class="status-badge status-${job.status}">${job.status}</span>
        <p class="job-description">${job.description}</p>
        <div class="budget">Budget: $${job.budget}</div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load jobs', error);
  }
}

async function viewJobApplications(jobId) {
  try {
    const response = await fetch(`/api/jobs/${jobId}/applications`);
    const applications = await response.json();
    
    const app = document.getElementById('app');
    app.innerHTML = `
      <button onclick="renderDashboard()">← Back</button>
      <div class="card">
        <h2>Applications</h2>
        ${applications.length === 0 ? '<p>No applications yet</p>' : 
          applications.map(app => `
            <div class="application-card card">
              <h3>${app.name}</h3>
              <div class="job-meta">${app.email}</div>
              <div class="job-meta">Skills: ${app.skills || 'Not specified'}</div>
              <p><strong>Proposal:</strong> ${app.proposal}</p>
              <span class="status-badge status-${app.status}">${app.status}</span>
            </div>
          `).join('')
        }
      </div>
    `;
  } catch (error) {
    alert('Failed to load applications');
  }
}

async function loadMyApplications() {
  try {
    const response = await fetch('/api/my-jobs');
    const applications = await response.json();
    
    const myApps = document.getElementById('my-applications');
    if (applications.length === 0) {
      myApps.innerHTML = '<p>No applications yet</p>';
      return;
    }
    
    myApps.innerHTML = applications.map(app => `
      <div class="application-card">
        <h3 class="job-title">${app.title}</h3>
        <span class="status-badge status-${app.status}">${app.status}</span>
        <p class="job-description">${app.description}</p>
        <div class="budget">Budget: $${app.budget}</div>
        <p><strong>Your proposal:</strong> ${app.proposal}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load applications', error);
  }
}

init();
