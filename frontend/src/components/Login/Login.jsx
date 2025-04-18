import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from 'context/AuthContext';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const { login, loading, error, clearError } = useAuth();
  
  const handleChange = (e) => {
    if (clearError) clearError();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch (err) {
      console.error('Login error:', err);
    }
  };
  
  return (
    <>
      {/* <!-- BEGIN LOGIN --> */}
      <div className='login'>
        <div className='wrapper'>
          <div
            className='login-form js-img'
            style={{ backgroundImage: `url('/assets/img/login-form__bg.png')` }}
          >
            <form onSubmit={handleSubmit}>
              <h3>Login to Your Account</h3>

              <div className='box-field'>
                <input
                  type='email'
                  className='form-control'
                  placeholder='Enter your email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='box-field'>
                <input
                  type='password'
                  className='form-control'
                  placeholder='Enter your password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {error && <div className='login-form__error'>{error}</div>}
              
              <label className='checkbox-box checkbox-box__sm'>
                <input type='checkbox' />
                <span className='checkmark'></span>
                Remember me
              </label>
              
              <button className='btn' type='submit' disabled={loading}>
                {loading ? 'Logging in...' : 'Log in'}
              </button>
              
              <div className='login-form__bottom'>
                <span>
                  No account?{' '}
                  <Link href='/registration'>
                    <a>Register now</a>
                  </Link>
                </span>
                <Link href='/'>
                  <a>
                    <i className='icon-arrow-md'></i>Return to Store
                  </a>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <!-- LOGIN EOF --> */}
    </>
  );
};
