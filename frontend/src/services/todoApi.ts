// src/services/todoApi.ts
import axios from 'axios';
import { TodoItem } from '../types/todo';

// Create an axios instance (similar to creating a client in Python requests)
const api = axios.create({
  baseURL: 'http://localhost:8080',
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

// Test function to check API configuration
export const testApiConfig = async () => {
  try {
    console.log('Testing API endpoints...');
    console.log('Base URL:', api.defaults.baseURL);
    
    // Test GET
    await api.get('/todos');
    console.log('GET /todos - OK');
    
    // Test OPTIONS (CORS)
    await api.options('/todos');
    console.log('OPTIONS /todos - OK');
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Configuration Test Failed:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
};

// Call this in your app's initialization
testApiConfig();
