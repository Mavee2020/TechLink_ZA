// TechLink Platform - Data Management
const ADMIN_EMAIL = 'admin@techlink.co.za';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_COMMISSION = 0.25; // 25%

const DB = {
  getFreelancers: () => JSON.parse(localStorage.getItem('freelancers') || '[]'),
  saveFreelancers: (data) => localStorage.setItem('freelancers', JSON.stringify(data)),
  getClients: () => JSON.parse(localStorage.getItem('clients') || '[]'),
  saveClients: (data) => localStorage.setItem('clients', JSON.stringify(data)),
  getJobs: () => JSON.parse(localStorage.getItem('jobs') || '[]'),
  saveJobs: (data) => localStorage.setItem('jobs', JSON.stringify(data)),
  getApplications: () => JSON.parse(localStorage.getItem('applications') || '[]'),
  saveApplications: (data) => localStorage.setItem('applications', JSON.stringify(data)),
  getContracts: () => JSON.parse(localStorage.getItem('contracts') || '[]'),
  saveContracts: (data) => localStorage.setItem('contracts', JSON.stringify(data)),
  getOffers: () => JSON.parse(localStorage.getItem('offers') || '[]'),
  saveOffers: (data) => localStorage.setItem('offers', JSON.stringify(data)),
  getReferrals: () => JSON.parse(localStorage.getItem('referrals') || '[]'),
  saveReferrals: (data) => localStorage.setItem('referrals', JSON.stringify(data)),
  getStatusUpdates: () => JSON.parse(localStorage.getItem('statusUpdates') || '[]'),
  saveStatusUpdates: (data) => localStorage.setItem('statusUpdates', JSON.stringify(data)),
  getCurrentUser: () => JSON.parse(localStorage.getItem('currentUser') || 'null'),
  setCurrentUser: (user) => localStorage.setItem('currentUser', JSON.stringify(user)),
  clearCurrentUser: () => localStorage.removeItem('currentUser')
};

let currentUser = DB.getCurrentUser();

function init() {
  if (currentUser) {
    renderNavbar();
    if (currentUser.role === 'admin') {
      renderAdminDashboard();
    } else if (currentUser.role === 'freelancer') {
      renderFreelancerDashboard();
    } else {
      renderClientDashboard();
    }
  } else {
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

function showAlert(message, type = 'success') {
  const app = document.getElementById('app');
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  app.insertBefore(alert, app.firstChild);
  setTimeout(() => alert.remove(), 4000);
}

function sendEmailNotification(to, subject, message) {
  console.log(`EMAIL NOTIFICATION:\nTo: ${to}\nSubject: ${subject}\nMessage: ${message}`);
  // In production, integrate with email service like SendGrid, Mailgun, etc.
}

function renderAuth() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-container">
      <div class="card">
        <div class="tabs">
          <button class="tab active" onclick="showAuthTab('login')">Login</button>
          <button class="tab" onclick="showAuthTab('register-freelancer')">Register as Freelancer</button>
          <button class="tab" onclick="showAuthTab('register-client')">Register as Client</button>
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
        
        <div id="register-freelancer-form" class="hidden">
          <h2>Register as Freelancer</h2>
          <form onsubmit="handleFreelancerRegister(event)">
            <div class="form-group">
              <label>Full Name</label>
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
              <label>Phone Number</label>
              <input type="tel" name="phone" required>
            </div>
            <div class="form-group">
              <label>Education</label>
              <input type="text" name="education" placeholder="e.g., BSc Computer Science" required>
            </div>
            <div class="form-group">
              <label>IT Skills (comma separated)</label>
              <input type="text" name="skills" placeholder="JavaScript, Python, React, AWS" required>
            </div>
            <div class="form-group">
              <label>Hourly Rate (ZAR)</label>
              <input type="number" name="hourlyRate" step="0.01" placeholder="300" required>
            </div>
            <div class="form-group">
              <label>Bio</label>
              <textarea name="bio" placeholder="Tell us about your experience..." required></textarea>
            </div>
            <button type="submit">Register</button>
          </form>
        </div>
        
        <div id="register-client-form" class="hidden">
          <h2>Register as Client</h2>
          <form onsubmit="handleClientRegister(event)">
            <div class="form-group">
              <label>Company/Individual Name</label>
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
              <label>Phone Number</label>
              <input type="tel" name="phone" required>
            </div>
            <div class="form-group">
              <label>Company Type</label>
              <select name="companyType" required>
                <option value="">Select...</option>
                <option value="individual">Individual</option>
                <option value="small">Small Business</option>
                <option value="medium">Medium Enterprise</option>
                <option value="large">Large Corporation</option>
              </select>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea name="description" placeholder="Tell us about your company..."></textarea>
            </div>
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

function showAuthTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-freelancer-form').classList.add('hidden');
  document.getElementById('register-client-form').classList.add('hidden');
  document.getElementById(`${tab}-form`).classList.remove('hidden');
}

function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const email = formData.get('email');
  const password = formData.get('password');
  
  // Check admin
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    currentUser = { id: 0, email, name: 'Admin', role: 'admin' };
    DB.setCurrentUser(currentUser);
    init();
    return;
  }
  
  // Check freelancers
  const freelancers = DB.getFreelancers();
  const freelancer = freelancers.find(f => f.email === email && f.password === password);
  if (freelancer) {
    currentUser = { ...freelancer, role: 'freelancer' };
    DB.setCurrentUser(currentUser);
    init();
    return;
  }
  
  // Check clients
  const clients = DB.getClients();
  const client = clients.find(c => c.email === email && c.password === password);
  if (client) {
    currentUser = { ...client, role: 'client' };
    DB.setCurrentUser(currentUser);
    init();
    return;
  }
  
  showAlert('Invalid credentials', 'error');
}

function handleFreelancerRegister(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const freelancers = DB.getFreelancers();
  const email = formData.get('email');
  
  if (freelancers.find(f => f.email === email)) {
    showAlert('Email already exists', 'error');
    return;
  }
  
  const newFreelancer = {
    id: Date.now(),
    email,
    password: formData.get('password'),
    name: formData.get('name'),
    phone: formData.get('phone'),
    education: formData.get('education'),
    skills: formData.get('skills'),
    hourlyRate: parseFloat(formData.get('hourlyRate')),
    bio: formData.get('bio'),
    available: true,
    totalEarnings: 0,
    createdAt: new Date().toISOString()
  };
  
  freelancers.push(newFreelancer);
  DB.saveFreelancers(freelancers);
  
  sendEmailNotification(email, 'Welcome to TechLink', `Hi ${newFreelancer.name}, your freelancer account has been created successfully!`);
  
  currentUser = { ...newFreelancer, role: 'freelancer' };
  DB.setCurrentUser(currentUser);
  init();
}

