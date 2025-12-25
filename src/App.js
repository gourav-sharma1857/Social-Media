import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  User,
  MessageSquare,
  PlusCircle,
  LogOut,
  Heart,
  Send,
  Users,
  Image,
  Video,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Trash,
  Camera,
  Loader,
  UserPlus,
  UserMinus,
  Search
} from 'lucide-react';

// Utility function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now();

// Custom hook for localStorage with live updates
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      window.dispatchEvent(new CustomEvent('storage-update', { 
        detail: { key, value: valueToStore }
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.key === key) {
        setStoredValue(e.detail.value);
      }
    };
    window.addEventListener('storage-update', handleUpdate);
    return () => window.removeEventListener('storage-update', handleUpdate);
  }, [key]);

  return [storedValue, setValue];
};

// Default users
const defaultUsers = [
  {
    id: 'user1',
    username: 'Jatt Saab',
    email: 'Jatt@demo.com',
    password: 'password',
    profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    bio: 'Digital creator & tech enthusiast 🚀',
    following: []
  },
  {
    id: 'user2',
    username: 'Kohli',
    email: 'Kohli@demo.com',
    password: 'password',
    profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    bio: 'Living my best life ✨',
    following: []
  },
  {
    id: 'user3',
    username: 'Masti Final Boss',
    email: 'masti@demo.com',
    password: 'password',
    profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
    bio: 'Coffee lover ☕ | Travel addict 🌍',
    following: []
  }
];

// Default groups
const defaultGroups = [
  {
    id: 'group1',
    name: 'Tech Enthusiasts',
    description: 'Discuss the latest in technology and innovation',
    members: ['user1', 'user2'],
    ownerId: 'user1',
    messages: []
  },
  {
    id: 'group2',
    name: 'Travel Lovers',
    description: 'Share your travel experiences and tips',
    members: ['user2', 'user3'],
    ownerId: 'user2',
    messages: []
  },
  {
    id: 'group3',
    name: 'Photography',
    description: 'For photography enthusiasts and professionals',
    members: ['user1', 'user3'],
    ownerId: 'user3',
    messages: []
  }
];

