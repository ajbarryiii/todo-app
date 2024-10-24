// src/hooks/useTodos.ts
import { useState, useEffect } from 'react';
import { TodoItem } from '../types/todo';
import { todoApi } from '../services/todoApi';

// Custom hook for managing todos (similar to a class that manages state in Rust)
export function useTodos() {
  // State variables (like mutable variables in Rust)
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect hook (runs when component mounts, like initialization code)
  useEffect(() => {
    loadTodos();
  }, []);

  // Load todos from API
  async function loadTodos() {
    try {
      setLoading(true);
      const data = await todoApi.getAllTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }

  // Add new todo
  async function addTodo(todo: Omit<TodoItem, 'id'>) {
    try {
      const newTodo = await todoApi.createTodo(todo);
      setTodos(prev => [...prev, newTodo]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    }
  }

  // Toggle todo completion
  async function toggleTodo(id: number) {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updated = await todoApi.updateTodo(id, { ...todo, done: !todo.done });
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  }

  // Delete todo
  async function deleteTodo(id: number) {
    try {
      await todoApi.deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  }

  return { todos, loading, error, addTodo, toggleTodo, deleteTodo };
}