const storeUserData = async (userData) => {
    const { email, fullname, loginid, account_list } = userData;
  
    const user = await User.findOne({ email });
    if (!user) {
      const newUser = new User({
        email,
        fullname,
        loginid,
        derivAccounts: account_list.map((account) => ({
          accountId: account.loginid,
          token: userData.authorize,
          currency: account.currency,
        })),
      });
      await newUser.save();
    } else {
      // Update user data if necessary
    }
  };


  const fetchBalance = async (token) => {
    try {
      const response = await axios.post('https://api.deriv.com/v2/balance', {
        authorize: token,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching balance: ', error);
      throw new Error('Failed to fetch balance.');
    }
  };
  