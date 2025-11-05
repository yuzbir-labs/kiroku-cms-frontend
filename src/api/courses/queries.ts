import { createQuery } from '../../config';
import api from '../../config/api';
import type {
  Course,
  CourseListParams,
  CourseGroup,
  CourseGroupListParams,
  MyGroupsResponse,
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
): Promise<CourseGroup[]> => {
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

export const useCourseGroupsByCourseQuery = (
  id: number,
  params?: CourseGroupListParams
) => {
  return createQuery<CourseGroup[]>({
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
