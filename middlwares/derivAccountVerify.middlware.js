const axios = require('axios');

const authorizeUser = async (token) => {
    try {
      const response = await axios.post('https://api.deriv.com/v2/authorize', {
        authorize: token,
      });
      return response.data;
    } catch (error) {
      console.error('Error authorizing user: ', error);
      throw new Error('Authorization failed.');
    }
};


const handleUserAuthorization = async (req, res) => {
    const { token } = req.body;
  
    try {
      const userData = await authorizeUser(token);
      res.status(200).json(userData);
    } catch (error) {
      res.status(500).json({ message: 'Error authorizing user' });
    }
}