import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Box,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import type { RootState } from '../../store';
import { setSidebarOpen } from '../../store/slices/uiSlice';

const DRAWER_WIDTH = 280;

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { title: 'Employees', path: '/employees', icon: <PeopleIcon /> },
  { title: 'Performance Reviews', path: '/reviews', icon: <AssessmentIcon /> },
  { title: 'Analytics', path: '/analytics', icon: <BarChartIcon /> },
  { title: 'Goals & KPIs', path: '/goals', icon: <TrendingUpIcon /> },
  { title: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      sx={{
        width: sidebarOpen ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: '#ffffff',
        },
      }}
    >
      <Box sx={{ px: 3, py: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '0.875rem' }}>
            EP
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              PerformX
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Performance System
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="overline" color="text.secondary" fontWeight={600}>
          Navigation
        </Typography>
      </Box>
      <List sx={{ px: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 1200) {
                    dispatch(setSidebarOpen(false));
                  }
                }}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'primary.contrastText' : 'text.secondary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'action.hover',
                  },
                  '& .MuiListItemIcon-root': {
                    color: isActive ? 'primary.contrastText' : 'text.secondary',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <Box sx={{ ml: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: 'inherit',
                    }}
                  >
                    {item.title}
                  </Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ mt: 2 }} />
      <Box sx={{ p: 2, mx: 2, mt: 2, bgcolor: '#f1f5f9', borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Need help?
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Check our documentation for guidance on using the performance system.
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
export { DRAWER_WIDTH };
