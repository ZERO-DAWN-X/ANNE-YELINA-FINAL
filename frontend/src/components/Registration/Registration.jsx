import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from 'context/AuthContext';

export const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [passwordError, setPasswordError] = useState('');
  const { register, loading, error, clearError } = useAuth();
  
  const handleChange = (e) => {
    if (clearError) clearError();
    setPasswordError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    // Register the user
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    };
    
    try {
      await register(userData);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };
  
  return (
    <>
      {/* <!-- BEGIN REGISTRATION --> */}
      <div className='login registration'>
        <div className='wrapper'>
          <div
            className='login-form js-img'
            style={{
              backgroundImage: `url('/assets/img/registration-form__bg.png')`,
            }}
          >
            <form onSubmit={handleSubmit}>
              <h3>Create an Account</h3>

              <div className='box-field'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter your name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
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
                  minLength='6'
                />
              </div>
              <div className='box-field'>
                <input
                  type='password'
                  className='form-control'
                  placeholder='Confirm password'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength='6'
                />
              </div>
              
              {passwordError && <div className='login-form__error'>{passwordError}</div>}
              {error && <div className='login-form__error'>{error}</div>}
              
              <label className='checkbox-box checkbox-box__sm'>
                <input type='checkbox' required />
                <span className='checkmark'></span>
                I agree to the <a href='#'>Terms of Use</a> and{' '}
                <a href='#'>Privacy Policy</a>
              </label>
              <button className='btn' type='submit' disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
              <div className='login-form__bottom'>
                <span>
                  Already have an account?{' '}
                  <Link href='/login'>
                    <a>Log in</a>
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
      {/* <!-- REGISTRATION EOF --> */}
    </>
  );
};