// Main App Component
export default function App() {
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', null);
  const [page, setPage] = useState('feed');
  const [users, setUsers] = useLocalStorage('users', defaultUsers);
  const [posts, setPosts] = useLocalStorage('posts', []);
  const [stories, setStories] = useLocalStorage('stories', []);
  const [chats, setChats] = useLocalStorage('chats', []);
  const [groups, setGroups] = useLocalStorage('groups', defaultGroups);

  // Clean up expired stories
  useEffect(() => {
    const cleanupStories = () => {
      const now = Date.now();
      setStories(prev => prev.filter(story => story.expiresAt > now));
    };
    cleanupStories();
    const interval = setInterval(cleanupStories, 60000);
    return () => clearInterval(interval);
  }, []);

  // Update current user from users array when it changes
  useEffect(() => {
    if (currentUser) {
      const updatedUser = users.find(u => u.id === currentUser.id);
      if (updatedUser && JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedUser);
      }
    }
  }, [users]);

  const handleLogout = () => {
    setCurrentUser(null);
    setPage('login');
  };

  const renderPage = () => {
    if (!currentUser) {
      return (
        <LoginPage 
          users={users} 
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setPage('feed');
          }} 
        />
      );
    }

    switch (page) {
      case 'feed':
        return <FeedPage currentUser={currentUser} posts={posts} setPosts={setPosts} stories={stories} setStories={setStories} users={users} setUsers={setUsers} />;
      case 'videos':
        return <VideosPage currentUser={currentUser} posts={posts} users={users} />;
      case 'groups':
        return <GroupsPage currentUser={currentUser} groups={groups} setGroups={setGroups} users={users} />;
      case 'chat':
        return <ChatPage currentUser={currentUser} chats={chats} setChats={setChats} groups={groups} setGroups={setGroups} users={users} />;
      case 'profile':
        return <ProfilePage currentUser={currentUser} posts={posts} setPosts={setPosts} users={users} setUsers={setUsers} />;
      case 'explore':
        return <ExplorePage currentUser={currentUser} users={users} setUsers={setUsers} chats={chats} setChats={setChats} />;
      default:
        return <FeedPage currentUser={currentUser} posts={posts} setPosts={setPosts} stories={stories} setStories={setStories} users={users} setUsers={setUsers} />;
    }
  };

  return (
    <div className="app-wrapper">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        :root {
          --bg-dark: #0a0e27;
          --bg-card: #111936;
          --bg-hover: #1a2445;
          --accent-blue: #00d9ff;
          --accent-green: #00ff88;
          --accent-purple: #7b2ff7;
          --text-primary: #ffffff;
          --text-secondary: #94a3b8;
          --border: rgba(0, 217, 255, 0.15);
          --shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1629 100%);
          color: var(--text-primary);
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .app-wrapper {
          min-height: 100vh;
          padding-bottom: 90px;
        }

        .page-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px;
        }

        .modern-navbar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, rgba(17, 25, 54, 0.95) 0%, rgba(10, 14, 39, 0.98) 100%);
          backdrop-filter: blur(20px);
          border-top: 1px solid var(--border);
          padding: 12px 0;
          z-index: 1000;
          box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.5);
        }

        .navbar-content {
          display: flex;
          justify-content: space-around;
          align-items: center;
          max-width: 700px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 10px 12px;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .nav-item:hover {
          color: var(--accent-blue);
          background: rgba(0, 217, 255, 0.08);
          transform: translateY(-3px);
        }

        .nav-active {
          color: var(--accent-blue);
          background: rgba(0, 217, 255, 0.12);
          box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
        }

        .nav-logout {
          color: #ff6b6b;
        }

        .nav-logout:hover {
          background: rgba(255, 107, 107, 0.1);
          color: #ff6b6b;
        }

        .btn-modern {
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
          color: var(--text-primary);
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 217, 255, 0.3);
        }

        .btn-modern:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 217, 255, 0.5);
        }

        .btn-modern:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-modern:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          color: var(--text-primary);
          padding: 10px 20px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--accent-blue);
          transform: translateY(-1px);
        }

        .btn-danger {
          background: rgba(255, 107, 107, 0.15);
          border: 1px solid rgba(255, 107, 107, 0.3);
          color: #ff6b6b;
          padding: 8px 16px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
        }

        .btn-danger:hover {
          background: rgba(255, 107, 107, 0.25);
          transform: translateY(-1px);
        }

        .modern-card {
          background: rgba(17, 25, 54, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
        }

        .modern-card:hover {
          border-color: var(--accent-blue);
          box-shadow: 0 8px 40px rgba(0, 217, 255, 0.2);
          transform: translateY(-2px);
        }

        .modern-input {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 14px 18px;
          color: var(--text-primary);
          width: 100%;
          font-size: 14px;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .modern-input:focus {
          outline: none;
          border-color: var(--accent-blue);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 4px rgba(0, 217, 255, 0.1);
        }

        .modern-input::placeholder {
          color: var(--text-secondary);
        }

        textarea.modern-input {
          resize: vertical;
          min-height: 100px;
          font-family: inherit;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 14, 39, 0.92);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: linear-gradient(135deg, #111936 0%, #1a2445 100%);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 32px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 80px rgba(0, 0, 0, 0.7);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .modal-title {
          font-size: 26px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-green));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .modal-close {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 8px;
          border-radius: 50%;
        }

        .modal-close:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
          transform: rotate(90deg);
        }

        .loader {
          display: inline-block;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-secondary);
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: var(--text-secondary);
        }

        .empty-state svg {
          margin-bottom: 20px;
          opacity: 0.4;
        }

        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: var(--accent-blue);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--accent-green);
        }

        @media (max-width: 768px) {
          .page-content {
            padding: 16px;
          }

          .modern-card {
            padding: 20px;
          }

          .modal-content {
            padding: 24px;
          }
        }
      `}</style>
      <div className="page-content">{renderPage()}</div>
      {currentUser && (
        <nav className="modern-navbar">
          <div className="navbar-content">
            <button onClick={() => setPage('feed')} className={`nav-item ${page === 'feed' ? 'nav-active' : ''}`}>
              <Home size={22} />
              <span>Feed</span>
            </button>
            <button onClick={() => setPage('explore')} className={`nav-item ${page === 'explore' ? 'nav-active' : ''}`}>
              <Search size={22} />
              <span>Explore</span>
            </button>
            <button onClick={() => setPage('videos')} className={`nav-item ${page === 'videos' ? 'nav-active' : ''}`}>
              <Video size={22} />
              <span>Videos</span>
            </button>
            <button onClick={() => setPage('groups')} className={`nav-item ${page === 'groups' ? 'nav-active' : ''}`}>
              <Users size={22} />
              <span>Groups</span>
            </button>
            <button onClick={() => setPage('chat')} className={`nav-item ${page === 'chat' ? 'nav-active' : ''}`}>
              <MessageSquare size={22} />
              <span>Chat</span>
            </button>
            <button onClick={() => setPage('profile')} className={`nav-item ${page === 'profile' ? 'nav-active' : ''}`}>
              <User size={22} />
              <span>Profile</span>
            </button>
            <button onClick={handleLogout} className="nav-item nav-logout">
              <LogOut size={22} />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

// ============================================================================
// LOGIN PAGE
// ============================================================================
const LoginPage = ({ users, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      onLoginSuccess(user);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <style>{`
        .login-card {
          background: linear-gradient(135deg, rgba(17, 25, 54, 0.9) 0%, rgba(26, 36, 69, 0.9) 100%);
          backdrop-filter: blur(30px);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 48px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
        }

        .login-logo {
          text-align: center;
          margin-bottom: 40px;
        }

        .login-logo h1 {
          font-size: 42px;
          font-weight: 900;
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-green));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
          letter-spacing: -1px;
        }

        .login-logo p {
          color: var(--text-secondary);
          font-size: 15px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-label {
          color: var(--text-primary);
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.3px;
        }

        .error-message {
          background: rgba(255, 107, 107, 0.12);
          border: 1px solid rgba(255, 107, 107, 0.3);
          color: #ff6b6b;
          padding: 14px;
          border-radius: 12px;
          font-size: 14px;
          text-align: center;
        }

        .login-btn {
          width: 100%;
          padding: 16px;
          font-size: 16px;
          margin-top: 12px;
        }

        .login-info {
          text-align: center;
          margin-top: 28px;
          color: var(--text-secondary);
          font-size: 13px;
          line-height: 1.8;
          padding: 20px;
          background: rgba(0, 217, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(0, 217, 255, 0.1);
        }

        .login-info strong {
          color: var(--accent-blue);
          display: block;
          margin-bottom: 8px;
        }
      `}</style>

      <div className="login-card">
        <div className="login-logo">
          <h1>SocialHub</h1>
          <p>Connect with friends around the world</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="modern-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="modern-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-modern login-btn">
            Sign In
          </button>
        </form>

        <div className="login-info">
          <strong>Demo Accounts:</strong>
          masti@demo.com / password<br />
          kohli@demo.com / password<br />
          Jatt@demo.com / password
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXPLORE PAGE (Connect with users)
// ============================================================================
const ExplorePage = ({ currentUser, users, setUsers, chats, setChats }) => {
  const otherUsers = users.filter(u => u.id !== currentUser.id);
  const currentUserData = users.find(u => u.id === currentUser.id);

  const handleFollow = (userId) => {
    setUsers(users.map(u => {
      if (u.id === currentUser.id) {
        const isFollowing = u.following?.includes(userId);
        return {
          ...u,
          following: isFollowing 
            ? u.following.filter(id => id !== userId)
            : [...(u.following || []), userId]
        };
      }
      return u;
    }));
  };

  const handleStartChat = (otherUserId) => {
    const existingChat = chats.find(chat => 
      chat.participants?.includes(currentUser.id) && 
      chat.participants?.includes(otherUserId) &&
      chat.participants?.length === 2
    );

    if (!existingChat) {
      setChats([...chats, {
        id: generateId(),
        participants: [currentUser.id, otherUserId],
        messages: [],
        isGroup: false
      }]);
    }
  };

  const isFollowing = (userId) => currentUserData?.following?.includes(userId);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <style>{`
        .page-title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 32px;
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-green));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .user-card {
          background: rgba(17, 25, 54, 0.5);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .user-card:hover {
          border-color: var(--accent-blue);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0, 217, 255, 0.25);
        }

        .user-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--accent-blue);
          margin: 0 auto 20px;
          box-shadow: 0 0 30px rgba(0, 217, 255, 0.4);
        }

        .user-name {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .user-email {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 12px;
        }

        .user-bio {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .user-actions {
          display: flex;
          gap: 10px;
        }
      `}</style>

      <h1 className="page-title">Explore People</h1>

      <div className="users-grid">
        {otherUsers.map(user => (
          <div key={user.id} className="user-card">
            <img src={user.profilePic} alt={user.username} className="user-avatar" />
            <h3 className="user-name">{user.username}</h3>
            <p className="user-email">{user.email}</p>
            <p className="user-bio">{user.bio}</p>
            <div className="user-actions">
              <button 
                onClick={() => handleFollow(user.id)} 
                className={isFollowing(user.id) ? 'btn-secondary' : 'btn-modern'}
                style={{ flex: 1 }}
              >
                {isFollowing(user.id) ? (
                  <>
                    <UserMinus size={18} />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Follow
                  </>
                )}
              </button>
              <button 
                onClick={() => handleStartChat(user.id)} 
                className="btn-modern"
                style={{ flex: 1 }}
              >
                <MessageCircle size={18} />
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// FEED PAGE
// ============================================================================
const FeedPage = ({ currentUser, posts, setPosts, stories, setStories, users, setUsers }) => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  const activeStories = stories.filter(s => s.expiresAt > Date.now());
  
  // Show posts from users you follow + your own posts
  const currentUserData = users.find(u => u.id === currentUser.id);
  const feedPosts = posts.filter(p => 
    p.userId === currentUser.id || 
    currentUserData?.following?.includes(p.userId)
  );

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <style>{`
        .feed-header {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
        }

        .create-btn {
          flex: 1;
        }

        .stories-section {
          background: rgba(17, 25, 54, 0.4);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 28px;
        }

        .stories-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stories-list {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding: 8px 0;
        }

        .story-item {
          flex-shrink: 0;
          cursor: pointer;
          transition: transform 0.3s ease;
          text-align: center;
        }

        .story-item:hover {
          transform: scale(1.08);
        }

        .story-avatar {
          width: 75px;
          height: 75px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--accent-blue);
          box-shadow: 0 0 20px rgba(0, 217, 255, 0.4);
          transition: all 0.3s ease;
        }

        .story-item:hover .story-avatar {
          box-shadow: 0 0 30px rgba(0, 217, 255, 0.6);
        }

        .story-username {
          display: block;
          margin-top: 10px;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
          max-width: 75px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .posts-feed {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
      `}</style>

      <div className="feed-header">
        <button onClick={() => setShowCreatePost(true)} className="btn-modern create-btn">
          <PlusCircle size={20} />
          New Post
        </button>
        <button onClick={() => setShowCreateStory(true)} className="btn-secondary create-btn">
          <Camera size={20} />
          Add Story
        </button>
      </div>

      {activeStories.length > 0 && (
        <div className="stories-section">
          <h3 className="stories-title">
            <Camera size={20} />
            Stories
          </h3>
          <div className="stories-list">
            {activeStories.map((story, index) => {
              const author = users.find(u => u.id === story.userId);
              return (
                <div key={story.id} className="story-item" onClick={() => {
                  setSelectedStoryIndex(index);
                  setShowStoryViewer(true);
                }}>
                  <img src={author?.profilePic} alt={author?.username} className="story-avatar" />
                  <span className="story-username">{author?.username}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="posts-feed">
        {feedPosts.length > 0 ? (
          [...feedPosts].sort((a, b) => b.timestamp - a.timestamp).map(post => (
            <PostCard key={post.id} post={post} currentUser={currentUser} users={users} posts={posts} setPosts={setPosts} />
          ))
        ) : (
          <div className="empty-state">
            <MessageCircle size={56} />
            <p>No posts yet. Follow people or create the first post!</p>
          </div>
        )}
      </div>

      {showCreatePost && <CreatePostModal currentUser={currentUser} onClose={() => setShowCreatePost(false)} setPosts={setPosts} />}
      {showCreateStory && <CreateStoryModal currentUser={currentUser} onClose={() => setShowCreateStory(false)} setStories={setStories} />}
      {showStoryViewer && <StoryViewer stories={activeStories} initialIndex={selectedStoryIndex} onClose={() => setShowStoryViewer(false)} currentUser={currentUser} users={users} setStories={setStories} />}
    </div>
  );
};

// ============================================================================
// POST CARD
// ============================================================================
const PostCard = ({ post, currentUser, users, posts, setPosts }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const author = users.find(u => u.id === post.userId);
  const isLiked = post.likes?.includes(currentUser.id);

  const handleLike = () => {
    setPosts(posts.map(p => {
      if (p.id === post.id) {
        const newLikes = isLiked 
          ? p.likes.filter(id => id !== currentUser.id)
          : [...(p.likes || []), currentUser.id];
        return { ...p, likes: newLikes };
      }
      return p;
    }));
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setPosts(posts.map(p => {
      if (p.id === post.id) {
        const newComment = {
          id: generateId(),
          userId: currentUser.id,
          content: commentText,
          timestamp: Date.now()
        };
        return { ...p, comments: [...(p.comments || []), newComment] };
      }
      return p;
    }));
    setCommentText('');
  };

  const handleDelete = () => {
    if (window.confirm('Delete this post?')) {
      setPosts(posts.filter(p => p.id !== post.id));
    }
  };

  const deleteComment = (commentId) => {
    setPosts(posts.map(p => {
      if (p.id === post.id) {
        return { ...p, comments: p.comments.filter(c => c.id !== commentId) };
      }
      return p;
    }));
  };

  const timeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  return (
    <div className="modern-card">
      <style>{`
        .post-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .post-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent-blue);
        }

        .post-author {
          flex: 1;
        }

        .post-author-name {
          font-weight: 700;
          color: var(--text-primary);
          font-size: 16px;
          margin-bottom: 2px;
        }

        .post-time {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .post-content {
          margin-bottom: 18px;
          color: var(--text-primary);
          line-height: 1.7;
          font-size: 15px;
        }

        .post-media {
          width: 100%;
          border-radius: 16px;
          margin-bottom: 18px;
          max-height: 500px;
          object-fit: cover;
        }

        .post-actions {
          display: flex;
          gap: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          padding: 8px 14px;
          border-radius: 10px;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }

        .action-btn.liked {
          color: #ff6b6b;
        }

        .action-btn.liked:hover {
          background: rgba(255, 107, 107, 0.1);
        }

        .comments-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }

        .comment-form {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: 350px;
          overflow-y: auto;
        }

        .comment-item {
          display: flex;
          gap: 12px;
          padding: 14px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .comment-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .comment-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .comment-content {
          flex: 1;
        }

        .comment-author {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .comment-text {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
        }
      `}</style>

      <div className="post-header">
        <img src={author?.profilePic} alt={author?.username} className="post-avatar" />
        <div className="post-author">
          <div className="post-author-name">{author?.username}</div>
          <div className="post-time">{timeAgo(post.timestamp)}</div>
        </div>
        {post.userId === currentUser.id && (
          <button onClick={handleDelete} className="btn-danger">
            <Trash size={16} />
          </button>
        )}
      </div>

      {post.content && <div className="post-content">{post.content}</div>}

      {post.media && (
        <>
          {post.mediaType === 'image' ? (
            <img src={post.media} alt="Post" className="post-media" />
          ) : (
            <video src={post.media} controls className="post-media" />
          )}
        </>
      )}

      <div className="post-actions">
        <button onClick={handleLike} className={`action-btn ${isLiked ? 'liked' : ''}`}>
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{post.likes?.length || 0}</span>
        </button>
        <button onClick={() => setShowComments(!showComments)} className="action-btn">
          <MessageCircle size={20} />
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleComment} className="comment-form">
            <input
              type="text"
              className="modern-input"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-modern" disabled={!commentText.trim()}>
              <Send size={16} />
            </button>
          </form>

          {post.comments?.length > 0 && (
            <div className="comments-list">
              {post.comments.map(comment => {
                const commentAuthor = users.find(u => u.id === comment.userId);
                return (
                  <div key={comment.id} className="comment-item">
                    <img src={commentAuthor?.profilePic} alt={commentAuthor?.username} className="comment-avatar" />
                    <div className="comment-content">
                      <div className="comment-author">{commentAuthor?.username}</div>
                      <div className="comment-text">{comment.content}</div>
                    </div>
                    {comment.userId === currentUser.id && (
                      <button onClick={() => deleteComment(comment.id)} className="btn-danger" style={{ padding: '6px', height: 'fit-content' }}>
                        <Trash size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CREATE POST MODAL
// ============================================================================
const CreatePostModal = ({ currentUser, onClose, setPosts }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (useCamera) {
      startCamera();
    }
    return () => stopCamera();
  }, [useCamera]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access denied');
      setUseCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg');
    setMedia(dataUrl);
    setMediaType('image');
    setUseCamera(false);
    stopCamera();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMedia(reader.result);
        setMediaType(file.type.startsWith('image/') ? 'image' : 'video');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !media) return;

    setLoading(true);
    setTimeout(() => {
      setPosts(prev => [{
        id: generateId(),
        userId: currentUser.id,
        content,
        media,
        mediaType,
        likes: [],
        comments: [],
        timestamp: Date.now()
      }, ...prev]);
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <style>{`
          .camera-container {
            margin: 24px 0;
            border-radius: 16px;
            overflow: hidden;
            background: #000;
          }

          .camera-video {
            width: 100%;
            border-radius: 16px;
            display: block;
          }

          .media-preview {
            margin: 24px 0;
            border-radius: 16px;
            overflow: hidden;
          }

          .media-preview img,
          .media-preview video {
            width: 100%;
            border-radius: 16px;
          }

          .form-actions {
            display: flex;
            gap: 12px;
            margin-top: 24px;
          }

          .file-input-label {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
            font-size: 14px;
          }

          .file-input-label:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--accent-blue);
          }
        `}</style>

        <div className="modal-header">
          <h2 className="modal-title">Create Post</h2>
          <button onClick={onClose} className="modal-close">
            <XCircle size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            className="modern-input"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
          />

          {useCamera ? (
            <div className="camera-container">
              <video ref__={videoRef} autoPlay playsInline muted className="camera-video" />
              <canvas ref__={canvasRef} style={{ display: 'none' }} />
              <div style={{ display: 'flex', gap: '12px', padding: '16px' }}>
                <button type="button" onClick={capturePhoto} className="btn-modern" style={{ flex: 1 }}>
                  <Camera size={18} />
                  Capture Photo
                </button>
                <button type="button" onClick={() => { setUseCamera(false); stopCamera(); }} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {media && (
                <div className="media-preview">
                  {mediaType === 'image' ? (
                    <img src={media} alt="Preview" />
                  ) : (
                    <video src={media} controls />
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', margin: '20px 0' }}>
                <label className="file-input-label">
                  <Image size={18} />
                  Add Media
                  <input type="file" accept="image/*,video/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
                <button type="button" onClick={() => setUseCamera(true)} className="btn-secondary">
                  <Camera size={18} />
                  Camera
                </button>
              </div>
            </>
          )}

          {!useCamera && (
            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn-modern" disabled={loading || (!content.trim() && !media)} style={{ flex: 1 }}>
                {loading ? <Loader className="loader" size={18} /> : 'Post'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// CREATE STORY MODAL
// ============================================================================
const CreateStoryModal = ({ currentUser, onClose, setStories }) => {
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (useCamera) {
      startCamera();
    }
    return () => stopCamera();
  }, [useCamera]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access denied');
      setUseCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg');
    setMedia(dataUrl);
    setMediaType('image');
    setUseCamera(false);
    stopCamera();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMedia(reader.result);
        setMediaType(file.type.startsWith('image/') ? 'image' : 'video');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!media) return;

    setLoading(true);
    setTimeout(() => {
      setStories(prev => [{
        id: generateId(),
        userId: currentUser.id,
        media,
        mediaType,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      }, ...prev]);
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create Story</h2>
          <button onClick={onClose} className="modal-close">
            <XCircle size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {useCamera ? (
            <div className="camera-container">
              <video ref__={videoRef} autoPlay playsInline muted className="camera-video" />
              <canvas ref__={canvasRef} style={{ display: 'none' }} />
              <div style={{ display: 'flex', gap: '12px', padding: '16px' }}>
                <button type="button" onClick={capturePhoto} className="btn-modern" style={{ flex: 1 }}>
                  <Camera size={18} />
                  Capture Photo
                </button>
                <button type="button" onClick={() => { setUseCamera(false); stopCamera(); }} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {media && (
                <div className="media-preview">
                  {mediaType === 'image' ? (
                    <img src={media} alt="Preview" />
                  ) : (
                    <video src={media} controls />
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', margin: '20px 0' }}>
                <label className="file-input-label">
                  <Image size={18} />
                  Add Media
                  <input type="file" accept="image/*,video/*" onChange={handleFileChange} style={{ display: 'none' }} required />
                </label>
                <button type="button" onClick={() => setUseCamera(true)} className="btn-secondary">
                  <Camera size={18} />
                  Camera
                </button>
              </div>
            </>
          )}

          {!useCamera && (
            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn-modern" disabled={loading || !media} style={{ flex: 1 }}>
                {loading ? <Loader className="loader" size={18} /> : 'Post Story'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// STORY VIEWER
// ============================================================================
const StoryViewer = ({ stories, initialIndex, onClose, currentUser, users, setStories }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const story = stories[currentIndex];
  const author = users.find(u => u.id === story?.userId);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Delete this story?')) {
      setStories(prev => prev.filter(s => s.id !== story.id));
      onClose();
    }
  };

  if (!story) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <style>{`
        .story-viewer {
          position: relative;
          width: 100%;
          max-width: 500px;
          height: 85vh;
          background: #000;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.8);
        }

        .story-media {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .story-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 24px;
          background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }

        .story-author-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .story-author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .story-author-name {
          color: white;
          font-weight: 700;
          font-size: 15px;
        }

        .story-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.6);
          border: none;
          color: white;
          padding: 16px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .story-nav-btn:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: translateY(-50%) scale(1.1);
        }

        .story-nav-left {
          left: 20px;
        }

        .story-nav-right {
          right: 20px;
        }
      `}</style>

      <div className="story-viewer" onClick={e => e.stopPropagation()}>
        {story.mediaType === 'image' ? (
          <img src={story.media} alt="Story" className="story-media" />
        ) : (
          <video src={story.media} controls autoPlay className="story-media" />
        )}

        <div className="story-header">
          <div className="story-author-info">
            <img src={author?.profilePic} alt={author?.username} className="story-author-avatar" />
            <span className="story-author-name">{author?.username}</span>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
            <XCircle size={24} />
          </button>
        </div>

        {currentIndex > 0 && (
          <button onClick={handlePrev} className="story-nav-btn story-nav-left">
            <ChevronLeft size={28} />
          </button>
        )}

        {currentIndex < stories.length - 1 && (
          <button onClick={handleNext} className="story-nav-btn story-nav-right">
            <ChevronRight size={28} />
          </button>
        )}

        {story.userId === currentUser.id && (
          <button onClick={handleDelete} className="btn-danger" style={{ position: 'absolute', bottom: '24px', left: '24px', zIndex: 10 }}>
            <Trash size={18} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// VIDEOS PAGE
// ============================================================================
const VideosPage = ({ currentUser, posts, users }) => {
  const videoPosts = posts.filter(p => p.mediaType === 'video');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <style>{`
        .page-title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 32px;
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-green));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .video-card {
          background: rgba(17, 25, 54, 0.5);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .video-card:hover {
          border-color: var(--accent-blue);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 217, 255, 0.3);
        }

        .video-player {
          width: 100%;
          height: 220px;
          background: #000;
        }

        .video-info {
          padding: 20px;
        }

        .video-author-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .video-author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid var(--accent-blue);
        }

        .video-title {
          color: var(--text-primary);
          font-weight: 600;
          font-size: 15px;
          line-height: 1.5;
        }

        .video-author-name {
          color: var(--text-secondary);
          font-size: 14px;
        }
      `}</style>

      <h1 className="page-title">Videos</h1>

      {videoPosts.length > 0 ? (
        <div className="videos-grid">
          {videoPosts.map(post => {
            const author = users.find(u => u.id === post.userId);
            return (
              <div key={post.id} className="video-card">
                <video src={post.media} controls className="video-player" />
                <div className="video-info">
                  <div className="video-author-info">
                    <img src={author?.profilePic} alt={author?.username} className="video-author-avatar" />
                    <div>
                      <div className="video-author-name">{author?.username}</div>
                    </div>
                  </div>
                  <div className="video-title">{post.content || 'Untitled Video'}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <Video size={56} />
          <p>No videos yet. Create the first one!</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// GROUPS PAGE
// ============================================================================
const GroupsPage = ({ currentUser, groups, setGroups, users }) => {
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const handleJoinGroup = (groupId) => {
    setGroups(groups.map(g => {
      if (g.id === groupId && !g.members.includes(currentUser.id)) {
        return { ...g, members: [...g.members, currentUser.id] };
      }
      return g;
    }));
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <style>{`
        .groups-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .groups-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .group-card {
          background: rgba(17, 25, 54, 0.5);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px;
          transition: all 0.3s ease;
        }

        .group-card:hover {
          border-color: var(--accent-blue);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0, 217, 255, 0.25);
        }

        .group-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 8px 24px rgba(0, 217, 255, 0.3);
        }

        .group-name {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .group-desc {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .group-members {
          color: var(--text-secondary);
          font-size: 13px;
          margin-bottom: 20px;
          font-weight: 500;
        }
      `}</style>

      <div className="groups-header">
        <h1 className="page-title">Groups</h1>
        <button onClick={() => setShowCreateGroup(true)} className="btn-modern">
          <PlusCircle size={20} />
          Create Group
        </button>
      </div>

      <div className="groups-grid">
        {groups.map(group => {
          const memberNames = group.members.map(memberId => {
            const user = users.find(u => u.id === memberId);
            return user?.username;
          }).filter(Boolean).join(', ');

          return (
            <div key={group.id} className="group-card">
              <div className="group-icon">
                <Users size={40} color="white" />
              </div>
              <h3 className="group-name">{group.name}</h3>
              <p className="group-desc">{group.description}</p>
              <p className="group-members">{group.members?.length || 0} members: {memberNames}</p>
              {group.members?.includes(currentUser.id) ? (
                <button className="btn-secondary" disabled style={{ width: '100%', opacity: 0.6 }}>
                  Joined
                </button>
              ) : (
                <button onClick={() => handleJoinGroup(group.id)} className="btn-modern" style={{ width: '100%' }}>
                  Join Group
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showCreateGroup && <CreateGroupModal currentUser={currentUser} onClose={() => setShowCreateGroup(false)} setGroups={setGroups} />}
    </div>
  );
};

// ============================================================================
// CREATE GROUP MODAL
// ============================================================================
const CreateGroupModal = ({ currentUser, onClose, setGroups }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setGroups(prev => [...prev, {
        id: generateId(),
        name,
        description,
        members: [currentUser.id],
        ownerId: currentUser.id,
        messages: []
      }]);
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create Group</h2>
          <button onClick={onClose} className="modal-close">
            <XCircle size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '10px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Group Name
            </label>
            <input
              type="text"
              className="modern-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '10px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Description
            </label>
            <textarea
              className="modern-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this group about?"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-modern" disabled={loading} style={{ flex: 1 }}>
              {loading ? <Loader className="loader" size={18} /> : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// CHAT PAGE (with 1-on-1 and group chats)
// ============================================================================
const ChatPage = ({ currentUser, chats, setChats, groups, setGroups, users }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  // Combine 1-on-1 chats and group chats
  const userChats = chats.filter(chat => chat.participants?.includes(currentUser.id));
  const userGroups = groups.filter(group => group.members?.includes(currentUser.id));

  const allConversations = [
    ...userChats.map(chat => ({ ...chat, type: 'chat' })),
    ...userGroups.map(group => ({ ...group, type: 'group' }))
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;

    const newMessage = {
      id: generateId(),
      senderId: currentUser.id,
      content: messageText,
      timestamp: Date.now()
    };

    if (selectedChat.type === 'chat') {
      setChats(chats.map(chat => {
        if (chat.id === selectedChat.id) {
          return {
            ...chat,
            messages: [...(chat.messages || []), newMessage]
          };
        }
        return chat;
      }));
    } else {
      setGroups(groups.map(group => {
        if (group.id === selectedChat.id) {
          return {
            ...group,
            messages: [...(group.messages || []), newMessage]
          };
        }
        return group;
      }));
    }

    setMessageText('');
  };

  const getChatName = (conversation) => {
    if (conversation.type === 'group') {
      return conversation.name;
    } else {
      const otherUserId = conversation.participants?.find(p => p !== currentUser.id);
      const otherUser = users.find(u => u.id === otherUserId);
      return otherUser?.username || 'Unknown';
    }
  };

  const getChatAvatar = (conversation) => {
    if (conversation.type === 'group') {
      return null; // Will show group icon
    } else {
      const otherUserId = conversation.participants?.find(p => p !== currentUser.id);
      const otherUser = users.find(u => u.id === otherUserId);
      return otherUser?.profilePic;
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '24px', height: 'calc(100vh - 140px)' }}>
      <style>{`
        .chat-sidebar {
          width: 340px;
          background: rgba(17, 25, 54, 0.5);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          overflow-y: auto;
        }

        .chat-main {
          flex: 1;
          background: rgba(17, 25, 54, 0.5);
          border: 1px solid var(--border);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
        }

        .chat-list-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 10px;
        }

        .chat-list-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .chat-list-item.active {
          background: rgba(0, 217, 255, 0.12);
          border: 1px solid var(--accent-blue);
        }

        .chat-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent-blue);
        }

        .group-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-messages-container {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
        }

        .message-item {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          animation: fadeIn 0.3s ease;
        }

        .message-item.mine {
          flex-direction: row-reverse;
        }

        .message-bubble {
          max-width: 65%;
          padding: 14px 18px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.05);
          line-height: 1.5;
        }

        .message-item.mine .message-bubble {
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
        }

        .message-sender {
          font-weight: 600;
          font-size: 13px;
          margin-bottom: 4px;
          color: var(--accent-green);
        }

        .message-time {
          font-size: 11px;
          margin-top: 6px;
          opacity: 0.7;
        }

        .chat-input-container {
          padding: 24px;
          border-top: 1px solid var(--border);
        }

        .chat-input-form {
          display: flex;
          gap: 12px;
        }

        @media (max-width: 768px) {
          .chat-sidebar {
            width: 100%;
            height: 200px;
          }
        }
      `}</style>

      <div className="chat-sidebar">
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
          Messages
        </h2>
        {allConversations.length > 0 ? (
          allConversations.map(conversation => (
            <div
              key={conversation.id}
              className={`chat-list-item ${selectedChat?.id === conversation.id ? 'active' : ''}`}
              onClick={() => setSelectedChat(conversation)}
            >
              {conversation.type === 'group' ? (
                <div className="group-avatar">
                  <Users size={28} color="white" />
                </div>
              ) : (
                <img src={getChatAvatar(conversation)} alt="Avatar" className="chat-avatar" />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px' }}>
                  {getChatName(conversation)}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {conversation.messages?.length || 0} messages
                  {conversation.type === 'group' && ` · ${conversation.members?.length} members`}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state" style={{ padding: '40px 20px' }}>
            <MessageSquare size={40} />
            <p>No chats yet</p>
          </div>
        )}
      </div>

      <div className="chat-main">
        {selectedChat ? (
          <>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {getChatName(selectedChat)}
              </h3>
              {selectedChat.type === 'group' && (
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {selectedChat.members?.length} members
                </p>
              )}
            </div>

            <div className="chat-messages-container">
              {selectedChat.messages?.map(message => {
                const sender = users.find(u => u.id === message.senderId);
                const isMine = message.senderId === currentUser.id;
                return (
                  <div key={message.id} className={`message-item ${isMine ? 'mine' : ''}`}>
                    <img src={sender?.profilePic} alt={sender?.username} className="chat-avatar" style={{ width: '40px', height: '40px' }} />
                    <div className="message-bubble">
                      {!isMine && selectedChat.type === 'group' && (
                        <div className="message-sender">{sender?.username}</div>
                      )}
                      <div style={{ fontSize: '14px' }}>{message.content}</div>
                      <div className="message-time">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref__={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                  type="text"
                  className="modern-input"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn-modern" disabled={!messageText.trim()}>
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="empty-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={56} />
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// PROFILE PAGE
// ============================================================================
const ProfilePage = ({ currentUser, posts, setPosts, users, setUsers }) => {
  const [showEditProfile, setShowEditProfile] = useState(false);

  const userPosts = posts.filter(p => p.userId === currentUser.id);
  const userData = users.find(u => u.id === currentUser.id);

  const handleDeletePost = (postId) => {
    if (window.confirm('Delete this post?')) {
      setPosts(posts.filter(p => p.id !== postId));
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <style>{`
        .profile-header-card {
          background: rgba(17, 25, 54, 0.5);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 48px;
          text-align: center;
          margin-bottom: 32px;
        }

        .profile-avatar-large {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--accent-blue);
          box-shadow: 0 0 30px rgba(0, 217, 255, 0.4);
          margin: 0 auto 24px;
        }

        .profile-name {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .profile-email {
          color: var(--text-secondary);
          margin-bottom: 20px;
          font-size: 15px;
        }

        .profile-bio {
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 28px;
          font-size: 15px;
        }

        .profile-stats {
          display: flex;
          gap: 40px;
          justify-content: center;
          margin: 28px 0;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-green));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
          margin-top: 4px;
          font-weight: 500;
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
      `}</style>

      <div className="profile-header-card">
        <img src={userData?.profilePic} alt={userData?.username} className="profile-avatar-large" />
        <h1 className="profile-name">{userData?.username}</h1>
        <p className="profile-email">{userData?.email}</p>
        <p className="profile-bio">{userData?.bio}</p>

        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-value">{userPosts.length}</div>
            <div className="stat-label">Posts</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{userData?.following?.length || 0}</div>
            <div className="stat-label">Following</div>
          </div>
        </div>

        <button onClick={() => setShowEditProfile(true)} className="btn-modern">
          Edit Profile
        </button>
      </div>

      <h2 className="page-title">My Posts</h2>
      <div className="posts-grid">
        {userPosts.length > 0 ? (
          userPosts.map(post => (
            <div key={post.id} className="modern-card" style={{ padding: '0', overflow: 'hidden' }}>
              {post.media && (
                post.mediaType === 'image' ? (
                  <img src={post.media} alt="Post" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                ) : (
                  <video src={post.media} controls style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                )
              )}
              <div style={{ padding: '20px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>{post.content}</p>
                <button onClick={() => handleDeletePost(post.id)} className="btn-danger" style={{ width: '100%' }}>
                  <Trash size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No posts yet</p>
          </div>
        )}
      </div>

      {showEditProfile && <EditProfileModal currentUser={currentUser} userData={userData} onClose={() => setShowEditProfile(false)} setUsers={setUsers} />}
    </div>
  );
};

// ============================================================================
// EDIT PROFILE MODAL
// ============================================================================
const EditProfileModal = ({ currentUser, userData, onClose, setUsers }) => {
  const [bio, setBio] = useState(userData?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, bio } : u));
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Profile</h2>
          <button onClick={onClose} className="modal-close">
            <XCircle size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '10px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Bio
            </label>
            <textarea
              className="modern-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows="5"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-modern" disabled={loading} style={{ flex: 1 }}>
              {loading ? <Loader className="loader" size={18} /> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};