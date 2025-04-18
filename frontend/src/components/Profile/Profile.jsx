import { useState } from 'react';
import { useAuth } from 'context/AuthContext';
import { useRouter } from 'next/router';
import { ProfileAside } from './ProfileAside/ProfileAside';
import { ProfileOrders } from './ProfileOrders/ProfileOrders';

export const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    country: user?.address?.country || '',
    postalCode: user?.address?.postalCode || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name ? (
              <span className="avatar-text">
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <i className="icon-user"></i>
            )}
          </div>
          <div className="user-details">
            <h3>{user?.name || 'User'}</h3>
            <p>{user?.email}</p>
          </div>
        </div>

        <nav className="profile-nav">
          <button 
            className={`nav-item ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <i className="icon-user"></i>
            Personal Information
          </button>
          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="icon-cart"></i>
            My Orders
          </button>
          <button 
            className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            <i className="icon-heart"></i>
            Wishlist
          </button>
          <button 
            className={`nav-item ${activeTab === 'address' ? 'active' : ''}`}
            onClick={() => setActiveTab('address')}
          >
            <i className="icon-map-pin"></i>
            Address Book
          </button>
        </nav>
      </div>

      <div className="profile-content">
        {activeTab === 'personal' && (
          <div className="content-section">
            <div className="section-header">
              <h2>Personal Information</h2>
              {!isEditing && (
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="content-section">
            <h2>My Orders</h2>
            <ProfileOrders />
          </div>
        )}

        {activeTab === 'address' && (
          <div className="content-section">
            <div className="section-header">
              <h2>Address Book</h2>
            </div>

            <form className="profile-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your street address"
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your city"
                  />
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your country"
                  />
                </div>

                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="profile-actions">
        <button 
          className="logout-button"
          onClick={handleLogout}
        >
          <i className="icon-logout"></i>
          Logout
        </button>
      </div>

      <style jsx>{`
        .profile-container {
          display: flex;
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .profile-sidebar {
          width: 280px;
          flex-shrink: 0;
        }

        .user-info {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #666;
        }

        .avatar-text {
          background: #d05278;
          color: white;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .user-details h3 {
          margin: 0 0 4px;
          font-size: 18px;
          color: #333;
        }

        .user-details p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .profile-nav {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .nav-item {
          width: 100%;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: none;
          background: none;
          color: #666;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: left;
        }

        .nav-item:hover {
          background: #f8f8f8;
          color: #d05278;
        }

        .nav-item.active {
          background: #d05278;
          color: white;
        }

        .nav-item i {
          font-size: 18px;
        }

        .profile-content {
          flex: 1;
          min-width: 0;
        }

        .content-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          padding: 24px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-header h2 {
          margin: 0;
          font-size: 20px;
          color: #333;
        }

        .edit-btn {
          background: none;
          border: 1px solid #d05278;
          color: #d05278;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }

        .edit-btn:hover {
          background: #d05278;
          color: white;
        }

        .profile-form {
          max-width: 800px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: span 2;
        }

        label {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        input {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 15px;
          transition: all 0.3s;
        }

        input:focus {
          outline: none;
          border-color: #d05278;
          box-shadow: 0 0 0 3px rgba(208,82,120,0.1);
        }

        input:disabled {
          background: #f8f8f8;
          cursor: not-allowed;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .save-btn {
          background: #d05278;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s;
        }

        .save-btn:hover {
          background: #b93d63;
        }

        .cancel-btn {
          background: none;
          border: 1px solid #ddd;
          color: #666;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s;
        }

        .cancel-btn:hover {
          background: #f0f0f0;
        }

        @media (max-width: 992px) {
          .profile-container {
            flex-direction: column;
          }

          .profile-sidebar {
            width: 100%;
          }

          .profile-nav {
            display: flex;
            flex-wrap: wrap;
          }

          .nav-item {
            flex: 1;
            min-width: 150px;
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-group.full-width {
            grid-column: span 1;
          }

          .section-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
        }

        .profile-actions {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff1f0;
          color: #e74c3c;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .logout-button:hover {
          background: #e74c3c;
          color: white;
          transform: translateY(-1px);
        }

        .logout-button i {
          font-size: 20px;
        }
      `}</style>
    </div>
  );
};
