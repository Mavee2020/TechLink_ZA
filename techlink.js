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
  getTimesheets: () => JSON.parse(localStorage.getItem('timesheets') || '[]'),
  saveTimesheets: (data) => localStorage.setItem('timesheets', JSON.stringify(data)),
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
  // Redirect to landing page
  window.location.href = 'index.html';
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
      <button class="tab" onclick="showFreelancerTab('projects')">Projects</button>
      <button class="tab" onclick="showFreelancerTab('contracts')">Contracts</button>
      <button class="tab" onclick="showFreelancerTab('referrals')">Referrals</button>
      <button class="tab" onclick="showFreelancerTab('earnings')">Earnings</button>
      <button class="tab" onclick="showFreelancerTab('profile')">Profile</button>
    </div>
    
    <div id="opportunities-tab"></div>
    <div id="applications-tab" class="hidden"></div>
    <div id="offers-tab" class="hidden"></div>
    <div id="assessments-tab" class="hidden"></div>
    <div id="projects-tab" class="hidden"></div>
    <div id="contracts-tab" class="hidden"></div>
    <div id="referrals-tab" class="hidden"></div>
    <div id="earnings-tab" class="hidden"></div>
    <div id="profile-tab" class="hidden"></div>
  `;
  
  loadOpportunities();
}

function showFreelancerTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  ['opportunities', 'applications', 'offers', 'assessments', 'projects', 'contracts', 'referrals', 'earnings', 'profile'].forEach(t => {
    document.getElementById(`${t}-tab`).classList.add('hidden');
  });
  
  document.getElementById(`${tab}-tab`).classList.remove('hidden');
  
  if (tab === 'opportunities') loadOpportunities();
  else if (tab === 'applications') loadMyApplications();
  else if (tab === 'offers') loadMyOffers();
  else if (tab === 'assessments') loadMyAssessments();
  else if (tab === 'projects') loadMyProjects();
  else if (tab === 'contracts') loadMyContracts();
  else if (tab === 'referrals') loadMyReferrals();
  else if (tab === 'earnings') loadMyEarnings();
  else if (tab === 'profile') loadMyProfile();
}

function loadOpportunities(searchTerm = '') {
  const jobs = DB.getJobs().filter(j => j.status === 'open');
  const container = document.getElementById('opportunities-tab');
  
  // Filter jobs based on search term
  const filteredJobs = searchTerm ? jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  ) : jobs;
  
  // Check if search box already exists
  const existingSearch = document.getElementById('job-search');
  if (existingSearch) {
    // Only update the job list, not the search box
    const jobsContainer = document.getElementById('jobs-list-container');
    jobsContainer.innerHTML = `
      <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">Showing ${filteredJobs.length} of ${jobs.length} opportunities</p>
      ${filteredJobs.length === 0 ? 
        '<div class="card"><p>No opportunities match your search.</p></div>' :
        filteredJobs.map(job => `
          <div class="job-card card" onclick="viewJobDetails(${job.id})">
            <h3 class="job-title">${job.title}</h3>
            <div class="job-meta">Posted by ${job.clientName} • ${new Date(job.createdAt).toLocaleDateString()}</div>
            <p>${job.description}</p>
            <div class="job-meta"><strong>Timeline:</strong> ${job.timeline}</div>
            <div class="rate">Rate: R${job.rate}/hour</div>
          </div>
        `).join('')
      }
    `;
  } else {
    // Initial render with search box
    container.innerHTML = `
      <div class="card">
        <div class="form-group">
          <input type="text" 
                 id="job-search" 
                 placeholder="🔍 Search opportunities by title, description, or client..." 
                 oninput="loadOpportunities(this.value)"
                 style="border: 1px solid #e5e7eb; padding: 0.8rem;">
        </div>
      </div>
      <div id="jobs-list-container">
        <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">Showing ${filteredJobs.length} of ${jobs.length} opportunities</p>
        ${filteredJobs.length === 0 ? 
          '<div class="card"><p>No opportunities available at the moment.</p></div>' :
          filteredJobs.map(job => `
            <div class="job-card card" onclick="viewJobDetails(${job.id})">
              <h3 class="job-title">${job.title}</h3>
              <div class="job-meta">${new Date(job.createdAt).toLocaleDateString()}</div>
              <p>${job.description}</p>
              <div class="job-meta"><strong>Timeline:</strong> ${job.timeline}</div>
              <div class="rate">Rate: R${job.rate}/hour</div>
            </div>
          `).join('')
        }
      </div>
    `;
  }
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
      <form onsubmit="handleJobApplication(event, ${jobId})" id="application-form">
        <div class="form-group">
          <label>Cover Letter</label>
          <textarea name="coverLetter" required placeholder="Explain why you're the best fit for this project..."></textarea>
        </div>
        <div class="form-group">
          <label>Estimated Hours</label>
          <input type="number" name="estimatedHours" required placeholder="40">
        </div>
        
        <div class="form-group">
          <label>Portfolio/Resume (PDF, DOC, DOCX - Max 5MB)</label>
          <input type="file" name="portfolio" accept=".pdf,.doc,.docx" onchange="handleFileSelect(event, 'portfolio')">
          <div id="portfolio-preview" style="margin-top: 0.5rem; color: #27ae60;"></div>
        </div>
        
        <div class="form-group">
          <label>Additional Documents (Optional - PDF, DOC, DOCX, ZIP - Max 5MB)</label>
          <input type="file" name="documents" accept=".pdf,.doc,.docx,.zip" multiple onchange="handleFileSelect(event, 'documents')">
          <div id="documents-preview" style="margin-top: 0.5rem; color: #27ae60;"></div>
        </div>
        
        <div class="form-group">
          <label>Portfolio Links (Optional)</label>
          <input type="url" name="portfolioLink1" placeholder="https://github.com/yourusername">
        </div>
        <div class="form-group">
          <input type="url" name="portfolioLink2" placeholder="https://yourwebsite.com">
        </div>
        <div class="form-group">
          <input type="url" name="portfolioLink3" placeholder="https://linkedin.com/in/yourprofile">
        </div>
        
        <button type="submit">Submit Application</button>
      </form>
    </div>
  `;
}

function handleFileSelect(event, fieldName) {
  const files = event.target.files;
  const previewDiv = document.getElementById(`${fieldName}-preview`);
  
  if (files.length === 0) {
    previewDiv.innerHTML = '';
    return;
  }
  
  let totalSize = 0;
  let fileList = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    totalSize += file.size;
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      previewDiv.innerHTML = '<span style="color: #e74c3c;">❌ File too large. Maximum size is 5MB.</span>';
      event.target.value = '';
      return;
    }
    
    fileList.push(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
  }
  
  previewDiv.innerHTML = `✓ ${fileList.join('<br>✓ ')}`;
}

