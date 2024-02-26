const fetchUserData = async (login, addUserData) => {
  try {
    const token = localStorage.getItem('ultimate_genius0510_token');

    // Check if token is available
    if (!token) {
      login(false);
      return;
    }

    // Fetch user profile data
    const response = await fetch('http://localhost:8000/api/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });


    // Parse response data
    const data = await response.json();

    // Update login status and user data
    login(true);
    addUserData(data);
  } catch (error) {
    // Handle errors
    console.error('Error fetching user data:', error);
    login(false); // Set login status to false
  }
};

export default fetchUserData;
