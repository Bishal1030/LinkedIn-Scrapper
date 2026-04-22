import { useState, useEffect } from 'react';
import { Input } from '@/components/retroui/Input';
import { Button } from '@/components/retroui/Button';
import { Card } from '@/components/retroui/Card';
import { Alert } from '@/components/retroui/Alert';

interface ExtractedProfile {
  name?: string;
  headline?: string;
  location?: string;
  company?: string;
  about?: string;
  experience?: string[];
  education?: string[];
  skills?: string[];
}

interface ScrapeResponse {
  extractedProfile: ExtractedProfile;
  error?: string;
}

export default function ProfileScraper() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ExtractedProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [hasCookies, setHasCookies] = useState<boolean | null>(null);
  const [checkingCookies, setCheckingCookies] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Check if cookies exist on mount
  useEffect(() => {
    checkCookies();
  }, []);

  const checkCookies = async () => {
    try {
      setCheckingCookies(true);
      const res = await fetch(`${API_BASE_URL}/api/profile/cookie-status`);
      const data = await res.json();
      setHasCookies(data.hasCookies);
    } catch (err) {
      console.error("Failed to check cookies", err);
    } finally {
      setCheckingCookies(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoginLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/profile/login`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setHasCookies(true);
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || 'Login flow failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setProfile(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data: ScrapeResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setProfile(data.extractedProfile);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (checkingCookies) {
    return <div className="text-center font-mono">Checking system status...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {!hasCookies ? (
        <Card title="Authentication Required">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-sm">
              No session found. Please start the login flow. A browser window will open on the server where you can log into LinkedIn.
            </p>
            <Button onClick={handleLogin} loading={loginLoading}>
              {loginLoading ? "Waiting for login..." : "Start LinkedIn Login"}
            </Button>
          </div>
        </Card>
      ) : (
        <Card title="Enter LinkedIn URL">
          <form onSubmit={handleScrape} className="flex flex-col sm:flex-row gap-4">
            <Input
              type="url"
              placeholder="https://www.linkedin.com/in/username/"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" loading={loading}>
              Scrape Profile
            </Button>
          </form>
        </Card>
      )}

      {error && (
        <Alert duration={5000} onClose={() => setError(null)}>
          <Alert.Title>{!hasCookies ? "Login Error" : "Scrape Failed"}</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
        </Alert>
      )}

      {profile && hasCookies && (
        <Card title="Extracted Profile Data">
          <div className="flex flex-col gap-6">
            <header className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-bold m-0">{profile.name}</h2>
              <p className="text-gray-600 font-mono italic">{profile.headline}</p>
              {profile.location && (
                <div className="text-sm mt-1">📍 {profile.location}</div>
              )}
              {profile.company && (
                <div className="text-sm">🏢 {profile.company}</div>
              )}
            </header>

            {profile.about && (
              <section>
                <h4 className="font-bold font-mono text-sm uppercase mb-2">About</h4>
                <p className="text-sm leading-relaxed">{profile.about}</p>
              </section>
            )}

            {profile.education && profile.education.length > 0 && (
              <section>
                <h4 className="font-bold font-mono text-sm uppercase mb-2">Education</h4>
                <ul className="list-disc list-inside text-sm">
                  {profile.education.map((edu, idx) => (
                    <li key={idx}>{edu}</li>
                  ))}
                </ul>
              </section>
            )}

            {profile.skills && profile.skills.length > 0 && (
              <section>
                <h4 className="font-bold font-mono text-sm uppercase mb-2">Skills</h4>
                <div className="badge-container">
                  {profile.skills.map((skill, idx) => (
                    <span key={idx} className="badge">{skill}</span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