function handleJobApplication(event, jobId) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const applications = DB.getApplications();
  const job = DB.getJobs().find(j => j.id === jobId);
  
  // Handle file uploads (store file info, in production use actual file upload service)
  const portfolioFile = formData.get('portfolio');
  const documentFiles = formData.getAll('documents');
  
  const portfolioInfo = portfolioFile && portfolioFile.size > 0 ? {
    name: portfolioFile.name,
    size: portfolioFile.size,
    type: portfolioFile.type,
    uploadedAt: new Date().toISOString()
  } : null;
  
  const documentsInfo = documentFiles.filter(f => f.size > 0).map(file => ({
    name: file.name,
    size: file.size,
    type: file.type,
    uploadedAt: new Date().toISOString()
  }));
  
  // Collect portfolio links
  const portfolioLinks = [
    formData.get('portfolioLink1'),
    formData.get('portfolioLink2'),
    formData.get('portfolioLink3')
  ].filter(link => link && link.trim());
  
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
    portfolio: portfolioInfo,
    documents: documentsInfo,
    portfolioLinks: portfolioLinks,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  applications.push(newApp);
  DB.saveApplications(applications);
  
  const attachmentText = portfolioInfo ? `\nPortfolio: ${portfolioInfo.name}` : '';
  const linksText = portfolioLinks.length > 0 ? `\nPortfolio Links: ${portfolioLinks.join(', ')}` : '';
  
  sendEmailNotification(currentUser.email, 'Application Submitted', `Your application for "${job.title}" has been submitted successfully.${attachmentText}${linksText}`);
  sendEmailNotification(ADMIN_EMAIL, 'New Application', `${currentUser.name} applied for "${job.title}"${attachmentText}${linksText}`);
  
  showAlert('Application submitted successfully with attachments!');
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
    // Create contract when offer is accepted
    const contracts = DB.getContracts();
    
    const newContract = {
      id: Date.now(),
      jobId: offer.jobId,
      jobTitle: offer.jobTitle,
      freelancerId: offer.freelancerId,
      freelancerName: offer.freelancerName,
      freelancerEmail: offer.freelancerEmail,
      freelancerRate: offer.freelancerRate,
      clientId: offer.clientId,
      clientName: offer.clientName,
      clientEmail: offer.clientEmail,
      clientRate: offer.clientRate,
      adminCommission: offer.adminCommission,
      timeline: offer.timeline,
      tasks: offer.tasks,
      milestones: offer.milestones,
      instructions: offer.instructions,
      hoursWorked: 0,
      status: 'active',
      paymentProcessed: false,
      createdAt: new Date().toISOString()
    };
    
    console.log('Creating contract with clientId:', newContract.clientId);
    contracts.push(newContract);
    DB.saveContracts(contracts);
    console.log('Contract saved successfully');
    
    // Update application status
    const applications = DB.getApplications();
    const app = applications.find(a => a.id === offer.applicationId);
    if (app) {
      app.status = 'active';
      DB.saveApplications(applications);
    }
    
    // Update job status
    const jobs = DB.getJobs();
    const job = jobs.find(j => j.id === offer.jobId);
    if (job) {
      job.status = 'in-progress';
      DB.saveJobs(jobs);
    }
    
    // Mark freelancer as busy
    const freelancers = DB.getFreelancers();
    const freelancer = freelancers.find(f => f.id === currentUser.id);
    if (freelancer) {
      freelancer.available = false;
      DB.saveFreelancers(freelancers);
    }
    
    // Send notifications
    sendEmailNotification(ADMIN_EMAIL, 'Offer Accepted - Contract Created', `${currentUser.name} accepted the offer for "${offer.jobTitle}". Contract has been created.`);
    sendEmailNotification(offer.clientEmail, 'Contract Active', `${currentUser.name} accepted your offer for "${offer.jobTitle}". The project is now active.`);
    
    showAlert('Offer accepted! Contract created. Check your Contracts tab.');
  } else {
    sendEmailNotification(ADMIN_EMAIL, 'Offer Declined', `${currentUser.name} declined the offer for "${offer.jobTitle}"`);
    showAlert('Offer declined.');
  }
  
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

