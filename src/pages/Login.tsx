import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Button, InputAdornment,
  IconButton, Alert, Divider, Avatar, Checkbox, FormControlLabel, Link, CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Email as EmailIcon, Lock as LockIcon } from '@mui/icons-material';
import type { RootState } from '../store';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import type { UserRole } from '../store/slices/authSlice';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!email || !password) {
      dispatch(loginFailure('Please enter both email and password'));
      return;
    }

    // Demo credentials
    if (email === 'admin@company.com' && password === 'admin123') {
      dispatch(loginSuccess({
        id: 'admin1', name: 'Admin User', email: 'admin@company.com',
        role: 'admin' as UserRole, avatar: 'AU', department: 'Management',
      }));
      navigate('/');
    } else if (email === 'user@company.com' && password === 'user123') {
      dispatch(loginSuccess({
        id: 'user1', name: 'John Doe', email: 'user@company.com',
        role: 'user' as UserRole, avatar: 'JD', department: 'Engineering',
      }));
      navigate('/');
    } else if (email && password.length >= 4) {
      // Accept any valid-looking credentials
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      dispatch(loginSuccess({
        id: `u${Date.now()}`, name, email,
        role: 'user' as UserRole, avatar: name.substring(0, 2).toUpperCase(),
      }));
      navigate('/');
    } else {
      dispatch(loginFailure('Invalid credentials. Password must be at least 4 characters.'));
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: 'background.default', p: 2, position: 'relative', overflow: 'hidden',
    }}>
      <Box sx={{ position: 'absolute', top: -200, right: -200, width: 500, height: 500, borderRadius: '50%', bgcolor: 'primary.main', opacity: 0.05 }} />
      <Box sx={{ position: 'absolute', bottom: -150, left: -150, width: 400, height: 400, borderRadius: '50%', bgcolor: 'secondary.main', opacity: 0.05 }} />

      <Box sx={{ maxWidth: 440, width: '100%', position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: '1.25rem', fontWeight: 700 }}>PX</Avatar>
          </Box>
          <Typography variant="h4" fontWeight={700}>Welcome Back</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>Sign in to your PerformX account</Typography>
        </Box>

        <Card sx={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Email Address" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} margin="normal" autoFocus
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment> } }}
              />
              <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)} margin="normal"
                slotProps={{ input: {
                  startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
                  endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
                }}}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <FormControlLabel control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} size="small" />} label="Remember me" />
                <Link component={RouterLink} to="/auth/login" variant="body2" underline="hover">Forgot password?</Link>
              </Box>

              <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading} sx={{ mt: 3, mb: 2, py: 1.5 }}>
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </form>

            <Divider sx={{ my: 2 }}><Typography variant="caption" color="text.secondary">OR</Typography></Divider>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button fullWidth variant="outlined" size="small" onClick={() => { setEmail('admin@company.com'); setPassword('admin123'); }}>
                Login as Admin
              </Button>
              <Button fullWidth variant="outlined" size="small" onClick={() => { setEmail('user@company.com'); setPassword('user123'); }}>
                Login as User
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 3 }}>
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} to="/auth/register" underline="hover" fontWeight={600}>Sign Up</Link>
        </Typography>

        <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ mt: 2, display: 'block', opacity: 0.7 }}>
          Demo: admin@company.com / admin123 OR user@company.com / user123
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
