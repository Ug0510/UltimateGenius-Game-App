const checkIsLoggedIn = async ({setIsLoggedIn}) => {
    try {
      const token = localStorage.getItem('ultimate_genius0510_token'); 

      if (!token) {
        setIsLoggedIn(false);
        return;
      }
  
      const response = await fetch('/api/user/check-login', {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      const data = await response.json();
  
      if (data.isLoggedIn) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      
    }
  };

  export default checkIsLoggedIn;