function loadMyProjects() {
  const contracts = DB.getContracts().filter(c => c.freelancerId === currentUser.id && c.status === 'active');
  const container = document.getElementById('projects-tab');
  
  if (contracts.length === 0) {
    container.innerHTML = '<div class="card"><p>No active projects.</p></div>';
    return;
  }
  
  container.innerHTML = contracts.map(contract => `
    <div class="card">
      <h3 class="job-title">${contract.jobTitle}</h3>
      <span class="status-badge status-active">Active</span>
      <p><strong>Client:</strong> ${contract.clientName}</p>
      <div class="rate">Your Rate: R${contract.freelancerRate}/hour</div>
      <p><strong>Timeline:</strong> ${contract.timeline}</p>
      <p><strong>Hours Worked:</strong> ${contract.hoursWorked || 0} hours</p>
      
      ${contract.tasks && contract.tasks.length > 0 ? `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
          <h4>Assigned Tasks:</h4>
          <ul style="margin-left: 1.5rem;">
            ${contract.tasks.map(task => `<li>${task}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      <button onclick="viewProjectDetails(${contract.id})">View Details & Post Update</button>
      <button class="secondary" onclick="viewTimesheets(${contract.id})">View Timesheets</button>
    </div>
  `).join('');
}

function viewProjectDetails(contractId) {
  const contract = DB.getContracts().find(c => c.id === contractId);
  const statusUpdates = DB.getStatusUpdates().filter(u => u.contractId === contractId);
  
  const container = document.getElementById('projects-tab');
  container.innerHTML = `
    <button onclick="loadMyProjects()">← Back to Projects</button>
    
    <div class="card">
      <h2>${contract.jobTitle}</h2>
      <span class="status-badge status-${contract.status}">${contract.status}</span>
      <p><strong>Client:</strong> ${contract.clientName}</p>
      <div class="rate">Your Rate: R${contract.freelancerRate}/hour</div>
      <p><strong>Timeline:</strong> ${contract.timeline}</p>
      <p><strong>Hours Worked:</strong> ${contract.hoursWorked || 0} hours</p>
      <div class="currency">Earned: R${((contract.hoursWorked || 0) * contract.freelancerRate).toFixed(2)}</div>
    </div>
    
    ${contract.tasks && contract.tasks.length > 0 ? `
      <div class="card">
        <h3>Assigned Tasks</h3>
        <ul style="margin-left: 1.5rem;">
          ${contract.tasks.map(task => `<li>${task}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${contract.milestones && contract.milestones.length > 0 ? `
      <div class="card">
        <h3>Project Milestones</h3>
        <ul style="margin-left: 1.5rem;">
          ${contract.milestones.map(milestone => `<li>${milestone}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${contract.instructions ? `
      <div class="card" style="background: #fff3cd;">
        <h3>Special Instructions</h3>
        <p>${contract.instructions}</p>
      </div>
    ` : ''}
    
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
        <div class="form-group">
          <label>Evidence/Proof of Work (URL or Description)</label>
          <textarea name="evidence" rows="3" placeholder="e.g., GitHub commit link, screenshot URL, deployed URL, or description of completed work"></textarea>
        </div>
        <div class="form-group">
          <label>Hours Worked on This Update</label>
          <input type="number" name="hoursWorked" step="0.5" min="0" placeholder="4">
        </div>
        <button type="submit">Post Update</button>
      </form>
    </div>
    
    <div class="card">
      <h3>Project Status History</h3>
      ${statusUpdates.length === 0 ? '<p>No status updates yet.</p>' : 
        statusUpdates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(update => `
          <div class="card" style="background: #f8f9fa; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <div>
                <strong>${update.postedBy}</strong>
                <span class="status-badge status-${update.projectStatus === 'on-track' ? 'active' : update.projectStatus === 'ahead' ? 'completed' : 'pending'}">${update.projectStatus}</span>
              </div>
              <div class="job-meta">${new Date(update.createdAt).toLocaleString()}</div>
            </div>
            <p><strong>Progress:</strong> ${update.progress}%</p>
            <div style="background: #e0e0e0; height: 10px; border-radius: 5px; margin: 0.5rem 0;">
              <div style="background: #27ae60; height: 100%; width: ${update.progress}%; border-radius: 5px;"></div>
            </div>
            <p style="margin-top: 0.5rem;"><strong>Update:</strong> ${update.comment}</p>
            ${update.evidence ? `
              <div style="background: #e3f2fd; padding: 0.75rem; border-radius: 6px; margin-top: 0.5rem;">
                <strong>Evidence:</strong><br>
                ${update.evidence.startsWith('http') ? 
                  `<a href="${update.evidence}" target="_blank" style="color: #2563eb;">${update.evidence}</a>` : 
                  update.evidence
                }
              </div>
            ` : ''}
            ${update.hoursWorked ? `<p style="margin-top: 0.5rem;"><strong>Hours:</strong> ${update.hoursWorked} hours</p>` : ''}
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
  
  const hoursWorked = parseFloat(formData.get('hoursWorked')) || 0;
  
  // Update contract hours
  if (hoursWorked > 0) {
    const contracts = DB.getContracts();
    contract.hoursWorked = (contract.hoursWorked || 0) + hoursWorked;
    DB.saveContracts(contracts);
  }
  
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
    evidence: formData.get('evidence'),
    hoursWorked: hoursWorked,
    createdAt: new Date().toISOString()
  };
  
  statusUpdates.push(newUpdate);
  DB.saveStatusUpdates(statusUpdates);
  
  // Send notifications
  const evidenceText = newUpdate.evidence ? `\n\nEvidence: ${newUpdate.evidence}` : '';
  sendEmailNotification(
    contract.clientEmail, 
    'Project Status Update', 
    `${currentUser.name} posted an update on "${contract.jobTitle}":\n\nStatus: ${formData.get('projectStatus')}\nProgress: ${formData.get('progress')}%\nComment: ${formData.get('comment')}${evidenceText}`
  );
  sendEmailNotification(
    ADMIN_EMAIL, 
    'Project Status Update', 
    `${currentUser.name} updated "${contract.jobTitle}" - Status: ${formData.get('projectStatus')}, Progress: ${formData.get('progress')}%${evidenceText}`
  );
  
  showAlert('Status update posted successfully!');
  viewProjectDetails(contractId);
}

// TIMESHEET FUNCTIONS
function viewTimesheets(contractId) {
  const contract = DB.getContracts().find(c => c.id === contractId);
  const timesheets = DB.getTimesheets().filter(t => t.contractId === contractId);
  
  // Group timesheets by week
  const weeklyTimesheets = {};
  timesheets.forEach(ts => {
    const weekKey = ts.weekStartDate;
    if (!weeklyTimesheets[weekKey]) {
      weeklyTimesheets[weekKey] = [];
    }
    weeklyTimesheets[weekKey].push(ts);
  });
  
  const container = currentUser.role === 'freelancer' ? document.getElementById('projects-tab') : 
                    currentUser.role === 'client' ? document.getElementById('active-projects-tab') :
                    document.getElementById('projects-tab');
  
  container.innerHTML = `
    <button onclick="${currentUser.role === 'freelancer' ? 'loadMyProjects()' : currentUser.role === 'client' ? 'loadClientActiveProjects()' : 'loadAdminProjects()'}">← Back to Projects</button>
    
    <div class="card">
      <h2>Timesheets - ${contract.jobTitle}</h2>
      <p><strong>Freelancer:</strong> ${contract.freelancerName}</p>
      <p><strong>Client:</strong> ${contract.clientName}</p>
      <div class="rate">Rate: R${contract.freelancerRate}/hour</div>
      <p><strong>Total Hours Logged:</strong> ${contract.hoursWorked || 0} hours</p>
    </div>
    
    ${currentUser.role === 'freelancer' ? `
      <div class="card">
        <h3>Log Time Entry</h3>
        <form onsubmit="submitTimeEntry(event, ${contractId})">
          <div class="form-group">
            <label>Date</label>
            <input type="date" name="date" required max="${new Date().toISOString().split('T')[0]}">
          </div>
          <div class="form-group">
            <label>Start Time</label>
            <input type="time" name="startTime" required>
          </div>
          <div class="form-group">
            <label>End Time</label>
            <input type="time" name="endTime" required>
          </div>
          <div class="form-group">
            <label>Description of Work</label>
            <textarea name="description" required placeholder="Describe what you worked on..."></textarea>
          </div>
          <button type="submit">Log Time</button>
        </form>
      </div>
    ` : ''}
    
    <div class="card">
      <h3>Weekly Timesheets</h3>
      ${Object.keys(weeklyTimesheets).length === 0 ? '<p>No time entries yet.</p>' : 
        Object.keys(weeklyTimesheets).sort().reverse().map(weekStart => {
          const entries = weeklyTimesheets[weekStart];
          const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
          const weekStatus = entries[0].status;
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          
          return `
            <div class="card" style="background: #f8f9fa; margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4>Week of ${new Date(weekStart).toLocaleDateString()} - ${weekEnd.toLocaleDateString()}</h4>
                <span class="status-badge status-${weekStatus}">${weekStatus}</span>
              </div>
              <p><strong>Total Hours:</strong> ${totalHours.toFixed(2)} hours</p>
              <p><strong>Amount:</strong> R${(totalHours * contract.freelancerRate).toFixed(2)}</p>
              
              <table style="width: 100%; margin-top: 1rem;">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Hours</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  ${entries.sort((a, b) => new Date(a.date) - new Date(b.date)).map(entry => `
                    <tr>
                      <td>${new Date(entry.date).toLocaleDateString()}</td>
                      <td>${entry.startTime} - ${entry.endTime}</td>
                      <td>${entry.hours.toFixed(2)}</td>
                      <td>${entry.description}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              ${weekStatus === 'pending' && currentUser.role === 'freelancer' ? `
                <button onclick="submitWeekForApproval('${weekStart}', ${contractId})" style="margin-top: 1rem;">Submit Week for Approval</button>
              ` : ''}
              
              ${weekStatus === 'submitted' && currentUser.role === 'client' ? `
                <div style="margin-top: 1rem;">
                  <button onclick="approveTimesheet('${weekStart}', ${contractId})">Approve</button>
                  <button class="secondary" onclick="queryTimesheet('${weekStart}', ${contractId})">Query</button>
                </div>
              ` : ''}
              
              ${weekStatus === 'queried' ? `
                <div style="background: #fff3cd; padding: 1rem; border-radius: 6px; margin-top: 1rem;">
                  <strong>Query:</strong> ${entries[0].queryReason || 'Client has queried this timesheet'}
                  ${currentUser.role === 'freelancer' ? `
                    <button onclick="resubmitTimesheet('${weekStart}', ${contractId})" style="margin-top: 0.5rem;">Resubmit for Approval</button>
                  ` : ''}
                </div>
              ` : ''}
              
              ${weekStatus === 'approved' ? `
                <div style="background: #d4edda; padding: 1rem; border-radius: 6px; margin-top: 1rem;">
                  ✓ Approved by ${entries[0].approvedBy} on ${new Date(entries[0].approvedAt).toLocaleString()}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')
      }
    </div>
  `;
}

function submitTimeEntry(event, contractId) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const date = formData.get('date');
  const startTime = formData.get('startTime');
  const endTime = formData.get('endTime');
  
  // Calculate hours
  const start = new Date(`${date}T${startTime}`);
  const end = new Date(`${date}T${endTime}`);
  const hours = (end - start) / (1000 * 60 * 60);
  
  if (hours <= 0) {
    showAlert('End time must be after start time', 'error');
    return;
  }
  
  // Get week start date (Monday)
  const entryDate = new Date(date);
  const dayOfWeek = entryDate.getDay();
  const diff = entryDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const weekStart = new Date(entryDate.setDate(diff));
  const weekStartDate = weekStart.toISOString().split('T')[0];
  
  const contract = DB.getContracts().find(c => c.id === contractId);
  const timesheets = DB.getTimesheets();
  
  const newEntry = {
    id: Date.now(),
    contractId,
    freelancerId: currentUser.id,
    freelancerName: currentUser.name,
    clientId: contract.clientId,
    clientName: contract.clientName,
    jobTitle: contract.jobTitle,
    date,
    startTime,
    endTime,
    hours,
    description: formData.get('description'),
    weekStartDate,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  timesheets.push(newEntry);
  DB.saveTimesheets(timesheets);
  
  showAlert('Time entry logged successfully!');
  viewTimesheets(contractId);
}

function submitWeekForApproval(weekStartDate, contractId) {
  const timesheets = DB.getTimesheets();
  const weekEntries = timesheets.filter(t => t.contractId === contractId && t.weekStartDate === weekStartDate);
  
  weekEntries.forEach(entry => {
    entry.status = 'submitted';
    entry.submittedAt = new Date().toISOString();
  });
  
  DB.saveTimesheets(timesheets);
  
  const contract = DB.getContracts().find(c => c.id === contractId);
  const totalHours = weekEntries.reduce((sum, e) => sum + e.hours, 0);
  
  sendEmailNotification(
    contract.clientEmail,
    'Timesheet Submitted for Approval',
    `${currentUser.name} has submitted a timesheet for week of ${new Date(weekStartDate).toLocaleDateString()}.\n\nTotal Hours: ${totalHours.toFixed(2)}\nAmount: R${(totalHours * contract.freelancerRate).toFixed(2)}\n\nPlease review and approve in your Active Projects tab.`
  );
  
  showAlert('Timesheet submitted for client approval!');
  viewTimesheets(contractId);
}

function approveTimesheet(weekStartDate, contractId) {
  const timesheets = DB.getTimesheets();
  const weekEntries = timesheets.filter(t => t.contractId === contractId && t.weekStartDate === weekStartDate);
  
  const totalHours = weekEntries.reduce((sum, e) => sum + e.hours, 0);
  
  weekEntries.forEach(entry => {
    entry.status = 'approved';
    entry.approvedBy = currentUser.name;
    entry.approvedAt = new Date().toISOString();
  });
  
  DB.saveTimesheets(timesheets);
  
  // Update contract hours
  const contracts = DB.getContracts();
  const contract = contracts.find(c => c.id === contractId);
  contract.hoursWorked = (contract.hoursWorked || 0) + totalHours;
  DB.saveContracts(contracts);
  
  sendEmailNotification(
    contract.freelancerEmail,
    'Timesheet Approved',
    `Your timesheet for week of ${new Date(weekStartDate).toLocaleDateString()} has been approved by ${currentUser.name}.\n\nTotal Hours: ${totalHours.toFixed(2)}\nAmount: R${(totalHours * contract.freelancerRate).toFixed(2)}`
  );
  
  sendEmailNotification(
    ADMIN_EMAIL,
    'Timesheet Approved',
    `${currentUser.name} approved timesheet for ${contract.freelancerName} on "${contract.jobTitle}".\n\nWeek: ${new Date(weekStartDate).toLocaleDateString()}\nHours: ${totalHours.toFixed(2)}`
  );
  
  showAlert('Timesheet approved!');
  viewTimesheets(contractId);
}

function queryTimesheet(weekStartDate, contractId) {
  const reason = prompt('Please provide a reason for querying this timesheet:');
  if (!reason) return;
  
  const timesheets = DB.getTimesheets();
  const weekEntries = timesheets.filter(t => t.contractId === contractId && t.weekStartDate === weekStartDate);
  
  weekEntries.forEach(entry => {
    entry.status = 'queried';
    entry.queryReason = reason;
    entry.queriedBy = currentUser.name;
    entry.queriedAt = new Date().toISOString();
  });
  
  DB.saveTimesheets(timesheets);
  
  const contract = DB.getContracts().find(c => c.id === contractId);
  
  sendEmailNotification(
    contract.freelancerEmail,
    'Timesheet Queried',
    `${currentUser.name} has queried your timesheet for week of ${new Date(weekStartDate).toLocaleDateString()}.\n\nReason: ${reason}\n\nPlease review and resubmit.`
  );
  
  showAlert('Timesheet queried. Freelancer has been notified.');
  viewTimesheets(contractId);
}

function resubmitTimesheet(weekStartDate, contractId) {
  const timesheets = DB.getTimesheets();
  const weekEntries = timesheets.filter(t => t.contractId === contractId && t.weekStartDate === weekStartDate);
  
  weekEntries.forEach(entry => {
    entry.status = 'submitted';
    entry.resubmittedAt = new Date().toISOString();
  });
  
  DB.saveTimesheets(timesheets);
  
  const contract = DB.getContracts().find(c => c.id === contractId);
  
  sendEmailNotification(
    contract.clientEmail,
    'Timesheet Resubmitted',
    `${currentUser.name} has resubmitted the timesheet for week of ${new Date(weekStartDate).toLocaleDateString()} after addressing your query.\n\nPlease review again.`
  );
  
  showAlert('Timesheet resubmitted for approval!');
  viewTimesheets(contractId);
}

function loadMyContracts() {
  const contracts = DB.getContracts().filter(c => c.freelancerId === currentUser.id);
  const container = document.getElementById('contracts-tab');
  
  if (contracts.length === 0) {
    container.innerHTML = '<div class="card"><p>No active contracts.</p></div>';
    return;
  }
  
  container.innerHTML = `
    <div class="card" style="background: #e3f2fd; margin-bottom: 1.5rem;">
      <h3>📋 Contracts Overview</h3>
      <p>This tab shows all your contracts (active, completed, and cancelled). To post status updates and manage active work, use the <strong>Projects</strong> tab.</p>
    </div>
    
    ${contracts.map(contract => `
      <div class="card">
        <h3 class="job-title">${contract.jobTitle}</h3>
        <span class="status-badge status-${contract.status}">${contract.status}</span>
        <p><strong>Client:</strong> ${contract.clientName}</p>
        <div class="rate">Your Rate: R${contract.freelancerRate}/hour</div>
        <p><strong>Timeline:</strong> ${contract.timeline}</p>
        <p><strong>Hours Worked:</strong> ${contract.hoursWorked || 0} hours</p>
        <div class="currency">Total Earned: R${((contract.hoursWorked || 0) * contract.freelancerRate).toFixed(2)}</div>
        <p><strong>Started:</strong> ${new Date(contract.createdAt).toLocaleDateString()}</p>
        ${contract.completedAt ? `<p><strong>Completed:</strong> ${new Date(contract.completedAt).toLocaleDateString()}</p>` : ''}
        ${contract.paymentProcessed ? '<p style="color: #27ae60;"><strong>✓ Payment Processed</strong></p>' : ''}
        
        ${contract.status === 'active' ? `
          <p style="margin-top: 1rem; padding: 0.75rem; background: #fff3cd; border-radius: 6px;">
            💡 <strong>Tip:</strong> Go to the <strong>Projects</strong> tab to post updates and manage this active project.
          </p>
        ` : ''}
      </div>
    `).join('')}
  `;
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

// Duplicate function removed - using the correct one with evidence and hours tracking

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
      <button class="tab" onclick="showClientTab('active-projects')">Active Projects</button>
      <button class="tab" onclick="showClientTab('browse-freelancers')">Browse Freelancers</button>
    </div>
    
    <div id="post-job-tab"></div>
    <div id="my-jobs-tab" class="hidden"></div>
    <div id="active-projects-tab" class="hidden"></div>
    <div id="browse-freelancers-tab" class="hidden"></div>
  `;
  
  loadPostJobForm();
}

function showClientTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  ['post-job', 'my-jobs', 'active-projects', 'browse-freelancers'].forEach(t => {
    document.getElementById(`${t}-tab`).classList.add('hidden');
  });
  
  document.getElementById(`${tab}-tab`).classList.remove('hidden');
  
  if (tab === 'post-job') loadPostJobForm();
  else if (tab === 'my-jobs') loadClientJobs();
  else if (tab === 'active-projects') loadClientActiveProjects();
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

function loadClientActiveProjects() {
  const allContracts = DB.getContracts();
  // Match by clientId OR by client name (fallback for data inconsistency)
  const contracts = allContracts.filter(c => 
    (c.clientId === currentUser.id || c.clientName === currentUser.name) && 
    c.status === 'active'
  );
  const container = document.getElementById('active-projects-tab');
  
  if (contracts.length === 0) {
    container.innerHTML = '<div class="card"><p>No active projects.</p></div>';
    return;
  }
  
  container.innerHTML = contracts.map(contract => `
    <div class="card">
      <h3 class="job-title">${contract.jobTitle}</h3>
      <span class="status-badge status-active">Active</span>
      <p><strong>Freelancer:</strong> ${contract.freelancerName}</p>
      <div class="rate">Rate: R${contract.clientRate}/hour</div>
      <p><strong>Timeline:</strong> ${contract.timeline}</p>
      <p><strong>Hours Worked:</strong> ${contract.hoursWorked || 0} hours</p>
      <div class="currency">Total Cost: R${((contract.hoursWorked || 0) * contract.clientRate).toFixed(2)}</div>
      
      <button onclick="viewClientProjectDetails(${contract.id})">View Project Status</button>
      <button class="secondary" onclick="viewTimesheets(${contract.id})">View Timesheets</button>
    </div>
  `).join('');
}

function viewClientProjectDetails(contractId) {
  const contract = DB.getContracts().find(c => c.id === contractId);
  const statusUpdates = DB.getStatusUpdates().filter(u => u.contractId === contractId);
  
  const container = document.getElementById('active-projects-tab');
  container.innerHTML = `
    <button onclick="loadClientActiveProjects()">← Back to Active Projects</button>
    
    <div class="card">
      <h2>${contract.jobTitle}</h2>
      <span class="status-badge status-${contract.status}">${contract.status}</span>
      <p><strong>Freelancer:</strong> ${contract.freelancerName}</p>
      <div class="rate">Your Rate: R${contract.clientRate}/hour</div>
      <p><strong>Timeline:</strong> ${contract.timeline}</p>
      <p><strong>Hours Worked:</strong> ${contract.hoursWorked || 0} hours</p>
      <div class="currency">Total Cost So Far: R${((contract.hoursWorked || 0) * contract.clientRate).toFixed(2)}</div>
    </div>
    
    ${contract.tasks && contract.tasks.length > 0 ? `
      <div class="card">
        <h3>Assigned Tasks</h3>
        <ul style="margin-left: 1.5rem;">
          ${contract.tasks.map(task => `<li>${task}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${contract.milestones && contract.milestones.length > 0 ? `
      <div class="card">
        <h3>Project Milestones</h3>
        <ul style="margin-left: 1.5rem;">
          ${contract.milestones.map(milestone => `<li>${milestone}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    <div class="card">
      <h3>Project Status Updates</h3>
      ${statusUpdates.length === 0 ? '<p>No status updates yet. Waiting for freelancer to post updates.</p>' : 
        statusUpdates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(update => `
          <div class="card" style="background: #f8f9fa; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <div>
                <strong>${update.postedBy}</strong>
                <span class="status-badge status-${update.projectStatus === 'on-track' ? 'active' : update.projectStatus === 'ahead' ? 'completed' : update.projectStatus === 'delayed' ? 'pending' : 'cancelled'}">${update.projectStatus}</span>
              </div>
              <div class="job-meta">${new Date(update.createdAt).toLocaleString()}</div>
            </div>
            
            <p><strong>Progress:</strong> ${update.progress}%</p>
            <div style="background: #e0e0e0; height: 10px; border-radius: 5px; margin: 0.5rem 0;">
              <div style="background: ${update.projectStatus === 'on-track' || update.projectStatus === 'ahead' ? '#27ae60' : update.projectStatus === 'delayed' ? '#f39c12' : '#e74c3c'}; height: 100%; width: ${update.progress}%; border-radius: 5px;"></div>
            </div>
            
            <p style="margin-top: 0.5rem;"><strong>Update:</strong> ${update.comment}</p>
            
            ${update.evidence ? `
              <div style="background: #e3f2fd; padding: 0.75rem; border-radius: 6px; margin-top: 0.5rem;">
                <strong>📎 Evidence/Proof of Work:</strong><br>
                ${update.evidence.startsWith('http') ? 
                  `<a href="${update.evidence}" target="_blank" style="color: #2563eb; word-break: break-all;">${update.evidence}</a>` : 
                  update.evidence
                }
              </div>
            ` : ''}
            
            ${update.hoursWorked ? `
              <p style="margin-top: 0.5rem;"><strong>Hours Logged:</strong> ${update.hoursWorked} hours</p>
            ` : ''}
          </div>
        `).join('')
      }
    </div>
    
    <div class="card" style="background: #fff3cd;">
      <h3>💬 Need Support?</h3>
      <p>For any questions or concerns about the project, please contact our admin team:</p>
      <p><strong>Admin Support:</strong> ${ADMIN_EMAIL}</p>
      <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">Our admin will facilitate communication between you and the freelancer to ensure smooth project delivery.</p>
    </div>
  `;
}

function loadFreelancersList() {
  const freelancers = DB.getFreelancers();
  const container = document.getElementById('browse-freelancers-tab');
  
  if (freelancers.length === 0) {
    container.innerHTML = '<div class="card"><p>No freelancers available.</p></div>';
    return;
  }
  
  container.innerHTML = `
    <div class="card" style="background: #fff3cd; margin-bottom: 1.5rem;">
      <h3>ℹ️ How to Hire</h3>
      <p>Browse available freelancers and post a job. Once you post a job, freelancers will apply, and our admin will review and connect you with the best match.</p>
      <p><strong>Note:</strong> Contact details are shared only after admin approval to ensure quality and prevent spam.</p>
    </div>
    
    ${freelancers.map(freelancer => `
      <div class="freelancer-card card">
        <h3 class="job-title">${freelancer.name}</h3>
        ${freelancer.available ? '<span class="status-badge status-active">Available</span>' : '<span class="status-badge status-pending">Busy</span>'}
        <p><strong>Education:</strong> ${freelancer.education}</p>
        <p><strong>Skills:</strong> ${freelancer.skills.split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}</p>
        <div class="rate">Rate: R${freelancer.hourlyRate}/hour</div>
        <p>${freelancer.bio}</p>
        <div class="job-meta" style="color: #7f8c8d; font-style: italic;">Contact details available after admin approval</div>
      </div>
    `).join('')}
  `;
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
      <button class="tab" onclick="showAdminTab('profile-updates')">Profile Updates</button>
      <button class="tab" onclick="showAdminTab('earnings')">Platform Earnings</button>
    </div>
    
    <div id="overview-tab"></div>
    <div id="projects-tab" class="hidden"></div>
    <div id="freelancers-tab" class="hidden"></div>
    <div id="clients-tab" class="hidden"></div>
    <div id="applications-tab" class="hidden"></div>
    <div id="profile-updates-tab" class="hidden"></div>
    <div id="earnings-tab" class="hidden"></div>
  `;
  
  loadAdminOverview();
}

function showAdminTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  ['overview', 'projects', 'freelancers', 'clients', 'applications', 'profile-updates', 'earnings'].forEach(t => {
    document.getElementById(`${t}-tab`).classList.add('hidden');
  });
  
  document.getElementById(`${tab}-tab`).classList.remove('hidden');
  
  if (tab === 'overview') loadAdminOverview();
  else if (tab === 'projects') loadAdminProjects();
  else if (tab === 'freelancers') loadAdminFreelancers();
  else if (tab === 'clients') loadAdminClients();
  else if (tab === 'applications') loadAdminApplications();
  else if (tab === 'profile-updates') loadAdminProfileUpdates();
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
                <button class="secondary" onclick="viewTimesheets(${c.id})" style="margin-bottom: 0.5rem;">View Timesheets</button>
                ${c.status === 'completed' ? (
                  c.paymentProcessed ? 
                    `<span class="status-badge status-completed">Payment Processed</span>` :
                    `<button onclick="processPayment(${c.id})">Process Payment</button>`
                ) : ''}
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
            <th>Actions</th>
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
                <td>
                  <button onclick="viewClientDetails(${c.id})">View/Edit</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function viewClientDetails(clientId) {
  const clients = DB.getClients();
  const client = clients.find(c => c.id === clientId);
  const jobs = DB.getJobs().filter(j => j.clientId === clientId);
  const contracts = DB.getContracts().filter(c => c.clientId === clientId);
  const comments = DB.getClientComments().filter(c => c.clientId === clientId);
  
  const container = document.getElementById('clients-tab');
  container.innerHTML = `
    <button onclick="loadAdminClients()">← Back to Clients</button>
    
    <div class="card">
      <h2>Client Details</h2>
      <form onsubmit="updateClientInfo(event, ${clientId})">
        <div class="grid-2">
          <div class="form-group">
            <label>Company/Name</label>
            <input type="text" name="name" value="${client.name}" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" value="${client.email}" required>
          </div>
        </div>
        
        <div class="grid-2">
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" name="phone" value="${client.phone}" required>
          </div>
          <div class="form-group">
            <label>Company Type</label>
            <select name="companyType" required>
              <option value="individual" ${client.companyType === 'individual' ? 'selected' : ''}>Individual</option>
              <option value="small" ${client.companyType === 'small' ? 'selected' : ''}>Small Business</option>
              <option value="medium" ${client.companyType === 'medium' ? 'selected' : ''}>Medium Enterprise</option>
              <option value="large" ${client.companyType === 'large' ? 'selected' : ''}>Large Corporation</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label>Description</label>
          <textarea name="description">${client.description || ''}</textarea>
        </div>
        
        <button type="submit">Update Client Information</button>
      </form>
    </div>
    
    <div class="card">
      <h3>Client Activity</h3>
      <p><strong>Jobs Posted:</strong> ${jobs.length}</p>
      <p><strong>Active Contracts:</strong> ${contracts.filter(c => c.status === 'active').length}</p>
      <p><strong>Completed Projects:</strong> ${contracts.filter(c => c.status === 'completed').length}</p>
      <p><strong>Member Since:</strong> ${new Date(client.createdAt).toLocaleDateString()}</p>
    </div>
    
    <div class="card">
      <h3>Admin Comments</h3>
      <form onsubmit="addClientComment(event, ${clientId})">
        <div class="form-group">
          <label>Add Comment</label>
          <textarea name="comment" required placeholder="Add notes about this client..."></textarea>
        </div>
        <button type="submit">Add Comment</button>
      </form>
      
      <div style="margin-top: 1.5rem;">
        ${comments.length === 0 ? '<p>No comments yet.</p>' : 
          comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(comment => `
            <div class="card" style="background: #f8f9fa; margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <strong>Admin</strong>
                <span class="job-meta">${new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <p>${comment.comment}</p>
              <button class="danger" style="margin-top: 0.5rem;" onclick="deleteClientComment(${comment.id}, ${clientId})">Delete</button>
            </div>
          `).join('')
        }
      </div>
    </div>
  `;
}

function updateClientInfo(event, clientId) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const clients = DB.getClients();
  const client = clients.find(c => c.id === clientId);
  
  client.name = formData.get('name');
  client.email = formData.get('email');
  client.phone = formData.get('phone');
  client.companyType = formData.get('companyType');
  client.description = formData.get('description');
  client.lastUpdated = new Date().toISOString();
  
  DB.saveClients(clients);
  
  sendEmailNotification(client.email, 'Profile Updated', 'Your TechLink profile has been updated by admin.');
  
  showAlert('Client information updated successfully!');
  viewClientDetails(clientId);
}

function addClientComment(event, clientId) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const comments = DB.getClientComments();
  const newComment = {
    id: Date.now(),
    clientId,
    comment: formData.get('comment'),
    createdAt: new Date().toISOString()
  };
  
  comments.push(newComment);
  DB.saveClientComments(comments);
  
  showAlert('Comment added!');
  viewClientDetails(clientId);
}

function deleteClientComment(commentId, clientId) {
  if (!confirm('Delete this comment?')) return;
  
  const comments = DB.getClientComments();
  const index = comments.findIndex(c => c.id === commentId);
  comments.splice(index, 1);
  DB.saveClientComments(comments);
  
  showAlert('Comment deleted.');
  viewClientDetails(clientId);
}

function showProfilePictureUpload() {
  const modal = document.createElement('div');
  modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';
  modal.innerHTML = `
    <div class="card" style="max-width: 500px; margin: 2rem;">
      <h3>Update Profile Picture</h3>
      <form onsubmit="uploadProfilePicture(event)">
        <div class="form-group">
          <label>Choose Image</label>
          <input type="file" name="profilePicture" accept="image/*" required onchange="previewProfilePicture(event)">
          <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Recommended: Square image, max 2MB</p>
        </div>
        <div id="preview-container" style="text-align: center; margin: 1rem 0;"></div>
        <button type="submit">Upload Picture</button>
        <button type="button" class="secondary" onclick="this.closest('div[style*=fixed]').remove()">Cancel</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

function previewProfilePicture(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Check file size (2MB limit)
  if (file.size > 2 * 1024 * 1024) {
    showAlert('Image too large. Maximum size is 2MB.', 'error');
    event.target.value = '';
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = document.getElementById('preview-container');
    preview.innerHTML = `
      <div style="width: 150px; height: 150px; margin: 0 auto; border-radius: 50%; overflow: hidden; border: 4px solid #667eea;">
        <img src="${e.target.result}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
    `;
  };
  reader.readAsDataURL(file);
}

function uploadProfilePicture(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const file = formData.get('profilePicture');
  
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const freelancers = DB.getFreelancers();
    const freelancer = freelancers.find(f => f.id === currentUser.id);
    
    // Store image as base64 data URL
    freelancer.profilePicture = e.target.result;
    DB.saveFreelancers(freelancers);
    
    // Update current user
    currentUser.profilePicture = e.target.result;
    DB.setCurrentUser(currentUser);
    
    showAlert('Profile picture updated successfully!');
    
    // Close modal and reload profile
    document.querySelector('div[style*="fixed"]').remove();
    loadMyProfile();
  };
  reader.readAsDataURL(file);
}

// Add to DB object
DB.getClientComments = () => JSON.parse(localStorage.getItem('clientComments') || '[]');
DB.saveClientComments = (data) => localStorage.setItem('clientComments', JSON.stringify(data));

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
        
        ${app.portfolio ? `
          <div style="background: #e3f2fd; padding: 1rem; border-radius: 6px; margin-top: 1rem;">
            <strong>📄 Portfolio/Resume:</strong><br>
            ${app.portfolio.name} (${(app.portfolio.size / 1024).toFixed(1)} KB)
          </div>
        ` : ''}
        
        ${app.documents && app.documents.length > 0 ? `
          <div style="background: #e8f5e9; padding: 1rem; border-radius: 6px; margin-top: 1rem;">
            <strong>📎 Additional Documents:</strong><br>
            ${app.documents.map(doc => `${doc.name} (${(doc.size / 1024).toFixed(1)} KB)`).join('<br>')}
          </div>
        ` : ''}
        
        ${app.portfolioLinks && app.portfolioLinks.length > 0 ? `
          <div style="background: #fff3cd; padding: 1rem; border-radius: 6px; margin-top: 1rem;">
            <strong>🔗 Portfolio Links:</strong><br>
            ${app.portfolioLinks.map(link => `<a href="${link}" target="_blank" style="color: #2563eb; display: block;">${link}</a>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
    
    <div class="card">
      <h3>Requirements Check</h3>
      <form onsubmit="return checkRequirements(event, ${applicationId}, ${jobId})" id="approval-form">
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
        
        <button type="submit">Approve & Send Offer</button>
        <button type="button" class="danger" onclick="rejectApplication(${applicationId})">Reject Application</button>
      </form>
    </div>
  `;
}

function checkRequirements(event, applicationId, jobId) {
  event.preventDefault();
  console.log('checkRequirements called', applicationId, jobId);
  
  try {
    const formData = new FormData(event.target);
    
    const applications = DB.getApplications();
    const app = applications.find(a => a.id === applicationId);
    
    if (!app) {
      showAlert('Application not found', 'error');
      return;
    }
    
    const jobs = DB.getJobs();
    const job = jobs.find(j => j.id === jobId);
    
    if (!job) {
      showAlert('Job not found', 'error');
      return;
    }
    
    const freelancers = DB.getFreelancers();
    const freelancer = freelancers.find(f => f.id === app.freelancerId);
    
    if (!freelancer) {
      showAlert('Freelancer not found', 'error');
      return;
    }
    
    if (!freelancer.available) {
      showAlert('Freelancer is not available for new projects', 'error');
      return;
    }
  
    // Parse tasks and milestones
    const tasks = formData.get('tasks').split('\n').filter(t => t.trim());
    const milestones = formData.get('milestones').split('\n').filter(m => m.trim());
    const instructions = formData.get('instructions');
    
    console.log('Tasks:', tasks);
    console.log('Milestones:', milestones);
    
    // Create offer with task allocation (not contract yet)
    const offers = DB.getOffers();
    const clients = DB.getClients();
    let client = clients.find(c => c.id === job.clientId);
    
    // If client not found, create a placeholder (this shouldn't happen in production)
    if (!client) {
      console.warn('Client not found in database, using job data as fallback');
      client = {
        id: job.clientId,
        name: job.clientName,
        email: 'client@example.com', // Fallback email
      };
    }
    
    const taskList = tasks.map((t, i) => `${i + 1}. ${t}`).join('\n');
    const milestoneList = milestones.map((m, i) => `${i + 1}. ${m}`).join('\n');
    
    // Calculate rates: Freelancer gets their rate, Admin gets 25%, Client pays both
    const freelancerRate = app.freelancerRate;
    const adminCommission = freelancerRate * ADMIN_COMMISSION; // 25% of freelancer rate
    const clientRate = freelancerRate + adminCommission; // Total client pays
    
    const newOffer = {
      id: Date.now(),
      applicationId: app.id,
      jobId: job.id,
      jobTitle: job.title,
      jobDescription: job.description,
      freelancerId: app.freelancerId,
      freelancerName: app.freelancerName,
      freelancerEmail: app.freelancerEmail,
      freelancerRate: freelancerRate,
      clientId: job.clientId,
      clientName: job.clientName,
      clientEmail: client.email,
      clientRate: clientRate,
      adminCommission: adminCommission,
      timeline: job.timeline,
      tasks: tasks,
      milestones: milestones,
      instructions: instructions,
      offeredRate: freelancerRate,
      message: `Congratulations! You've been selected for "${job.title}".\n\nYour Tasks:\n${taskList}\n\nMilestones:\n${milestoneList}\n\nInstructions: ${instructions || 'None'}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    offers.push(newOffer);
    DB.saveOffers(offers);
    console.log('Offer created:', newOffer);
    
    // Update application status to approved
    app.status = 'approved';
    DB.saveApplications(applications);
    
    // Send email notification to freelancer
    sendEmailNotification(
      app.freelancerEmail, 
      'Job Offer - Action Required', 
      `Congratulations! You've been selected for "${job.title}".\n\nPlease review the offer in your Offers tab and accept to proceed.\n\nYour Tasks:\n${taskList}\n\nMilestones:\n${milestoneList}\n\nInstructions: ${instructions || 'None'}`
    );
    
    // Notify client
    sendEmailNotification(
      client.email, 
      'Application Approved', 
      `${app.freelancerName} has been approved for your project "${job.title}". Waiting for freelancer to accept the offer.`
    );
    
    showAlert('Offer sent to freelancer! They will see it in their Offers tab.');
    loadAdminApplications();
    
  } catch (error) {
    console.error('Error in checkRequirements:', error);
    showAlert('Error creating contract: ' + error.message, 'error');
  }
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
    clientRate: job.rate,
    adminCommission: job.rate * ADMIN_COMMISSION,
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

function loadAdminProfileUpdates() {
  const profileUpdates = DB.getProfileUpdates() || [];
  const pendingUpdates = profileUpdates.filter(u => u.status === 'pending');
  const container = document.getElementById('profile-updates-tab');
  
  container.innerHTML = `
    <div class="card">
      <h3>Profile Update Requests</h3>
      <p>Freelancers can update their profiles once per month. Review and approve/reject changes below.</p>
      
      ${pendingUpdates.length === 0 ? '<p style="margin-top: 1rem;">No pending profile updates.</p>' : ''}
      
      <table style="margin-top: 1rem;">
        <thead>
          <tr>
            <th>Freelancer</th>
            <th>Requested</th>
            <th>Reason</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${pendingUpdates.map(update => `
            <tr>
              <td>${update.freelancerName}</td>
              <td>${new Date(update.createdAt).toLocaleDateString()}</td>
              <td>${update.updateReason}</td>
              <td>
                <button onclick="reviewProfileUpdate(${update.id})">Review</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="card">
      <h3>Update History</h3>
      <table>
        <thead>
          <tr>
            <th>Freelancer</th>
            <th>Requested</th>
            <th>Status</th>
            <th>Processed</th>
          </tr>
        </thead>
        <tbody>
          ${profileUpdates.filter(u => u.status !== 'pending').sort((a, b) => new Date(b.processedAt) - new Date(a.processedAt)).map(update => `
            <tr>
              <td>${update.freelancerName}</td>
              <td>${new Date(update.createdAt).toLocaleDateString()}</td>
              <td><span class="status-badge status-${update.status === 'approved' ? 'completed' : 'cancelled'}">${update.status}</span></td>
              <td>${update.processedAt ? new Date(update.processedAt).toLocaleDateString() : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function reviewProfileUpdate(updateId) {
  const profileUpdates = DB.getProfileUpdates();
  const update = profileUpdates.find(u => u.id === updateId);
  const freelancers = DB.getFreelancers();
  const freelancer = freelancers.find(f => f.id === update.freelancerId);
  
  const container = document.getElementById('profile-updates-tab');
  container.innerHTML = `
    <button onclick="loadAdminProfileUpdates()">← Back to Profile Updates</button>
    
    <div class="card">
      <h2>Review Profile Update Request</h2>
      <p><strong>Freelancer:</strong> ${update.freelancerName}</p>
      <p><strong>Requested:</strong> ${new Date(update.createdAt).toLocaleDateString()}</p>
      <p><strong>Reason:</strong> ${update.updateReason}</p>
    </div>
    
    <div class="grid-2">
      <div class="card">
        <h3>Current Profile</h3>
        <p><strong>Name:</strong> ${freelancer.name}</p>
        <p><strong>Phone:</strong> ${freelancer.phone}</p>
        <p><strong>Education:</strong> ${freelancer.education}</p>
        <p><strong>Skills:</strong> ${freelancer.skills}</p>
        <p><strong>Hourly Rate:</strong> R${freelancer.hourlyRate}</p>
        <p><strong>Bio:</strong> ${freelancer.bio}</p>
      </div>
      
      <div class="card" style="background: #e3f2fd;">
        <h3>Requested Changes</h3>
        <p><strong>Name:</strong> ${update.updates.name}</p>
        <p><strong>Phone:</strong> ${update.updates.phone}</p>
        <p><strong>Education:</strong> ${update.updates.education}</p>
        <p><strong>Skills:</strong> ${update.updates.skills}</p>
        <p><strong>Hourly Rate:</strong> R${update.updates.hourlyRate}</p>
        <p><strong>Bio:</strong> ${update.updates.bio}</p>
      </div>
    </div>
    
    <div class="card">
      <h3>Admin Decision</h3>
      <button onclick="approveProfileUpdate(${updateId})">✓ Approve Changes</button>
      <button class="danger" onclick="rejectProfileUpdate(${updateId})">✗ Reject Changes</button>
    </div>
  `;
}

function approveProfileUpdate(updateId) {
  if (!confirm('Are you sure you want to approve this profile update?')) return;
  
  const profileUpdates = DB.getProfileUpdates();
  const update = profileUpdates.find(u => u.id === updateId);
  
  // Update freelancer profile
  const freelancers = DB.getFreelancers();
  const freelancer = freelancers.find(f => f.id === update.freelancerId);
  
  freelancer.name = update.updates.name;
  freelancer.phone = update.updates.phone;
  freelancer.education = update.updates.education;
  freelancer.skills = update.updates.skills;
  freelancer.hourlyRate = update.updates.hourlyRate;
  freelancer.bio = update.updates.bio;
  freelancer.lastProfileUpdate = new Date().toISOString();
  
  DB.saveFreelancers(freelancers);
  
  // Update request status
  update.status = 'approved';
  update.processedAt = new Date().toISOString();
  DB.saveProfileUpdates(profileUpdates);
  
  sendEmailNotification(update.freelancerEmail, 'Profile Update Approved', 'Your profile update request has been approved and your profile has been updated.');
  
  showAlert('Profile update approved!');
  loadAdminProfileUpdates();
}

function rejectProfileUpdate(updateId) {
  const reason = prompt('Enter reason for rejection (will be sent to freelancer):');
  if (!reason) return;
  
  const profileUpdates = DB.getProfileUpdates();
  const update = profileUpdates.find(u => u.id === updateId);
  
  update.status = 'rejected';
  update.processedAt = new Date().toISOString();
  update.rejectionReason = reason;
  DB.saveProfileUpdates(profileUpdates);
  
  sendEmailNotification(update.freelancerEmail, 'Profile Update Rejected', `Your profile update request has been rejected.\n\nReason: ${reason}\n\nYou can submit a new request next month.`);
  
  showAlert('Profile update rejected.');
  loadAdminProfileUpdates();
}

function loadAdminEarnings() {
  const contracts = DB.getContracts();
  const totalCommission = contracts.reduce((sum, c) => {
    const hours = c.hoursWorked || 0;
    const commission = c.adminCommission || 0;
    return sum + (hours * commission);
  }, 0);
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
            const hours = c.hoursWorked || 0;
            const freelancerRate = c.freelancerRate || 0;
            const clientRate = c.clientRate || 0;
            const adminCommission = c.adminCommission || 0;
            
            const freelancerPaid = hours * freelancerRate;
            const clientCharged = hours * clientRate;
            const commission = hours * adminCommission;
            
            return `
              <tr>
                <td>${c.jobTitle}</td>
                <td>${c.freelancerName}</td>
                <td>${c.clientName}</td>
                <td>${hours}</td>
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

function loadMyProfile() {
  const freelancer = DB.getFreelancers().find(f => f.id === currentUser.id);
  const applications = DB.getApplications().filter(a => a.freelancerId === currentUser.id);
  const container = document.getElementById('profile-tab');
  
  // Get all uploaded files from applications
  const allPortfolios = applications.filter(a => a.portfolio).map(a => ({
    ...a.portfolio,
    jobTitle: DB.getJobs().find(j => j.id === a.jobId)?.title,
    uploadedAt: a.createdAt
  }));
  
  const allDocuments = applications.flatMap(a => 
    (a.documents || []).map(doc => ({
      ...doc,
      jobTitle: DB.getJobs().find(j => j.id === a.jobId)?.title,
      uploadedAt: a.createdAt
    }))
  );
  
  const allLinks = applications.flatMap(a => 
    (a.portfolioLinks || []).map(link => ({
      link,
      jobTitle: DB.getJobs().find(j => j.id === a.jobId)?.title,
      uploadedAt: a.createdAt
    }))
  );
  
  container.innerHTML = `
    <div class="card">
      <h2>My Profile</h2>
      
      <div style="text-align: center; margin: 1.5rem 0;">
        <div style="width: 150px; height: 150px; margin: 0 auto; border-radius: 50%; overflow: hidden; border: 4px solid #667eea; background: #f0f0f0;">
          ${freelancer.profilePicture ? 
            `<img src="${freelancer.profilePicture}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">` :
            `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem; color: #667eea;">${freelancer.name.charAt(0).toUpperCase()}</div>`
          }
        </div>
        <button onclick="showProfilePictureUpload()" style="margin-top: 1rem;">Change Profile Picture</button>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1.5rem;">
        <div>
          <h3 style="margin-bottom: 1rem; color: #667eea;">Personal Information</h3>
          <p><strong>Name:</strong> ${freelancer.name}</p>
          <p><strong>Email:</strong> ${freelancer.email}</p>
          <p><strong>Phone:</strong> ${freelancer.phone}</p>
          <p><strong>Member Since:</strong> ${new Date(freelancer.createdAt).toLocaleDateString()}</p>
          <p style="margin-top: 1rem;"><strong>Availability:</strong> 
            ${freelancer.available ? '<span class="status-badge status-active">Available</span>' : '<span class="status-badge status-pending">Busy</span>'}
          </p>
        </div>
        
        <div>
          <h3 style="margin-bottom: 1rem; color: #667eea;">Professional Details</h3>
          <p><strong>Education:</strong> ${freelancer.education}</p>
          <p><strong>Hourly Rate:</strong> <span class="rate">R${freelancer.hourlyRate}/hour</span></p>
          <p><strong>Total Earnings:</strong> <span class="currency">R${(freelancer.totalEarnings || 0).toFixed(2)}</span></p>
        </div>
      </div>
      
      <div style="margin-top: 2rem;">
        <h3 style="margin-bottom: 1rem; color: #667eea;">Skills</h3>
        <div>
          ${freelancer.skills.split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}
        </div>
      </div>
      
      <div style="margin-top: 2rem;">
        <h3 style="margin-bottom: 1rem; color: #667eea;">Bio</h3>
        <p style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">${freelancer.bio}</p>
      </div>
    </div>
    
    <div class="card">
      <h3>📄 Uploaded Portfolios & Resumes</h3>
      ${allPortfolios.length === 0 ? '<p>No portfolios uploaded yet.</p>' : 
        allPortfolios.map(portfolio => `
          <div class="card" style="background: #e3f2fd; margin-top: 1rem;">
            <p><strong>File:</strong> ${portfolio.name}</p>
            <p><strong>Size:</strong> ${(portfolio.size / 1024).toFixed(1)} KB</p>
            <p><strong>Applied for:</strong> ${portfolio.jobTitle}</p>
            <p><strong>Uploaded:</strong> ${new Date(portfolio.uploadedAt).toLocaleDateString()}</p>
          </div>
        `).join('')
      }
    </div>
    
    <div class="card">
      <h3>📎 Additional Documents</h3>
      ${allDocuments.length === 0 ? '<p>No additional documents uploaded yet.</p>' : 
        allDocuments.map(doc => `
          <div class="card" style="background: #e8f5e9; margin-top: 1rem;">
            <p><strong>File:</strong> ${doc.name}</p>
            <p><strong>Size:</strong> ${(doc.size / 1024).toFixed(1)} KB</p>
            <p><strong>Applied for:</strong> ${doc.jobTitle}</p>
            <p><strong>Uploaded:</strong> ${new Date(doc.uploadedAt).toLocaleDateString()}</p>
          </div>
        `).join('')
      }
    </div>
    
    <div class="card">
      <h3>🔗 Portfolio Links</h3>
      ${allLinks.length === 0 ? '<p>No portfolio links added yet.</p>' : 
        allLinks.map(item => `
          <div class="card" style="background: #fff3cd; margin-top: 1rem;">
            <p><strong>Link:</strong> <a href="${item.link}" target="_blank" style="color: #2563eb; word-break: break-all;">${item.link}</a></p>
            <p><strong>Applied for:</strong> ${item.jobTitle}</p>
            <p><strong>Added:</strong> ${new Date(item.uploadedAt).toLocaleDateString()}</p>
          </div>
        `).join('')
      }
    </div>
    
    ${canUpdateProfile(freelancer) ? `
      <div class="card">
        <h3>✏️ Update Profile</h3>
        <p style="margin-bottom: 1rem; color: #27ae60;">You can update your profile this month!</p>
        <button onclick="showProfileUpdateForm()">Update My Profile</button>
      </div>
    ` : `
      <div class="card" style="background: #fff3cd;">
        <h3>ℹ️ Profile Updates</h3>
        <p style="margin-bottom: 0.5rem;">Profile updates are allowed once per month.</p>
        <p><strong>Last Updated:</strong> ${freelancer.lastProfileUpdate ? new Date(freelancer.lastProfileUpdate).toLocaleDateString() : 'Never'}</p>
        <p><strong>Next Update Available:</strong> ${getNextUpdateDate(freelancer)}</p>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">For urgent changes, contact admin at: <strong>${ADMIN_EMAIL}</strong></p>
      </div>
    `}
    
    ${getPendingProfileUpdate(freelancer.id) ? `
      <div class="card" style="background: #e3f2fd;">
        <h3>⏳ Pending Profile Update</h3>
        <p>Your profile update request is pending admin approval.</p>
        <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">You will be notified once the admin reviews your changes.</p>
      </div>
    ` : ''}
  `;
}

function canUpdateProfile(freelancer) {
  // Check if there's a pending update
  if (getPendingProfileUpdate(freelancer.id)) return false;
  
  // Check if last update was more than 30 days ago
  if (!freelancer.lastProfileUpdate) return true;
  
  const lastUpdate = new Date(freelancer.lastProfileUpdate);
  const now = new Date();
  const daysSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
  
  return daysSinceUpdate >= 30;
}

function getNextUpdateDate(freelancer) {
  if (!freelancer.lastProfileUpdate) return 'Now';
  
  const lastUpdate = new Date(freelancer.lastProfileUpdate);
  const nextUpdate = new Date(lastUpdate);
  nextUpdate.setDate(nextUpdate.getDate() + 30);
  
  return nextUpdate.toLocaleDateString();
}

function getPendingProfileUpdate(freelancerId) {
  const updates = DB.getProfileUpdates() || [];
  return updates.find(u => u.freelancerId === freelancerId && u.status === 'pending');
}

function showProfileUpdateForm() {
  const freelancer = DB.getFreelancers().find(f => f.id === currentUser.id);
  const container = document.getElementById('profile-tab');
  
  container.innerHTML = `
    <button onclick="loadMyProfile()">← Back to Profile</button>
    
    <div class="card">
      <h2>Update Profile</h2>
      <p style="color: #f39c12; margin-bottom: 1rem;">⚠️ Changes will be reviewed by admin before being applied to your profile.</p>
      
      <form onsubmit="submitProfileUpdate(event)">
        <div class="form-group">
          <label>Name</label>
          <input type="text" name="name" value="${freelancer.name}" required>
        </div>
        
        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" name="phone" value="${freelancer.phone}" required>
        </div>
        
        <div class="form-group">
          <label>Education</label>
          <input type="text" name="education" value="${freelancer.education}" required>
        </div>
        
        <div class="form-group">
          <label>IT Skills (comma separated)</label>
          <input type="text" name="skills" value="${freelancer.skills}" required>
        </div>
        
        <div class="form-group">
          <label>Hourly Rate (ZAR)</label>
          <input type="number" name="hourlyRate" value="${freelancer.hourlyRate}" step="0.01" required>
        </div>
        
        <div class="form-group">
          <label>Bio</label>
          <textarea name="bio" required>${freelancer.bio}</textarea>
        </div>
        
        <div class="form-group">
          <label>Reason for Update</label>
          <textarea name="updateReason" required placeholder="Explain why you're updating your profile..."></textarea>
        </div>
        
        <button type="submit">Submit for Admin Approval</button>
        <button type="button" class="secondary" onclick="loadMyProfile()">Cancel</button>
      </form>
    </div>
  `;
}

function submitProfileUpdate(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const profileUpdates = DB.getProfileUpdates() || [];
  
  const newUpdate = {
    id: Date.now(),
    freelancerId: currentUser.id,
    freelancerName: currentUser.name,
    freelancerEmail: currentUser.email,
    updates: {
      name: formData.get('name'),
      phone: formData.get('phone'),
      education: formData.get('education'),
      skills: formData.get('skills'),
      hourlyRate: parseFloat(formData.get('hourlyRate')),
      bio: formData.get('bio')
    },
    updateReason: formData.get('updateReason'),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  profileUpdates.push(newUpdate);
  DB.saveProfileUpdates(profileUpdates);
  
  sendEmailNotification(ADMIN_EMAIL, 'Profile Update Request', `${currentUser.name} has requested to update their profile.\n\nReason: ${formData.get('updateReason')}`);
  sendEmailNotification(currentUser.email, 'Profile Update Submitted', 'Your profile update request has been submitted and is pending admin approval.');
  
  showAlert('Profile update submitted for admin approval!');
  loadMyProfile();
}

// Add to DB object
DB.getProfileUpdates = () => JSON.parse(localStorage.getItem('profileUpdates') || '[]');
DB.saveProfileUpdates = (data) => localStorage.setItem('profileUpdates', JSON.stringify(data));

// Initialize app
init();
