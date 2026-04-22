import { Layout } from './components/Layout';
import ProfileScraper from './components/ProfileScraper';
import './App.css';

function App() {
  return (
    <Layout>
      <div style={{ paddingTop: '2.5rem' }}>
        <h1 style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1.75rem', marginBottom: '1.5rem' }}>
          LinkedIn Scrapper
        </h1>
        <ProfileScraper />
      </div>
    </Layout>
  );
}

export default App;