function handleClientRegister(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const clients = DB.getClients();
  const email = formData.get('email');
  
  if (clients.find(c => c.email === email)) {
    showAlert('Email already exists', 'error');
    return;
  }
  
  const newClient = {
    id: Date.now(),
    email,
    password: formData.get('password'),
    name: formData.get('name'),
    phone: formData.get('phone'),
    companyType: formData.get('companyType'),
    description: formData.get('description'),
    createdAt: new Date().toISOString()
  };
  
  clients.push(newClient);
  DB.saveClients(clients);
  
  sendEmailNotification(email, 'Welcome to TechLink', `Hi ${newClient.name}, your client account has been created successfully!`);
  
  currentUser = { ...newClient, role: 'client' };
  DB.setCurrentUser(currentUser);
  init();
}

function logout() {
  currentUser = null;
  DB.clearCurrentUser();
  renderAuth();
  renderNavbar();
}

// FREELANCER DASHBOARD
function renderFreelancerDashboard() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="tabs">
      <button class="tab active" onclick="showFreelancerTab('opportunities')">Opportunities</button>
      <button class="tab" onclick="showFreelancerTab('applications')">Applications</button>
      <button class="tab" onclick="showFreelancerTab('offers')">Offers</button>
      <button class="tab" onclick="showFreelancerTab('assessments')">Assessments</button>
      <button class="tab" onclick="showFreelancerTab('contracts')">Contracts</button>
      <button class="tab" onclick="showFreelancerTab('referrals')">Referrals</button>
      <button class="tab" onclick="showFreelancerTab('earnings')">Earnings</button>
    </div>
    
    <div id="opportunities-tab"></div>
    <div id="applications-tab" class="hidden"></div>
    <div id="offers-tab" class="hidden"></div>
    <div id="assessments-tab" class="hidden"></div>
    <div id="contracts-tab" class="hidden"></div>
    <div id="referrals-tab" class="hidden"></div>
    <div id="earnings-tab" class="hidden"></div>
  `;
  
  loadOpportunities();
}

function showFreelancerTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  ['opportunities', 'applications', 'offers', 'assessments', 'contracts', 'referrals', 'earnings'].forEach(t => {
    document.getElementById(`${t}-tab`).classList.add('hidden');
  });
  
  document.getElementById(`${tab}-tab`).classList.remove('hidden');
  
  if (tab === 'opportunities') loadOpportunities();
  else if (tab === 'applications') loadMyApplications();
  else if (tab === 'offers') loadMyOffers();
  else if (tab === 'assessments') loadMyAssessments();
  else if (tab === 'contracts') loadMyContracts();
  else if (tab === 'referrals') loadMyReferrals();
  else if (tab === 'earnings') loadMyEarnings();
}

function loadOpportunities() {
  const jobs = DB.getJobs().filter(j => j.status === 'open');
  const container = document.getElementById('opportunities-tab');
  
  if (jobs.length === 0) {
    container.innerHTML = '<div class="card"><p>No opportunities available at the moment.</p></div>';
    return;
  }
  
  container.innerHTML = jobs.map(job => `
    <div class="job-card card" onclick="viewJobDetails(${job.id})">
      <h3 class="job-title">${job.title}</h3>
      <div class="job-meta">Posted by ${job.clientName} • ${new Date(job.createdAt).toLocaleDateString()}</div>
      <p>${job.description}</p>
      <div class="job-meta"><strong>Timeline:</strong> ${job.timeline}</div>
      <div class="rate">Rate: R${job.rate}/hour</div>
    </div>
  `).join('');
}

function viewJobDetails(jobId) {
  const job = DB.getJobs().find(j => j.id === jobId);
  if (!job) return;
  
  const app = document.getElementById('app');
  app.innerHTML = `
    <button onclick="renderFreelancerDashboard()">← Back to Opportunities</button>
    <div class="card">
      <h2>${job.title}</h2>
      <div class="job-meta">Posted by ${job.clientName}</div>
      <p><strong>Description:</strong> ${job.description}</p>
      <p><strong>Timeline:</strong> ${job.timeline}</p>
      <div class="rate">Rate: R${job.rate}/hour</div>
    </div>
    
    <div class="card">
      <h3>Apply for this Opportunity</h3>
      <form onsubmit="handleJobApplication(event, ${jobId})">
        <div class="form-group">
          <label>Cover Letter</label>
          <textarea name="coverLetter" required placeholder="Explain why you're the best fit for this project..."></textarea>
        </div>
        <div class="form-group">
          <label>Estimated Hours</label>
          <input type="number" name="estimatedHours" required placeholder="40">
        </div>
        <button type="submit">Submit Application</button>
      </form>
    </div>
  `;
}

function handleJobApplication(event, jobId) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const applications = DB.getApplications();
  const job = DB.getJobs().find(j => j.id === jobId);
  
  const newApp = {
    id: Date.now(),
    jobId,
    freelancerId: currentUser.id,
    freelancerName: currentUser.name,
    freelancerEmail: currentUser.email,
    freelancerSkills: currentUser.skills,
    freelancerRate: currentUser.hourlyRate,
    coverLetter: formData.get('coverLetter'),
    estimatedHours: parseInt(formData.get('estimatedHours')),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  applications.push(newApp);
  DB.saveApplications(applications);
  
  sendEmailNotification(currentUser.email, 'Application Submitted', `Your application for "${job.title}" has been submitted successfully.`);
  sendEmailNotification(ADMIN_EMAIL, 'New Application', `${currentUser.name} applied for "${job.title}"`);
  
  showAlert('Application submitted successfully!');
  renderFreelancerDashboard();
}

function loadMyApplications() {
  const applications = DB.getApplications().filter(a => a.freelancerId === currentUser.id);
  const jobs = DB.getJobs();
  const container = document.getElementById('applications-tab');
  
  if (applications.length === 0) {
    container.innerHTML = '<div class="card"><p>No applications yet.</p></div>';
    return;
  }
  
  container.innerHTML = applications.map(app => {
    const job = jobs.find(j => j.id === app.jobId);
    return `
      <div class="card">
        <h3 class="job-title">${job.title}</h3>
        <span class="status-badge status-${app.status}">${app.status}</span>
        <p>${job.description}</p>
        <div class="job-meta">Applied: ${new Date(app.createdAt).toLocaleDateString()}</div>
        <p><strong>Your cover letter:</strong> ${app.coverLetter}</p>
      </div>
    `;
  }).join('');
}

function loadMyOffers() {
  const offers = DB.getOffers().filter(o => o.freelancerId === currentUser.id);
  const container = document.getElementById('offers-tab');
  
  if (offers.length === 0) {
    container.innerHTML = '<div class="card"><p>No offers yet.</p></div>';
    return;
  }
  
  container.innerHTML = offers.map(offer => `
    <div class="card">
      <h3 class="job-title">${offer.jobTitle}</h3>
      <span class="status-badge status-${offer.status}">${offer.status}</span>
      <p>${offer.message}</p>
      <div class="rate">Offered Rate: R${offer.offeredRate}/hour</div>
      <div class="job-meta">Offered: ${new Date(offer.createdAt).toLocaleDateString()}</div>
      ${offer.status === 'pending' ? `
        <button onclick="respondToOffer(${offer.id}, 'accepted')">Accept</button>
        <button class="secondary" onclick="respondToOffer(${offer.id}, 'declined')">Decline</button>
      ` : ''}
    </div>
  `).join('');
}

function respondToOffer(offerId, response) {
  const offers = DB.getOffers();
  const offer = offers.find(o => o.id === offerId);
  offer.status = response;
  DB.saveOffers(offers);
  
  if (response === 'accepted') {
    // Move to assessment stage
    const applications = DB.getApplications();
    const app = applications.find(a => a.id === offer.applicationId);
    app.status = 'interview';
    DB.saveApplications(applications);
    
    sendEmailNotification(ADMIN_EMAIL, 'Offer Accepted', `${currentUser.name} accepted the offer for "${offer.jobTitle}"`);
  }
  
  showAlert(`Offer ${response}!`);
  loadMyOffers();
}

function loadMyAssessments() {
  const applications = DB.getApplications().filter(a => a.freelancerId === currentUser.id && a.status === 'interview');
  const container = document.getElementById('assessments-tab');
  
  if (applications.length === 0) {
    container.innerHTML = '<div class="card"><p>No assessments scheduled.</p></div>';
    return;
  }
  
  container.innerHTML = applications.map(app => {
    const job = DB.getJobs().find(j => j.id === app.jobId);
    return `
      <div class="card">
        <h3 class="job-title">${job.title}</h3>
        <span class="status-badge status-interview">Interview Stage</span>
        <p>You are in the interview/assessment stage for this project.</p>
        <div class="job-meta">Status: Awaiting admin approval</div>
      </div>
    `;
  }).join('');
}

function loadMyContracts() {
  const contracts = DB.getContracts().filter(c => c.freelancerId === currentUser.id);
  const container = document.getElementById('contracts-tab');
  
  if (contracts.length === 0) {
    container.innerHTML = '<div class="card"><p>No active contracts.</p></div>';
    return;
  }
  
  container.innerHTML = contracts.map(contract => `
    <div class="card">
      <h3 class="job-title">${contract.jobTitle}</h3>
      <span class="status-badge status-${contract.status}">${contract.status}</span>
      <p><strong>Client:</strong> ${contract.clientName}</p>
      <div class="rate">Your Rate: R${contract.freelancerRate}/hour</div>
      <p><strong>Timeline:</strong> ${contract.timeline}</p>
      
      ${contract.tasks && contract.tasks.length > 0 ? `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
          <h4>Assigned Tasks:</h4>
          <ul style="margin-left: 1.5rem;">
            ${contract.tasks.map(task => `<li>${task}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${contract.milestones && contract.milestones.length > 0 ? `
        <div style="background: #e8f5e9; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
          <h4>Project Milestones:</h4>
          <ul style="margin-left: 1.5rem;">
            ${contract.milestones.map(milestone => `<li>${milestone}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${contract.instructions ? `
        <div style="background: #fff3cd; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
          <h4>Special Instructions:</h4>
          <p>${contract.instructions}</p>
        </div>
      ` : ''}
      
      <p><strong>Hours Worked:</strong> ${contract.hoursWorked || 0} hours</p>
      <div class="currency">Earned: R${((contract.hoursWorked || 0) * contract.freelancerRate).toFixed(2)}</div>
      
      ${contract.status === 'active' ? `
        <button onclick="viewContractDetails(${contract.id})">View Full Details & Updates</button>
        <button onclick="logHours(${contract.id})">Log Hours</button>
        <button class="secondary" onclick="markContractComplete(${contract.id})">Mark Complete</button>
      ` : `
        <button onclick="viewContractDetails(${contract.id})">View Details</button>
      `}
    </div>
  `).join('');
}

function viewContractDetails(contractId) {
  const contract = DB.getContracts().find(c => c.id === contractId);
  const statusUpdates = DB.getStatusUpdates().filter(u => u.contractId === contractId);
  
  const container = document.getElementById('contracts-tab');
  container.innerHTML = `
    <button onclick="loadMyContracts()">← Back to Contracts</button>
    
    <div class="card">
      <h2>${contract.jobTitle}</h2>
      <span class="status-badge status-${contract.status}">${contract.status}</span>
      
      <div class="grid-2" style="margin-top: 1rem;">
        <div>
          <p><strong>Client:</strong> ${contract.clientName}</p>
          <p><strong>Timeline:</strong> ${contract.timeline}</p>
          <div class="rate">Your Rate: R${contract.freelancerRate}/hour</div>
        </div>
        <div>
          <p><strong>Hours Worked:</strong> ${contract.hoursWorked || 0} hours</p>
          <div class="currency">Earned: R${((contract.hoursWorked || 0) * contract.freelancerRate).toFixed(2)}</div>
        </div>
      </div>
      
      ${contract.tasks && contract.tasks.length > 0 ? `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
          <h4>Assigned Tasks:</h4>
          <ul style="margin-left: 1.5rem;">
            ${contract.tasks.map(task => `<li>${task}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
    
    ${contract.status === 'active' ? `
      <div class="card">
        <h3>Post Status Update</h3>
        <form onsubmit="postStatusUpdate(event, ${contractId})">
          <div class="form-group">
            <label>Project Status</label>
            <select name="projectStatus" required>
              <option value="on-track">On Track</option>
              <option value="ahead">Ahead of Schedule</option>
              <option value="delayed">Delayed</option>
              <option value="blocked">Blocked/Issues</option>
            </select>
          </div>
          <div class="form-group">
            <label>Progress Percentage</label>
            <input type="number" name="progress" min="0" max="100" required placeholder="50">
          </div>
          <div class="form-group">
            <label>Update Comment</label>
            <textarea name="comment" required placeholder="Describe what you've completed, current work, and any issues..."></textarea>
          </div>
          <button type="submit">Post Update</button>
        </form>
      </div>
    ` : ''}
    
    <div class="card">
      <h3>Project Status History</h3>
      ${statusUpdates.length === 0 ? '<p>No status updates yet.</p>' : 
        statusUpdates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(update => `
          <div class="card" style="background: #f8f9fa; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>${update.postedBy}</strong>
                <span class="status-badge status-${update.projectStatus === 'on-track' ? 'active' : update.projectStatus === 'ahead' ? 'completed' : 'pending'}">${update.projectStatus}</span>
              </div>
              <div class="job-meta">${new Date(update.createdAt).toLocaleString()}</div>
            </div>
            <p style="margin-top: 0.5rem;"><strong>Progress:</strong> ${update.progress}%</p>
            <div style="background: #e0e0e0; height: 10px; border-radius: 5px; margin: 0.5rem 0;">
              <div style="background: #27ae60; height: 100%; width: ${update.progress}%; border-radius: 5px;"></div>
            </div>
            <p style="margin-top: 0.5rem;">${update.comment}</p>
          </div>
        `).join('')
      }
    </div>
  `;
}

function postStatusUpdate(event, contractId) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const contract = DB.getContracts().find(c => c.id === contractId);
  const statusUpdates = DB.getStatusUpdates();
  
  const newUpdate = {
    id: Date.now(),
    contractId,
    jobTitle: contract.jobTitle,
    freelancerId: currentUser.id,
    freelancerName: currentUser.name,
    clientId: contract.clientId,
    clientName: contract.clientName,
    postedBy: currentUser.name,
    projectStatus: formData.get('projectStatus'),
    progress: parseInt(formData.get('progress')),
    comment: formData.get('comment'),
    createdAt: new Date().toISOString()
  };
  
  statusUpdates.push(newUpdate);
  DB.saveStatusUpdates(statusUpdates);
  
  // Send notifications
  sendEmailNotification(contract.clientEmail, 'Project Status Update', `${currentUser.name} posted an update on "${contract.jobTitle}": ${formData.get('comment')}`);
  sendEmailNotification(ADMIN_EMAIL, 'Project Status Update', `${currentUser.name} updated "${contract.jobTitle}" - Status: ${formData.get('projectStatus')}, Progress: ${formData.get('progress')}%`);
  
  showAlert('Status update posted successfully!');
  viewContractDetails(contractId);
}

function logHours(contractId) {
  const hours = prompt('Enter hours worked:');
  if (!hours || isNaN(hours)) return;
  
  const contracts = DB.getContracts();
  const contract = contracts.find(c => c.id === contractId);
  contract.hoursWorked = (contract.hoursWorked || 0) + parseFloat(hours);
  DB.saveContracts(contracts);
  
  sendEmailNotification(ADMIN_EMAIL, 'Hours Logged', `${currentUser.name} logged ${hours} hours for "${contract.jobTitle}"`);
  
  showAlert('Hours logged successfully!');
  loadMyContracts();
}

function markContractComplete(contractId) {
  if (!confirm('Are you sure you want to mark this contract as complete?')) return;
  
  const contracts = DB.getContracts();
  const contract = contracts.find(c => c.id === contractId);
  contract.status = 'completed';
  contract.completedAt = new Date().toISOString();
  DB.saveContracts(contracts);
  
  // Update freelancer earnings
  const freelancers = DB.getFreelancers();
  const freelancer = freelancers.find(f => f.id === currentUser.id);
  const earnings = contract.hoursWorked * contract.freelancerRate;
  freelancer.totalEarnings = (freelancer.totalEarnings || 0) + earnings;
  freelancer.available = true;
  DB.saveFreelancers(freelancers);
  
  sendEmailNotification(ADMIN_EMAIL, 'Contract Completed', `${currentUser.name} completed "${contract.jobTitle}"`);
  
  showAlert('Contract marked as complete!');
  loadMyContracts();
}

function loadMyReferrals() {
  const referrals = DB.getReferrals().filter(r => r.referrerId === currentUser.id);
  const container = document.getElementById('referrals-tab');
  
  container.innerHTML = `
    <div class="card">
      <h2>Refer Other Freelancers</h2>
      <p>Earn R500 for every freelancer you refer who completes their first project!</p>
      <form onsubmit="handleReferral(event)">
        <div class="form-group">
          <label>Freelancer Name</label>
          <input type="text" name="name" required>
        </div>
        <div class="form-group">
          <label>Freelancer Email</label>
          <input type="email" name="email" required>
        </div>
        <button type="submit">Send Referral</button>
      </form>
    </div>
    
    <div class="card">
      <h3>Your Referrals</h3>
      ${referrals.length === 0 ? '<p>No referrals yet.</p>' : 
        referrals.map(ref => `
          <div class="card">
            <p><strong>${ref.name}</strong> (${ref.email})</p>
            <span class="status-badge status-${ref.status}">${ref.status}</span>
            ${ref.status === 'completed' ? '<div class="currency">Earned: R500</div>' : ''}
          </div>
        `).join('')
      }
    </div>
  `;
}

function handleReferral(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const referrals = DB.getReferrals();
  const newRef = {
    id: Date.now(),
    referrerId: currentUser.id,
    referrerName: currentUser.name,
    name: formData.get('name'),
    email: formData.get('email'),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  referrals.push(newRef);
  DB.saveReferrals(referrals);
  
  sendEmailNotification(formData.get('email'), 'TechLink Referral', `${currentUser.name} has referred you to join TechLink!`);
  
  showAlert('Referral sent!');
  loadMyReferrals();
}

function loadMyEarnings() {
  const contracts = DB.getContracts().filter(c => c.freelancerId === currentUser.id);
  const referrals = DB.getReferrals().filter(r => r.referrerId === currentUser.id && r.status === 'completed');
  
  const projectEarnings = contracts.reduce((sum, c) => sum + ((c.hoursWorked || 0) * c.freelancerRate), 0);
  const referralEarnings = referrals.length * 500;
  const totalEarnings = projectEarnings + referralEarnings;
  
  const container = document.getElementById('earnings-tab');
  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">R${projectEarnings.toFixed(2)}</div>
        <div class="stat-label">Project Earnings</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">R${referralEarnings.toFixed(2)}</div>
        <div class="stat-label">Referral Earnings</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">R${totalEarnings.toFixed(2)}</div>
        <div class="stat-label">Total Earnings</div>
      </div>
    </div>
    
    <div class="card">
      <h3>Earnings Breakdown</h3>
      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>Hours</th>
            <th>Rate</th>
            <th>Earned</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${contracts.map(c => `
            <tr>
              <td>${c.jobTitle}</td>
              <td>${c.hoursWorked || 0}</td>
              <td class="currency">R${c.freelancerRate}</td>
              <td class="currency">R${((c.hoursWorked || 0) * c.freelancerRate).toFixed(2)}</td>
              <td><span class="status-badge status-${c.status}">${c.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// CLIENT DASHBOARD
function renderClientDashboard() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="tabs">
      <button class="tab active" onclick="showClientTab('post-job')">Post Job</button>
      <button class="tab" onclick="showClientTab('my-jobs')">My Jobs</button>
      <button class="tab" onclick="showClientTab('browse-freelancers')">Browse Freelancers</button>
    </div>
    
    <div id="post-job-tab"></div>
    <div id="my-jobs-tab" class="hidden"></div>
    <div id="browse-freelancers-tab" class="hidden"></div>
  `;
  
  loadPostJobForm();
}

function showClientTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  ['post-job', 'my-jobs', 'browse-freelancers'].forEach(t => {
    document.getElementById(`${t}-tab`).classList.add('hidden');
  });
  
  document.getElementById(`${tab}-tab`).classList.remove('hidden');
  
  if (tab === 'post-job') loadPostJobForm();
  else if (tab === 'my-jobs') loadClientJobs();
  else if (tab === 'browse-freelancers') loadFreelancersList();
}

function loadPostJobForm() {
  const container = document.getElementById('post-job-tab');
  container.innerHTML = `
    <div class="card">
      <h2>Post a New Job</h2>
      <form onsubmit="handlePostJob(event)">
        <div class="form-group">
          <label>Job Title</label>
          <input type="text" name="title" required>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea name="description" required placeholder="Describe the project requirements..."></textarea>
        </div>
        <div class="form-group">
          <label>Timeline</label>
          <input type="text" name="timeline" required placeholder="e.g., 2 weeks, 1 month">
        </div>
        <div class="form-group">
          <label>Your Budget (ZAR)</label>
          <input type="number" name="budget" step="0.01" required placeholder="10000">
        </div>
        <div class="form-group">
          <label>Hourly Rate You're Willing to Pay (ZAR)</label>
          <input type="number" name="rate" step="0.01" required placeholder="300">
        </div>
        <button type="submit">Post Job</button>
      </form>
    </div>
  `;
}

function handlePostJob(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const jobs = DB.getJobs();
  const budget = parseFloat(formData.get('budget'));
  const clientRate = parseFloat(formData.get('rate'));
  const adminCommission = clientRate * ADMIN_COMMISSION;
  const totalClientCost = clientRate + adminCommission;
  
  const newJob = {
    id: Date.now(),
    clientId: currentUser.id,
    clientName: currentUser.name,
    title: formData.get('title'),
    description: formData.get('description'),
    timeline: formData.get('timeline'),
    budget: budget,
    rate: clientRate,
    totalClientCost: totalClientCost,
    adminCommission: adminCommission,
    status: 'open',
    createdAt: new Date().toISOString()
  };
  
  jobs.push(newJob);
  DB.saveJobs(jobs);
  
  sendEmailNotification(currentUser.email, 'Job Posted', `Your job "${newJob.title}" has been posted successfully.`);
  sendEmailNotification(ADMIN_EMAIL, 'New Job Posted', `${currentUser.name} posted a new job: "${newJob.title}"`);
  
  showAlert('Job posted successfully!');
  loadClientJobs();
  showClientTab('my-jobs');
}

function loadClientJobs() {
  const jobs = DB.getJobs().filter(j => j.clientId === currentUser.id);
  const contracts = DB.getContracts();
  const container = document.getElementById('my-jobs-tab');
  
  if (jobs.length === 0) {
    container.innerHTML = '<div class="card"><p>No jobs posted yet.</p></div>';
    return;
  }
  
  container.innerHTML = jobs.map(job => {
    const contract = contracts.find(c => c.jobId === job.id);
    return `
      <div class="job-card card" onclick="viewClientJobDetails(${job.id})">
        <h3 class="job-title">${job.title}</h3>
        <span class="status-badge status-${job.status}">${job.status}</span>
        <p>${job.description}</p>
        <div class="job-meta"><strong>Timeline:</strong> ${job.timeline}</div>
        <div class="rate">Your Rate: R${job.rate}/hour (Total: R${job.totalClientCost}/hour)</div>
        <div class="job-meta">Posted: ${new Date(job.createdAt).toLocaleDateString()}</div>
        ${contract ? `<p style="margin-top: 0.5rem;"><strong>Assigned to:</strong> ${contract.freelancerName}</p>` : ''}
      </div>
    `;
  }).join('');
}

function viewClientJobDetails(jobId) {
  const job = DB.getJobs().find(j => j.id === jobId);
  const applications = DB.getApplications().filter(a => a.jobId === jobId);
  const contracts = DB.getContracts();
  const contract = contracts.find(c => c.jobId === jobId);
  const statusUpdates = contract ? DB.getStatusUpdates().filter(u => u.contractId === contract.id) : [];
  
  const app = document.getElementById('app');
  app.innerHTML = `
    <button onclick="renderClientDashboard(); showClientTab('my-jobs')">← Back to My Jobs</button>
    <div class="card">
      <h2>${job.title}</h2>
      <span class="status-badge status-${job.status}">${job.status}</span>
      <p>${job.description}</p>
      <p><strong>Timeline:</strong> ${job.timeline}</p>
      <div class="rate">Rate: R${job.rate}/hour (You pay: R${job.totalClientCost}/hour)</div>
      ${contract ? `
        <div style="margin-top: 1rem; padding: 1rem; background: #e8f5e9; border-radius: 6px;">
          <p><strong>Assigned Freelancer:</strong> ${contract.freelancerName}</p>
          <p><strong>Hours Worked:</strong> ${contract.hoursWorked || 0} hours</p>
          <div class="currency">Total Cost: R${((contract.hoursWorked || 0) * contract.clientRate).toFixed(2)}</div>
        </div>
      ` : ''}
    </div>
    
    ${contract && statusUpdates.length > 0 ? `
      <div class="card">
        <h3>Project Status Updates</h3>
        ${statusUpdates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(update => `
          <div class="card" style="background: #f8f9fa; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>${update.postedBy}</strong>
                <span class="status-badge status-${update.projectStatus === 'on-track' ? 'active' : update.projectStatus === 'ahead' ? 'completed' : 'pending'}">${update.projectStatus}</span>
              </div>
              <div class="job-meta">${new Date(update.createdAt).toLocaleString()}</div>
            </div>
            <p style="margin-top: 0.5rem;"><strong>Progress:</strong> ${update.progress}%</p>
            <div style="background: #e0e0e0; height: 10px; border-radius: 5px; margin: 0.5rem 0;">
              <div style="background: #27ae60; height: 100%; width: ${update.progress}%; border-radius: 5px;"></div>
            </div>
            <p style="margin-top: 0.5rem;">${update.comment}</p>
          </div>
        `).join('')}
      </div>
    ` : ''}
    
    <div class="card">
      <h3>Applications (${applications.length})</h3>
      ${applications.length === 0 ? '<p>No applications yet.</p>' : 
        applications.map(app => `
          <div class="card">
            <h4>${app.freelancerName}</h4>
            <span class="status-badge status-${app.status}">${app.status}</span>
            <p><strong>Skills:</strong> ${app.freelancerSkills}</p>
            <p><strong>Rate:</strong> R${app.freelancerRate}/hour</p>
            <p><strong>Estimated Hours:</strong> ${app.estimatedHours}</p>
            <p><strong>Cover Letter:</strong> ${app.coverLetter}</p>
            ${app.status === 'pending' ? `
              <button onclick="sendOffer(${app.id}, ${job.id})">Send Offer</button>
            ` : ''}
          </div>
        `).join('')
      }
    </div>
  `;
}

function sendOffer(applicationId, jobId) {
  const app = DB.getApplications().find(a => a.id === applicationId);
  const job = DB.getJobs().find(j => j.id === jobId);
  
  const offers = DB.getOffers();
  const newOffer = {
    id: Date.now(),
    applicationId,
    jobId,
    freelancerId: app.freelancerId,
    clientId: currentUser.id,
    jobTitle: job.title,
    offeredRate: job.rate,
    message: `We would like to offer you this project at R${job.rate}/hour.`,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  offers.push(newOffer);
  DB.saveOffers(offers);
  
  sendEmailNotification(app.freelancerEmail, 'New Job Offer', `You have received an offer for "${job.title}"`);
  
  showAlert('Offer sent to freelancer!');
  viewClientJobDetails(jobId);
}

function loadFreelancersList() {
  const freelancers = DB.getFreelancers();
  const container = document.getElementById('browse-freelancers-tab');
  
  if (freelancers.length === 0) {
    container.innerHTML = '<div class="card"><p>No freelancers available.</p></div>';
    return;
  }
  
  container.innerHTML = freelancers.map(freelancer => `
    <div class="freelancer-card card">
      <h3 class="job-title">${freelancer.name}</h3>
      ${freelancer.available ? '<span class="status-badge status-active">Available</span>' : '<span class="status-badge status-pending">Busy</span>'}
      <p><strong>Education:</strong> ${freelancer.education}</p>
      <p><strong>Skills:</strong> ${freelancer.skills.split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}</p>
      <div class="rate">Rate: R${freelancer.hourlyRate}/hour</div>
      <p>${freelancer.bio}</p>
      <div class="job-meta">Email: ${freelancer.email} | Phone: ${freelancer.phone}</div>
    </div>
  `).join('');
}

// ADMIN DASHBOARD
function renderAdminDashboard() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="admin-section">
      <h2>🔐 Admin Dashboard</h2>
      <p>You have full control over the platform</p>
    </div>
    
    <div class="tabs">
      <button class="tab active" onclick="showAdminTab('overview')">Overview</button>
      <button class="tab" onclick="showAdminTab('projects')">Projects</button>
      <button class="tab" onclick="showAdminTab('freelancers')">Freelancers</button>
      <button class="tab" onclick="showAdminTab('clients')">Clients</button>
      <button class="tab" onclick="showAdminTab('applications')">Applications</button>
      <button class="tab" onclick="showAdminTab('earnings')">Platform Earnings</button>
    </div>
    
    <div id="overview-tab"></div>
    <div id="projects-tab" class="hidden"></div>
    <div id="freelancers-tab" class="hidden"></div>
    <div id="clients-tab" class="hidden"></div>
    <div id="applications-tab" class="hidden"></div>
    <div id="earnings-tab" class="hidden"></div>
  `;
  
  loadAdminOverview();
}

function showAdminTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  ['overview', 'projects', 'freelancers', 'clients', 'applications', 'earnings'].forEach(t => {
    document.getElementById(`${t}-tab`).classList.add('hidden');
  });
  
  document.getElementById(`${tab}-tab`).classList.remove('hidden');
  
  if (tab === 'overview') loadAdminOverview();
  else if (tab === 'projects') loadAdminProjects();
  else if (tab === 'freelancers') loadAdminFreelancers();
  else if (tab === 'clients') loadAdminClients();
  else if (tab === 'applications') loadAdminApplications();
  else if (tab === 'earnings') loadAdminEarnings();
}

function loadAdminOverview() {
  const freelancers = DB.getFreelancers();
  const clients = DB.getClients();
  const jobs = DB.getJobs();
  const contracts = DB.getContracts();
  const applications = DB.getApplications();
  
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const pendingApps = applications.filter(a => a.status === 'pending').length;
  
  const container = document.getElementById('overview-tab');
  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${freelancers.length}</div>
        <div class="stat-label">Total Freelancers</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${clients.length}</div>
        <div class="stat-label">Total Clients</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${jobs.length}</div>
        <div class="stat-label">Total Jobs</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${activeContracts}</div>
        <div class="stat-label">Active Contracts</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${pendingApps}</div>
        <div class="stat-label">Pending Applications</div>
      </div>
    </div>
    
    <div class="card">
      <h3>Recent Activity</h3>
      <p>Monitor all platform activities from this dashboard.</p>
    </div>
  `;
}

function loadAdminProjects() {
  const contracts = DB.getContracts();
  const jobs = DB.getJobs();
  const container = document.getElementById('projects-tab');
  
  const totalCommission = contracts.reduce((sum, c) => {
    return sum + ((c.hoursWorked || 0) * c.adminCommission);
  }, 0);
  
  container.innerHTML = `
    <div class="card">
      <h3>All Projects</h3>
      <div class="currency">Total Platform Commission: R${totalCommission.toFixed(2)}</div>
      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>Freelancer</th>
            <th>Client</th>
            <th>Status</th>
            <th>Hours</th>
            <th>Freelancer Rate</th>
            <th>Client Rate</th>
            <th>Commission</th>
            <th>Timeline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${contracts.map(c => `
            <tr>
              <td>${c.jobTitle}</td>
              <td>${c.freelancerName}</td>
              <td>${c.clientName}</td>
              <td><span class="status-badge status-${c.status}">${c.status}</span></td>
              <td>${c.hoursWorked || 0}</td>
              <td class="currency">R${c.freelancerRate}</td>
              <td class="currency">R${c.clientRate}</td>
              <td class="currency">R${((c.hoursWorked || 0) * c.adminCommission).toFixed(2)}</td>
              <td>${c.timeline}</td>
              <td>
                ${c.status === 'completed' ? `
                  <button onclick="processPayment(${c.id})">Process Payment</button>
                ` : ''}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="card">
      <h3>Open Jobs</h3>
      <table>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Client</th>
            <th>Rate</th>
            <th>Budget</th>
            <th>Applications</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${jobs.map(j => {
            const appCount = DB.getApplications().filter(a => a.jobId === j.id).length;
            return `
              <tr>
                <td>${j.title}</td>
                <td>${j.clientName}</td>
                <td class="currency">R${j.rate}</td>
                <td class="currency">R${j.budget}</td>
                <td>${appCount}</td>
                <td><span class="status-badge status-${j.status}">${j.status}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function processPayment(contractId) {
  const contracts = DB.getContracts();
  const contract = contracts.find(c => c.id === contractId);
  
  if (contract.paymentProcessed) {
    showAlert('Payment already processed', 'error');
    return;
  }
  
  contract.paymentProcessed = true;
  DB.saveContracts(contracts);
  
  const freelancerAmount = contract.hoursWorked * contract.freelancerRate;
  const clientAmount = contract.hoursWorked * contract.clientRate;
  const adminAmount = contract.hoursWorked * contract.adminCommission;
  
  sendEmailNotification(contract.freelancerEmail, 'Payment Processed', `Payment of R${freelancerAmount.toFixed(2)} for "${contract.jobTitle}" has been processed.`);
  sendEmailNotification(contract.clientEmail, 'Invoice', `Invoice for R${clientAmount.toFixed(2)} for "${contract.jobTitle}" has been generated.`);
  
  showAlert(`Payment processed! Freelancer: R${freelancerAmount.toFixed(2)}, Client charged: R${clientAmount.toFixed(2)}, Platform earned: R${adminAmount.toFixed(2)}`);
  loadAdminProjects();
}

function loadAdminFreelancers() {
  const freelancers = DB.getFreelancers();
  const container = document.getElementById('freelancers-tab');
  
  container.innerHTML = `
    <div class="card">
      <h3>All Freelancers</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Skills</th>
            <th>Rate</th>
            <th>Availability</th>
            <th>Total Earnings</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${freelancers.map(f => `
            <tr>
              <td>${f.name}</td>
              <td>${f.email}</td>
              <td>${f.phone}</td>
              <td>${f.skills}</td>
              <td class="currency">R${f.hourlyRate}</td>
              <td>${f.available ? '<span class="status-badge status-active">Available</span>' : '<span class="status-badge status-pending">Busy</span>'}</td>
              <td class="currency">R${(f.totalEarnings || 0).toFixed(2)}</td>
              <td>
                <button onclick="toggleFreelancerAvailability(${f.id})">${f.available ? 'Mark Busy' : 'Mark Available'}</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function toggleFreelancerAvailability(freelancerId) {
  const freelancers = DB.getFreelancers();
  const freelancer = freelancers.find(f => f.id === freelancerId);
  freelancer.available = !freelancer.available;
  DB.saveFreelancers(freelancers);
  
  sendEmailNotification(freelancer.email, 'Availability Updated', `Your availability has been set to: ${freelancer.available ? 'Available' : 'Busy'}`);
  
  showAlert('Freelancer availability updated!');
  loadAdminFreelancers();
}

function loadAdminClients() {
  const clients = DB.getClients();
  const container = document.getElementById('clients-tab');
  
  container.innerHTML = `
    <div class="card">
      <h3>All Clients</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company Type</th>
            <th>Jobs Posted</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          ${clients.map(c => {
            const jobCount = DB.getJobs().filter(j => j.clientId === c.id).length;
            return `
              <tr>
                <td>${c.name}</td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td>${c.companyType}</td>
                <td>${jobCount}</td>
                <td>${new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function loadAdminApplications() {
  const applications = DB.getApplications();
  const jobs = DB.getJobs();
  const container = document.getElementById('applications-tab');
  
  container.innerHTML = `
    <div class="card">
      <h3>All Applications</h3>
      <table>
        <thead>
          <tr>
            <th>Job</th>
            <th>Freelancer</th>
            <th>Skills</th>
            <th>Rate</th>
            <th>Est. Hours</th>
            <th>Status</th>
            <th>Applied</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${applications.map(app => {
            const job = jobs.find(j => j.id === app.jobId);
            return `
              <tr>
                <td>${job.title}</td>
                <td>${app.freelancerName}</td>
                <td>${app.freelancerSkills}</td>
                <td class="currency">R${app.freelancerRate}</td>
                <td>${app.estimatedHours}</td>
                <td><span class="status-badge status-${app.status}">${app.status}</span></td>
                <td>${new Date(app.createdAt).toLocaleDateString()}</td>
                <td>
                  ${app.status === 'pending' || app.status === 'interview' ? `
                    <button onclick="reviewApplication(${app.id}, ${job.id})">Review & Assign</button>
                    <button class="danger" onclick="rejectApplication(${app.id})">Reject</button>
                  ` : ''}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function reviewApplication(applicationId, jobId) {
  const app = DB.getApplications().find(a => a.id === applicationId);
  const job = DB.getJobs().find(j => j.id === jobId);
  const freelancers = DB.getFreelancers();
  const freelancer = freelancers.find(f => f.id === app.freelancerId);
  
  const container = document.getElementById('applications-tab');
  container.innerHTML = `
    <button onclick="loadAdminApplications()">← Back to Applications</button>
    
    <div class="card">
      <h2>Review Application</h2>
      
      <div class="grid-2">
        <div>
          <h3>Job Details</h3>
          <p><strong>Title:</strong> ${job.title}</p>
          <p><strong>Description:</strong> ${job.description}</p>
          <p><strong>Timeline:</strong> ${job.timeline}</p>
          <p><strong>Budget:</strong> R${job.budget}</p>
          <p><strong>Rate:</strong> R${job.rate}/hour</p>
        </div>
        
        <div>
          <h3>Freelancer Details</h3>
          <p><strong>Name:</strong> ${freelancer.name}</p>
          <p><strong>Email:</strong> ${freelancer.email}</p>
          <p><strong>Phone:</strong> ${freelancer.phone}</p>
          <p><strong>Education:</strong> ${freelancer.education}</p>
          <p><strong>Skills:</strong> ${freelancer.skills}</p>
          <p><strong>Rate:</strong> R${freelancer.hourlyRate}/hour</p>
          <p><strong>Availability:</strong> ${freelancer.available ? '<span class="status-badge status-active">Available</span>' : '<span class="status-badge status-pending">Busy</span>'}</p>
        </div>
      </div>
      
      <div class="card" style="background: #f8f9fa; margin-top: 1rem;">
        <h4>Application Details</h4>
        <p><strong>Cover Letter:</strong></p>
        <p>${app.coverLetter}</p>
        <p><strong>Estimated Hours:</strong> ${app.estimatedHours} hours</p>
        <p><strong>Applied:</strong> ${new Date(app.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
    
    <div class="card">
      <h3>Requirements Check</h3>
      <form onsubmit="checkRequirements(event, ${applicationId}, ${jobId})">
        <div class="form-group">
          <label>
            <input type="checkbox" name="skillsMatch" required>
            Skills match job requirements
          </label>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" name="experienceMatch" required>
            Experience level is adequate
          </label>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" name="availabilityCheck" required>
            Freelancer is available
          </label>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" name="rateAcceptable" required>
            Rate is within budget
          </label>
        </div>
        
        <h4 style="margin-top: 1.5rem;">Task Allocation</h4>
        <div class="form-group">
          <label>Project Tasks (one per line)</label>
          <textarea name="tasks" rows="6" required placeholder="Task 1: Setup development environment&#10;Task 2: Design database schema&#10;Task 3: Implement user authentication&#10;Task 4: Build frontend components&#10;Task 5: Testing and deployment"></textarea>
        </div>
        
        <div class="form-group">
          <label>Project Milestones</label>
          <textarea name="milestones" rows="4" required placeholder="Week 1: Project setup and planning&#10;Week 2: Core development&#10;Week 3: Testing and refinement&#10;Week 4: Deployment and handover"></textarea>
        </div>
        
        <div class="form-group">
          <label>Special Instructions</label>
          <textarea name="instructions" placeholder="Any specific requirements or guidelines for the freelancer..."></textarea>
        </div>
        
        <button type="submit">Approve & Create Contract with Tasks</button>
        <button type="button" class="danger" onclick="rejectApplication(${applicationId})">Reject Application</button>
      </form>
    </div>
  `;
}

function checkRequirements(event, applicationId, jobId) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const app = DB.getApplications().find(a => a.id === applicationId);
  const job = DB.getJobs().find(j => j.id === jobId);
  const freelancers = DB.getFreelancers();
  const freelancer = freelancers.find(f => f.id === app.freelancerId);
  
  if (!freelancer.available) {
    showAlert('Freelancer is not available for new projects', 'error');
    return;
  }
  
  // Parse tasks and milestones
  const tasks = formData.get('tasks').split('\n').filter(t => t.trim());
  const milestones = formData.get('milestones').split('\n').filter(m => m.trim());
  const instructions = formData.get('instructions');
  
  // Create contract with task allocation
  const contracts = DB.getContracts();
  const clients = DB.getClients();
  const client = clients.find(c => c.id === job.clientId);
  
  const newContract = {
    id: Date.now(),
    jobId: job.id,
    jobTitle: job.title,
    freelancerId: app.freelancerId,
    freelancerName: app.freelancerName,
    freelancerEmail: app.freelancerEmail,
    freelancerRate: app.freelancerRate,
    clientId: job.clientId,
    clientName: job.clientName,
    clientEmail: client.email,
    clientRate: job.totalClientCost,
    adminCommission: job.adminCommission,
    timeline: job.timeline,
    tasks: tasks,
    milestones: milestones,
    instructions: instructions,
    hoursWorked: 0,
    status: 'active',
    paymentProcessed: false,
    createdAt: new Date().toISOString()
  };
  
  contracts.push(newContract);
  DB.saveContracts(contracts);
  
  // Update application status
  const applications = DB.getApplications();
  app.status = 'active';
  DB.saveApplications(applications);
  
  // Update job status
  const jobs = DB.getJobs();
  job.status = 'in-progress';
  DB.saveJobs(jobs);
  
  // Mark freelancer as busy
  freelancer.available = false;
  DB.saveFreelancers(freelancers);
  
  // Send detailed email notifications
  const taskList = tasks.map((t, i) => `${i + 1}. ${t}`).join('\n');
  const milestoneList = milestones.map((m, i) => `${i + 1}. ${m}`).join('\n');
  
  sendEmailNotification(
    app.freelancerEmail, 
    'Contract Created - Task Assignment', 
    `Congratulations! You've been selected for "${job.title}".\n\nYour Tasks:\n${taskList}\n\nMilestones:\n${milestoneList}\n\nInstructions: ${instructions || 'None'}`
  );
  
  sendEmailNotification(
    client.email, 
    'Freelancer Assigned', 
    `${app.freelancerName} has been assigned to your project "${job.title}".\n\nTasks allocated:\n${taskList}`
  );
  
  showAlert('Contract created with task allocation!');
  loadAdminApplications();
}

function approveFreelancer(applicationId, jobId) {
  const app = DB.getApplications().find(a => a.id === applicationId);
  const job = DB.getJobs().find(j => j.id === jobId);
  
  // Check freelancer availability
  const freelancers = DB.getFreelancers();
  const freelancer = freelancers.find(f => f.id === app.freelancerId);
  
  if (!freelancer.available) {
    showAlert('Freelancer is not available for new projects', 'error');
    return;
  }
  
  // Create contract
  const contracts = DB.getContracts();
  const clients = DB.getClients();
  const client = clients.find(c => c.id === job.clientId);
  
  const newContract = {
    id: Date.now(),
    jobId: job.id,
    jobTitle: job.title,
    freelancerId: app.freelancerId,
    freelancerName: app.freelancerName,
    freelancerEmail: app.freelancerEmail,
    freelancerRate: app.freelancerRate,
    clientId: job.clientId,
    clientName: job.clientName,
    clientEmail: client.email,
    clientRate: job.totalClientCost,
    adminCommission: job.adminCommission,
    timeline: job.timeline,
    hoursWorked: 0,
    status: 'active',
    paymentProcessed: false,
    createdAt: new Date().toISOString()
  };
  
  contracts.push(newContract);
  DB.saveContracts(contracts);
  
  // Update application status
  const applications = DB.getApplications();
  app.status = 'active';
  DB.saveApplications(applications);
  
  // Update job status
  const jobs = DB.getJobs();
  job.status = 'in-progress';
  DB.saveJobs(jobs);
  
  // Mark freelancer as busy
  freelancer.available = false;
  DB.saveFreelancers(freelancers);
  
  sendEmailNotification(app.freelancerEmail, 'Contract Created', `Congratulations! You've been selected for "${job.title}". Your contract is now active.`);
  sendEmailNotification(client.email, 'Freelancer Assigned', `${app.freelancerName} has been assigned to your project "${job.title}".`);
  
  showAlert('Contract created successfully!');
  loadAdminApplications();
}

function rejectApplication(applicationId) {
  if (!confirm('Are you sure you want to reject this application?')) return;
  
  const applications = DB.getApplications();
  const app = applications.find(a => a.id === applicationId);
  app.status = 'rejected';
  DB.saveApplications(applications);
  
  sendEmailNotification(app.freelancerEmail, 'Application Update', 'Unfortunately, your application was not selected for this project.');
  
  showAlert('Application rejected');
  loadAdminApplications();
}

function loadAdminEarnings() {
  const contracts = DB.getContracts();
  const totalCommission = contracts.reduce((sum, c) => sum + ((c.hoursWorked || 0) * c.adminCommission), 0);
  const processedPayments = contracts.filter(c => c.paymentProcessed).length;
  const pendingPayments = contracts.filter(c => c.status === 'completed' && !c.paymentProcessed).length;
  
  const container = document.getElementById('earnings-tab');
  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">R${totalCommission.toFixed(2)}</div>
        <div class="stat-label">Total Platform Earnings</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${processedPayments}</div>
        <div class="stat-label">Processed Payments</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${pendingPayments}</div>
        <div class="stat-label">Pending Payments</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${(ADMIN_COMMISSION * 100).toFixed(0)}%</div>
        <div class="stat-label">Commission Rate</div>
      </div>
    </div>
    
    <div class="card">
      <h3>Earnings Breakdown by Project</h3>
      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>Freelancer</th>
            <th>Client</th>
            <th>Hours</th>
            <th>Freelancer Paid</th>
            <th>Client Charged</th>
            <th>Platform Commission</th>
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          ${contracts.map(c => {
            const freelancerPaid = (c.hoursWorked || 0) * c.freelancerRate;
            const clientCharged = (c.hoursWorked || 0) * c.clientRate;
            const commission = (c.hoursWorked || 0) * c.adminCommission;
            return `
              <tr>
                <td>${c.jobTitle}</td>
                <td>${c.freelancerName}</td>
                <td>${c.clientName}</td>
                <td>${c.hoursWorked || 0}</td>
                <td class="currency">R${freelancerPaid.toFixed(2)}</td>
                <td class="currency">R${clientCharged.toFixed(2)}</td>
                <td class="currency">R${commission.toFixed(2)}</td>
                <td>${c.paymentProcessed ? '<span class="status-badge status-completed">Processed</span>' : '<span class="status-badge status-pending">Pending</span>'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// Initialize app
init();
