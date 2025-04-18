import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

export const Banner = () => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [mainTextIndex, setMainTextIndex] = useState(0);
  const [subTextIndex, setSubTextIndex] = useState(0);
  
  const mainTexts = [
    'Beauty & Care',
    'Style & Elegance',
    'Glow & Shine',
    'Pure & Natural'
  ];
  
  const subTexts = [
    'Nourish your skin with toxin-free cosmetic products.',
    'Discover premium beauty products for your daily routine.',
    'Enhance your natural beauty with our exclusive collections.'
  ];
  
  const typingSpeed = 100; // milliseconds per character
  const deletingSpeed = 50; // faster deleting speed
  const pauseBeforeDelete = 2000; // pause before starting to delete
  const pauseBeforeType = 500; // shorter pause before typing again
  const textChangeDelay = 5000; // 5 seconds before changing subtext
  
  const typingRef = useRef(null);
  const subTextRef = useRef(null);

  // Typing animation for main text
  useEffect(() => {
    const fullText = mainTexts[mainTextIndex];
    
    const typeText = () => {
      if (!isDeleting && displayText === fullText) {
        // Full text typed, pause before deleting
        clearTimeout(typingRef.current);
        typingRef.current = setTimeout(() => {
          setIsDeleting(true);
          typeText();
        }, pauseBeforeDelete);
        return;
      }
      
      if (isDeleting && displayText === '') {
        // Text fully deleted, switch to next main text and pause before typing again
        clearTimeout(typingRef.current);
        setIsDeleting(false);
        setMainTextIndex((prevIndex) => (prevIndex + 1) % mainTexts.length);
        
        typingRef.current = setTimeout(typeText, pauseBeforeType);
        return;
      }
      
      // Clear any existing timeout
      clearTimeout(typingRef.current);
      
      // Set typing speed based on if we're typing or deleting
      const speed = isDeleting ? deletingSpeed : typingSpeed;
      
      typingRef.current = setTimeout(() => {
        setDisplayText(prevText => {
          if (isDeleting) {
            // Delete character
            return prevText.substring(0, prevText.length - 1);
          } else {
            // Add character
            return fullText.substring(0, prevText.length + 1);
          }
        });
        typeText();
      }, speed);
    };
    
    // Start the typing animation
    typeText();
    
    // Cleanup
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [isDeleting, displayText, mainTextIndex, mainTexts]);
  
  // Rotating subtext
  useEffect(() => {
    // Initial fade-in for the first subtext
    setSubTextIndex(0);
    
    // Set up interval to change subtexts
    subTextRef.current = setInterval(() => {
      setSubTextIndex((prevIndex) => (prevIndex + 1) % subTexts.length);
    }, textChangeDelay);
    
    return () => {
      if (subTextRef.current) clearInterval(subTextRef.current);
    };
  }, []);

  return (
    <>
      {/* <!-- BEGIN MAIN BLOCK --> */}
      <div className='main-block load-bg'>
        <div className='wrapper'>
          <div className='main-block__content'>
            <span className='saint-text'>Professional</span>
            <h1 className='main-text'>{displayText}<span className="cursor"></span></h1>
            <div className="subtext-container">
              <p key={subTextIndex} className="animated-subtext">
                {subTexts[subTextIndex]}
              </p>
            </div>
            
            <Link href='/shop'>
              <a className='btn'>Shop now</a>
            </Link>
          </div>
        </div>
        <img
          className='main-block__decor'
          src='/assets/img/main-block-decor.png'
          alt=''
        />
      </div>
      {/* <!-- MAIN BLOCK EOF --> */}
    </>
  );
};
