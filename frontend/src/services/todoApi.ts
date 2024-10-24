// src/services/todoApi.ts
import axios from 'axios';
import { TodoItem } from '../types/todo';

// Create an axios instance (similar to creating a client in Python requests)
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define API functions (similar to how you'd create helper functions in Python)
export const todoApi = {
  async getAllTodos(): Promise<TodoItem[]> {
    const response = await api.get<TodoItem[]>('/todos');
    return response.data;
  },

  async createTodo(todo: Omit<TodoItem, 'id'>): Promise<TodoItem> {
    const response = await api.post<TodoItem>('/todos', todo);
    return response.data;
  },

  async updateTodo(id: number, todo: TodoItem): Promise<TodoItem> {
    const response = await api.put<TodoItem>(`/todos/${id}`, todo);
    return response.data;
  },

  async deleteTodo(id: number): Promise<void> {
        try {
            await api.delete(`/todos/${id}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    throw new Error(`Todo with id ${id} not found`);
                }
                throw new Error(error.response?.data?.error || 'Failed to delete todo');
            }
            throw error;
        }
    }
};