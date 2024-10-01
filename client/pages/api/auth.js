export default async function handler(req, res) {
    const authUrl = 'https://oauth.deriv.com/oauth2/authorize?app_id=64437';
  
    // Redirect the user to the OAuth page
    res.redirect(authUrl);
  }

  // jpwiUhqNLU3c8PI