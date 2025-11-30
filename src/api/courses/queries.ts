import { createQuery } from '../../config';
import api from '../../config/api';
import type { PaginatedResponse } from '../types';
import type {
  Course,
  CourseListParams,
  CourseGroup,
  CourseGroupListParams,
  MyGroupsResponse,
  GroupEnrollment,
} from './types';

// API functions
const fetchCourses = async (params?: CourseListParams): Promise<Course[]> => {
  const response = await api.get('/courses/', { params });
  return response.data;
};

const fetchCourse = async (id: number): Promise<Course> => {
  const response = await api.get(`/courses/${id}/`);
  return response.data;
};

const fetchCourseGroups = async (
  id: number,
  params?: CourseGroupListParams
): Promise<PaginatedResponse<CourseGroup>> => {
  const response = await api.get(`/courses/${id}/groups/`, { params });
  return response.data;
};

const fetchMyCourseGroups = async (): Promise<MyGroupsResponse> => {
  const response = await api.get('/courses/my-groups/');
  return response.data;
};

// Query hooks
export const useCoursesQuery = (params?: CourseListParams) => {
  return createQuery<Course[]>({
    queryKey: ['courses', 'list', JSON.stringify(params)],
    queryFn: () => fetchCourses(params),
  })();
};

export const useCourseQuery = (id: number) => {
  return createQuery<Course>({
    queryKey: ['courses', 'detail', id],
    queryFn: () => fetchCourse(id),
    options: {
      enabled: !!id,
    },
  })();
};

export const useCourseGroupsByCourseQuery = (id: number, params?: CourseGroupListParams) => {
  return createQuery<PaginatedResponse<CourseGroup>>({
    queryKey: ['courses', 'groups', id, JSON.stringify(params)],
    queryFn: () => fetchCourseGroups(id, params),
    options: {
      enabled: !!id,
    },
  })();
};

export const useMyCourseGroupsQuery = () => {
  return createQuery<MyGroupsResponse>({
    queryKey: ['courses', 'my-groups'],
    queryFn: fetchMyCourseGroups,
  })();
};

const fetchActiveUpcomingCourseGroups = async (
  params?: CourseGroupListParams
): Promise<CourseGroup[]> => {
  const response = await api.get('/courses/groups/active-upcoming/', {
    params,
  });
  return response.data;
};

export const useActiveUpcomingCourseGroupsQuery = (params?: CourseGroupListParams) => {
  return createQuery<CourseGroup[]>({
    queryKey: ['courses', 'groups', 'active-upcoming', JSON.stringify(params)],
    queryFn: () => fetchActiveUpcomingCourseGroups(params),
  })();
};

// Fetch group details for general use (students, teachers, etc.)
const fetchCourseGroup = async (groupId: number): Promise<CourseGroup> => {
  const response = await api.get(`/courses/groups/${groupId}/`);
  return response.data;
};

// Fetch group details with students for teachers (from my-groups endpoint)
const fetchMyCourseGroup = async (groupId: number): Promise<CourseGroup> => {
  const response = await api.get(`/courses/my-groups/${groupId}/`);
  return response.data;
};

const fetchCourseGroupStudents = async (groupId: number): Promise<GroupEnrollment[]> => {
  const response = await api.get(`/courses/my-groups/${groupId}/`);
  return response.data || [];
};

// General query for all users - uses public group endpoint
export const useCourseGroupQuery = (groupId: number) => {
  return createQuery<CourseGroup>({
    queryKey: ['courses', 'groups', groupId],
    queryFn: () => fetchCourseGroup(groupId),
    options: {
      enabled: !!groupId,
    },
  })();
};

// Teacher-specific query - uses my-groups endpoint with student data
export const useMyCourseGroupQuery = (groupId: number) => {
  return createQuery<CourseGroup>({
    queryKey: ['courses', 'my-groups', groupId],
    queryFn: () => fetchMyCourseGroup(groupId),
    options: {
      enabled: !!groupId,
    },
  })();
};

export const useCourseGroupStudentsQuery = (groupId: number, enabled: boolean = true) => {
  return createQuery<GroupEnrollment[]>({
    queryKey: ['courses', 'groups', groupId, 'students'],
    queryFn: () => fetchCourseGroupStudents(groupId),
    options: {
      enabled: !!groupId && enabled,
    },
  })();
};
