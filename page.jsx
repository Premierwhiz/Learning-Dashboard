import ClientDashboard from './ClientDashboard';

// In a real app, this is where you query Supabase Postgres directly:
// const { data } = await supabase.from('users').select('*')
async function fetchUserData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // (Optional: simulate error to test error.jsx)
      // if (Math.random() < 0.05) reject(new Error("Supabase Connection Timeout. Check your PostgreSQL instance."));
      resolve({
        id: 'usr_123', name: 'Joe Learner', xp: 28450, level: 'AI Engineer (L4)',
        streak: 42, rank: 'Top 1%', theme: 'dark', phone: '+1 (555) 019-2834', email: 'joe.learner@gmail.com'
      });
    }, 800);
  });
}

export default async function Page() {
  // Data fetched securely on the server
  const userData = await fetchUserData();

  return (
    <ClientDashboard initialUser={userData} />
  );
}
