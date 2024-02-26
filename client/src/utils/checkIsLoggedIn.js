const checkIsLoggedIn = async (login) => {
    try {
      const token = localStorage.getItem('ultimate_genius0510_token'); 

      if (!token) {
        login(false);
        return;
      }
  
      const response = await fetch('http://localhost:8000/api/user/check-login', {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      const data = await response.json();
  
      if (data.isLoggedIn) {
        login(true);
      } else {
        login(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      
    }
  };

  export default checkIsLoggedIn;