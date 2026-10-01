import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Button, InputAdornment,
  IconButton, Alert, Divider, Avatar, Checkbox, FormControlLabel, Link,
  CircularProgress, Grid, ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import {
  Visibility, VisibilityOff, Email as EmailIcon, Lock as LockIcon,
  Person as PersonIcon, AdminPanelSettings as AdminIcon, PersonOutlined as UserIcon,
} from '@mui/icons-material';
import type { RootState } from '../store';
import { registerStart, registerSuccess, registerFailure } from '../store/slices/authSlice';
import type { UserRole } from '../store/slices/authSlice';

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  });
  const [role, setRole] = useState<UserRole>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.firstName || !formData.email || !formData.password) {
      setValidationError('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    if (formData.password.length < 4) {
      setValidationError('Password must be at least 4 characters');
      return;
    }
    if (!agreeTerms) {
      setValidationError('Please agree to the terms and conditions');
      return;
    }

    dispatch(registerStart());
    await new Promise((resolve) => setTimeout(resolve, 800));

    const name = `${formData.firstName} ${formData.lastName || ''}`.trim();
    dispatch(registerSuccess({
      id: `u${Date.now()}`,
      name,
      email: formData.email,
      role,
      avatar: `${formData.firstName[0]}${(formData.lastName?.[0] || '')}`.toUpperCase(),
    }));
    navigate('/');
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: 'background.default', p: 2, position: 'relative', overflow: 'hidden',
    }}>
      <Box sx={{ position: 'absolute', top: -200, left: -200, width: 500, height: 500, borderRadius: '50%', bgcolor: 'secondary.main', opacity: 0.05 }} />
      <Box sx={{ position: 'absolute', bottom: -150, right: -150, width: 400, height: 400, borderRadius: '50%', bgcolor: 'primary.main', opacity: 0.05 }} />

      <Box sx={{ maxWidth: 500, width: '100%', position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: '1.25rem', fontWeight: 700 }}>PX</Avatar>
          </Box>
          <Typography variant="h4" fontWeight={700}>Create Account</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>Get started with PerformX today</Typography>
        </Box>

        <Card sx={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            {(error || validationError) && <Alert severity="error" sx={{ mb: 3 }}>{validationError || error}</Alert>}

            <form onSubmit={handleSubmit}>
              {/* Role Selection */}
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Select your role</Typography>
              <ToggleButtonGroup
                value={role}
                exclusive
                onChange={(_, val) => val && setRole(val)}
                fullWidth
                sx={{ mb: 2, '& .MuiToggleButton-root': { py: 1.5, gap: 1 } }}
              >
                <ToggleButton value="user">
                  <UserIcon fontSize="small" /> User
                </ToggleButton>
                <ToggleButton value="admin">
                  <AdminIcon fontSize="small" /> Admin
                </ToggleButton>
              </ToggleButtonGroup>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="First Name" value={formData.firstName} onChange={handleChange('firstName')}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonIcon color="action" fontSize="small" /></InputAdornment> } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Last Name" value={formData.lastName} onChange={handleChange('lastName')}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonIcon color="action" fontSize="small" /></InputAdornment> } }}
                  />
                </Grid>
              </Grid>

              <TextField fullWidth label="Email Address" type="email" value={formData.email} onChange={handleChange('email')} margin="normal"
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment> } }}
              />
              <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} value={formData.password}
                onChange={handleChange('password')} margin="normal" helperText="Must be at least 4 characters"
                slotProps={{ input: {
                  startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
                  endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
                }}}
              />
              <TextField fullWidth label="Confirm Password" type={showPassword ? 'text' : 'password'} value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')} margin="normal"
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment> } }}
              />

              <FormControlLabel
                control={<Checkbox checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} size="small" />}
                label={<Typography variant="body2">I agree to the <Link href="#">Terms</Link> and <Link href="#">Privacy Policy</Link></Typography>}
                sx={{ mt: 1 }}
              />

              <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading} sx={{ mt: 2, mb: 2, py: 1.5 }}>
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
            </form>

            <Divider><Typography variant="caption" color="text.secondary">OR</Typography></Divider>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={RouterLink} to="/auth/login" underline="hover" fontWeight={600}>Sign In</Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Register;
