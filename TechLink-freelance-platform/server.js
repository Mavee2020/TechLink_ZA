import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions@v4.1.9/mod.ts";
import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const app = new Application();
const router = new Router();
const PORT = 3000;

// Database setup
const db = new DB("./freelance.db");

// Initialize database tables
db.execute(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  user_type TEXT NOT NULL,
  skills TEXT,
  bio TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

db.execute(`CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget REAL,
  status TEXT DEFAULT 'open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id)
)`);

db.execute(`CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  freelancer_id INTEGER NOT NULL,
  proposal TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (freelancer_id) REFERENCES users(id)
)`);

// Session middleware
type AppState = {
  session: Session;
};

app.use(Session.initMiddleware());

// Auth middleware
const requireAuth = async (ctx: any, next: any) => {
  const userId = await ctx.state.session.get('userId');
  if (!userId) {
    ctx.response.status = 401;
    ctx.response.body = { error: 'Unauthorized' };
    return;
  }
  await next();
};

// Routes
router.post('/api/register', async (ctx) => {
  const body = await ctx.request.body({ type: 'json' }).value;
  const { email, password, name, userType, skills, bio } = body;
  
  try {
    const hashedPassword = await bcrypt.hash(password);
    db.query(
      'INSERT INTO users (email, password, name, user_type, skills, bio) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, name, userType, skills || '', bio || '']
    );
    
    const [user] = db.query('SELECT id FROM users WHERE email = ?', [email]);
    await ctx.state.session.set('userId', user[0]);
    await ctx.state.session.set('userType', userType);
    ctx.response.body = { success: true, userId: user[0] };
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = { error: 'Email already exists' };
  }
});

router.post('/api/login', async (ctx) => {
  const body = await ctx.request.body({ type: 'json' }).value;
  const { email, password } = body;
  
  const users = db.query('SELECT * FROM users WHERE email = ?', [email]);
  
  if (users.length === 0) {
    ctx.response.status = 401;
    ctx.response.body = { error: 'Invalid credentials' };
    return;
  }
  
  const user = users[0];
  const validPassword = await bcrypt.compare(password, user[2]);
  
  if (!validPassword) {
    ctx.response.status = 401;
    ctx.response.body = { error: 'Invalid credentials' };
    return;
  }
  
  await ctx.state.session.set('userId', user[0]);
  await ctx.state.session.set('userType', user[4]);
  ctx.response.body = { success: true, userType: user[4], name: user[3] };
});

router.post('/api/logout', async (ctx) => {
  await ctx.state.session.deleteSession();
  ctx.response.body = { success: true };
});

router.get('/api/me', requireAuth, async (ctx) => {
  const userId = await ctx.state.session.get('userId');
  const users = db.query('SELECT id, email, name, user_type, skills, bio FROM users WHERE id = ?', [userId]);
  
  if (users.length === 0) {
    ctx.response.status = 404;
    ctx.response.body = { error: 'User not found' };
    return;
  }
  
  const user = users[0];
  ctx.response.body = {
    id: user[0],
    email: user[1],
    name: user[2],
    user_type: user[3],
    skills: user[4],
    bio: user[5]
  };
});

router.post('/api/jobs', requireAuth, async (ctx) => {
  const userType = await ctx.state.session.get('userType');
  if (userType !== 'client') {
    ctx.response.status = 403;
    ctx.response.body = { error: 'Only clients can post jobs' };
    return;
  }
  
  const body = await ctx.request.body({ type: 'json' }).value;
  const { title, description, budget } = body;
  const userId = await ctx.state.session.get('userId');
  
  db.query(
    'INSERT INTO jobs (client_id, title, description, budget) VALUES (?, ?, ?, ?)',
    [userId, title, description, budget]
  );
  
  const [job] = db.query('SELECT last_insert_rowid()');
  ctx.response.body = { success: true, jobId: job[0] };
});

router.get('/api/jobs', (ctx) => {
  const jobs = db.query(
    `SELECT j.*, u.name as client_name 
     FROM jobs j 
     JOIN users u ON j.client_id = u.id 
     WHERE j.status = 'open' 
     ORDER BY j.created_at DESC`
  );
  
  ctx.response.body = jobs.map((row: any) => ({
    id: row[0],
    client_id: row[1],
    title: row[2],
    description: row[3],
    budget: row[4],
    status: row[5],
    created_at: row[6],
    client_name: row[7]
  }));
});

router.get('/api/jobs/:id', (ctx) => {
  const jobs = db.query(
    `SELECT j.*, u.name as client_name, u.email as client_email 
     FROM jobs j 
     JOIN users u ON j.client_id = u.id 
     WHERE j.id = ?`,
    [ctx.params.id]
  );
  
  if (jobs.length === 0) {
    ctx.response.status = 404;
    ctx.response.body = { error: 'Job not found' };
    return;
  }
  
  const job = jobs[0];
  ctx.response.body = {
    id: job[0],
    client_id: job[1],
    title: job[2],
    description: job[3],
    budget: job[4],
    status: job[5],
    created_at: job[6],
    client_name: job[7],
    client_email: job[8]
  };
});

router.post('/api/applications', requireAuth, async (ctx) => {
  const userType = await ctx.state.session.get('userType');
  if (userType !== 'freelancer') {
    ctx.response.status = 403;
    ctx.response.body = { error: 'Only freelancers can apply' };
    return;
  }
  
  const body = await ctx.request.body({ type: 'json' }).value;
  const { jobId, proposal } = body;
  const userId = await ctx.state.session.get('userId');
  
  db.query(
    'INSERT INTO applications (job_id, freelancer_id, proposal) VALUES (?, ?, ?)',
    [jobId, userId, proposal]
  );
  
  const [app] = db.query('SELECT last_insert_rowid()');
  ctx.response.body = { success: true, applicationId: app[0] };
});

router.get('/api/my-jobs', requireAuth, async (ctx) => {
  const userType = await ctx.state.session.get('userType');
  const userId = await ctx.state.session.get('userId');
  
  if (userType === 'client') {
    const jobs = db.query(
      'SELECT * FROM jobs WHERE client_id = ? ORDER BY created_at DESC',
      [userId]
    );
    ctx.response.body = jobs.map((row: any) => ({
      id: row[0],
      client_id: row[1],
      title: row[2],
      description: row[3],
      budget: row[4],
      status: row[5],
      created_at: row[6]
    }));
  } else {
    const applications = db.query(
      `SELECT a.*, j.title, j.description, j.budget 
       FROM applications a 
       JOIN jobs j ON a.job_id = j.id 
       WHERE a.freelancer_id = ? 
       ORDER BY a.created_at DESC`,
      [userId]
    );
    ctx.response.body = applications.map((row: any) => ({
      id: row[0],
      job_id: row[1],
      freelancer_id: row[2],
      proposal: row[3],
      status: row[4],
      created_at: row[5],
      title: row[6],
      description: row[7],
      budget: row[8]
    }));
  }
});

router.get('/api/jobs/:id/applications', requireAuth, async (ctx) => {
  const userId = await ctx.state.session.get('userId');
  const jobs = db.query('SELECT client_id FROM jobs WHERE id = ?', [ctx.params.id]);
  
  if (jobs.length === 0 || jobs[0][0] !== userId) {
    ctx.response.status = 403;
    ctx.response.body = { error: 'Unauthorized' };
    return;
  }
  
  const applications = db.query(
    `SELECT a.*, u.name, u.email, u.skills, u.bio 
     FROM applications a 
     JOIN users u ON a.freelancer_id = u.id 
     WHERE a.job_id = ? 
     ORDER BY a.created_at DESC`,
    [ctx.params.id]
  );
  
  ctx.response.body = applications.map((row: any) => ({
    id: row[0],
    job_id: row[1],
    freelancer_id: row[2],
    proposal: row[3],
    status: row[4],
    created_at: row[5],
    name: row[6],
    email: row[7],
    skills: row[8],
    bio: row[9]
  }));
});

// Static files
app.use(async (ctx, next) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch {
    await next();
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
