import { useEffect } from 'react';
import { useRouter } from 'next/router';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    
    

    
    router.push('/', undefined, { shallow: true });
  }, []);

  return (
    <div>
      <p>Logging out...</p>
      
    </div>
  );
};

export default LogoutPage;
