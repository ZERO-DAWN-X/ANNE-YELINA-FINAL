import { PublicLayout } from 'layout/PublicLayout';
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const breadcrumbsData = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: 'Phone',
      details: ['+1 (234) 567-8900', '+1 (234) 567-8901'],
      color: '#10b981'
    },
    {
      icon: <Mail size={24} />,
      title: 'Email',
      details: ['support@anneyelina.com', 'info@anneyelina.com'],
      color: '#f59e0b'
    },
    {
      icon: <MapPin size={24} />,
      title: 'Location',
      details: ['123 Beauty Street', 'New York, NY 10001'],
      color: '#ef4444'
    },
    {
      icon: <Clock size={24} />,
      title: 'Business Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat - Sun: 10:00 AM - 4:00 PM'],
      color: '#6366f1'
    }
  ];

  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle='Contact Us'>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 20px'
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '16px'
          }}>Get in Touch</h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Have questions about our products or services? We're here to help and answer any question you might have.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          {contactInfo.map((item, index) => (
            <div key={index} style={{
              padding: '32px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s ease',
              cursor: 'pointer',
              ':hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: `${item.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                color: item.color
              }}>
                {item.icon}
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '12px'
              }}>{item.title}</h3>
              {item.details.map((detail, idx) => (
                <p key={idx} style={{
                  fontSize: '0.975rem',
                  color: '#6b7280',
                  marginBottom: idx === 0 ? '4px' : '0'
                }}>{detail}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Form */}
          <div>
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '24px'
            }}>Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#4b5563'
                }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1.5px solid #e5e7eb',
                    fontSize: '0.875rem',
                    transition: 'border-color 0.2s ease',
                    outline: 'none',
                    ':focus': {
                      borderColor: '#d05278'
                    }
                  }}
                  placeholder="John Doe"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#4b5563'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1.5px solid #e5e7eb',
                    fontSize: '0.875rem',
                    transition: 'border-color 0.2s ease',
                    outline: 'none',
                    ':focus': {
                      borderColor: '#d05278'
                    }
                  }}
                  placeholder="john@example.com"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#4b5563'
                }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1.5px solid #e5e7eb',
                    fontSize: '0.875rem',
                    transition: 'border-color 0.2s ease',
                    outline: 'none',
                    ':focus': {
                      borderColor: '#d05278'
                    }
                  }}
                  placeholder="How can we help?"
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#4b5563'
                }}>
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1.5px solid #e5e7eb',
                    fontSize: '0.875rem',
                    minHeight: '120px',
                    resize: 'vertical',
                    transition: 'border-color 0.2s ease',
                    outline: 'none',
                    ':focus': {
                      borderColor: '#d05278'
                    }
                  }}
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  backgroundColor: '#d05278',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  ':hover': {
                    backgroundColor: '#b83d61'
                  }
                }}
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>

          {/* Map */}
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            height: '400px'
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1644332048300!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .contact-form-section {
            grid-template-columns: 1fr;
          }
          
          .contact-info-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }
      `}</style>
    </PublicLayout>
  );
};

export default ContactPage;
