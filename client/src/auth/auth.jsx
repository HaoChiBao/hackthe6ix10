import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import React from "react";
import { useEffect, useState } from "react";

const GitHubAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe;
  }, []);

  const handleGitHubSignIn = () => {
    const auth = getAuth();
    const provider = new GithubAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        console.log("User Info:", user);
        console.log("GitHub Access Token:", token);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
        console.error("Error Code:", errorCode);
        console.error("Error Message:", errorMessage);
        console.error("Email:", email);
        console.error("Credential:", credential);
        // ...
      });
  };

  return (
    <div>
      {!user ? (
        <button onClick={handleGitHubSignIn}>Sign in with GitHub</button>
      ) : (
        <div className="profile">
          <p>{user.displayName}</p>
          <img
            className="profile-img"
            src={user.photoURL}
            alt={user.displayName}
          />
        </div>
      )}
    </div>
  );
};

export default GitHubAuth;
