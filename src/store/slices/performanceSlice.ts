import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewer: string;
  reviewDate: string;
  period: string;
  overallScore: number;
  categories: {
    name: string;
    score: number;
    comment: string;
  }[];
  goals: {
    id: string;
    title: string;
    status: 'completed' | 'in-progress' | 'not-started';
    progress: number;
  }[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  feedback: string;
}

interface PerformanceState {
  reviews: PerformanceReview[];
  selectedReviewId: string | null;
}

const initialState: PerformanceState = {
  reviews: [
    {
      id: 'r1',
      employeeId: '1',
      employeeName: 'Sarah Johnson',
      reviewer: 'John Manager',
      reviewDate: '2024-12-15',
      period: 'Q4 2024',
      overallScore: 92,
      categories: [
        { name: 'Technical Skills', score: 95, comment: 'Excellent coding abilities and architecture decisions' },
        { name: 'Communication', score: 88, comment: 'Clear and effective in team meetings' },
        { name: 'Leadership', score: 90, comment: 'Great mentoring of junior developers' },
        { name: 'Problem Solving', score: 94, comment: 'Creative solutions to complex problems' },
      ],
      goals: [
        { id: 'g1', title: 'Lead microservices migration', status: 'completed', progress: 100 },
        { id: 'g2', title: 'Improve test coverage to 90%', status: 'completed', progress: 100 },
        { id: 'g3', title: 'Mentor 2 junior developers', status: 'in-progress', progress: 75 },
      ],
      status: 'approved',
      feedback: 'Outstanding performance this quarter. Sarah has been instrumental in our technical improvements.',
    },
    {
      id: 'r2',
      employeeId: '2',
      employeeName: 'Michael Chen',
      reviewer: 'Lisa Director',
      reviewDate: '2024-12-10',
      period: 'Q4 2024',
      overallScore: 88,
      categories: [
        { name: 'Design Quality', score: 92, comment: 'Beautiful and intuitive designs' },
        { name: 'Collaboration', score: 85, comment: 'Works well with development team' },
        { name: 'Innovation', score: 90, comment: 'Always exploring new design trends' },
        { name: 'Timeliness', score: 82, comment: 'Occasionally misses deadlines' },
      ],
      goals: [
        { id: 'g4', title: 'Redesign company website', status: 'completed', progress: 100 },
        { id: 'g5', title: 'Create design system v2', status: 'in-progress', progress: 60 },
        { id: 'g6', title: 'Conduct user research sessions', status: 'not-started', progress: 0 },
      ],
      status: 'submitted',
      feedback: 'Strong design work with room for improvement in meeting deadlines consistently.',
    },
    {
      id: 'r3',
      employeeId: '3',
      employeeName: 'Emily Rodriguez',
      reviewer: 'VP Marketing',
      reviewDate: '2024-12-20',
      period: 'Q4 2024',
      overallScore: 95,
      categories: [
        { name: 'Strategy', score: 96, comment: 'Exceptional marketing strategy development' },
        { name: 'Execution', score: 94, comment: 'Flawless campaign execution' },
        { name: 'Analytics', score: 93, comment: 'Data-driven decision making' },
        { name: 'Team Management', score: 97, comment: 'Outstanding team leadership' },
      ],
      goals: [
        { id: 'g7', title: 'Increase brand awareness by 30%', status: 'completed', progress: 100 },
        { id: 'g8', title: 'Launch Q1 campaign', status: 'completed', progress: 100 },
        { id: 'g9', title: 'Develop content strategy', status: 'completed', progress: 100 },
      ],
      status: 'approved',
      feedback: 'Emily exceeded all expectations this quarter. A true leader in our marketing department.',
    },
    {
      id: 'r4',
      employeeId: '4',
      employeeName: 'David Kim',
      reviewer: 'CTO',
      reviewDate: '2024-11-30',
      period: 'Q3 2024',
      overallScore: 78,
      categories: [
        { name: 'Technical Skills', score: 82, comment: 'Solid backend knowledge' },
        { name: 'Communication', score: 70, comment: 'Needs improvement in documentation' },
        { name: 'Reliability', score: 75, comment: 'Some concerns about availability' },
        { name: 'Problem Solving', score: 85, comment: 'Good debugging skills' },
      ],
      goals: [
        { id: 'g10', title: 'Implement caching layer', status: 'completed', progress: 100 },
        { id: 'g11', title: 'Reduce API response time by 50%', status: 'in-progress', progress: 40 },
        { id: 'g12', title: 'Write API documentation', status: 'not-started', progress: 0 },
      ],
      status: 'draft',
      feedback: 'David shows good technical potential but needs to focus on communication and reliability.',
    },
    {
      id: 'r5',
      employeeId: '6',
      employeeName: 'Robert Taylor',
      reviewer: 'CEO',
      reviewDate: '2024-12-18',
      period: 'Q4 2024',
      overallScore: 91,
      categories: [
        { name: 'Sales Performance', score: 95, comment: 'Exceeded quarterly targets by 15%' },
        { name: 'Client Relations', score: 90, comment: 'Excellent client satisfaction scores' },
        { name: 'Team Building', score: 88, comment: 'Built a strong sales team' },
        { name: 'Strategy', score: 91, comment: 'Good market analysis and planning' },
      ],
      goals: [
        { id: 'g13', title: 'Close $2M in new deals', status: 'completed', progress: 100 },
        { id: 'g14', title: 'Expand to European market', status: 'in-progress', progress: 45 },
        { id: 'g15', title: 'Hire 3 new sales reps', status: 'completed', progress: 100 },
      ],
      status: 'approved',
      feedback: 'Robert continues to drive exceptional sales results. Key contributor to company growth.',
    },
  ],
  selectedReviewId: null,
};

const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    setSelectedReview: (state, action: PayloadAction<string | null>) => {
      state.selectedReviewId = action.payload;
    },
    updateReviewStatus: (state, action: PayloadAction<{ id: string; status: PerformanceReview['status'] }>) => {
      const review = state.reviews.find((r) => r.id === action.payload.id);
      if (review) {
        review.status = action.payload.status;
      }
    },
    addReview: (state, action: PayloadAction<PerformanceReview>) => {
      state.reviews.push(action.payload);
    },
  },
});

export const { setSelectedReview, updateReviewStatus, addReview } = performanceSlice.actions;
export default performanceSlice.reducer;
