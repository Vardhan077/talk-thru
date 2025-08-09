import React, { useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function Login() {
  const { setCurrentUser, setAllUsers } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginToBackend = async (firebaseUser: any) => {
    if (!firebaseUser.email) return alert('User email not found!');
    try {
      const res = await axios.post(
        `${API}/login`,
        {
          username: firebaseUser.email,
          photoURL: firebaseUser.photoURL || '',
        },
        { withCredentials: true }
      );
      setCurrentUser(res.data.user);
      setAllUsers(res.data.users);
    } catch (err) {
      alert('Backend login failed');
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await loginToBackend(result.user);
    } catch (err) {
      alert('Google sign-in failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) return alert('Enter both email and password');
    setLoading(true);
    try {
      const authResult = isSignup
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);

      await loginToBackend(authResult.user);
    } catch (err) {
      alert(isSignup ? 'Signup failed' : 'Login failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-whatsapp-green flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            {isSignup ? 'Create an Account' : 'Welcome Back!'}
          </CardTitle>
          <p className="text-muted-foreground">
            {isSignup ? 'Sign up with your email and password' : 'Log in to continue'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
              onClick={handleEmailAuth} 
              disabled={loading}
              className="w-full bg-whatsapp-green hover:bg-whatsapp-green-dark"
            >
              {isSignup ? 'Sign Up' : 'Login'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">OR</span>
            </div>
          </div>

          <Button 
            onClick={handleGoogleLogin} 
            disabled={loading} 
            variant="outline"
            className="w-full"
          >
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-whatsapp-green hover:underline font-medium"
            >
              {isSignup ? 'Login here' : 'Sign up'}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}